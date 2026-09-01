import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  Globe, 
  Copy, 
  ExternalLink,
  Sparkles,
  Zap,
  ArrowLeft
} from 'lucide-react';
import type { User } from 'firebase/auth';
import type { LovinglyEvent, TierType } from '../../types';
import { getEventCreatorPath, getEventTypePath } from '../../lib/utils';
import { EntitlementService } from '../../domain/entitlement/entitlementService';

interface PublishStepProps {
  event: LovinglyEvent;
  user: User | null;
  onSignIn: () => Promise<User | null>;
  onPublish: (selectedTier: TierType) => Promise<void>;
  onBack: () => void;
}

export function PublishStep({
  event,
  user,
  onSignIn,
  onPublish,
  onBack
}: PublishStepProps) {
  const [selectedTier, setSelectedTier] = useState<TierType>('basic');
  const [publishing, setPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(event.isPublished || false);
  const [copied, setCopied] = useState(false);

  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${getEventCreatorPath(event, user)}/${getEventTypePath(event)}/${event.slug}`
    : `https://yourslovingly.in/${getEventCreatorPath(event, user)}/${getEventTypePath(event)}/${event.slug}`;

  const handlePublishClick = async () => {
    if (!user) {
      const signedInUser = await onSignIn();
      if (!signedInUser) return;
    }
    setPublishing(true);
    await onPublish(selectedTier);
    setPublishing(false);
    setIsSuccess(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tiers: { id: TierType; name: string; price: string; validity: string; badge?: string; features: string[] }[] = [
    {
      id: 'basic',
      name: 'Basic Page',
      price: `₹${EntitlementService.getPublishingPrice('basic')}`,
      validity: '15 Days Active Hosting',
      badge: 'Standard',
      features: [
        'Instant live web link',
        'Mobile responsive invite',
        'Google Maps venue directions',
        'Spotify celebration music',
        'Standard template access',
        'Platform watermark included'
      ]
    },
    {
      id: 'extended',
      name: 'Premium Page',
      price: `₹${EntitlementService.getPublishingPrice('premium')}`,
      validity: '15 Days Active Hosting',
      badge: 'Most Popular',
      features: [
        'Everything in Basic Page',
        '15 Days active hosting',
        'Watermark-Free experience',
        'Interactive RSVP form & guest responses',
        'UPI Shagun / Gift collection module',
        'High-res PNG & Vector PDF download'
      ]
    },
    {
      id: 'lifetime',
      name: 'Lifetime Keepsake',
      price: `₹${EntitlementService.getExtensionPrice('premium', true)}`,
      validity: 'Lifetime Perpetual Hosting',
      badge: 'Best Value',
      features: [
        'Everything in Premium Page',
        'Lifetime permanent URL',
        'Never expires or deletes',
        'Printable high-res PDF export',
        'Guest attendance analytics & export'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Step Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
          <span>Step 7 of 7</span>
          <span>•</span>
          <span>Publish & Share</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
          {isSuccess ? 'Your Invite is Live!' : 'Choose Hosting Plan & Publish'}
        </h2>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
          {isSuccess 
            ? 'Share your custom digital invite via WhatsApp, Instagram, or print QR codes.' 
            : 'Start free for 3 days or upgrade for extended hosting and watermark-free sharing.'}
        </p>
      </div>

      {!isSuccess ? (
        <div className="space-y-8">
          {/* Tier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map((t) => {
              const isSelected = selectedTier === t.id;
              const isPopular = t.badge === 'Most Popular';

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTier(t.id)}
                  className={`rounded-3xl p-6 border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-rose-600 shadow-xl ring-2 ring-rose-600/20'
                      : 'bg-white border-stone-200 hover:border-stone-400 hover:shadow-md'
                  }`}
                >
                  {t.badge && (
                    <div className="absolute -top-3 left-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isPopular ? 'bg-rose-700 text-white shadow-md' : 'bg-stone-900 text-white'
                      }`}>
                        {t.badge}
                      </span>
                    </div>
                  )}

                  <div className="space-y-4 pt-2">
                    <div>
                      <h3 className="font-bold text-stone-900 text-lg">{t.name}</h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-serif font-bold text-stone-900">{t.price}</span>
                        <span className="text-xs text-stone-500">/ one-time</span>
                      </div>
                      <span className="inline-block text-[11px] font-semibold text-rose-700 mt-1">
                        {t.validity}
                      </span>
                    </div>

                    <div className="space-y-2 border-t border-stone-100 pt-4">
                      {t.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-stone-600">
                          <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-stone-100">
                    <button
                      type="button"
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected 
                          ? 'bg-rose-700 text-white shadow-md' 
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {isSelected ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                      <span>{isSelected ? 'Plan Selected' : 'Select Plan'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Action Row */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
            <div className="text-stone-600 text-xs sm:text-sm">
              <span className="font-bold text-stone-900">Pay-As-You-Need:</span> Individual Invite purchasing. Zero recurring subscriptions or hidden charges.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onBack}
                className="px-4 sm:px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Previous Section</span>
                <span className="sm:hidden">Back</span>
              </button>

              <button
                onClick={handlePublishClick}
                disabled={publishing}
                className="flex-1 sm:flex-initial px-6 sm:px-8 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-700/20 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {publishing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                <span>{user ? 'Publish Event Now' : 'Sign in & Publish'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Success Screen */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto space-y-6"
        >
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
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="text-left truncate">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Public Link</span>
              <span className="text-xs sm:text-sm font-mono text-stone-800 truncate block">{publicUrl}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-stone-900 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-stone-100">
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Live Invite</span>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `You're Invited! 🎊\n\n${event.title || 'Special Event'}\nJoin us on ${event.eventDate || 'the special day'}${event.location ? ` at ${event.location}` : ''}.\n\nTap the link below to view our official invitation and RSVP:\n${publicUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1DA851] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.8 5.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z"/>
              </svg>
              <span>Share via WhatsApp</span>
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
