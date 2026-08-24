import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  ArrowRight
} from 'lucide-react';
import type { EventKind } from '../../types';
import { EVENT_TYPE_OPTIONS, type EventTypeOption } from '../../data/eventTypes';

export type { EventTypeOption };

interface EventTypeStepProps {
  selectedEventType: EventKind;
  onSelectEventType: (eventType: EventKind, defaultData: Partial<EventTypeOption>) => void;
  onNext: () => void;
}

export function EventTypeStep({ selectedEventType, onSelectEventType, onNext }: EventTypeStepProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'popular' | 'traditional' | 'celebration' | 'personal' | 'professional'>('all');

  const filteredOptions = EVENT_TYPE_OPTIONS.filter(opt => {
    const matchesSearch = opt.title.toLowerCase().includes(search.toLowerCase()) || 
                          opt.subtitle.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (activeCategory === 'all') return true;
    if (activeCategory === 'popular') return opt.popular;
    return opt.category === activeCategory;
  });

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
          <span>Step 1 of 6</span>
          <span>•</span>
          <span>Event Category</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
          What type of event are you creating?
        </h2>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
          Selecting your event type helps us recommend the best layouts, auspicious motifs, and color palettes.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Types' },
            { id: 'popular', label: '🔥 Popular' },
            { id: 'traditional', label: 'Traditional & Pooja' },
            { id: 'celebration', label: 'Parties' },
            { id: 'personal', label: 'Milestones' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === tab.id 
                  ? 'bg-white text-stone-900 shadow-xs' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search event type..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
          />
        </div>
      </div>

      {/* Grid of Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
        {filteredOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedEventType === opt.id;

          return (
            <motion.button
              key={opt.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSelectEventType(opt.id, opt);
                onNext();
              }}
              className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[140px] cursor-pointer group ${
                isSelected
                  ? 'bg-rose-50/50 border-rose-600 shadow-md ring-2 ring-rose-600/20'
                  : 'bg-white border-stone-200 hover:border-stone-400 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${opt.bgLight}`}>
                    <Icon className={`w-5 h-5 ${opt.color}`} />
                  </div>
                  {opt.popular && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-stone-900 text-base group-hover:text-rose-700 transition-colors">
                  {opt.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                  {opt.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-3 text-xs font-semibold text-stone-600 group-hover:text-rose-700">
                <span>Select & Continue</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
