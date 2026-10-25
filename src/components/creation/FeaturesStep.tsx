import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Music, 
  Users, 
  IndianRupee, 
  Lock, 
  ShieldCheck,
  Check,
  Upload,
  Sparkles,
  X
} from 'lucide-react';
import type { LovinglyEvent, RsvpFormConfig } from '../../types';
import { AudioUploader } from '../audio/AudioUploader';
import { CreationBottomNav } from './CreationBottomNav';

interface FeaturesStepProps {
  event: LovinglyEvent;
  onUpdate: (updates: Partial<LovinglyEvent>) => void;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
}

const FEATURE_TABS: Array<'spotify' | 'rsvp' | 'upi' | 'security'> = [
  'spotify',
  'rsvp',
  'upi',
  'security'
];

export function FeaturesStep({ event, onUpdate, onBack, onNext, onSaveDraft }: FeaturesStepProps) {
  const [activeTab, setActiveTab] = useState<'spotify' | 'rsvp' | 'upi' | 'security'>('spotify');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentIndex = FEATURE_TABS.indexOf(activeTab);

  const handleNextClick = () => {
    if (currentIndex < FEATURE_TABS.length - 1) {
      setActiveTab(FEATURE_TABS[currentIndex + 1]);
    } else {
      onNext();
    }
  };

  const handleBackClick = () => {
    if (currentIndex > 0) {
      setActiveTab(FEATURE_TABS[currentIndex - 1]);
    } else {
      onBack();
    }
  };

  const handleSaveDraftClick = () => {
    if (onSaveDraft) {
      onSaveDraft();
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const defaultRsvpConfig: RsvpFormConfig = {
    enabled: event.rsvpConfig?.enabled ?? true,
    collectPhone: event.rsvpConfig?.collectPhone ?? true,
    collectGuestCount: event.rsvpConfig?.collectGuestCount ?? true,
    collectDietary: event.rsvpConfig?.collectDietary ?? true,
    collectAccommodation: event.rsvpConfig?.collectAccommodation ?? false,
    customQuestions: event.rsvpConfig?.customQuestions ?? []
  };

  const handleUpdateRsvp = (updates: Partial<RsvpFormConfig>) => {
    const updated = {
      ...defaultRsvpConfig,
      ...updates
    };
    onUpdate({ rsvpConfig: updated });
  };

  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      onUpdate({ upiQrImageUrl: dataUrl, showUpiQrCode: true });
    };
    reader.readAsDataURL(file);
  };

  const hasUpiConfigured = !!(event.upiQrImageUrl || event.upiId);

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden w-full max-w-full">
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 lg:p-8 space-y-6 max-w-full">
        {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
          <span>Step 4 of 6</span>
          <span>•</span>
          <span>Select Features & Integrations</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
          Configure Page Features & Integrations
        </h2>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
          Enable Spotify celebration soundtracks, interactive RSVP tracking, UPI gift collection, and privacy controls.
        </p>
      </div>

      {/* Save Draft Toast */}
      {saveSuccess && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 max-w-xl mx-auto">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>Draft Saved Successfully! You can resume anytime from your Dashboard.</span>
        </div>
      )}

      {/* Main Feature Container */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-stone-100 rounded-2xl">
          {[
            { id: 'spotify', label: 'Music & Audio', icon: Music, badge: event.bgAudioUrl ? 'MP3 Active' : event.spotifyUrl ? 'Spotify Active' : 'Basic Included' },
            { id: 'rsvp', label: 'RSVP Form', icon: Users, badge: event.rsvpConfig?.enabled === true ? 'Active' : '⭐ Premium' },
            { id: 'upi', label: 'UPI Gifts & QR', icon: IndianRupee, badge: hasUpiConfigured ? 'Active' : '⭐ Premium' },
            { id: 'security', label: 'Password Lock', icon: Lock, badge: event.password ? 'Protected' : '⭐ Premium' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  isActive ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-rose-600" />
                  <span>{tab.label}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-md ${
                  isActive ? 'bg-rose-50 text-rose-700' : 'bg-stone-200/70 text-stone-500'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Music & Audio (MP3 Upload & Spotify) */}
        {activeTab === 'spotify' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <AudioUploader
              event={event}
              onChange={onUpdate}
              variant="card"
            />
          </motion.div>
        )}

        {/* Tab 2: RSVP Config */}
        {activeTab === 'rsvp' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-amber-50/70 rounded-2xl border border-amber-200">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-900">Interactive Guest RSVP Form</span>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-700" /> Premium Feature
                  </span>
                </div>
                <p className="text-xs text-amber-800">
                  Collect attendance responses, dietary choices, and headcount directly to your live dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleUpdateRsvp({ enabled: !defaultRsvpConfig.enabled })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  defaultRsvpConfig.enabled
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {defaultRsvpConfig.enabled ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{defaultRsvpConfig.enabled ? 'Enabled' : 'Disabled'}</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Information to Collect from Guests
                </h4>
                <span className="text-[11px] text-stone-400">Customizable form fields</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center justify-between cursor-pointer bg-white">
                  <span className="text-xs font-semibold text-stone-800">Phone Number for WhatsApp Updates</span>
                  <input
                    type="checkbox"
                    checked={defaultRsvpConfig.collectPhone}
                    onChange={(e) => handleUpdateRsvp({ collectPhone: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded-md"
                  />
                </label>

                <label className="p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center justify-between cursor-pointer bg-white">
                  <span className="text-xs font-semibold text-stone-800">Total Attending Guest Count</span>
                  <input
                    type="checkbox"
                    checked={defaultRsvpConfig.collectGuestCount}
                    onChange={(e) => handleUpdateRsvp({ collectGuestCount: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded-md"
                  />
                </label>

                <label className="p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center justify-between cursor-pointer bg-white">
                  <span className="text-xs font-semibold text-stone-800">Meal Preference (Veg / Non-Veg)</span>
                  <input
                    type="checkbox"
                    checked={defaultRsvpConfig.collectDietary}
                    onChange={(e) => handleUpdateRsvp({ collectDietary: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded-md"
                  />
                </label>

                <label className="p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center justify-between cursor-pointer bg-white">
                  <span className="text-xs font-semibold text-stone-800">Stay & Accommodation Required</span>
                  <input
                    type="checkbox"
                    checked={defaultRsvpConfig.collectAccommodation}
                    onChange={(e) => handleUpdateRsvp({ collectAccommodation: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded-md"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  RSVP Deadline Date (Optional)
                </label>
                <input
                  type="text"
                  value={defaultRsvpConfig.deadline || ''}
                  onChange={(e) => handleUpdateRsvp({ deadline: e.target.value })}
                  placeholder="e.g. Please confirm by December 10, 2026"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: UPI Gifts & QR Image Upload */}
        {activeTab === 'upi' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <IndianRupee className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-amber-900">Direct UPI Gifts & Digital Payments</h4>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-700" /> Premium Feature
                    </span>
                  </div>
                  <p className="text-xs text-amber-700 leading-relaxed mt-0.5">
                    Allows well-wishers and guests to scan your QR code or send digital gifts directly to your bank account via GPay, PhonePe, Paytm, or BHIM. Zero platform fees.
                  </p>
                </div>
              </div>
            </div>

            {/* Validation warning status */}
            {!hasUpiConfigured ? (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold flex items-center gap-2">
                <span>⚠️ Either attach a QR Code image OR enter your UPI ID / Phone number to enable UPI gifts on your page.</span>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>UPI Gift module is ready for your page! Guests will be able to scan your QR code or copy your UPI ID.</span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Option A: Upload QR Image */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  1. Attach UPI QR Code Image (Optional)
                </label>
                <p className="text-[11px] text-stone-500">
                  Upload an image of your custom QR scanner from GPay, PhonePe, Paytm, or your bank app.
                </p>

                {event.upiQrImageUrl ? (
                  <div className="relative group inline-block bg-white p-2 rounded-xl border border-stone-200 shadow-sm">
                    <img 
                      src={event.upiQrImageUrl} 
                      alt="Uploaded UPI QR Code" 
                      className="w-36 h-36 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdate({ upiQrImageUrl: undefined })}
                      className="absolute -top-2 -right-2 bg-rose-700 text-white p-1 rounded-full shadow-md hover:bg-rose-800 transition-colors"
                      title="Remove QR Image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-stone-300 hover:border-rose-600 bg-white rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors space-y-2">
                    <Upload className="w-6 h-6 text-stone-400" />
                    <span className="text-xs font-bold text-stone-700">Click to Upload QR Image</span>
                    <span className="text-[10px] text-stone-400">PNG, JPG, or WEBP formats</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleQrFileUpload} 
                      className="hidden" 
                    />
                  </label>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Or Paste Image URL directly
                  </label>
                  <input
                    type="url"
                    value={event.upiQrImageUrl || ''}
                    onChange={(e) => onUpdate({ upiQrImageUrl: e.target.value, showUpiQrCode: true })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              {/* Option B: UPI ID or Phone Number */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-4">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  2. UPI ID or Phone Number (Optional)
                </label>
                <p className="text-[11px] text-stone-500">
                  Enter your VPA (e.g. name@okaxis) or phone number (e.g. 9876543210@paytm). If QR image is not uploaded, a QR code will be generated from this ID.
                </p>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    UPI ID / VPA / Phone Number
                  </label>
                  <input
                    type="text"
                    value={event.upiId || ''}
                    onChange={(e) => onUpdate({ upiId: e.target.value, showUpiQrCode: true })}
                    placeholder="e.g. 9876543210@paytm or name@okicici"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm font-semibold text-stone-900 focus:outline-none focus:border-rose-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Payee Display Name
                  </label>
                  <input
                    type="text"
                    value={event.upiName || ''}
                    onChange={(e) => onUpdate({ upiName: e.target.value })}
                    placeholder="e.g. Anand & Divya Celebration"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-rose-600 transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 4: Security & 4-Digit PIN */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-amber-900">4-Digit Security PIN</h4>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-700" /> Premium Feature
                  </span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                  Protect your private celebration photos, venue details, and invite behind a simple 4-digit numeric PIN.
                </p>
              </div>
            </div>

            <div className="max-w-md bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-3">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                Set 4-Digit Guest Access PIN (Numbers Only)
              </label>
              <p className="text-xs text-stone-500">
                Guests will enter these 4 numbers to open your invitation. Leave empty for public access.
              </p>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  pattern="[0-9]*"
                  value={event.password || ''}
                  onChange={(e) => {
                    const cleanPin = e.target.value.replace(/\D/g, '').slice(0, 4);
                    onUpdate({ password: cleanPin });
                  }}
                  placeholder="e.g. 2026"
                  className="w-40 px-4 py-3 bg-white border border-stone-300 rounded-xl text-center font-mono text-xl font-bold tracking-widest text-stone-900 focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20"
                />
                {event.password && (
                  <button
                    type="button"
                    onClick={() => onUpdate({ password: '' })}
                    className="px-3 py-2 text-xs font-bold text-stone-500 hover:text-rose-700 bg-white border border-stone-200 rounded-lg cursor-pointer"
                  >
                    Clear PIN
                  </button>
                )}
              </div>
              <div className="text-[11px] text-stone-500">
                {event.password && event.password.length === 4 
                  ? '✓ 4-Digit PIN active. Guests will need this PIN to view the invite.' 
                  : event.password ? `${event.password.length}/4 digits entered` : 'No PIN set (Open public access)'}
              </div>
            </div>
          </motion.div>
        )}

        </div>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <CreationBottomNav 
        onBack={handleBackClick}
        onNext={handleNextClick}
        onSaveDraft={handleSaveDraftClick}
        backLabel="Previous Section"
        mobileBackLabel="Back"
        nextLabel={currentIndex === FEATURE_TABS.length - 1 ? 'Continue to Live Preview (Step 5)' : 'Move to Next Section'}
        mobileNextLabel={currentIndex === FEATURE_TABS.length - 1 ? 'Preview' : 'Next'}
      />
    </div>
  );
}

