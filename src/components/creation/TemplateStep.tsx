import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  ArrowRight, 
  ArrowLeft,
  Plus
} from 'lucide-react';
import type { LovinglyEvent } from '../../types';
import { MASTER_TEMPLATES, type MasterTemplate } from '../../lib/designSystem';

interface TemplateStepProps {
  event: LovinglyEvent;
  onSelectTemplate: (template: MasterTemplate) => void;
  onSelectBlank: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function TemplateStep({
  event,
  onSelectTemplate,
  onSelectBlank,
  onBack,
  onNext
}: TemplateStepProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredTemplates = MASTER_TEMPLATES.filter((t: MasterTemplate) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          (t.tagline || '').toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (activeCategory === 'all') return true;
    return t.category === activeCategory;
  });

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8 space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
          <span>Step 2 of 7</span>
          <span>•</span>
          <span>Template / Canvas</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
          Choose a Starting Template or Blank Canvas
        </h2>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
          Templates provide a starting layout and theme that you can fully modify, or start with a clean blank canvas.
        </p>
      </div>

      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Templates' },
            { id: 'wedding', label: '💍 Wedding' },
            { id: 'birthday', label: '🎂 Birthday' },
            { id: 'traditional', label: '🕉️ Traditional' },
            { id: 'minimal', label: '✨ Minimal' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
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
            placeholder="Search templates..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
          />
        </div>
      </div>

      {/* Grid of Templates & Blank Option */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Blank Canvas Option */}
        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => {
            onSelectBlank();
            onNext();
          }}
          className="rounded-3xl border-2 border-dashed border-stone-300 hover:border-rose-600 p-6 flex flex-col justify-between text-center items-center cursor-pointer bg-white/50 hover:bg-rose-50/20 transition-all group min-h-[280px]"
        >
          <div className="w-14 h-14 rounded-2xl bg-stone-100 group-hover:bg-rose-100 flex items-center justify-center my-auto transition-colors">
            <Plus className="w-6 h-6 text-stone-600 group-hover:text-rose-600 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-lg group-hover:text-rose-700">
              Blank Canvas
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs">
              Start from scratch with clean slate. Add your own motifs, fonts, colors, and layout.
            </p>
          </div>
          <span className="text-xs font-bold text-stone-700 group-hover:text-rose-700 mt-4">
            Start Blank &rarr;
          </span>
        </motion.div>

        {/* Master Preset Templates */}
        {filteredTemplates.map((tmpl: MasterTemplate) => {
          const isSelected = event.templateId === tmpl.id;

          return (
            <motion.div
              key={tmpl.id}
              whileHover={{ y: -4 }}
              onClick={() => {
                onSelectTemplate(tmpl);
                onNext();
              }}
              className={`rounded-3xl border overflow-hidden flex flex-col justify-between cursor-pointer bg-white transition-all group min-h-[280px] ${
                isSelected
                  ? 'border-rose-600 ring-2 ring-rose-600/20 shadow-lg'
                  : 'border-stone-200 hover:border-stone-400 hover:shadow-md'
              }`}
            >
              {/* Visual Card Header */}
              <div 
                style={{ backgroundColor: tmpl.primaryColor }}
                className="p-6 text-white text-center flex flex-col justify-center items-center min-h-[140px] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 uppercase tracking-widest text-amber-200">
                    {tmpl.category}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-white">
                    {tmpl.name}
                  </h4>
                </div>
              </div>

              {/* Card Meta & Action */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                  {tmpl.tagline}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs font-bold text-stone-700 group-hover:text-rose-700">
                  <span>Use This Template</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sticky Navigation Footer */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs border-t border-stone-200 p-3 sm:p-4 rounded-2xl z-20 shadow-lg flex items-center justify-between gap-2 max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="px-3.5 sm:px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Previous Section</span>
          <span className="sm:hidden">Back</span>
        </button>
        <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider hidden xs:inline">
          Step 2 of 7
        </span>
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
