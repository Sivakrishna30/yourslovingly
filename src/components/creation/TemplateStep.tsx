import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Plus, 
  Check, 
  ChevronDown, 
  Sparkles,
  Eye,
  X,
  Smartphone,
  Monitor,
  Layers
} from 'lucide-react';
import type { LovinglyEvent, EventKind } from '../../types';
import { MASTER_TEMPLATES, getTemplatesSortedByEventType, type MasterTemplate } from '../../lib/designSystem';
import { EVENT_TYPE_OPTIONS } from '../../data/eventTypes';
import { masterTemplateToLovinglyEvent } from '../../lib/sampleAdapter';
import { EventViewer } from '../Viewer';
import { CreationBottomNav } from './CreationBottomNav';

interface TemplateStepProps {
  event: LovinglyEvent;
  onUpdateEvent?: (updates: Partial<LovinglyEvent>) => void;
  onSelectTemplate: (template: MasterTemplate) => void;
  onSelectBlank: () => void;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
}

/**
 * Responsive miniature template preview component.
 * Dynamically scales the production EventViewer proportionally edge-to-edge
 * with real frames, center elements, typography, and textures.
 */
function TemplateCardThumbnail({ 
  tmpl, 
  onPreview 
}: { 
  tmpl: MasterTemplate; 
  onPreview: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const templateEvent = useMemo(() => masterTemplateToLovinglyEvent(tmpl), [tmpl]);

  const BASE_WIDTH = 360;
  const BASE_HEIGHT = 260;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setScale(width / BASE_WIDTH);
      }
    };

    updateScale();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) {
          setScale(w / BASE_WIDTH);
        }
      }
    });

    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  const containerHeight = Math.round(BASE_HEIGHT * scale);

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-t-3xl border-b border-stone-200/90 group/thumb select-none"
      style={{ 
        height: containerHeight > 0 ? `${containerHeight}px` : `${BASE_HEIGHT}px`,
        backgroundColor: tmpl.primaryColor ? `${tmpl.primaryColor}12` : '#FAF9F6'
      }}
    >
      <div 
        style={{
          width: `${BASE_WIDTH}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        className="pointer-events-none select-none absolute top-0 left-0"
      >
        <EventViewer event={templateEvent} isCompact={true} isBuilderMode={false} />
      </div>

      {/* Quick Hover Overlay */}
      <div className="absolute inset-0 bg-stone-900/35 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px] z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          className="px-4 py-2 rounded-xl bg-white text-stone-900 text-xs font-bold shadow-lg hover:bg-stone-50 transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer pointer-events-auto"
        >
          <Eye className="w-3.5 h-3.5 text-rose-600" />
          <span>Full Preview</span>
        </button>
      </div>

      {/* Bottom gradient with badge & category */}
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent flex items-end justify-between px-3.5 pb-2.5 z-10 pointer-events-none">
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20 truncate max-w-[170px]">
          {tmpl.badge}
        </span>
        <span className="text-[10px] font-semibold text-white/90 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
          {tmpl.categoryLabel}
        </span>
      </div>
    </div>
  );
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
  const [previewTemplate, setPreviewTemplate] = useState<MasterTemplate | null>(null);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'desktop' | 'mobile'>('mobile');

  const currentEventType = event.eventType || 'wedding';

  const previewTemplateEvent = useMemo(() => {
    return previewTemplate ? masterTemplateToLovinglyEvent(previewTemplate) : null;
  }, [previewTemplate]);

  // Dynamically sort templates prioritizing the selected Event Type
  const { allSorted: displayTemplates } = useMemo(() => {
    return getTemplatesSortedByEventType(MASTER_TEMPLATES, currentEventType);
  }, [currentEventType]);

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
    <div className="flex flex-col h-full min-h-0 overflow-hidden w-full max-w-full">
      {/* Scrollable Center Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-full">
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
            Choose your event type to prioritize perfectly curated layouts, auspicious motifs, and color palettes.
          </p>
        </div>

        {/* Save Draft Notification Toast */}
        {saveSuccess && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 max-w-xl mx-auto">
            <Check className="w-4 h-4 text-emerald-200" />
            <span>Draft Saved Successfully! You can resume anytime from your Dashboard.</span>
          </div>
        )}

        {/* SECTION 1: Event Type Dropdown */}
        <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-6 shadow-xs max-w-4xl mx-auto space-y-3">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>Section 1 of 2: Choose Event Type</span>
          </label>

          {/* Clean Dropdown */}
          <div className="relative">
            <select
              value={currentEventType}
              onChange={(e) => handleEventTypeChange(e.target.value as EventKind)}
              className="w-full pl-4 pr-10 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm font-semibold text-stone-900 appearance-none focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all cursor-pointer"
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
        <div className="space-y-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-1.5 px-1">
            <Layers className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Section 2 of 2: Select Starting Design
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Blank Canvas Option */}
            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => {
                onSelectBlank();
                onNext();
              }}
              className="rounded-3xl border-2 border-dashed border-stone-300 hover:border-rose-600 p-6 flex flex-col justify-between text-center items-center cursor-pointer bg-white hover:bg-rose-50/20 transition-all group min-h-[340px] shadow-2xs"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center my-auto transition-colors">
                <Plus className="w-7 h-7 text-rose-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-stone-900 text-lg group-hover:text-rose-700 transition-colors">
                  Start Blank Canvas
                </h3>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                  Design from scratch with a clean slate. Add custom center elements, frames, colors, and layout blocks.
                </p>
              </div>
              <div className="w-full pt-4 border-t border-stone-100">
                <span className="w-full py-2.5 px-3 rounded-xl bg-stone-100 group-hover:bg-rose-100 text-stone-800 group-hover:text-rose-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                  <span>Start Clean Canvas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>

            {/* Master Preset Templates with Live Interactive Previews */}
            {displayTemplates.map((tmpl: MasterTemplate) => {
              const isSelected = event.templateId === tmpl.id;
              const isPrimaryMatch = tmpl.category === currentEventType;
              const isCompatibleMatch = Boolean(
                tmpl.compatibleEventTypes && tmpl.compatibleEventTypes.includes(currentEventType as EventKind)
              );
              const isMatch = isPrimaryMatch || isCompatibleMatch;

              return (
                <motion.div
                  key={tmpl.id}
                  whileHover={{ y: -3 }}
                  onClick={() => {
                    onSelectTemplate(tmpl);
                    onNext();
                  }}
                  className={`rounded-3xl border overflow-hidden flex flex-col justify-between cursor-pointer bg-white transition-all group ${
                    isSelected
                      ? 'border-rose-600 ring-2 ring-rose-600/20 shadow-md'
                      : isMatch
                        ? 'border-rose-200/90 hover:border-rose-400 hover:shadow-md'
                        : 'border-stone-200 hover:border-stone-300 hover:shadow-sm opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Miniature Interactive Preview */}
                  <div className="relative">
                    <TemplateCardThumbnail 
                      tmpl={tmpl} 
                      onPreview={() => setPreviewTemplate(tmpl)} 
                    />
                  </div>

                  {/* Card Info & Tags */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-serif font-bold text-base text-stone-900 group-hover:text-rose-700 transition-colors line-clamp-1">
                          {tmpl.name}
                        </h4>
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                        {tmpl.tagline}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-2.5 border-t border-stone-100 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(tmpl);
                        }}
                        className="py-2.5 px-2 rounded-xl border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span className="truncate">Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTemplate(tmpl);
                          onNext();
                        }}
                        className="py-2.5 px-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                      >
                        <span className="truncate">Select</span>
                        <ArrowRight className="w-3 h-3 shrink-0" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FIXED Bottom Navigation Bar (Non-cropping, responsive) */}
      <CreationBottomNav 
        onBack={onBack}
        onNext={onNext}
        onSaveDraft={handleSaveDraftClick}
        backLabel="Back to Exit"
        mobileBackLabel="Exit"
        nextLabel="Move to Next Section"
        mobileNextLabel="Next"
      />

      {/* Complete Full-Invitation Preview Modal Powered by EventViewer */}
      {previewTemplate && previewTemplateEvent && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex flex-col p-2 sm:p-4 md:p-6 overflow-hidden">
          {/* Modal Top Bar */}
          <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 border border-stone-200/90 shadow-lg flex items-center justify-between gap-3 shrink-0 mb-3 sm:mb-4">
            <div className="min-w-0 flex-1 pr-2">
              <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-lg md:text-xl truncate tracking-tight">
                {previewTemplate.name}
              </h3>
              {previewTemplate.tagline && (
                <p className="text-stone-500 text-[11px] sm:text-xs truncate hidden sm:block mt-0.5">
                  {previewTemplate.tagline}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Device Mode Switcher */}
              <div className="hidden md:flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setPreviewDeviceMode('mobile')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    previewDeviceMode === 'mobile' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-rose-600" />
                  <span>Mobile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDeviceMode('desktop')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    previewDeviceMode === 'desktop' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5 text-rose-600" />
                  <span>Desktop</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  const t = previewTemplate;
                  setPreviewTemplate(null);
                  onSelectTemplate(t);
                  onNext();
                }}
                className="px-3 sm:px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 w-full max-w-5xl mx-auto overflow-y-auto rounded-3xl bg-stone-900/60 p-2 sm:p-4 flex justify-center items-start border border-white/10 shadow-2xl">
            <div 
              className={`w-full transition-all duration-300 ${
                previewDeviceMode === 'desktop' 
                  ? 'max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden my-auto' 
                  : 'max-w-[380px] bg-white shadow-2xl rounded-[40px] border-[8px] border-stone-800 overflow-hidden my-auto'
              }`}
            >
              <EventViewer 
                event={previewTemplateEvent} 
                isCompact={false} 
                isBuilderMode={false} 
                deviceMode={previewDeviceMode}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
