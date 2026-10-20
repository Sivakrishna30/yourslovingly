import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Check, 
  Type, 
  Palette, 
  Layout, 
  Sliders, 
  SlidersHorizontal,
  Plus, 
  Trash2, 
  RotateCcw, 
  ChevronUp, 
  ChevronDown,
  X,
  Music,
  MapPin,
  Heart,
  QrCode
} from 'lucide-react';
import type { User } from 'firebase/auth';
import type { 
  LovinglyEvent, 
  FrameType, 
  DecorativeMotif, 
  BackgroundTexture
} from '../../types';
import { SAMPLE_INVITES } from '../../data/samples';
import { sampleToLovinglyEvent } from '../../lib/sampleAdapter';
import { EventViewer } from '../Viewer';
import { createSlug } from '../../lib/utils';
import { 
  FRAME_PRESETS, 
  MOTIF_PRESETS, 
  TEXTURE_PRESETS, 
  PALETTES, 
  FONT_PAIRINGS 
} from '../../lib/designSystem';

interface SampleCanvasEditorProps {
  user: User | null;
  onSignIn?: () => Promise<User | null>;
}

type ToolbarTab = 'text' | 'elements' | 'background' | 'borders' | 'features';

export function SampleCanvasEditor({ user }: SampleCanvasEditorProps) {
  const { sampleId } = useParams<{ sampleId: string }>();
  const navigate = useNavigate();

  // Find sample definition
  const sample = SAMPLE_INVITES.find(s => s.id === sampleId);

  // Scoped storage key
  const storageKey = `sample_custom_draft_${sampleId || 'unknown'}`;

  // State: editable LovinglyEvent
  const [event, setEvent] = useState<LovinglyEvent>(() => {
    if (!sample) {
      return sampleToLovinglyEvent(SAMPLE_INVITES[0]);
    }
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return sampleToLovinglyEvent(sample, user?.uid || 'guest');
  });

  const [activeTab, setActiveTab] = useState<ToolbarTab>('text');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [fullCustomizeEnabled, setFullCustomizeEnabled] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Save changes to scoped storage
  const handleUpdate = (updates: Partial<LovinglyEvent>) => {
    setEvent((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (err) {
        console.warn('Could not persist sample draft', err);
      }
      return next;
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
  };

  // Reset to original sample configuration
  const handleReset = () => {
    if (!sample) return;
    if (window.confirm('Reset this design back to the original sample? Any custom edits will be undone.')) {
      const original = sampleToLovinglyEvent(sample, user?.uid || 'guest');
      setEvent(original);
      localStorage.setItem(storageKey, JSON.stringify(original));
    }
  };

  // Proceed into normal workflow to publish / share
  const handleProceedToPublish = () => {
    const newId = 'evt_' + Date.now().toString(36);
    const creationDraft: LovinglyEvent = {
      ...event,
      id: newId,
      slug: createSlug(),
      ownerId: user?.uid || 'guest',
      creatorPath: user?.displayName || 'guest',
      isPublished: false,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    };

    localStorage.setItem(`draft_${newId}`, JSON.stringify(creationDraft));
    // Navigate straight to Preview & Publish in standard creation workflow
    navigate(`/create/${newId}/preview`);
  };

  if (!sample) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-50 text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Sample Not Found</h2>
        <p className="text-sm text-stone-600 mb-6">The requested invitation sample could not be found.</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-bold shadow-md hover:bg-stone-800 transition-all cursor-pointer"
        >
          Return to Gallery
        </button>
      </div>
    );
  }

  const messagesList = event.messages && event.messages.length > 0 ? event.messages : [''];

  const handleUpdateMessage = (idx: number, val: string) => {
    const updated = [...messagesList];
    updated[idx] = val;
    handleUpdate({ messages: updated });
  };

  const handleAddMessage = () => {
    handleUpdate({ messages: [...messagesList, ''] });
  };

  const handleRemoveMessage = (idx: number) => {
    if (messagesList.length <= 1) return;
    handleUpdate({ messages: messagesList.filter((_, i) => i !== idx) });
  };

  return (
    <div className="min-h-screen bg-stone-100/90 text-stone-900 flex flex-col overflow-hidden relative">
      {/* Top Header Bar */}
      <header className="h-14 sm:h-16 bg-white/95 backdrop-blur-md border-b border-stone-200 px-3 sm:px-6 flex items-center justify-between shrink-0 z-40 shadow-xs">
        {/* Left: Exit to Gallery & Sample Label */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Exit to Gallery"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit to Gallery</span>
          </button>
          
          <div className="h-5 w-px bg-stone-200 hidden sm:block" />

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 hidden md:inline">
              {sample.badge}
            </span>
            <h1 className="font-serif font-bold text-xs sm:text-sm text-stone-900 max-w-[140px] sm:max-w-[220px] md:max-w-xs truncate">
              {event.title || sample.title}
            </h1>
          </div>
        </div>

        {/* Center: Device Switcher & Saved indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-0.5 sm:p-1 bg-stone-100 rounded-xl border border-stone-200">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                deviceMode === 'mobile' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden md:inline">Mobile</span>
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                deviceMode === 'desktop' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden md:inline">Desktop</span>
            </button>
          </div>

          {savedNotice && (
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 animate-in fade-in hidden sm:inline">
              Saved
            </span>
          )}
        </div>

        {/* Right: Full Customize Switch & Finalize */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Enable Full Customize Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <span className="text-[11px] font-bold text-stone-600 hidden lg:inline">
              Enable full customize
            </span>
            <div className="relative inline-block w-9 h-5 align-middle select-none transition duration-200 ease-in">
              <input 
                type="checkbox" 
                checked={fullCustomizeEnabled}
                onChange={(e) => setFullCustomizeEnabled(e.target.checked)}
                className="opacity-0 absolute block w-0 h-0 cursor-pointer"
              />
              <div className={`w-9 h-5 rounded-full transition-colors ${fullCustomizeEnabled ? 'bg-rose-700' : 'bg-stone-300'}`} />
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${fullCustomizeEnabled ? 'transform translate-x-4' : ''}`} />
            </div>
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500 lg:hidden" />
          </label>

          <button
            onClick={handleProceedToPublish}
            className="px-3 sm:px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Save & Proceed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 flex flex-col items-center justify-start relative">
        <div className={`transition-all duration-300 w-full my-auto ${
          deviceMode === 'mobile'
            ? 'max-w-[340px] sm:max-w-[380px] rounded-[36px] sm:rounded-[44px] border-4 sm:border-[8px] border-stone-900 shadow-2xl overflow-hidden bg-white max-h-[calc(100vh-230px)] sm:max-h-[calc(100vh-240px)] overflow-y-auto'
            : 'max-w-4xl rounded-2xl border border-stone-300 shadow-xl overflow-hidden bg-white max-h-[calc(100vh-230px)] sm:max-h-[calc(100vh-240px)] overflow-y-auto'
        }`}>
          <EventViewer 
            event={event} 
            isBuilderMode={fullCustomizeEnabled}
            onUpdateEvent={handleUpdate}
            isCompact={false}
          />
        </div>
      </main>

      {/* Sliding Edit Controls Panel above Toolbar */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl shadow-2xl p-4 sm:p-5 max-h-[46vh] sm:max-h-[42vh] overflow-y-auto z-30 mb-2 px-4 sm:px-6"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Customizing {activeTab.toUpperCase()}
                </span>
                {fullCustomizeEnabled && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    ⭐ Advanced Mode Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="text-[11px] font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors cursor-pointer mr-2"
                  title="Reset design"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Sample</span>
                </button>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Minimize controls"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* TAB 1: TEXT INPUTS */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Event Title / Couple Names *
                    </label>
                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => handleUpdate({ title: e.target.value })}
                      placeholder="e.g. Priya & Rahul"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Subtitle / Host Names
                    </label>
                    <input
                      type="text"
                      value={event.recipientName || ''}
                      onChange={(e) => handleUpdate({ recipientName: e.target.value })}
                      placeholder="e.g. Together with their families"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Auspicious Quote / Welcome Tagline
                  </label>
                  <input
                    type="text"
                    value={event.shlokaText || ''}
                    onChange={(e) => handleUpdate({ shlokaText: e.target.value })}
                    placeholder="e.g. Under the Auspicious Divine Blessings"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Event Date & Time
                    </label>
                    <input
                      type="text"
                      value={event.eventDate || ''}
                      onChange={(e) => handleUpdate({ eventDate: e.target.value })}
                      placeholder="e.g. 2026-12-24"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Venue / Celebration Location
                    </label>
                    <input
                      type="text"
                      value={event.location || ''}
                      onChange={(e) => handleUpdate({ location: e.target.value })}
                      placeholder="e.g. The Leela Palace Ballroom, Bengaluru"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                    />
                  </div>
                </div>

                {/* Message Paragraphs */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700">
                      Invitation Messages & Notes ({messagesList.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddMessage}
                      className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Paragraph</span>
                    </button>
                  </div>

                  {messagesList.map((msg, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <textarea
                        rows={2}
                        value={msg}
                        onChange={(e) => handleUpdateMessage(idx, e.target.value)}
                        placeholder={`Message paragraph ${idx + 1}...`}
                        className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                      />
                      {messagesList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMessage(idx)}
                          className="p-2 text-stone-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete paragraph"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Full Customize: Typography */}
                {fullCustomizeEnabled && (
                  <div className="pt-3 border-t border-stone-200 space-y-3">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                      Typography & Font Pairing
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {FONT_PAIRINGS.map((font) => (
                        <button
                          key={font.id}
                          type="button"
                          onClick={() => {
                            const curStyles = event.elementStyles || {};
                            handleUpdate({
                              elementStyles: {
                                ...curStyles,
                                title: { ...curStyles['title'], fontFamily: font.headingFont }
                              }
                            });
                          }}
                          className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-rose-300 text-left text-xs transition-all cursor-pointer"
                        >
                          <p className="font-bold text-stone-800 truncate">{font.name}</p>
                          <p className="text-[10px] text-stone-500 truncate">{font.headingFont}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ELEMENTS & MOTIFS */}
            {activeTab === 'elements' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    Select Center Decorative Motif / Symbol
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                    {MOTIF_PRESETS.map((motif) => {
                      const isSelected = (event.decorativeMotif || 'auspicious-kalash') === motif.id;
                      return (
                        <button
                          key={motif.id}
                          type="button"
                          onClick={() => handleUpdate({ decorativeMotif: motif.id as DecorativeMotif })}
                          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-rose-50/70 border-rose-600 ring-2 ring-rose-600/30 shadow-xs'
                              : 'bg-stone-50 border-stone-200 hover:bg-white hover:border-stone-300'
                          }`}
                        >
                          <span className="text-2xl">{motif.icon}</span>
                          <span className="text-[11px] font-bold text-stone-800 truncate w-full">
                            {motif.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Auspicious Glyphs in Full Customize */}
                {fullCustomizeEnabled && (
                  <div className="pt-3 border-t border-stone-200">
                    <label className="block text-xs font-bold text-stone-700 mb-2">
                      Floating Sparkle Glyphs
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['sparkles', 'flowers', 'rings', 'hearts', 'stars', 'champagne'].map((glyph) => {
                        const hasGlyph = (event.elements || []).includes(glyph);
                        return (
                          <button
                            key={glyph}
                            type="button"
                            onClick={() => {
                              const current = event.elements || [];
                              const next = hasGlyph ? current.filter(g => g !== glyph) : [...current, glyph];
                              handleUpdate({ elements: next });
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                              hasGlyph
                                ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-white'
                            }`}
                          >
                            <span>{glyph}</span>
                            {hasGlyph && <Check className="w-3 h-3" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: BACKGROUND & COLORS */}
            {activeTab === 'background' && (
              <div className="space-y-4">
                {/* Curated Color Palettes */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    Curated Color Schemes
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PALETTES.slice(0, 8).map((pal) => (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => handleUpdate({
                          primaryColor: pal.primary,
                          secondaryColor: pal.secondary,
                          highlightColor: pal.accent
                        })}
                        className="p-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-rose-300 text-left transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="truncate mr-2">
                          <p className="text-xs font-bold text-stone-800 truncate">{pal.name}</p>
                          <p className="text-[10px] text-stone-400">{pal.badge}</p>
                        </div>
                        <div className="flex -space-x-1 shrink-0">
                          <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ backgroundColor: pal.primary }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ backgroundColor: pal.accent }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ backgroundColor: pal.secondary }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color Pickers */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={event.primaryColor}
                        onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
                        className="w-8 h-8 rounded-lg border border-stone-300 cursor-pointer p-0"
                      />
                      <input 
                        type="text" 
                        value={event.primaryColor}
                        onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
                        className="w-full text-xs font-mono font-semibold px-2 py-1.5 border border-stone-200 rounded-lg bg-stone-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Surface Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={event.secondaryColor}
                        onChange={(e) => handleUpdate({ secondaryColor: e.target.value })}
                        className="w-8 h-8 rounded-lg border border-stone-300 cursor-pointer p-0"
                      />
                      <input 
                        type="text" 
                        value={event.secondaryColor}
                        onChange={(e) => handleUpdate({ secondaryColor: e.target.value })}
                        className="w-full text-xs font-mono font-semibold px-2 py-1.5 border border-stone-200 rounded-lg bg-stone-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Gold Highlight</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={event.highlightColor || '#D4AF37'}
                        onChange={(e) => handleUpdate({ highlightColor: e.target.value })}
                        className="w-8 h-8 rounded-lg border border-stone-300 cursor-pointer p-0"
                      />
                      <input 
                        type="text" 
                        value={event.highlightColor || '#D4AF37'}
                        onChange={(e) => handleUpdate({ highlightColor: e.target.value })}
                        className="w-full text-xs font-mono font-semibold px-2 py-1.5 border border-stone-200 rounded-lg bg-stone-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Background Textures */}
                <div className="pt-2 border-t border-stone-200">
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    Background Texture Overlay
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TEXTURE_PRESETS.map((tex) => {
                      const isSelected = (event.textureType || 'gold-dust') === tex.id;
                      return (
                        <button
                          key={tex.id}
                          type="button"
                          onClick={() => handleUpdate({ textureType: tex.id as BackgroundTexture })}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-rose-50/70 border-rose-600 ring-2 ring-rose-600/30 shadow-xs'
                              : 'bg-stone-50 border-stone-200 hover:bg-white hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span>{tex.icon || '🎨'}</span>
                            <span className="text-xs font-bold text-stone-800 truncate">{tex.name}</span>
                          </div>
                          <span className="text-[10px] text-stone-500 block truncate">{tex.intensity}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BORDERS & FRAMES */}
            {activeTab === 'borders' && (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Select Architectural Frame & Border
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {FRAME_PRESETS.map((frame) => {
                    const isSelected = (event.frameType || 'traditional-marigold-gold') === frame.id;
                    return (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() => handleUpdate({ frameType: frame.id as FrameType })}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-rose-50/70 border-rose-600 ring-2 ring-rose-600/30 shadow-xs'
                            : 'bg-stone-50 border-stone-200 hover:bg-white hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl shrink-0">{frame.icon || '🖼️'}</span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-stone-900 truncate">{frame.name}</h4>
                            <span className="text-[10px] text-stone-500 font-medium">{frame.badge || frame.category}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-rose-700 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: DETAILS & FEATURES */}
            {activeTab === 'features' && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {/* Google Maps */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                        <MapPin className="w-4 h-4 text-rose-600" />
                        <span>Google Maps Directions</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={event.showLocationQrCode ?? true}
                        onChange={(e) => handleUpdate({ showLocationQrCode: e.target.checked })}
                        className="w-4 h-4 text-rose-600 rounded cursor-pointer"
                      />
                    </div>
                    <input
                      type="url"
                      value={event.googleMapsUrl || ''}
                      onChange={(e) => handleUpdate({ googleMapsUrl: e.target.value })}
                      placeholder="https://maps.google.com/..."
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                    />
                  </div>

                  {/* Spotify Music */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <Music className="w-4 h-4 text-emerald-600" />
                      <span>Spotify Song / Playlist Link</span>
                    </div>
                    <input
                      type="url"
                      value={event.spotifyUrl || ''}
                      onChange={(e) => handleUpdate({ spotifyUrl: e.target.value })}
                      placeholder="https://open.spotify.com/track/..."
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                    />
                  </div>

                  {/* RSVP */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                        <Heart className="w-4 h-4 text-rose-600" />
                        <span>Interactive RSVP Attendance Form</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={event.rsvpConfig?.enabled ?? false}
                        onChange={(e) => handleUpdate({
                          rsvpConfig: {
                            ...(event.rsvpConfig || { collectPhone: true, collectGuestCount: true, collectDietary: false, collectAccommodation: false }),
                            enabled: e.target.checked
                          }
                        })}
                        className="w-4 h-4 text-rose-600 rounded cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-stone-500">Collect guest responses and headcount directly on your page</p>
                  </div>

                  {/* UPI Gift */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                        <QrCode className="w-4 h-4 text-purple-700" />
                        <span>UPI Gift QR Scanner</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={event.showUpiQrCode ?? true}
                        onChange={(e) => handleUpdate({ showUpiQrCode: e.target.checked })}
                        className="w-4 h-4 text-rose-600 rounded cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={event.upiId || ''}
                      onChange={(e) => handleUpdate({ upiId: e.target.value })}
                      placeholder="e.g. username@okhdfcbank"
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Bottom Horizontal Toolbar */}
      <nav className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-xl px-2 sm:px-6 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'text' as ToolbarTab, label: 'Text', icon: Type },
              { id: 'elements' as ToolbarTab, label: 'Elements', icon: Sparkles },
              { id: 'background' as ToolbarTab, label: 'Background', icon: Palette },
              { id: 'borders' as ToolbarTab, label: 'Borders', icon: Layout },
              { id: 'features' as ToolbarTab, label: 'Features', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsPanelOpen(true);
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-rose-700 text-white shadow-md shadow-rose-700/20'
                      : 'bg-stone-50 text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Toggle Panel Visibility Button */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer shrink-0 ml-2"
            title={isPanelOpen ? 'Hide controls panel' : 'Show controls panel'}
          >
            {isPanelOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </nav>
    </div>
  );
}
