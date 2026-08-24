import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Music, 
  Users, 
  IndianRupee, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck
} from 'lucide-react';
import type { LovinglyEvent, RsvpFormConfig } from '../../types';

interface FeaturesStepProps {
  event: LovinglyEvent;
  onUpdate: (updates: Partial<LovinglyEvent>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function FeaturesStep({ event, onUpdate, onBack, onNext }: FeaturesStepProps) {
  const [activeTab, setActiveTab] = useState<'spotify' | 'rsvp' | 'upi' | 'security'>('spotify');

  const defaultRsvpConfig: RsvpFormConfig = event.rsvpConfig || {
    enabled: true,
    collectPhone: true,
    collectGuestCount: true,
    collectDietary: true,
    collectAccommodation: false,
    customQuestions: []
  };

  const handleUpdateRsvp = (updates: Partial<RsvpFormConfig>) => {
    const updated = {
      ...defaultRsvpConfig,
      ...updates
    };
    onUpdate({ rsvpConfig: updated });
  };

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8 space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
          <span>Step 6 of 7</span>
          <span>•</span>
          <span>Interactive Features</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
          Configure Interactive Integrations
        </h2>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
          Enable Spotify celebration soundtracks, interactive RSVP tracking, UPI gift collection, and privacy controls.
        </p>
      </div>

      {/* Main Feature Container */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-stone-100 rounded-2xl">
          {[
            { id: 'spotify', label: 'Spotify Music', icon: Music, badge: 'Included' },
            { id: 'rsvp', label: 'RSVP Form', icon: Users, badge: event.rsvpConfig?.enabled !== false ? 'Active' : 'Off' },
            { id: 'upi', label: 'UPI Gifts', icon: IndianRupee, badge: event.upiId ? 'Configured' : 'Optional' },
            { id: 'security', label: 'Password & Security', icon: Lock, badge: event.password ? 'Protected' : 'Public' }
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

        {/* Tab 1: Spotify Music */}
        {activeTab === 'spotify' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
              <Music className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">Background Celebration Music</h4>
                <p className="text-xs text-emerald-700 leading-relaxed mt-0.5">
                  Embed any track or playlist from Spotify. Visitors will see a refined floating music player to enjoy your curated celebration vibe.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Spotify Track or Playlist URL
              </label>
              <input
                type="url"
                value={event.spotifyUrl || ''}
                onChange={(e) => onUpdate({ spotifyUrl: e.target.value })}
                placeholder="https://open.spotify.com/track/..."
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600 transition-all"
              />
              <p className="text-[11px] text-stone-400 mt-1.5">
                Paste any Spotify track, album, or playlist link directly.
              </p>
            </div>
          </motion.div>
        )}

        {/* Tab 2: RSVP Config */}
        {activeTab === 'rsvp' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-stone-900">Enable Interactive Guest RSVP</span>
                <p className="text-xs text-stone-500">Collect attendance responses and headcount directly to your dashboard</p>
              </div>
              <input
                type="checkbox"
                checked={defaultRsvpConfig.enabled}
                onChange={(e) => handleUpdateRsvp({ enabled: e.target.checked })}
                className="w-5 h-5 text-rose-600 rounded-md focus:ring-rose-500 border-stone-300 cursor-pointer"
              />
            </div>

            {defaultRsvpConfig.enabled && (
              <div className="space-y-4 pl-2">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Information to Collect from Guests
                </h4>

                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-semibold text-stone-800">Phone Number for WhatsApp Updates</span>
                    <input
                      type="checkbox"
                      checked={defaultRsvpConfig.collectPhone}
                      onChange={(e) => handleUpdateRsvp({ collectPhone: e.target.checked })}
                      className="w-4 h-4 text-rose-600 rounded-md"
                    />
                  </label>

                  <label className="p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-semibold text-stone-800">Total Attending Guest Count</span>
                    <input
                      type="checkbox"
                      checked={defaultRsvpConfig.collectGuestCount}
                      onChange={(e) => handleUpdateRsvp({ collectGuestCount: e.target.checked })}
                      className="w-4 h-4 text-rose-600 rounded-md"
                    />
                  </label>

                  <label className="p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-semibold text-stone-800">Meal Preference (Veg / Jain / Non-Veg)</span>
                    <input
                      type="checkbox"
                      checked={defaultRsvpConfig.collectDietary}
                      onChange={(e) => handleUpdateRsvp({ collectDietary: e.target.checked })}
                      className="w-4 h-4 text-rose-600 rounded-md"
                    />
                  </label>

                  <label className="p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center justify-between cursor-pointer">
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
            )}
          </motion.div>
        )}

        {/* Tab 3: UPI Gifts */}
        {activeTab === 'upi' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <IndianRupee className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Direct UPI Shagun & Digital Gifts</h4>
                <p className="text-xs text-amber-700 leading-relaxed mt-0.5">
                  Allows well-wishers and guests to send digital blessings directly to your bank via GPay, PhonePe, Paytm, or BHIM. Zero commission taken by Yours Lovingly.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Your UPI ID (VPA)
                </label>
                <input
                  type="text"
                  value={event.upiId || ''}
                  onChange={(e) => onUpdate({ upiId: e.target.value })}
                  placeholder="e.g. name@okaxis, 9876543210@paytm"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Payee Display Name
                </label>
                <input
                  type="text"
                  value={event.upiName || ''}
                  onChange={(e) => onUpdate({ upiName: e.target.value })}
                  placeholder="e.g. Anand & Divya Celebration"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600 transition-all"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 4: Security & Password */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-stone-900">Privacy & Password Lock</h4>
                <p className="text-xs text-stone-500 leading-relaxed mt-0.5">
                  Protect private family photos and venue details with an optional 4-digit PIN or passcode.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Access Passcode / PIN (Leave empty for public)
              </label>
              <input
                type="text"
                value={event.password || ''}
                onChange={(e) => onUpdate({ password: e.target.value })}
                placeholder="e.g. 2026 or LOVE24"
                className="w-full max-w-sm px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600 transition-all"
              />
            </div>
          </motion.div>
        )}

        {/* Sticky Bottom Actions */}
        <div className="sticky -bottom-4 sm:-bottom-6 lg:-bottom-8 -mx-4 sm:-mx-6 lg:-mx-8 -mb-4 sm:-mb-6 lg:-mb-8 bg-white/95 backdrop-blur-xs border-t border-stone-200 p-3 sm:p-4 rounded-b-3xl z-20 shadow-lg flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="px-3.5 sm:px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Previous Section</span>
            <span className="sm:hidden">Back</span>
          </button>
          <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider hidden xs:inline">
            Step 6 of 7
          </span>
          <button
            onClick={onNext}
            className="px-4 sm:px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
          >
            <span>Move to Next Section</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
