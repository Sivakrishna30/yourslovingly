import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Type, 
  Calendar, 
  MapPin, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  Eye,
  Save,
  Check,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react';
import type { LovinglyEvent } from '../../types';
import { SmartMessageSuggestion } from '../SmartMessageSuggestion';

interface DetailsStepProps {
  event: LovinglyEvent;
  onUpdate: (updates: Partial<LovinglyEvent>) => void;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
}

export function DetailsStep({ event, onUpdate, onBack, onNext, onSaveDraft }: DetailsStepProps) {
  const [activeTab, setActiveTab] = useState<'basics' | 'venue' | 'message'>('basics');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const messagesList = event.messages && event.messages.length > 0 ? event.messages : [''];

  const handleUpdateMessage = (index: number, val: string) => {
    const updated = [...messagesList];
    updated[index] = val;
    onUpdate({ messages: updated });
  };

  const handleAddMessageField = () => {
    onUpdate({ messages: [...messagesList, ''] });
  };

  const handleRemoveMessageField = (index: number) => {
    if (messagesList.length <= 1) return;
    const updated = messagesList.filter((_, i) => i !== index);
    onUpdate({ messages: updated });
  };

  const handleNextClick = () => {
    if (activeTab === 'basics') {
      setActiveTab('venue');
    } else if (activeTab === 'venue') {
      setActiveTab('message');
    } else {
      onNext();
    }
  };

  const handleBackClick = () => {
    if (activeTab === 'message') {
      setActiveTab('venue');
    } else if (activeTab === 'venue') {
      setActiveTab('basics');
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

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8 space-y-6 max-w-full overflow-x-hidden">
      {/* Step Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
          <span>Step 2 of 6</span>
          <span>•</span>
          <span>Invite Details</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
          Enter Your Event Information
        </h2>
        <p className="text-stone-500 text-xs sm:text-base leading-relaxed">
          Fill in your event details below section by section. Everything updates in real time on the live preview canvas.
        </p>
      </div>

      {/* Save Draft Notification Toast */}
      {saveSuccess && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 max-w-xl mx-auto">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>Draft Saved Successfully! You can resume anytime from your Dashboard.</span>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start max-w-full overflow-x-hidden">
        {/* Left: Input Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-4 sm:p-6 lg:p-8 shadow-sm space-y-6 relative max-w-full overflow-x-hidden">
          {/* Sub-tabs */}
          <div className="flex items-center gap-1 sm:gap-2 p-1 bg-stone-100 rounded-2xl max-w-full overflow-x-auto">
            <button
              onClick={() => setActiveTab('basics')}
              className={`flex-1 min-w-0 py-2.5 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'basics' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Type className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              <span className="truncate">1. Title & Host</span>
            </button>
            <button
              onClick={() => setActiveTab('venue')}
              className={`flex-1 min-w-0 py-2.5 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'venue' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              <span className="truncate">2. Date & Venue</span>
            </button>
            <button
              onClick={() => setActiveTab('message')}
              className={`flex-1 min-w-0 py-2.5 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'message' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              <span className="truncate">3. Invitation Note</span>
            </button>
          </div>

          {/* Section Indicator */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {activeTab === 'basics' && 'Section 1 of 3: Main Headline & Hosts'}
              {activeTab === 'venue' && 'Section 2 of 3: Event Date & Location'}
              {activeTab === 'message' && 'Section 3 of 3: Invitation Message & Smart Suggestions'}
            </span>
            <span className="text-[11px] text-stone-400">
              {activeTab === 'basics' ? 'Section 1/3' : activeTab === 'venue' ? 'Section 2/3' : 'Section 3/3'}
            </span>
          </div>

          {/* Tab 1: Basics */}
          {activeTab === 'basics' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Event Title / Couple or Host Names *
                </label>
                <input
                  type="text"
                  value={event.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  placeholder="e.g. Anand & Divya, Aarav's 5th Birthday"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">Displayed prominently as the main headline</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Host Header / Subtitle
                </label>
                <input
                  type="text"
                  value={event.recipientName}
                  onChange={(e) => onUpdate({ recipientName: e.target.value })}
                  placeholder="e.g. Together with their families, Our beloved family & friends"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Custom Welcome Tagline / Quote / Heading
                </label>
                <input
                  type="text"
                  value={event.shlokaText || ''}
                  onChange={(e) => onUpdate({ shlokaText: e.target.value })}
                  placeholder="e.g. Celebrating Our Holy Matrimony, Two Souls One Love"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                />
              </div>
            </motion.div>
          )}

          {/* Tab 2: Date & Venue */}
          {activeTab === 'venue' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Event Date & Time *
                </label>
                <input
                  type="text"
                  value={event.eventDate}
                  onChange={(e) => onUpdate({ eventDate: e.target.value })}
                  placeholder="e.g. Sunday, December 24, 2026 • 6:30 PM Onwards"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Venue Name & Address *
                </label>
                <textarea
                  value={event.location}
                  onChange={(e) => onUpdate({ location: e.target.value })}
                  rows={3}
                  placeholder="e.g. The Grand Ballroom, The Leela Palace, Old Airport Road, Bengaluru"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Google Maps Link (One-Click Directions)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={event.googleMapsUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      onUpdate({ 
                        googleMapsUrl: val,
                        showLocationQrCode: val ? (event.showLocationQrCode ?? true) : false 
                      });
                    }}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                  />
                </div>

                {event.googleMapsUrl && (
                  <div className="mt-3 p-3 bg-rose-50/70 border border-rose-200/80 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-xl border border-stone-200 p-1 shrink-0 flex items-center justify-center">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(event.googleMapsUrl)}`}
                          alt="Venue Directions QR Code"
                          className="w-10 h-10 object-contain rounded"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-900 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          Generate Location Directions QR Code
                        </span>
                        <span className="text-[11px] text-stone-500 block">Attach QR code on page for guests to scan map directions</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={!!event.showLocationQrCode} 
                        onChange={(e) => onUpdate({ showLocationQrCode: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-700"></div>
                    </label>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Tab 3: Invitation Note & Flexible AI Suggestions */}
          {activeTab === 'message' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {messagesList.map((msgText, idx) => (
                <div key={idx} className="bg-stone-50/70 border border-stone-200/90 rounded-2xl p-4 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Invitation Message Paragraph {idx + 1} {idx === 0 ? '*' : '(Optional)'}
                    </label>

                    {messagesList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMessageField(idx)}
                        className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove message paragraph"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <textarea
                    value={msgText}
                    onChange={(e) => handleUpdateMessage(idx, e.target.value)}
                    rows={3}
                    placeholder={
                      idx === 0 
                        ? "With joyful hearts, we lovingly invite you to celebrate..." 
                        : "Dinner and celebration to follow. Your presence is our most cherished gift."
                    }
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                  />

                  {/* AI Smart Message Suggester bound to this paragraph */}
                  <div className="pt-1">
                    <SmartMessageSuggestion 
                      eventType={event.eventType}
                      onSelectSuggestion={(suggestion: string) => handleUpdateMessage(idx, suggestion)}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddMessageField}
                className="w-full py-3 border-2 border-dashed border-rose-200 bg-rose-50/40 hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Message Paragraph</span>
              </button>
            </motion.div>
          )}

          {/* Sticky Bottom Navigation Actions */}
          <div className="sticky -bottom-4 sm:-bottom-6 lg:-bottom-8 -mx-4 sm:-mx-6 lg:-mx-8 -mb-4 sm:-mb-6 lg:-mb-8 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 sm:p-4 rounded-b-3xl z-20 shadow-lg flex items-center justify-between gap-2">
            <button
              onClick={handleBackClick}
              className="px-3.5 sm:px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Previous Section</span>
              <span className="sm:hidden">Back</span>
            </button>

            <button
              onClick={handleSaveDraftClick}
              className="px-3 sm:px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50/60 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4 text-rose-600" />
              <span>Save Draft</span>
            </button>

            <button
              onClick={handleNextClick}
              className="px-4 sm:px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
            >
              <span>{activeTab === 'message' ? 'Continue to Motifs & Styles' : 'Move to Next Section'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Real-time Synchronized Preview Card (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-stone-100 rounded-3xl p-4 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-stone-500" />
                Live Canvas Sync
              </span>
              <span className="text-[10px] text-stone-400 font-medium">Updates as you type</span>
            </div>

            {/* Simulated Live Viewport Card */}
            <div 
              style={{ backgroundColor: event.primaryColor || '#881337' }}
              className="rounded-2xl p-6 text-white text-center space-y-4 shadow-md overflow-hidden relative"
            >
              {event.shlokaText && (
                <p className="text-[10px] text-amber-200/90 font-serif italic tracking-wide">
                  {event.shlokaText}
                </p>
              )}

              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-widest text-amber-200 font-semibold">
                  {event.recipientName || 'Together with their families'}
                </p>
                <h3 className="font-serif font-bold text-2xl text-white tracking-tight leading-tight">
                  {event.title || 'Event Title'}
                </h3>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-3 text-left space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-amber-100">
                  <Calendar className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">{event.eventDate || 'Date & Time'}</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                  <span className="truncate">{event.location || 'Venue Location'}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-white/80 italic font-serif leading-relaxed text-left">
                {messagesList.filter(m => m.trim()).map((mText, i) => (
                  <p key={i}>"{mText}"</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


