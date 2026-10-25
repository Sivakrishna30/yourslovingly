import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Palette, 
  Image as ImageIcon, 
  Sparkles, 
  Layers, 
  Trash2, 
  Upload,
  Check,
  Sliders,
  Eye,
  Smartphone,
  Monitor
} from 'lucide-react';
import type { 
  LovinglyEvent, 
  FrameType, 
  DecorativeMotif, 
  BackgroundTexture 
} from '../../types';
import { EventViewer } from '../Viewer';
import { CreationBottomNav } from './CreationBottomNav';
import { 
  COLOR_PALETTES, 
  FRAME_PRESETS, 
  MOTIF_PRESETS, 
  TEXTURE_PRESETS 
} from '../../lib/designSystem';

interface ElementsStepProps {
  event: LovinglyEvent;
  onUpdate: (updates: Partial<LovinglyEvent>) => void;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
}

const CATEGORIES: Array<'palette' | 'frames' | 'motifs' | 'textures' | 'photos'> = [
  'palette',
  'frames',
  'motifs',
  'textures',
  'photos'
];

export function ElementsStep({ event, onUpdate, onBack, onNext, onSaveDraft }: ElementsStepProps) {
  const [activeCategory, setActiveCategory] = useState<'palette' | 'frames' | 'motifs' | 'textures' | 'photos'>('palette');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isBlankCanvas = !event.templateId;

  const livePreviewEvent: LovinglyEvent = useMemo(() => {
    return {
      ...event,
      // For blank canvas, ensure clean white background and dark text (avoiding default maroon fallback unless styled)
      ...(isBlankCanvas ? {
        primaryColor: (event.primaryColor && event.primaryColor !== '#881337') ? event.primaryColor : '#1c1917',
        secondaryColor: (event.secondaryColor && event.secondaryColor !== '#fff1f2') ? event.secondaryColor : '#ffffff',
        frameType: event.frameType || 'none',
        decorativeMotif: event.decorativeMotif || 'none',
        textureType: event.textureType || 'none',
        elements: [],
      } : {}),
      title: event.title?.trim() || 'Event Title',
      recipientName: event.recipientName?.trim() || (isBlankCanvas ? '' : 'Host / Subtitle'),
      eventDate: event.eventDate?.trim() || 'Date & Time',
      location: event.location?.trim() || 'Venue Location',
      messages: (event.messages && event.messages.some(m => m && m.trim()))
        ? event.messages.filter(m => m && m.trim())
        : []
    };
  }, [event, isBlankCanvas]);

  const currentIndex = CATEGORIES.indexOf(activeCategory);

  const handleNextClick = () => {
    if (currentIndex < CATEGORIES.length - 1) {
      setActiveCategory(CATEGORIES[currentIndex + 1]);
    } else {
      onNext();
    }
  };

  const handleBackClick = () => {
    if (currentIndex > 0) {
      setActiveCategory(CATEGORIES[currentIndex - 1]);
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


  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (eventReader) => {
      const result = eventReader.target?.result as string;
      if (result) {
        const currentPhotos = event.photos || [];
        onUpdate({
          photos: [...currentPhotos, result]
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (index: number) => {
    const updated = (event.photos || []).filter((_, i) => i !== index);
    onUpdate({ photos: updated });
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden w-full max-w-full">
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 lg:p-8 space-y-6 max-w-full">
        {/* Step Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
          <span>Step 3 of 6</span>
          <span>•</span>
          <span>Elements & Styles</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
          Craft & Style Every Element
        </h2>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
          Select auspicious center elements, decorative frames, textured backgrounds, color palettes, and photos.
        </p>
      </div>

      {/* Save Draft Toast */}
      {saveSuccess && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 max-w-xl mx-auto">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>Draft Saved Successfully! You can resume anytime from your Dashboard.</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Drawer Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-4 sm:p-6 lg:p-8 shadow-sm space-y-6 max-w-full overflow-x-hidden">
          {/* Category Switcher Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2 p-1.5 bg-stone-100 rounded-2xl max-w-full">
            {[
              { id: 'palette', label: 'Colors', icon: Palette },
              { id: 'frames', label: 'Frames', icon: Layers },
              { id: 'motifs', label: 'Center Elements', icon: Sparkles },
              { id: 'textures', label: 'Textures', icon: Sliders },
              { id: 'photos', label: 'Photos', icon: ImageIcon }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
                  className={`py-2 px-1 sm:px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer min-w-0 ${
                    isActive ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] sm:text-[11px] truncate w-full text-center">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 1. Color Palettes */}
          {activeCategory === 'palette' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Select Theme Palette
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COLOR_PALETTES.map(pal => {
                  const isSelected = event.primaryColor === pal.primary;
                  return (
                    <button
                      key={pal.id}
                      onClick={() => onUpdate({
                        primaryColor: pal.primary,
                        secondaryColor: pal.secondary,
                        highlightColor: pal.accent
                      })}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected ? 'border-rose-600 ring-2 ring-rose-600/20 bg-rose-50/40' : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-stone-900 block">{pal.name}</span>
                        <span className="text-[10px] text-stone-500 capitalize">{pal.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div style={{ backgroundColor: pal.primary }} className="w-5 h-5 rounded-full border border-white shadow-xs" />
                        <div style={{ backgroundColor: pal.secondary }} className="w-5 h-5 rounded-full border border-white shadow-xs" />
                        <div style={{ backgroundColor: pal.accent }} className="w-5 h-5 rounded-full border border-white shadow-xs" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 2. Decorative Frames */}
          {activeCategory === 'frames' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Auspicious Frames & Borders
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FRAME_PRESETS.map(frame => {
                  const isSelected = (event.frameType || 'none') === frame.id;
                  return (
                    <button
                      key={frame.id}
                      onClick={() => onUpdate({ frameType: frame.id as FrameType })}
                      className={`p-3.5 rounded-2xl border text-center space-y-1.5 transition-all cursor-pointer ${
                        isSelected ? 'border-rose-600 ring-2 ring-rose-600/20 bg-rose-50/40' : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div className="text-xl">{frame.icon}</div>
                      <span className="text-xs font-bold text-stone-900 block leading-tight">{frame.name}</span>
                      <span className="text-[10px] text-stone-500 block">{frame.category}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 4. Center Elements */}
          {activeCategory === 'motifs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Center Elements & Symbols
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MOTIF_PRESETS.map(motif => {
                  const isSelected = (event.decorativeMotif || 'none') === motif.id;
                  return (
                    <button
                      key={motif.id}
                      onClick={() => onUpdate({ decorativeMotif: motif.id as DecorativeMotif })}
                      className={`p-3.5 rounded-2xl border text-center space-y-1.5 transition-all cursor-pointer ${
                        isSelected ? 'border-rose-600 ring-2 ring-rose-600/20 bg-rose-50/40' : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div className="text-xl">{motif.icon}</div>
                      <span className="text-xs font-bold text-stone-900 block leading-tight">{motif.name}</span>
                      <span className="text-[10px] text-stone-500 block">{motif.category}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 5. Textures */}
          {activeCategory === 'textures' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Background Texture Patterns
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TEXTURE_PRESETS.map(tex => {
                  const isSelected = (event.textureType || 'none') === tex.id;
                  return (
                    <button
                      key={tex.id}
                      onClick={() => onUpdate({ textureType: tex.id as BackgroundTexture })}
                      className={`p-3.5 rounded-2xl border text-center space-y-1.5 transition-all cursor-pointer ${
                        isSelected ? 'border-rose-600 ring-2 ring-rose-600/20 bg-rose-50/40' : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div className="text-xl">{tex.icon}</div>
                      <span className="text-xs font-bold text-stone-900 block leading-tight">{tex.name}</span>
                      <span className="text-[10px] text-stone-500 block">{tex.intensity}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 6. Photos */}
          {activeCategory === 'photos' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Photo Gallery ({(event.photos || []).length} / 10)
                </h3>
                <label className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                  <input type="file" accept="image/*" onChange={handleAddPhoto} className="hidden" />
                </label>
              </div>

              {(event.photos || []).length === 0 ? (
                <div className="border-2 border-dashed border-stone-200 rounded-2xl p-8 text-center space-y-2">
                  <ImageIcon className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-xs text-stone-500 font-medium">No photos uploaded yet</p>
                  <p className="text-[11px] text-stone-400">Add couple photos, venue highlights, or invitation cards</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {(event.photos || []).map((p, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-stone-200">
                      <img src={p} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </div>

        {/* Right: Real-time Synchronized Production Live Canvas Sync (5 cols) */}
        <div className="lg:col-span-5 sticky top-20 space-y-2">
          <div className="bg-stone-100 rounded-3xl p-3 sm:p-4 border border-stone-200 space-y-3">
            {/* Header: Title + Device Mode Switcher (hidden on mobile, visible on desktop) */}
            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-stone-500" />
                  Live Canvas Sync
                </span>
                <span className="text-[10px] text-stone-400 font-medium">Updates as you style</span>
              </div>

              {/* Mobile / Desktop switcher toggle: hidden on mobile per requirement, matching SampleCanvasEditor */}
              <div className="hidden md:flex items-center gap-1 bg-stone-200/70 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    previewMode === 'mobile' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title="Mobile View"
                  aria-label="Switch to Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Mobile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    previewMode === 'desktop' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title="Desktop View"
                  aria-label="Switch to Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Desktop</span>
                </button>
              </div>
            </div>

            {/* Live Full Production EventViewer Preview (Identical to Step 2 & SampleCanvasEditor model) */}
            <div className="flex justify-center bg-stone-900/5 rounded-2xl p-2 sm:p-4 border border-stone-200/80 overflow-hidden min-h-[480px]">
              <div className={`transition-all duration-300 w-full ${
                previewMode === 'mobile' 
                  ? 'max-w-[340px] sm:max-w-[380px] rounded-[36px] sm:rounded-[44px] border-4 sm:border-[8px] border-stone-900 shadow-2xl overflow-hidden bg-white max-h-[660px] overflow-y-auto mx-auto' 
                  : 'w-full rounded-2xl border border-stone-300 shadow-xl overflow-hidden bg-white max-h-[660px] overflow-y-auto'
              }`}>
                <EventViewer 
                  event={livePreviewEvent} 
                  deviceMode={previewMode} 
                  isBuilderMode={false} 
                  disableAutoplay={true}
                />
              </div>
            </div>

            <p className="text-center text-[11px] text-stone-400">
              Live interactive preview • Changes update as you style
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <CreationBottomNav 
        onBack={handleBackClick}
        onNext={handleNextClick}
        onSaveDraft={handleSaveDraftClick}
        backLabel="Previous Section"
        mobileBackLabel="Back"
        nextLabel={currentIndex === CATEGORIES.length - 1 ? 'Move to Integrations' : 'Move to Next Section'}
        mobileNextLabel={currentIndex === CATEGORIES.length - 1 ? 'Features' : 'Next'}
      />
    </div>
  );
}
