import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  ArrowRight, 
  MapPin, 
  Music, 
  Check, 
  Eye, 
  X,
  QrCode,
  Smartphone,
  Monitor,
  Sparkles
} from 'lucide-react';
import { SAMPLE_INVITES, type SampleInvite } from '../data/samples';
import { sampleToLovinglyEvent } from '../lib/sampleAdapter';
import { EventViewer } from './Viewer';

export type { SampleInvite };

interface SamplesShowcaseProps {
  onSelectSample: (sample: SampleInvite) => void;
}

/**
 * Responsive miniature invitation card preview component.
 * Dynamically derives container width using ResizeObserver and scales the
 * production EventViewer proportionally edge-to-edge with 0px blank side padding.
 */
function SampleCardThumbnail({ 
  sample, 
  onPreview 
}: { 
  sample: SampleInvite; 
  onPreview: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const sampleEvent = useMemo(() => sampleToLovinglyEvent(sample), [sample]);

  // Baseline logical design dimensions for miniature invitation viewport
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
        backgroundColor: sample.primaryColor ? `${sample.primaryColor}12` : '#FAF9F6'
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
        <EventViewer event={sampleEvent} isCompact={true} isBuilderMode={false} />
      </div>

      {/* Quick Hover Overlay */}
      <div className="absolute inset-0 bg-stone-900/35 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px] z-20">
        <button
          type="button"
          onClick={onPreview}
          className="px-4 py-2 rounded-xl bg-white text-stone-900 text-xs font-bold shadow-lg hover:bg-stone-50 transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer pointer-events-auto"
        >
          <Eye className="w-3.5 h-3.5 text-rose-600" />
          <span>Full Preview</span>
        </button>
      </div>

      {/* Bottom gradient with badge & date */}
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent flex items-end justify-between px-3.5 pb-2.5 z-10 pointer-events-none">
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20 truncate max-w-[170px]">
          {sample.badge}
        </span>
        <span className="text-[10px] text-white/95 font-medium drop-shadow-xs shrink-0 ml-2">
          {sample.date.split(',')[0]}
        </span>
      </div>
    </div>
  );
}

export function SamplesShowcase({ onSelectSample }: SamplesShowcaseProps) {
  const [previewSample, setPreviewSample] = useState<SampleInvite | null>(null);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  return (
    <section id="samples" className="py-12 sm:py-18 lg:py-24 px-4 sm:px-6 lg:px-8 bg-stone-50/50 border-t border-stone-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10 lg:space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            <span>Interactive Sample Gallery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            See What You Can Create in Minutes
          </h2>
          <p className="text-stone-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            Explore live interactive sample invites crafted with genuine traditional frames, center elements, and delicate textures.
          </p>
        </div>

        {/* Samples Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 max-w-6xl mx-auto">
          {SAMPLE_INVITES.map((sample) => (
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-md shadow-stone-200/40 overflow-hidden flex flex-col justify-between group hover:border-rose-300 transition-all"
            >
              {/* Dynamically Scaled Invitation Preview Header */}
              <SampleCardThumbnail 
                sample={sample} 
                onPreview={() => setPreviewSample(sample)} 
              />

              {/* Card Meta & Feature Badges */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 tracking-tight leading-snug">
                      {sample.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium mt-0.5 line-clamp-2">
                      {sample.tagline}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {sample.hasRsvp && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> RSVP Form
                      </span>
                    )}
                    {sample.hasMap && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" /> Google Maps
                      </span>
                    )}
                    {sample.musicType === 'mp3' || sample.bgAudioPresetId ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 flex items-center gap-1">
                        <Music className="w-2.5 h-2.5" /> MP3 Autoplay
                      </span>
                    ) : sample.spotifySong ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200/80 flex items-center gap-1">
                        <Music className="w-2.5 h-2.5" /> Spotify Track
                      </span>
                    ) : null}
                    {sample.photos && sample.photos.length > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Photo Gallery
                      </span>
                    )}
                    {sample.hasQr && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center gap-1">
                        <QrCode className="w-2.5 h-2.5" /> Digital QR
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewSample(sample)}
                    className="py-2.5 px-2 rounded-xl border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span className="truncate">Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectSample(sample)}
                    className="py-2.5 px-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                  >
                    <span className="truncate">Customize</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Complete Full-Invitation Preview Modal Powered by EventViewer */}
      {previewSample && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex flex-col p-2 sm:p-4 md:p-6 overflow-hidden">
          {/* Modal Top Bar */}
          <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 border border-stone-200/90 shadow-lg flex items-center justify-between gap-3 shrink-0 mb-3 sm:mb-4">
            {/* Left: Name Section (Clean, Spacious & Mobile-Friendly) */}
            <div className="min-w-0 flex-1 pr-2">
              <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-lg md:text-xl truncate tracking-tight">
                {previewSample.title}
              </h3>
              {previewSample.tagline && (
                <p className="text-stone-500 text-[11px] sm:text-xs truncate hidden sm:block mt-0.5">
                  {previewSample.tagline}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Device Mode Switcher (Visible only on medium/large screens) */}
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
                  const s = previewSample;
                  setPreviewSample(null);
                  onSelectSample(s);
                }}
                className="px-3 sm:px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>Customize<span className="hidden sm:inline"> This Sample</span></span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setPreviewSample(null)}
                className="p-1.5 sm:p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Viewport Container */}
          <div className="flex-1 w-full max-w-5xl mx-auto overflow-y-auto flex justify-center items-start p-2 sm:p-4 rounded-3xl bg-stone-900/40 border border-white/10">
            <div className={`transition-all duration-300 w-full ${
              previewDeviceMode === 'mobile'
                ? 'max-w-[340px] sm:max-w-[380px] rounded-[32px] sm:rounded-[44px] border-4 sm:border-[8px] border-stone-900 shadow-2xl overflow-hidden bg-white my-auto max-h-[calc(100vh-140px)] overflow-y-auto'
                : 'max-w-4xl rounded-2xl border border-stone-300 shadow-2xl overflow-hidden bg-white max-h-[calc(100vh-140px)] overflow-y-auto'
            }`}>
              <EventViewer event={sampleToLovinglyEvent(previewSample)} isBuilderMode={false} isCompact={false} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
