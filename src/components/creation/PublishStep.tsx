import { useState, useMemo, useEffect } from 'react';
import { 
  Check, 
  Globe, 
  Copy, 
  ExternalLink,
  Sparkles,
  Zap,
  Lock,
  ShieldCheck,
  Undo2,
  X,
  Share2,
  Printer
} from 'lucide-react';
import type { User } from 'firebase/auth';
import type { LovinglyEvent, TierType } from '../../types';
import { getEventCreatorPath, getEventTypePath } from '../../lib/utils';
import { EntitlementService } from '../../domain/entitlement/entitlementService';
import { firebaseService } from '../../lib/firebase-service';
import { CreationBottomNav } from './CreationBottomNav';
import { PdfExportModal } from '../PdfExportModal';

interface PublishStepProps {
  event: LovinglyEvent;
  user: User | null;
  onSignIn: () => Promise<User | null>;
  onUpdateEvent?: (updates: Partial<LovinglyEvent>) => void;
  onPublish: (selectedTier: TierType, requiresPayment?: boolean) => Promise<boolean | void>;
  onBack: () => void;
  onNext?: () => void;
  onSaveDraft?: () => void;
}

export function PublishStep({
  event,
  user,
  onSignIn,
  onUpdateEvent,
  onPublish,
  onBack,
  onNext,
  onSaveDraft
}: PublishStepProps) {
  const [publishing, setPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(event.isPublished || false);
  const [copied, setCopied] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [downgradedToast, setDowngradedToast] = useState<string | null>(null);
  const [undoBackup, setUndoBackup] = useState<Partial<LovinglyEvent> | null>(null);
  const [showPdfExport, setShowPdfExport] = useState(false);

  // Real-time Quota from Firestore
  const [quotaLoading, setQuotaLoading] = useState(false);
  const [userEvents, setUserEvents] = useState<LovinglyEvent[]>([]);

  // Load User Quota
  useEffect(() => {
    let isMounted = true;
    if (!user) {
      return;
    }
    const uid = user.uid;

    async function loadUserQuota() {
      setQuotaLoading(true);
      try {
        const events = await firebaseService.getUserEvents(uid);
        if (isMounted) {
          setUserEvents(events);
        }
      } catch (err) {
        console.warn('Could not load user events for quota check:', err);
      } finally {
        if (isMounted) {
          setQuotaLoading(false);
        }
      }
    }

    loadUserQuota();
    return () => { isMounted = false; };
  }, [user]);

  // Quota calculation: 1st page is free if user has no other published events
  const publishedOtherEvents = useMemo(() => {
    return userEvents.filter(e => e.isPublished && e.id !== event.id);
  }, [userEvents, event.id]);

  const hasFreePageCredit = publishedOtherEvents.length === 0;

  // Active Premium Features Detection
  const activePremiumFeatures = useMemo(() => {
    const list: { id: string; name: string }[] = [];
    if (event.rsvpConfig?.enabled) {
      list.push({ id: 'rsvp', name: 'Interactive RSVP Form' });
    }
    if (event.upiId || event.upiQrImageUrl) {
      list.push({ id: 'upi', name: 'UPI Shagun / Gift Scanner' });
    }
    if (event.password && event.password.trim() !== '') {
      list.push({ id: 'password', name: '4-Digit Security PIN' });
    }
    if (event.showLocationQrCode) {
      list.push({ id: 'locationQr', name: 'Venue Directions QR Code' });
    }
    return list;
  }, [event.rsvpConfig?.enabled, event.upiId, event.upiQrImageUrl, event.password, event.showLocationQrCode]);

  const hasPremiumFeatures = activePremiumFeatures.length > 0;

  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${getEventCreatorPath(event, user)}/${getEventTypePath(event)}/${event.slug}`
    : `https://yourslovingly.in/${getEventCreatorPath(event, user)}/${getEventTypePath(event)}/${event.slug}`;

  // 1-Click Downgrade to Basic: Unselect all premium features & immediately enable ₹0 free publish
  const handleDowngradeToBasic = () => {
    setUndoBackup({
      rsvpConfig: event.rsvpConfig,
      upiId: event.upiId,
      upiQrImageUrl: event.upiQrImageUrl,
      showUpiQrCode: event.showUpiQrCode,
      password: event.password,
      showLocationQrCode: event.showLocationQrCode,
    });

    const updates: Partial<LovinglyEvent> = {
      rsvpConfig: event.rsvpConfig ? { ...event.rsvpConfig, enabled: false } : undefined,
      upiId: '',
      upiQrImageUrl: '',
      showUpiQrCode: false,
      password: '',
      showLocationQrCode: false,
    };

    if (onUpdateEvent) {
      onUpdateEvent(updates);
    }

    setDowngradedToast('All premium features removed! This invite is now configured as a Free Basic Page ready for ₹0 launch.');
    setTimeout(() => setDowngradedToast(null), 8000);
  };

  // Remove individual premium feature
  const handleRemoveSingleFeature = (featureId: string) => {
    if (!onUpdateEvent) return;
    if (featureId === 'rsvp') {
      onUpdateEvent({ rsvpConfig: event.rsvpConfig ? { ...event.rsvpConfig, enabled: false } : undefined });
    } else if (featureId === 'upi') {
      onUpdateEvent({ upiId: '', upiQrImageUrl: '', showUpiQrCode: false });
    } else if (featureId === 'password') {
      onUpdateEvent({ password: '' });
    } else if (featureId === 'locationQr') {
      onUpdateEvent({ showLocationQrCode: false });
    }
    setDowngradedToast('Feature removed from invitation.');
    setTimeout(() => setDowngradedToast(null), 4000);
  };

  // Undo Downgrade
  const handleUndoDowngrade = () => {
    if (undoBackup && onUpdateEvent) {
      onUpdateEvent(undoBackup);
      setUndoBackup(null);
      setDowngradedToast('Restored previous premium features!');
      setTimeout(() => setDowngradedToast(null), 3500);
    }
  };

  const handleSignInClick = async () => {
    setIsSigningIn(true);
    try {
      await onSignIn();
    } catch (err) {
      console.error('Sign in error:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handlePublishClick = async (tier: TierType) => {
    if (!user) {
      const signedInUser = await onSignIn();
      if (!signedInUser) return;
    }
    const requiresPayment = tier === 'extended' || tier === 'premium' || !hasFreePageCredit;
    setPublishing(true);
    try {
      const result = await onPublish(tier, requiresPayment);
      if (result !== false && !requiresPayment) {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error('Publishing failed:', err);
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDraftClick = () => {
    if (onSaveDraft) {
      onSaveDraft();
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const basicPrice = 49;
  const premiumPrice = EntitlementService.getPublishingPrice('premium') || 99;
  const upgradePrice = 49; // Approved upgrade price from Basic to Premium

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden w-full max-w-full">
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-full">
        {/* Step Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
            <span>Step 6 of 6</span>
            <span>•</span>
            <span>Hosting, Plan & Launch</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
            {isSuccess ? 'Your Invite is Published!' : 'Review Quota & Publish'}
          </h2>
          <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
            {isSuccess 
              ? 'Your invite is live and ready to be shared with guests.' 
              : 'Verify your account quota, select your hosting plan, and launch your live guest URL.'}
          </p>
        </div>

        {/* Save Draft Toast */}
        {saveSuccess && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 max-w-xl mx-auto">
            <Check className="w-4 h-4 text-emerald-200" />
            <span>Draft Saved Successfully! You can resume anytime from your Dashboard.</span>
          </div>
        )}

        {/* Downgrade / Undo Toast */}
        {downgradedToast && (
          <div className="bg-stone-900 text-white border border-stone-700 px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs max-w-2xl mx-auto animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{downgradedToast}</span>
            </div>
            {undoBackup && (
              <button
                type="button"
                onClick={handleUndoDowngrade}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
              >
                <Undo2 className="w-3 h-3" />
                <span>Undo</span>
              </button>
            )}
          </div>
        )}

        {/* MAIN BODY */}
        {!isSuccess ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 1. AUTHENTICATION GATE: Check if user is signed in */}
            {!user ? (
              <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-rose-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-800 text-center space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 shadow-inner">
                  <Lock className="w-7 h-7" />
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Sign In Required to Verify Quota & Publish</span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-serif font-bold text-white">
                    Sign In to Check Your Free Credits & Publish
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    Every account receives <strong>1 Free Page Publication</strong> with 15 days active hosting. Sign in with Google to check your available quota and publish your live link.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleSignInClick}
                    disabled={isSigningIn}
                    className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-stone-100 text-stone-900 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    {isSigningIn ? (
                      <div className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    )}
                    <span>Sign In with Google</span>
                  </button>
                </div>

                <div className="text-[11px] text-stone-400">
                  Your invitation design is preserved. No payment details required to sign in.
                </div>
              </div>
            ) : (
              /* 2. AUTHENTICATED: Display Live Quota and Intelligent Choices */
              <div className="space-y-6">
                {/* Account Quota Bar */}
                <div className="bg-stone-50 border border-stone-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 tabular-nums ${
                      hasFreePageCredit ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-800'
                    }`}>
                      {hasFreePageCredit ? '1' : '0'}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                        <span>{hasFreePageCredit ? 'Free 1st Page Credit Available' : 'Standard Account (Free Quota Utilized)'}</span>
                        {hasFreePageCredit && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                            Eligible for Basic ₹0
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {hasFreePageCredit 
                          ? 'Every account gets 1 free basic invitation publication with 15 days active hosting.' 
                          : `You have previously published ${publishedOtherEvents.length} event(s). Standard hosting rates apply.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-600 truncate max-w-[200px]">{user.email}</span>
                    {quotaLoading && (
                      <div className="w-3.5 h-3.5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin shrink-0" />
                    )}
                  </div>
                </div>

                {/* SCENARIO A: PREMIUM FEATURES ARE SELECTED */}
                {hasPremiumFeatures ? (
                  <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    {/* Header & Price */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-stone-100 pb-5">
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Premium Page Configuration</span>
                        </div>
                        <h4 className="font-serif font-bold text-stone-900 text-xl sm:text-2xl">
                          Premium Features Are Selected
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                          The following premium features are enabled on your page. Uncheck any feature below to remove it, or proceed with the Premium Page plan.
                        </p>
                      </div>

                      <div className="sm:text-right bg-rose-50/70 border border-rose-200/80 rounded-2xl px-4 py-3 shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                          Premium Page Price
                        </span>
                        <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tabular-nums mt-0.5">
                          {hasFreePageCredit ? `₹${upgradePrice}` : `₹${premiumPrice}`}
                        </div>
                        <span className="text-[11px] text-stone-500 block">
                          {hasFreePageCredit ? 'Free Page Credit + ₹49 Upgrade' : '15 Days Hosting · Watermark-Free'}
                        </span>
                      </div>
                    </div>

                    {/* Selected Premium Features Checkboxes */}
                    <div className="space-y-2.5">
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                        Selected Premium Features ({activePremiumFeatures.length})
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activePremiumFeatures.map((feat) => (
                          <label
                            key={feat.id}
                            className="bg-stone-50 hover:bg-rose-50/40 border border-stone-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <input
                                type="checkbox"
                                checked={true}
                                onChange={() => handleRemoveSingleFeature(feat.id)}
                                className="w-4 h-4 text-rose-700 rounded border-stone-300 focus:ring-rose-600 cursor-pointer shrink-0"
                              />
                              <span className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                                {feat.name}
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md shrink-0">
                              Premium
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Primary Action: Proceed with Premium Page */}
                    <div className="space-y-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handlePublishClick('extended')}
                        disabled={publishing}
                        className="w-full py-3.5 px-6 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        {publishing ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                        <span>
                          {hasFreePageCredit 
                            ? `Proceed with Premium Page (₹${upgradePrice})` 
                            : `Proceed with Premium Page (₹${premiumPrice})`}
                        </span>
                      </button>

                      {/* Secondary Action: Remove Premium Features & Proceed with Basic Page */}
                      <div className="pt-3 border-t border-stone-100 text-center space-y-2">
                        <p className="text-xs text-stone-500">
                          Prefer not to use premium features? Remove them to switch to a Basic Page ({hasFreePageCredit ? '₹0 Free with 1st Page Credit' : `₹${basicPrice}`}):
                        </p>
                        <button
                          type="button"
                          onClick={handleDowngradeToBasic}
                          className="w-full py-3 px-5 rounded-2xl border border-stone-300 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <X className="w-4 h-4 text-rose-600" />
                          <span>
                            Remove Premium Features &amp; Proceed with Basic Page ({hasFreePageCredit ? '₹0 Free' : `₹${basicPrice}`})
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* SCENARIO B: NO PREMIUM FEATURES SELECTED -> SHOW ONLY BASIC PAGE */
                  <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Basic Page Selected</span>
                        </div>
                        <h4 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                          {hasFreePageCredit ? 'Free Basic Page (₹0)' : `Basic Page (₹${basicPrice})`}
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
                          {hasFreePageCredit
                            ? 'No premium features are selected. Your first Basic Page qualifies for 100% free instant hosting for 15 days.'
                            : 'No premium features are selected. Publish your Basic Page with 15 days of active hosting and standard features.'}
                        </p>
                      </div>

                      <div className="sm:text-right bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3 shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                          Basic Page Price
                        </span>
                        <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tabular-nums mt-0.5">
                          {hasFreePageCredit ? '₹0' : `₹${basicPrice}`}
                        </div>
                        <span className="text-[11px] text-stone-500 block">
                          15 Days Live Hosting
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePublishClick('basic')}
                      disabled={publishing}
                      className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      {publishing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Globe className="w-4 h-4" />
                      )}
                      <span>
                        {hasFreePageCredit 
                          ? 'Proceed with Basic Page (₹0 Free)' 
                          : `Proceed with Basic Page (₹${basicPrice})`}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* SUCCESS SCREEN ONCE PUBLISHED */
          <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                Congratulations! Your Invite is Live
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm">
                Your invite is hosted on Yours Lovingly and ready to be shared with guests.
              </p>
            </div>

            {/* Share Link Box */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="truncate w-full sm:w-auto">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Official Public Link</span>
                <span className="text-xs sm:text-sm font-mono text-stone-800 truncate block">{publicUrl}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full sm:w-auto px-4 py-2.5 bg-stone-900 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-stone-100">
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Live Page</span>
              </a>
              <button
                type="button"
                onClick={() => setShowPdfExport(true)}
                className="py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-700" />
                <span>Export PDF</span>
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `You're Invited!\n\n${event.title || 'Special Event'}\nJoin us on ${event.eventDate || 'the special day'}${event.location ? ` at ${event.location}` : ''}.\n\nTap the link below to view our official invitation and RSVP:\n${publicUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1DA851] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="py-3 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <span>Go to Dashboard &rarr;</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <CreationBottomNav 
        onBack={onBack}
        onNext={isSuccess && onNext ? onNext : handleSaveDraftClick}
        onSaveDraft={handleSaveDraftClick}
        backLabel="Back to Final Preview"
        mobileBackLabel="Back"
        nextLabel={isSuccess ? "Go to Dashboard" : "Save Draft"}
        mobileNextLabel={isSuccess ? "Done" : "Save"}
      />

      <PdfExportModal
        event={showPdfExport ? event : null}
        onClose={() => setShowPdfExport(false)}
      />
    </div>
  );
}
