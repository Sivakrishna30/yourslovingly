import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Music, 
  Check, 
  Eye, 
  X,
  QrCode
} from 'lucide-react';
import { SAMPLE_INVITES, type SampleInvite } from '../data/samples';

export type { SampleInvite };

interface SamplesShowcaseProps {
  onSelectSample: (sample: SampleInvite) => void;
}

export function SamplesShowcase({ onSelectSample }: SamplesShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewSample, setPreviewSample] = useState<SampleInvite | null>(null);

  const categories = [
    { id: 'all', label: 'All Invites & Cards' },
    { id: 'wedding', label: '💍 Weddings' },
    { id: 'birthday', label: '🎂 Birthdays' },
    { id: 'housewarming', label: '🏡 Griha Pravesh' },
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
            Explore live interactive sample invites, business cards, and celebration flyers crafted by our community.
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
            const Icon = sample.icon;
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
                {/* Visual Card Header */}
                <div 
                  style={{ backgroundColor: sample.primaryColor }}
                  className="p-6 text-white relative min-h-[190px] flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30 pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30">
                      {sample.badge}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="relative z-10 my-auto text-center space-y-1">
                    <p className="text-[10px] uppercase font-serif tracking-widest text-amber-200 font-semibold">
                      {sample.subtitle}
                    </p>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight">
                      {sample.title}
                    </h3>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[11px] text-white/80 border-t border-white/15 pt-2">
                    <span className="truncate max-w-[160px]">{sample.location.split(',')[0]}</span>
                    <span>{sample.date.split(',')[0]}</span>
                  </div>
                </div>

                {/* Card Meta & Feature Badges */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <p className="text-xs text-stone-600 leading-relaxed font-medium">
                      {sample.tagline}
                    </p>

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

      {/* Interactive Modal Preview */}
      {previewSample && (
        <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 relative my-auto"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                {previewSample.badge}
              </span>
              <button 
                onClick={() => setPreviewSample(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div 
              style={{ backgroundColor: previewSample.primaryColor }}
              className="p-8 text-white space-y-6 text-center relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md mx-auto flex items-center justify-center border border-white/30 shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-serif tracking-widest uppercase text-amber-200 font-semibold">
                  {previewSample.subtitle}
                </p>
                <h3 className="text-2xl font-serif font-bold text-white tracking-tight">
                  {previewSample.title}
                </h3>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 space-y-2.5 text-left text-xs">
                <div className="flex items-center gap-2 text-amber-100">
                  <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>{previewSample.date} • {previewSample.time}</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="w-4 h-4 text-rose-300 shrink-0" />
                  <span>{previewSample.location}</span>
                </div>
                {previewSample.musicTrack && (
                  <div className="flex items-center gap-2 text-emerald-200">
                    <Music className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>{previewSample.musicTrack}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-white/80 italic font-serif leading-relaxed">
                {previewSample.messages.map((m, idx) => (
                  <p key={idx}>"{m}"</p>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setPreviewSample(null)}
                className="py-2.5 px-4 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const sample = previewSample;
                  setPreviewSample(null);
                  onSelectSample(sample);
                }}
                className="py-2.5 px-5 rounded-xl bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-rose-800 transition-all cursor-pointer"
              >
                <span>Customize This Sample</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
