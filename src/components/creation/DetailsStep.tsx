import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Type, 
  Calendar, 
  MapPin, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  Eye
} from 'lucide-react';
import type { LovinglyEvent } from '../../types';
import { SmartMessageSuggestion } from '../SmartMessageSuggestion';

interface DetailsStepProps {
  event: LovinglyEvent;
  onUpdate: (updates: Partial<LovinglyEvent>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function DetailsStep({ event, onUpdate, onBack, onNext }: DetailsStepProps) {
  const [activeTab, setActiveTab] = useState<'basics' | 'venue' | 'message'>('basics');

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Step Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
          <span>Step 3 of 6</span>
          <span>•</span>
          <span>Invite Details</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
          Enter Your Event Information
        </h2>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
          Fill in your event details below. Everything updates in real time on the live preview canvas.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Sub-tabs */}
          <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-2xl">
            <button
              onClick={() => setActiveTab('basics')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'basics' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>1. Title & Host</span>
            </button>
            <button
              onClick={() => setActiveTab('venue')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'venue' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>2. Date & Venue</span>
            </button>
            <button
              onClick={() => setActiveTab('message')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'message' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>3. Invitation Note</span>
            </button>
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
                  Custom Shloka / Blessing / Tagline
                </label>
                <input
                  type="text"
                  value={event.shlokaText || ''}
                  onChange={(e) => onUpdate({ shlokaText: e.target.value })}
                  placeholder="e.g. || Vakratunda Mahakaya || or Om Shri Ganeshaya Namah"
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
                    onChange={(e) => onUpdate({ googleMapsUrl: e.target.value })}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 3: Invitation Note & AI Suggestions */}
          {activeTab === 'message' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Invitation Message Paragraph 1
                  </label>
                </div>
                <textarea
                  value={event.messages[0] || ''}
                  onChange={(e) => {
                    const newMsgs = [...event.messages];
                    newMsgs[0] = e.target.value;
                    onUpdate({ messages: newMsgs });
                  }}
                  rows={3}
                  placeholder="With joyful hearts, we lovingly invite you to celebrate..."
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Invitation Message Paragraph 2 (Optional)
                </label>
                <textarea
                  value={event.messages[1] || ''}
                  onChange={(e) => {
                    const newMsgs = [...event.messages];
                    newMsgs[1] = e.target.value;
                    onUpdate({ messages: newMsgs });
                  }}
                  rows={2}
                  placeholder="Dinner and celebration to follow. Your presence is our most cherished gift."
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                />
              </div>

              {/* AI Smart Message Suggester */}
              <div className="pt-2">
                <SmartMessageSuggestion 
                  eventType={event.eventType}
                  onSelectSuggestion={(msg: string) => {
                    const newMsgs = [...event.messages];
                    newMsgs[0] = msg;
                    onUpdate({ messages: newMsgs });
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={onNext}
              className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>Continue to Elements & Canvas</span>
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

              <div className="space-y-1 text-xs text-white/80 italic font-serif leading-relaxed">
                {event.messages[0] && <p>"{event.messages[0]}"</p>}
                {event.messages[1] && <p className="text-[11px]">"{event.messages[1]}"</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
