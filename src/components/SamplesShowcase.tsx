import { useState } from 'react';
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
  Monitor
} from 'lucide-react';
import { SAMPLE_INVITES, type SampleInvite } from '../data/samples';
import { sampleToLovinglyEvent } from '../lib/sampleAdapter';
import { EventViewer } from './Viewer';

export type { SampleInvite };

interface SamplesShowcaseProps {
  onSelectSample: (sample: SampleInvite) => void;
}

export function SamplesShowcase({ onSelectSample }: SamplesShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewSample, setPreviewSample] = useState<SampleInvite | null>(null);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  const categories = [
    { id: 'all', label: 'All Invites & Cards' },
    { id: 'wedding', label: '💍 Weddings' },
    { id: 'birthday', label: '🎂 Birthdays' },
    { id: 'housewarming', label: '🏡 Housewarming' },
    { id: 'anniversary', label: '✨ Anniversaries' },
    { id: 'party', label: '🎉 Parties & Reunions' },
    { id: 'corporate', label: '💼 Corporate' }
  ];

  const filteredSamples = activeCategory === 'all' 
    ? SAMPLE_INVITES 
    : SAMPLE_INVITES.filter(s => s.category === activeCategory);

  return (
    <section id="samples" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-stone-50/50 border-t border-stone-200/80 relative">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
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
            Explore live interactive sample invites, business cards, and celebration flyers crafted with genuine traditional frames, motifs, and textures.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-700 text-white shadow-md shadow-rose-700/20'
                    : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/80'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Samples Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {filteredSamples.map((sample) => {
            const sampleEvent = sampleToLovinglyEvent(sample);
            return (
              <motion.div
                key={sample.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-lg shadow-stone-200/40 overflow-hidden flex flex-col justify-between group hover:border-rose-300 transition-all"
              >
                {/* Scaled Miniature Invitation Preview Header */}
                <div className="relative w-full h-[220px] sm:h-[240px] overflow-hidden bg-stone-100 rounded-t-3xl border-b border-stone-200/90 group/thumb">
                  <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[380px] sm:w-[400px] pointer-events-none select-none"
                    style={{ transform: 'translateX(-50%) scale(0.65)', transformOrigin: 'top center' }}
                  >
                    <EventViewer event={sampleEvent} isCompact={true} />
                  </div>

                  {/* Quick Hover Overlay */}
                  <div className="absolute inset-0 bg-stone-900/35 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <button
                      onClick={() => setPreviewSample(sample)}
                      className="px-4 py-2 rounded-xl bg-white text-stone-900 text-xs font-bold shadow-lg hover:bg-stone-50 transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-rose-600" />
                      <span>Full Preview</span>
                    </button>
                  </div>

                  {/* Bottom gradient with badge */}
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent flex items-end justify-between px-3.5 pb-2.5 z-10 pointer-events-none">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                      {sample.badge}
                    </span>
                    <span className="text-[10px] text-white/90 font-medium drop-shadow-sm">
                      {sample.date.split(',')[0]}
                    </span>
                  </div>
                </div>

                {/* Card Meta & Feature Badges */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-stone-900 tracking-tight">
                        {sample.title}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed font-medium mt-0.5">
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
                      {sample.spotifySong && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200/80 flex items-center gap-1">
                          <Music className="w-2.5 h-2.5" /> Spotify Music
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
                      onClick={() => setPreviewSample(sample)}
                      className="py-2.5 px-3 rounded-xl border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-500" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => onSelectSample(sample)}
                      className="py-2.5 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer"
                    >
                      <span>Customize</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Complete Full-Invitation Preview Modal Powered by EventViewer */}
      {previewSample && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex flex-col p-2 sm:p-4 md:p-6 overflow-hidden">
          {/* Modal Top Bar */}
          <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl px-4 py-3 border border-stone-200/90 shadow-lg flex items-center justify-between gap-3 shrink-0 mb-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                {previewSample.badge}
              </span>
              <div className="min-w-0">
                <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base truncate">
                  {previewSample.title}
                </h3>
                <p className="text-[11px] text-stone-500 truncate hidden sm:block">
                  {previewSample.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Device Mode Switcher */}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200">
                <button
                  onClick={() => setPreviewDeviceMode('mobile')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    previewDeviceMode === 'mobile' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-rose-600" />
                  <span>Mobile</span>
                </button>
                <button
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
                onClick={() => {
                  const s = previewSample;
                  setPreviewSample(null);
                  onSelectSample(s);
                }}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>Customize This Sample</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setPreviewSample(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
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
                ? 'max-w-[340px] sm:max-w-[380px] rounded-[36px] sm:rounded-[44px] border-4 sm:border-[8px] border-stone-900 shadow-2xl overflow-hidden bg-white my-auto max-h-[calc(100vh-140px)] overflow-y-auto'
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
