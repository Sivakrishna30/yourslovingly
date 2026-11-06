import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Music, 
  Users, 
  IndianRupee, 
  ShieldCheck, 
  Check,
  Upload,
  X,
  Plus,
  Trash2
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
  const [newQuestion, setNewQuestion] = useState('');

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
    enabled: event.rsvpConfig?.enabled ?? false,
    collectPhone: event.rsvpConfig?.collectPhone ?? true,
    collectGuestCount: event.rsvpConfig?.collectGuestCount ?? true,
    collectDietary: event.rsvpConfig?.collectDietary ?? true,
    collectAccommodation: event.rsvpConfig?.collectAccommodation ?? false,
    deadline: event.rsvpConfig?.deadline ?? '',
    customQuestions: event.rsvpConfig?.customQuestions ?? []
  };

  const handleUpdateRsvp = (updates: Partial<RsvpFormConfig>) => {
    const updated: RsvpFormConfig = {
      ...defaultRsvpConfig,
      enabled: updates.enabled !== undefined ? updates.enabled : true,
      ...updates
    };
    onUpdate({ rsvpConfig: updated });
  };

  const handleAddCustomQuestion = () => {
    const trimmed = newQuestion.trim();
    if (!trimmed) return;
    const nextQuestions = [...(defaultRsvpConfig.customQuestions || []), trimmed];
    handleUpdateRsvp({ customQuestions: nextQuestions, enabled: true });
    setNewQuestion('');
  };

  const handleRemoveCustomQuestion = (idx: number) => {
    const nextQuestions = (defaultRsvpConfig.customQuestions || []).filter((_, i) => i !== idx);
    handleUpdateRsvp({ customQuestions: nextQuestions });
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

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden w-full max-w-full">
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 lg:p-8 space-y-6 max-w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
            <span>Step 4 of 6</span>
            <span>•</span>
            <span>Select Features &amp; Integrations</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
            Configure Page Features &amp; Integrations
          </h2>
          <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
            Configure celebration soundtracks, interactive RSVP tracking, UPI gift QR codes, and Google account session access.
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
          {/* Navigation Tabs (No 'Active' or 'Included' badges) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-stone-100 rounded-2xl">
            {[
              { id: 'spotify', label: 'Music & Audio', icon: Music },
              { id: 'rsvp', label: 'RSVP Form', icon: Users },
              { id: 'upi', label: 'UPI Gifts & QR', icon: IndianRupee },
              { id: 'security', label: 'Google Access', icon: ShieldCheck }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isActive ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{tab.label}</span>
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
              {(event.bgAudioUrl || event.spotifyUrl || event.bgAudioTitle) && (
                <button
                  type="button"
                  onClick={() => onUpdate({
                    bgAudioUrl: '',
                    bgAudioPresetId: '',
                    bgAudioTitle: '',
                    spotifyUrl: '',
                    musicType: 'none',
                  })}
                  className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove from this page</span>
                </button>
              )}
            </motion.div>
          )}

          {/* Tab 2: RSVP Config */}
          {activeTab === 'rsvp' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Information to Collect from Guests
                  </h4>
                  {!defaultRsvpConfig.enabled && (
                    <button
                      type="button"
                      onClick={() => handleUpdateRsvp({ enabled: true })}
                      className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add RSVP Form to Page</span>
                    </button>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center justify-between cursor-pointer bg-white">
                    <span className="text-xs font-semibold text-stone-800">Phone Number for WhatsApp Updates</span>
                    <input
                      type="checkbox"
                      checked={defaultRsvpConfig.collectPhone}
                      onChange={(e) => handleUpdateRsvp({ collectPhone: e.target.checked, enabled: true })}
                      className="w-4 h-4 text-rose-600 rounded-md"
                    />
                  </label>

                  <label className="p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center justify-between cursor-pointer bg-white">
                    <span className="text-xs font-semibold text-stone-800">Total Attending Guest Count</span>
                    <input
                      type="checkbox"
                      checked={defaultRsvpConfig.collectGuestCount}
                      onChange={(e) => handleUpdateRsvp({ collectGuestCount: e.target.checked, enabled: true })}
                      className="w-4 h-4 text-rose-600 rounded-md"
                    />
                  </label>

                  <label className="p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center justify-between cursor-pointer bg-white">
                    <span className="text-xs font-semibold text-stone-800">Meal Preference (Veg / Non-Veg)</span>
                    <input
                      type="checkbox"
                      checked={defaultRsvpConfig.collectDietary}
                      onChange={(e) => handleUpdateRsvp({ collectDietary: e.target.checked, enabled: true })}
                      className="w-4 h-4 text-rose-600 rounded-md"
                    />
                  </label>

                  <label className="p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center justify-between cursor-pointer bg-white">
                    <span className="text-xs font-semibold text-stone-800">Stay &amp; Accommodation Required</span>
                    <input
                      type="checkbox"
                      checked={defaultRsvpConfig.collectAccommodation}
                      onChange={(e) => handleUpdateRsvp({ collectAccommodation: e.target.checked, enabled: true })}
                      className="w-4 h-4 text-rose-600 rounded-md"
                    />
                  </label>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      RSVP Deadline Date (Optional)
                    </label>
                    <input
                      type="text"
                      value={defaultRsvpConfig.deadline || ''}
                      onChange={(e) => handleUpdateRsvp({ deadline: e.target.value, enabled: true })}
                      placeholder="e.g. Please confirm by December 10, 2026"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Host WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={event.whatsappNumber || ''}
                      onChange={(e) => {
                        onUpdate({
                          whatsappNumber: e.target.value,
                          rsvpConfig: { ...defaultRsvpConfig, enabled: true }
                        });
                      }}
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600"
                    />
                  </div>
                </div>

                {/* Custom RSVP Questions */}
                <div className="space-y-2.5 pt-2 border-t border-stone-100">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Custom RSVP Questions (Optional)
                  </label>
                  {(defaultRsvpConfig.customQuestions || []).length > 0 && (
                    <div className="space-y-2">
                      {(defaultRsvpConfig.customQuestions || []).map((q, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={q}
                            onChange={(e) => {
                              const next = [...(defaultRsvpConfig.customQuestions || [])];
                              next[idx] = e.target.value;
                              handleUpdateRsvp({ customQuestions: next, enabled: true });
                            }}
                            className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomQuestion(idx)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomQuestion();
                        }
                      }}
                      placeholder="Add a custom question (e.g. Arrival time or Song request)"
                      className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomQuestion}
                      className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Field</span>
                    </button>
                  </div>
                </div>

                {defaultRsvpConfig.enabled && (
                  <button
                    type="button"
                    onClick={() => onUpdate({
                      rsvpConfig: {
                        ...defaultRsvpConfig,
                        enabled: false
                      }
                    })}
                    className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove from this page</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Tab 3: UPI Gifts & QR Image Upload */}
          {activeTab === 'upi' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
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
                    <div className="flex items-center gap-3">
                      <div className="relative group inline-block bg-white p-2 rounded-xl border border-stone-200 shadow-sm">
                        <img 
                          src={event.upiQrImageUrl} 
                          alt="Uploaded UPI QR Code" 
                          className="w-32 h-32 object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => onUpdate({ upiQrImageUrl: undefined })}
                          className="absolute -top-2 -right-2 bg-rose-700 text-white p-1 rounded-full shadow-md hover:bg-rose-800 transition-colors cursor-pointer"
                          title="Remove Custom QR Image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <label className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 cursor-pointer flex items-center gap-1.5 shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-rose-600" />
                        <span>Change QR Image</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleQrFileUpload} 
                          className="hidden" 
                        />
                      </label>
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
                    Enter your VPA (e.g. name@okaxis) or phone number (e.g. 9876543210@paytm). If a custom QR image is not uploaded, a QR code is automatically generated from this ID.
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
                      onChange={(e) => onUpdate({ upiName: e.target.value, showUpiQrCode: true })}
                      placeholder="e.g. Anand & Divya Celebration"
                      className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-rose-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              {(event.upiId || event.upiQrImageUrl || event.showUpiQrCode !== false) && (
                <button
                  type="button"
                  onClick={() => onUpdate({
                    upiId: '',
                    upiQrImageUrl: '',
                    upiName: '',
                    showUpiQrCode: false,
                  })}
                  className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove from this page</span>
                </button>
              )}
            </motion.div>
          )}

          {/* Tab 4: Google Account Session Access Control (Zero-Password Model) */}
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="max-w-xl bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                    Invitation Access &amp; Session Control
                  </label>
                  <p className="text-xs text-stone-500 mt-1">
                    We never collect or store passwords. Choose whether anyone with the link can view your page or require guests to verify with their Google Account session.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onUpdate({ visibility: 'anyone', allowedEmails: '' })}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      (event.visibility || 'anyone') === 'anyone'
                        ? 'bg-white border-rose-600 ring-2 ring-rose-600/20 shadow-xs'
                        : 'bg-white/60 border-stone-200 hover:bg-white'
                    }`}
                  >
                    <p className="text-xs font-bold text-stone-900">Open Public Link</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Anyone with your invitation link can view directly without signing in.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdate({ visibility: 'restricted' })}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      event.visibility === 'restricted'
                        ? 'bg-white border-rose-600 ring-2 ring-rose-600/20 shadow-xs'
                        : 'bg-white/60 border-stone-200 hover:bg-white'
                    }`}
                  >
                    <p className="text-xs font-bold text-stone-900">Google Account Session Only</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Guests select their signed-in Google Account (1-click session, no passwords).
                    </p>
                  </button>
                </div>

                {event.visibility === 'restricted' && (
                  <div className="space-y-3 pt-2 border-t border-stone-200/80">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Allowed Google Emails (Optional — leave blank to allow any signed-in Google account)
                      </label>
                      <textarea
                        rows={2}
                        value={event.allowedEmails || ''}
                        onChange={(e) => onUpdate({ allowedEmails: e.target.value })}
                        placeholder="e.g. family@gmail.com, friend@gmail.com"
                        className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-rose-600"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => onUpdate({ visibility: 'anyone', allowedEmails: '' })}
                      className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove from this page</span>
                    </button>
                  </div>
                )}
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
