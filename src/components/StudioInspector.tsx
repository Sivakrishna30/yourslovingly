import { useState, useMemo } from 'react';
import type { LovinglyEvent, StudioElementKey, StudioElementStyle, AnimationType } from '../types';
import { STUDIO_FONTS, STUDIO_ANIMATIONS } from '../lib/presetMessages';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Unlock, 
  Check, 
  Type, 
  Palette, 
  Sparkles, 
  Move,
  ArrowUp,
  ArrowDown,
  Plus
} from 'lucide-react';
import { elementGlyphs } from '../lib/constants';

export interface StudioInspectorProps {
  event: LovinglyEvent;
  activeElementKey: StudioElementKey;
  onSelectElement?: (key: StudioElementKey) => void;
  onSelectElementKey?: (key: StudioElementKey) => void;
  onUpdateElementStyle: (key: StudioElementKey, newStyle: Partial<StudioElementStyle>) => void;
  onUpdateEvent?: (updates: Partial<LovinglyEvent>) => void;
}

export function StudioInspector({
  event,
  activeElementKey,
  onSelectElement,
  onSelectElementKey,
  onUpdateElementStyle,
  onUpdateEvent
}: StudioInspectorProps) {
  const handleSelect = onSelectElementKey || onSelectElement || (() => {});
  const [activeTab, setActiveTab] = useState<'position' | 'typography' | 'colors' | 'animation' | 'elements'>('position');

  const elementSequence = useMemo(() => {
    const seq: { key: string; label: string; icon: string }[] = [];
    seq.push({ key: 'background', label: 'Background Canvas', icon: '🎨' });
    if (event.title?.trim() || event.eventType) seq.push({ key: 'title', label: 'Main Event Title', icon: '👑' });
    if (event.recipientName?.trim()) seq.push({ key: 'recipient', label: 'Subtitle / Recipient', icon: '💌' });
    if (event.eventDate || event.location) seq.push({ key: 'details', label: 'Date & Venue Details', icon: '📍' });
    
    event.messages?.forEach((msg, idx) => {
      if (msg.trim()) {
        seq.push({ key: `message_${idx}`, label: `Message ${idx + 1}`, icon: '💬' });
      }
    });

    event.photos?.forEach((_, idx) => {
      seq.push({ key: `photo_${idx}`, label: `Image ${idx + 1}`, icon: '🖼️' });
    });

    if (event.showLocationQrCode && event.googleMapsUrl) seq.push({ key: 'locationQr', label: 'Location Map & QR', icon: '🗺️' });
    if (event.showUpiQrCode && (event.upiId || event.upiQrImageUrl)) seq.push({ key: 'upiQr', label: 'UPI Gift & Payment QR', icon: '💳' });

    if (event.elementOrder) {
      seq.sort((a, b) => {
        const indexA = event.elementOrder!.indexOf(a.key);
        const indexB = event.elementOrder!.indexOf(b.key);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }

    return seq;
  }, [event]);

  const currentIndex = elementSequence.findIndex(e => e.key === activeElementKey);
  const currentElemInfo = elementSequence[currentIndex] || elementSequence[0] || { key: 'background', label: 'Background Canvas', icon: '🎨' };
  
  // Update active element if it's no longer in the sequence
  if (currentIndex === -1 && elementSequence.length > 0 && activeElementKey !== currentElemInfo.key) {
    setTimeout(() => handleSelect(currentElemInfo.key), 0);
  }

  const currentStyles: StudioElementStyle = (event.elementStyles && event.elementStyles[activeElementKey]) || {};
  const isLocked = !!currentStyles.isLocked;

  const handlePrev = () => {
    if (elementSequence.length === 0) return;
    const prevIdx = (currentIndex - 1 + elementSequence.length) % elementSequence.length;
    handleSelect(elementSequence[prevIdx].key);
  };

  const handleNext = () => {
    if (elementSequence.length === 0) return;
    const nextIdx = (currentIndex + 1) % elementSequence.length;
    handleSelect(elementSequence[nextIdx].key);
  };

  const toggleLock = () => {
    onUpdateElementStyle(activeElementKey, { isLocked: !isLocked });
  };

  const moveElement = (direction: 'up' | 'down') => {
    if (!onUpdateEvent || elementSequence.length === 0 || currentIndex === -1) return;
    if (currentElemInfo.key === 'background') return; // Cannot move background
    
    const newOrder = elementSequence.map(e => e.key).filter(k => k !== 'background');
    const seqIndex = newOrder.indexOf(currentElemInfo.key);
    
    if (seqIndex === -1) return;
    if (direction === 'up' && seqIndex > 0) {
      const temp = newOrder[seqIndex];
      newOrder[seqIndex] = newOrder[seqIndex - 1];
      newOrder[seqIndex - 1] = temp;
    } else if (direction === 'down' && seqIndex < newOrder.length - 1) {
      const temp = newOrder[seqIndex];
      newOrder[seqIndex] = newOrder[seqIndex + 1];
      newOrder[seqIndex + 1] = temp;
    } else {
      return;
    }
    
    // Always prepend background
    onUpdateEvent({ elementOrder: ['background', ...newOrder] });
  };

  return (
    <div className="bg-stone-900 text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-stone-800 space-y-3.5 my-2 w-full max-w-full overflow-x-hidden mx-auto">
      {/* Top Header Bar: Element Selector & Lock/Confirm Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentElemInfo.icon}</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                Element {currentIndex + 1} of {elementSequence.length}
              </span>
              {isLocked && (
                <span className="px-1.5 py-0.2 bg-brand-teal/20 text-secondary border border-brand-teal/30 rounded text-[9px] font-bold flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Locked
                </span>
              )}
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              {currentElemInfo.label}
            </h4>
          </div>
        </div>

        {/* Prev / Lock / Next Controls */}
        <div className="flex items-center gap-1.5">
          {onUpdateEvent && currentElemInfo.key !== 'background' && (
            <div className="flex items-center bg-stone-800 rounded-lg overflow-hidden mr-1">
              <button
                type="button"
                onClick={() => moveElement('up')}
                className="p-1.5 hover:bg-stone-700 text-stone-200 transition-colors border-r border-stone-700"
                title="Move Element Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveElement('down')}
                className="p-1.5 hover:bg-stone-700 text-stone-200 transition-colors"
                title="Move Element Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={handlePrev}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            title="Previous Element"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            type="button"
            onClick={toggleLock}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isLocked
                ? 'bg-secondary text-white border-brand-teal/40 shadow-xs'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
            }`}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5 text-white" /> : <Unlock className="w-3.5 h-3.5 text-stone-400" />}
            <span>{isLocked ? 'Locked' : 'Lock & Confirm'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="p-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
            title="Next Element"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Element Quick Selection Badges Bar */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-[11px]">
        {elementSequence.map((item) => {
          const itemLocked = !!(event.elementStyles?.[item.key]?.isLocked);
          const isSelected = item.key === activeElementKey;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleSelect(item.key)}
              className={`px-2 py-1 rounded-lg shrink-0 font-medium transition-all flex items-center gap-1 ${
                isSelected
                  ? 'bg-accent text-stone-950 font-bold shadow-xs'
                  : itemLocked
                  ? 'bg-stone-800 text-secondary border border-brand-teal/20'
                  : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <span>{item.icon}</span>
              <span className="truncate max-w-[80px]">{item.label.split(' ')[0]}</span>
              {itemLocked && <Check className="w-3 h-3 text-secondary" />}
            </button>
          );
        })}
      </div>

      {/* Editor Option Sub-tabs */}
      <div className="flex overflow-x-auto no-scrollbar bg-stone-800 p-0.5 rounded-xl text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('position')}
          className={`flex-1 min-w-[120px] shrink-0 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'position' ? 'bg-stone-950 text-accent shadow-xs' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Move className="w-3.5 h-3.5" /> Size & Position
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('typography')}
          className={`flex-1 min-w-[100px] shrink-0 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'typography' ? 'bg-stone-950 text-accent shadow-xs' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" /> Typography
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('colors')}
          className={`flex-1 min-w-[90px] shrink-0 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'colors' ? 'bg-stone-950 text-accent shadow-xs' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" /> Colors
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('animation')}
          className={`flex-1 min-w-[100px] shrink-0 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'animation' ? 'bg-stone-950 text-accent shadow-xs' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Animation
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('elements')}
          className={`flex-1 min-w-[100px] shrink-0 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'elements' ? 'bg-stone-950 text-accent shadow-xs' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Plus className="w-3.5 h-3.5" /> Elements
        </button>
      </div>

      {/* Tab 1: Position & Numeric Sizing Controls */}
      {activeTab === 'position' && (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 text-xs pt-1">
          <div>
            <label className="block text-[10px] font-bold text-stone-400 mb-1">X Offset (px)</label>
            <input 
              type="number"
              value={currentStyles.offsetX || 0}
              onChange={(e) => onUpdateElementStyle(activeElementKey, { offsetX: parseInt(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-mono focus:ring-1 focus:ring-teal-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-400 mb-1">Y Offset (px)</label>
            <input 
              type="number"
              value={currentStyles.offsetY || 0}
              onChange={(e) => onUpdateElementStyle(activeElementKey, { offsetY: parseInt(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-mono focus:ring-1 focus:ring-teal-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-400 mb-1">Y Padding (px)</label>
            <input 
              type="number"
              value={currentStyles.paddingY ?? 12}
              onChange={(e) => onUpdateElementStyle(activeElementKey, { paddingY: parseInt(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-mono focus:ring-1 focus:ring-teal-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-400 mb-1">Max Width (%)</label>
            <input 
              type="number"
              min="20"
              max="100"
              value={currentStyles.width ?? 100}
              onChange={(e) => onUpdateElementStyle(activeElementKey, { width: parseInt(e.target.value) || 100 })}
              className="w-full px-2.5 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-mono focus:ring-1 focus:ring-teal-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-400 mb-1">Border Radius</label>
            <input 
              type="number"
              min="0"
              max="40"
              value={currentStyles.borderRadius ?? 16}
              onChange={(e) => onUpdateElementStyle(activeElementKey, { borderRadius: parseInt(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-mono focus:ring-1 focus:ring-teal-400 outline-none"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Typography Controls */}
      {activeTab === 'typography' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div>
            <label className="block text-[10px] font-bold text-stone-400 mb-1">Font Family</label>
            <select
              value={currentStyles.fontFamily || 'Playfair Display, serif'}
              onChange={(e) => onUpdateElementStyle(activeElementKey, { fontFamily: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white focus:ring-1 focus:ring-accent outline-none"
            >
              {STUDIO_FONTS.map(f => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-400 mb-1">Font Size (px)</label>
            <input 
              type="number"
              min="12"
              max="96"
              value={currentStyles.fontSize || 24}
              onChange={(e) => onUpdateElementStyle(activeElementKey, { fontSize: parseInt(e.target.value) || 24 })}
              className="w-full px-2.5 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-mono focus:ring-1 focus:ring-teal-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-400 mb-1">Alignment</label>
            <div className="flex bg-stone-800 p-0.5 rounded-lg border border-stone-700">
              {(['left', 'center', 'right'] as const).map(align => (
                <button
                  key={align}
                  type="button"
                  onClick={() => onUpdateElementStyle(activeElementKey, { align })}
                  className={`flex-1 py-1 rounded text-[11px] font-bold capitalize ${
                    (currentStyles.align || 'center') === align ? 'bg-accent text-stone-950' : 'text-stone-300'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Colors & Fills */}
      {activeTab === 'colors' && (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs pt-1">
          <div>
            <label className="block text-[10px] font-bold text-stone-400 mb-1">Text Color</label>
            <div className="flex items-center gap-2 bg-stone-800 p-1.5 border border-stone-700 rounded-lg">
              <input 
                type="color"
                value={currentStyles.color || event.primaryColor || '#881337'}
                onChange={(e) => onUpdateElementStyle(activeElementKey, { color: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
              />
              <input 
                type="text"
                value={currentStyles.color || event.primaryColor || '#881337'}
                onChange={(e) => onUpdateElementStyle(activeElementKey, { color: e.target.value })}
                className="flex-1 bg-transparent text-white font-mono text-[11px] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-400 mb-1">Element Fill Color</label>
            <div className="flex items-center gap-2 bg-stone-800 p-1.5 border border-stone-700 rounded-lg">
              <input 
                type="color"
                value={currentStyles.backgroundColor || 'transparent'}
                onChange={(e) => onUpdateElementStyle(activeElementKey, { backgroundColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
              />
              <input 
                type="text"
                value={currentStyles.backgroundColor || 'transparent'}
                onChange={(e) => onUpdateElementStyle(activeElementKey, { backgroundColor: e.target.value })}
                className="flex-1 bg-transparent text-white font-mono text-[11px] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-400 mb-1">Border Color</label>
            <div className="flex items-center gap-2 bg-stone-800 p-1.5 border border-stone-700 rounded-lg">
              <input 
                type="color"
                value={currentStyles.borderColor || '#e7e5e4'}
                onChange={(e) => onUpdateElementStyle(activeElementKey, { borderColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
              />
              <input 
                type="text"
                value={currentStyles.borderColor || '#e7e5e4'}
                onChange={(e) => onUpdateElementStyle(activeElementKey, { borderColor: e.target.value })}
                className="flex-1 bg-transparent text-white font-mono text-[11px] outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Animation Presets */}
      {activeTab === 'animation' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          {STUDIO_ANIMATIONS.map(anim => (
            <button
              key={anim.id}
              type="button"
              onClick={() => onUpdateElementStyle(activeElementKey, { animation: anim.id as AnimationType })}
              className={`p-2 rounded-xl text-left border transition-all ${
                (currentStyles.animation || 'none') === anim.id
                  ? 'bg-teal-950 border-teal-500 text-teal-300 font-bold shadow-xs'
                  : 'bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-600'
              }`}
            >
              {anim.label}
            </button>
          ))}
        </div>
      )}
      {/* Tab 5: Element Library */}
      {activeTab === 'elements' && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Add Design Elements
            </label>
            <span className="text-[9px] text-stone-500 italic">Select to toggle element presence</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {Object.entries(elementGlyphs).map(([key, glyph]) => {
              const isActive = event.elements.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (!onUpdateEvent) return;
                    const newElements = isActive 
                      ? event.elements.filter(e => e !== key)
                      : [...event.elements, key];
                    onUpdateEvent({ elements: newElements });
                  }}
                  className={`p-2 rounded-xl text-xl transition-all border ${
                    isActive 
                      ? 'bg-accent border-accent text-stone-950 shadow-xs scale-110' 
                      : 'bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-600'
                  }`}
                  title={key}
                >
                  {glyph}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-stone-500 leading-relaxed bg-stone-800/40 p-2 rounded-lg border border-stone-800">
            Floating elements are placed randomly across the invitation for a layered depth effect. 
            Toggle elements above to add or remove them from your design.
          </p>
        </div>
      )}
    </div>
  );
}
