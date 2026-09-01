import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft,
  Plus,
  Save,
  Check,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import type { LovinglyEvent, EventKind } from '../../types';
import { MASTER_TEMPLATES, type MasterTemplate } from '../../lib/designSystem';
import { EVENT_TYPE_OPTIONS } from '../../data/eventTypes';

interface TemplateStepProps {
  event: LovinglyEvent;
  onUpdateEvent?: (updates: Partial<LovinglyEvent>) => void;
  onSelectTemplate: (template: MasterTemplate) => void;
  onSelectBlank: () => void;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
}

export function TemplateStep({
  event,
  onUpdateEvent,
  onSelectTemplate,
  onSelectBlank,
  onBack,
  onNext,
  onSaveDraft
}: TemplateStepProps) {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEventTypeChange = (newKind: EventKind) => {
    const selectedOpt = EVENT_TYPE_OPTIONS.find(opt => opt.id === newKind);
    if (onUpdateEvent) {
      onUpdateEvent({
        eventType: newKind,
        ...(selectedOpt ? {
          title: event.title || selectedOpt.defaultTitle,
          recipientName: event.recipientName || selectedOpt.defaultRecipient,
          messages: event.messages.length > 0 ? event.messages : [selectedOpt.defaultMessage]
        } : {})
      });
    }
  };

  const handleSaveDraftClick = () => {
    if (onSaveDraft) {
      onSaveDraft();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8 space-y-8 max-w-full overflow-x-hidden">
      {/* Step Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
          <span>Step 1 of 6</span>
          <span>•</span>
          <span>Event Type & Template Canvas</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
          Select Event Category & Starting Template
        </h2>
        <p className="text-stone-500 text-xs sm:text-base leading-relaxed">
          Choose your event type from the simple dropdown below, then pick a handcrafted starting template or blank canvas.
        </p>
      </div>

      {/* Save Draft Notification Toast */}
      {saveSuccess && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>Draft Saved Successfully! You can resume anytime from your Dashboard.</span>
        </div>
      )}

      {/* SECTION 1: Event Type Dropdown Selection */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>Select Event Type</span>
          </label>
          <span className="text-[11px] text-stone-400">Section 1 of 2</span>
        </div>

        <div className="relative">
          <select
            value={event.eventType || 'wedding'}
            onChange={(e) => handleEventTypeChange(e.target.value as EventKind)}
            className="w-full pl-4 pr-10 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 appearance-none focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all cursor-pointer"
          >
            {EVENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.title} — ({opt.subtitle})
              </option>
            ))}
          </select>
          <ChevronDown className="w-5 h-5 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* SECTION 2: Template Cards Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto px-1">
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Section 2 of 2: Select Template Design
          </h3>
          <span className="text-xs text-stone-500 font-medium">Click any template to continue</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {/* Blank Canvas Option */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => {
              onSelectBlank();
              onNext();
            }}
            className="rounded-3xl border-2 border-dashed border-stone-300 hover:border-rose-600 p-6 flex flex-col justify-between text-center items-center cursor-pointer bg-white hover:bg-rose-50/20 transition-all group min-h-[260px] shadow-2xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center my-auto transition-colors">
              <Plus className="w-6 h-6 text-rose-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-stone-900 text-lg group-hover:text-rose-700 transition-colors">
                Start Blank Canvas
              </h3>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                Design from scratch with a clean slate. Add custom motifs, colors, and layout elements.
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 mt-4 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              <span>Start Clean Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </motion.div>

          {/* Master Preset Templates */}
          {MASTER_TEMPLATES.map((tmpl: MasterTemplate) => {
            const isSelected = event.templateId === tmpl.id;

            return (
              <motion.div
                key={tmpl.id}
                whileHover={{ y: -3 }}
                onClick={() => {
                  onSelectTemplate(tmpl);
                  onNext();
                }}
                className={`rounded-3xl border overflow-hidden flex flex-col justify-between cursor-pointer bg-white transition-all group min-h-[260px] ${
                  isSelected
                    ? 'border-rose-600 ring-2 ring-rose-600/20 shadow-md'
                    : 'border-stone-200 hover:border-stone-400 hover:shadow-sm'
                }`}
              >
                {/* Visual Card Header */}
                <div 
                  style={{ backgroundColor: tmpl.primaryColor }}
                  className="p-5 text-white text-center flex flex-col justify-center items-center min-h-[130px] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 space-y-1">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/25 uppercase tracking-widest text-amber-200">
                      {tmpl.category}
                    </span>
                    <h4 className="font-serif font-bold text-lg text-white drop-shadow-xs">
                      {tmpl.name}
                    </h4>
                  </div>
                </div>

                {/* Card Meta & Action */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {tmpl.tagline}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs font-bold text-stone-700 group-hover:text-rose-700">
                    <span>Use This Template</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-rose-600" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Sticky Navigation Footer */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 sm:p-4 rounded-2xl z-20 shadow-lg flex items-center justify-between gap-2 max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="px-3.5 sm:px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Exit</span>
          <span className="sm:hidden">Exit</span>
        </button>

        <button
          onClick={handleSaveDraftClick}
          className="px-3.5 sm:px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50/60 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4 text-rose-600" />
          <span>Save Draft</span>
        </button>

        <button
          onClick={onNext}
          className="px-4 sm:px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
        >
          <span>Move to Next Section</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

