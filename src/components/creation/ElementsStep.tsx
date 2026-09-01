import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Sparkles, 
  Layers, 
  Trash2, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  Check,
  Sliders,
  Eye,
  Calendar,
  MapPin,
  Save
} from 'lucide-react';
import type { 
  LovinglyEvent, 
  FrameType, 
  DecorativeMotif, 
  BackgroundTexture 
} from '../../types';
import { 
  COLOR_PALETTES, 
  FONT_PAIRINGS, 
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

const CATEGORIES: Array<'palette' | 'fonts' | 'frames' | 'motifs' | 'textures' | 'photos'> = [
  'palette',
  'fonts',
  'frames',
  'motifs',
  'textures',
  'photos'
];

export function ElementsStep({ event, onUpdate, onBack, onNext, onSaveDraft }: ElementsStepProps) {
  const [activeCategory, setActiveCategory] = useState<'palette' | 'fonts' | 'frames' | 'motifs' | 'textures' | 'photos'>('palette');
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    <div className="max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8 space-y-6 max-w-full overflow-x-hidden">
      {/* Step Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
          <span>Step 3 of 6</span>
          <span>•</span>
          <span>Elements, Motifs & Styles</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
          Craft & Style Every Element
        </h2>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
          Select auspicious Indian motifs, decorative frames, textured backgrounds, color palettes, and custom typography.
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
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 p-1.5 bg-stone-100 rounded-2xl max-w-full">
            {[
              { id: 'palette', label: 'Colors', icon: Palette },
              { id: 'fonts', label: 'Fonts', icon: Type },
              { id: 'frames', label: 'Frames', icon: Layers },
              { id: 'motifs', label: 'Motifs', icon: Sparkles },
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

          {/* 2. Typography Font Pairings */}
          {activeCategory === 'fonts' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Curated Font Pairings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FONT_PAIRINGS.map(font => {
                  const isSelected = event.elementStyles?.title?.fontFamily === font.headingFont;
                  return (
                    <button
                      key={font.id}
                      onClick={() => {
                        const cur = event.elementStyles || {};
                        onUpdate({
                          elementStyles: {
                            ...cur,
                            title: { ...(cur.title || {}), fontFamily: font.headingFont },
                            recipient: { ...(cur.recipient || {}), fontFamily: font.accentFont },
                            messages: { ...(cur.messages || {}), fontFamily: font.bodyFont }
                          }
                        });
                      }}
                      className={`p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                        isSelected ? 'border-rose-600 ring-2 ring-rose-600/20 bg-rose-50/40' : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">{font.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-rose-600" />}
                      </div>
                      <p style={{ fontFamily: font.headingFont }} className="text-base font-bold text-stone-800">
                        Priya & Rahul
                      </p>
                      <p style={{ fontFamily: font.bodyFont }} className="text-xs text-stone-500">
                        Request the honor of your presence
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 3. Decorative Frames */}
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

          {/* 4. Auspicious Motifs */}
          {activeCategory === 'motifs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Auspicious Motifs & Symbols
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

          {/* Sticky Bottom Actions */}
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
              <span>{currentIndex === CATEGORIES.length - 1 ? 'Continue to Guest Preview' : 'Move to Next Section'}</span>
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
                {event.messages && event.messages[0] && <p>"{event.messages[0]}"</p>}
                {event.messages && event.messages[1] && <p className="text-[11px]">"{event.messages[1]}"</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
