import { useState } from 'react';
import { Type, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import type { StudioElementStyle } from '../../types';

const FIELD_FONTS = [
  { id: 'default', name: 'Theme Default', family: '' },
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', Georgia, serif" },
  { id: 'cormorant', name: 'Cormorant Garamond', family: "'Cormorant Garamond', Georgia, serif" },
  { id: 'cinzel', name: 'Cinzel Royal', family: "'Cinzel', Georgia, serif" },
  { id: 'dancing', name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { id: 'outfit', name: 'Outfit Modern', family: "'Outfit', sans-serif" },
  { id: 'poppins', name: 'Poppins Clean', family: "'Poppins', sans-serif" },
  { id: 'inter', name: 'Inter Clean', family: "'Inter', sans-serif" },
];

const PRESET_COLORS = [
  { label: 'Deep Maroon', color: '#881337' },
  { label: 'Charcoal Black', color: '#1c1917' },
  { label: 'Royal Gold', color: '#B45309' },
  { label: 'Emerald Green', color: '#047857' },
  { label: 'Royal Navy', color: '#1D4ED8' },
  { label: 'Warm Rose', color: '#BE123C' }
];

interface FieldTypographyControlProps {
  elementKey: string;
  fieldLabel: string;
  isHeadline?: boolean;
  currentStyle?: StudioElementStyle;
  onUpdateStyle: (key: string, updates: Partial<StudioElementStyle>) => void;
  onResetStyle?: (key: string) => void;
}

export function FieldTypographyControl({
  elementKey,
  fieldLabel,
  isHeadline = false,
  currentStyle = {},
  onUpdateStyle,
  onResetStyle
}: FieldTypographyControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const fontSizes = isHeadline 
    ? [
        { label: 'Sm', size: 24 },
        { label: 'Md', size: 36 },
        { label: 'Lg', size: 48 },
        { label: 'Xl', size: 64 }
      ]
    : [
        { label: 'Sm', size: 13 },
        { label: 'Md', size: 16 },
        { label: 'Lg', size: 20 },
        { label: 'Xl', size: 26 }
      ];

  const hasCustomStyles = Boolean(
    currentStyle.fontFamily || 
    currentStyle.fontSize || 
    currentStyle.color
  );

  const handleReset = () => {
    if (onResetStyle) {
      onResetStyle(elementKey);
    } else {
      onUpdateStyle(elementKey, {
        fontFamily: undefined,
        fontSize: undefined,
        color: undefined
      });
    }
  };

  return (
    <div className="mt-1.5">
      {/* Minimized / Collapsed Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
          isOpen
            ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-2xs'
            : hasCustomStyles
              ? 'bg-stone-100 border-amber-300 text-stone-800 hover:bg-stone-200'
              : 'bg-stone-50/80 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
        }`}
      >
        <Type className="w-3 h-3 text-rose-600 shrink-0" />
        <span>Customize Font & Size</span>
        {hasCustomStyles && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" title="Custom style applied" />
        )}
        {isOpen ? (
          <ChevronUp className="w-3 h-3 text-stone-400 shrink-0" />
        ) : (
          <ChevronDown className="w-3 h-3 text-stone-400 shrink-0" />
        )}
      </button>

      {/* Expanded Micro-Toolbar Drawer */}
      {isOpen && (
        <div className="mt-2 p-3 bg-stone-50 rounded-2xl border border-stone-200 shadow-xs space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between pb-1 border-b border-stone-200/60">
            <span className="text-[11px] font-bold text-stone-700">
              Typography for {fieldLabel}
            </span>
            {hasCustomStyles && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[10px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset to Theme Default</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 1. Font Style (Family) */}
            <div>
              <label className="block text-[10px] font-bold text-stone-600 mb-1 uppercase tracking-wider">
                Font Style
              </label>
              <select
                value={currentStyle.fontFamily || ''}
                onChange={(e) => onUpdateStyle(elementKey, { fontFamily: e.target.value || undefined })}
                className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-600 cursor-pointer shadow-2xs"
              >
                {FIELD_FONTS.map(f => (
                  <option key={f.id} value={f.family}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Font Size Presets */}
            <div>
              <label className="block text-[10px] font-bold text-stone-600 mb-1 uppercase tracking-wider">
                Font Size
              </label>
              <div className="grid grid-cols-4 gap-1">
                {fontSizes.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => onUpdateStyle(elementKey, { fontSize: s.size })}
                    className={`py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      currentStyle.fontSize === s.size
                        ? 'bg-rose-700 text-white border-rose-700 shadow-2xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Font Color Selection */}
            <div>
              <label className="block text-[10px] font-bold text-stone-600 mb-1 uppercase tracking-wider">
                Text Color
              </label>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => onUpdateStyle(elementKey, { color: c.color })}
                      className={`w-5 h-5 rounded-full border border-white shadow-2xs transition-transform hover:scale-110 cursor-pointer ${
                        currentStyle.color === c.color ? 'ring-2 ring-stone-900 ring-offset-1' : ''
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>

                {/* Custom Color Input */}
                <div className="relative ml-auto flex items-center">
                  <input
                    type="color"
                    value={currentStyle.color || '#1c1917'}
                    onChange={(e) => onUpdateStyle(elementKey, { color: e.target.value })}
                    className="w-6 h-6 rounded-lg border border-stone-300 p-0 cursor-pointer bg-transparent"
                    title="Choose custom color"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
