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
  Plus, 
  Trash2, 
  RotateCcw, 
  X, 
  MapPin, 
  Heart, 
  QrCode,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { User } from 'firebase/auth';
import type { 
  LovinglyEvent, 
  FrameType, 
  DecorativeMotif, 
  BackgroundTexture,
  StudioElementStyle
} from '../../types';
import { SAMPLE_INVITES } from '../../data/samples';
import { sampleToLovinglyEvent } from '../../lib/sampleAdapter';
import { EventViewer } from '../Viewer';
import { AudioUploader } from '../audio/AudioUploader';
import { createSlug } from '../../lib/utils';
import { 
  FRAME_PRESETS, 
  MOTIF_PRESETS, 
  TEXTURE_PRESETS, 
  PALETTES 
} from '../../lib/designSystem';

const PROFESSIONAL_FONTS = [
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', Georgia, serif", category: 'Classic Serif' },
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif", category: 'Modern Clean' },
  { id: 'poppins', name: 'Poppins', family: "'Poppins', sans-serif", category: 'Bold Contemporary' },
  { id: 'cormorant', name: 'Cormorant', family: "'Cormorant Garamond', Georgia, serif", category: 'Luxury Serif' },
  { id: 'outfit', name: 'Outfit', family: "'Outfit', sans-serif", category: 'Clean Rounded' },
  { id: 'cinzel', name: 'Cinzel', family: "'Cinzel', Georgia, serif", category: 'Royal Heritage' },
];

interface SampleCanvasEditorProps {
  user: User | null;
  onSignIn?: () => Promise<User | null>;
}

type GlobalDrawer = 'background' | 'borders' | 'features' | null;

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

  // Canva-Style Element Selection state: null by default so canvas preview is front-and-center!
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(null);
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState<boolean>(false);
  const [activeGlobalDrawer, setActiveGlobalDrawer] = useState<GlobalDrawer>(null);
  const [isGlobalDrawerCollapsed, setIsGlobalDrawerCollapsed] = useState<boolean>(false);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
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

  // Update specific element styles (font, size, color, alignment)
  const handleUpdateElementStyle = (key: string, updates: Partial<StudioElementStyle>) => {
    const curStyles = event.elementStyles || {};
    const existing = curStyles[key] || {};
    handleUpdate({
      elementStyles: {
        ...curStyles,
        [key]: {
          ...existing,
          ...updates
        }
      }
    });
  };

  // Reset ONLY the currently selected element back to default sample configuration
  const handleResetSelectedElement = () => {
    if (!selectedElementKey || !sample) return;

    const original = sampleToLovinglyEvent(sample, user?.uid || 'guest');
    const nextStyles = { ...(event.elementStyles || {}) };
    delete nextStyles[selectedElementKey];

    const updates: Partial<LovinglyEvent> = {
      elementStyles: nextStyles
    };

    if (selectedElementKey === 'title') {
      updates.title = original.title;
    } else if (selectedElementKey === 'recipient') {
      updates.recipientName = original.recipientName;
    } else if (selectedElementKey === 'quote') {
      updates.shlokaText = original.shlokaText;
    } else if (selectedElementKey === 'details') {
      updates.eventDate = original.eventDate;
      updates.location = original.location;
      updates.googleMapsUrl = original.googleMapsUrl;
    } else if (selectedElementKey === 'motif') {
      updates.decorativeMotif = original.decorativeMotif;
    } else if (selectedElementKey.startsWith('message_')) {
      const idx = parseInt(selectedElementKey.replace('message_', ''), 10);
      if (!isNaN(idx)) {
        const nextMsgs = [...(event.messages || [])];
        nextMsgs[idx] = original.messages?.[idx] || '';
        updates.messages = nextMsgs;
      }
    }

    handleUpdate(updates);
  };

  // Reset active global drawer (colors, borders, or features) back to sample defaults
  const handleResetCurrentDrawer = () => {
    if (!sample) return;
    const original = sampleToLovinglyEvent(sample, user?.uid || 'guest');
    if (activeGlobalDrawer === 'background') {
      handleUpdate({
        primaryColor: original.primaryColor,
        secondaryColor: original.secondaryColor,
        highlightColor: original.highlightColor,
        textureType: original.textureType
      });
    } else if (activeGlobalDrawer === 'borders') {
      handleUpdate({
        frameType: original.frameType
      });
    } else if (activeGlobalDrawer === 'features') {
      handleUpdate({
        bgAudioUrl: original.bgAudioUrl,
        bgAudioPresetId: original.bgAudioPresetId,
        bgAudioTitle: original.bgAudioTitle,
        musicType: original.musicType,
        rsvpConfig: original.rsvpConfig,
        showUpiQrCode: original.showUpiQrCode,
        upiId: original.upiId
      });
    }
  };

  // Reset entire design back to default sample configuration
  const handleResetAllDesign = () => {
    if (!sample) return;
    const original = sampleToLovinglyEvent(sample, user?.uid || 'guest');
    setEvent(original);
    try {
      localStorage.setItem(storageKey, JSON.stringify(original));
    } catch {
      // ignore
    }
    setSelectedElementKey(null);
    setActiveGlobalDrawer(null);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
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
    const updated = [...messagesList, ''];
    handleUpdate({ messages: updated });
    setSelectedElementKey(`message_${updated.length - 1}`);
  };

  const handleRemoveMessage = (idx: number) => {
    if (messagesList.length <= 1) return;
    const updated = messagesList.filter((_, i) => i !== idx);
    handleUpdate({ messages: updated });
    setSelectedElementKey(null);
  };

  // Helper to extract message index
  const getSelectedMessageIndex = () => {
    if (selectedElementKey?.startsWith('message_')) {
      const idx = parseInt(selectedElementKey.replace('message_', ''), 10);
      return isNaN(idx) ? null : idx;
    }
    return null;
  };

  const messageIdx = getSelectedMessageIndex();

  // Selected element style
  const activeStyle = selectedElementKey ? (event.elementStyles?.[selectedElementKey] || {}) : {};

  return (
    <div className="min-h-screen bg-stone-100/90 text-stone-900 flex flex-col overflow-hidden relative">
      {/* Top Header Bar: Streamlined Single Compact Row */}
      <header className="h-14 sm:h-16 bg-white/95 backdrop-blur-md border-b border-stone-200 px-2.5 sm:px-4 md:px-6 flex items-center justify-between gap-1.5 sm:gap-3 shrink-0 z-40 shadow-xs select-none">
        {/* Left: Exit & Template Title */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 max-w-[42%] sm:max-w-none">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
            title="Exit to Gallery"
            aria-label="Exit to Gallery"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Exit</span>
          </button>
          
          <div className="h-4 w-px bg-stone-200 hidden xs:block shrink-0" />

          <div className="flex items-center gap-1.5 min-w-0">
            <h1 
              className="font-serif font-bold text-xs sm:text-base text-stone-900 truncate tracking-tight"
              title={event.title || sample.title}
            >
              {event.title || sample.title}
            </h1>
          </div>
        </div>

        {/* Center: Device Mode Switcher (Shown only on medium/large screens: desktop, laptop, tablet) */}
        <div className="hidden md:flex items-center gap-1 sm:gap-2 shrink-0">
          <div className="flex items-center p-0.5 bg-stone-100 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => setDeviceMode('mobile')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                deviceMode === 'mobile' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Mobile View"
              aria-label="Switch to Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Mobile</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('desktop')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                deviceMode === 'desktop' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Desktop View"
              aria-label="Switch to Desktop View"
            >
              <Monitor className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Desktop</span>
            </button>
          </div>

          {savedNotice && (
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 animate-in fade-in shrink-0">
              Saved
            </span>
          )}
        </div>

        {/* Right: Save & Proceed Action (100% visible with zero cut-off) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={handleProceedToPublish}
            className="px-3 sm:px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Save changes and proceed to publish"
          >
            <span>Save &amp; Proceed</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </header>

      {/* Main Canvas Area: Prominent, Generous Viewport */}
      <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 flex flex-col items-center justify-start relative">
        <div className={`transition-all duration-300 w-full my-auto ${
          deviceMode === 'mobile'
            ? 'max-w-[340px] sm:max-w-[380px] rounded-[36px] sm:rounded-[44px] border-4 sm:border-[8px] border-stone-900 shadow-2xl overflow-hidden bg-white overflow-y-auto'
            : 'max-w-4xl rounded-2xl border border-stone-300 shadow-xl overflow-hidden bg-white overflow-y-auto'
        } ${
          (selectedElementKey && !isInspectorCollapsed) || (activeGlobalDrawer && !isGlobalDrawerCollapsed)
            ? 'max-h-[calc(100vh-320px)] sm:max-h-[calc(100vh-300px)]'
            : 'max-h-[calc(100vh-140px)] sm:max-h-[calc(100vh-160px)]'
        }`}>
          <EventViewer 
            event={event} 
            deviceMode={deviceMode}
            isBuilderMode={true}
            disableAutoplay={true}
            activeElementKey={selectedElementKey}
            onSelectElementKey={(key) => {
              setSelectedElementKey(key);
              if (key) {
                setActiveGlobalDrawer(null);
                setIsInspectorCollapsed(false);
              }
            }}
            onUpdateEvent={handleUpdate}
            isCompact={false}
          />
        </div>
      </main>

      {/* CANVA-STYLE CONTEXTUAL BOTTOM INSPECTOR PANEL */}
      <AnimatePresence>
        {selectedElementKey && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            transition={{ duration: 0.2 }}
            className={`w-full max-w-4xl mx-auto bg-white/98 backdrop-blur-md border border-stone-200/90 rounded-2xl shadow-2xl z-40 mb-2 transition-all duration-300 flex flex-col overflow-hidden ${
              isInspectorCollapsed
                ? 'max-h-[64px]'
                : 'max-h-[44vh] sm:max-h-[38vh]'
            }`}
          >
            {/* Inspector Top Bar (Fixed / Pinned Header) */}
            <div className={`shrink-0 px-3.5 sm:px-6 py-2.5 sm:py-3 bg-white/95 border-stone-200/80 flex items-center justify-between gap-2 rounded-t-2xl z-10 ${isInspectorCollapsed ? '' : 'border-b'}`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="p-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                  {selectedElementKey === 'title' && <Type className="w-3.5 h-3.5" />}
                  {selectedElementKey === 'recipient' && <Type className="w-3.5 h-3.5" />}
                  {selectedElementKey === 'quote' && <Sparkles className="w-3.5 h-3.5" />}
                  {selectedElementKey === 'details' && <MapPin className="w-3.5 h-3.5" />}
                  {selectedElementKey === 'motif' && <Sparkles className="w-3.5 h-3.5" />}
                  {selectedElementKey?.startsWith('message_') && <FileText className="w-3.5 h-3.5" />}
                </span>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 capitalize truncate">
                    {selectedElementKey === 'title' && 'Editing Event Title'}
                    {selectedElementKey === 'recipient' && 'Editing Subtitle / Host Names'}
                    {selectedElementKey === 'quote' && 'Editing Welcome Tagline / Quote'}
                    {selectedElementKey === 'details' && 'Editing Date & Location'}
                    {selectedElementKey === 'motif' && 'Editing Center Element'}
                    {selectedElementKey?.startsWith('message_') && `Editing Message Paragraph ${messageIdx !== null ? messageIdx + 1 : ''}`}
                  </h3>
                  <p className="text-[10px] text-stone-500 hidden sm:block truncate">
                    {isInspectorCollapsed 
                      ? 'Element selected & highlighted. Drag directly on canvas to reposition.' 
                      : selectedElementKey === 'motif'
                        ? 'Select an auspicious or celebratory center element. Edits reflect live on the canvas.'
                        : 'Modify text, font pairing, size, and styling. Edits reflect live on the canvas.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Reset, Collapse/Expand Arrow, Close X */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleResetSelectedElement}
                  className="px-2 py-1 text-[11px] font-bold text-stone-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 border border-stone-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset this selected element to sample defaults"
                >
                  <RotateCcw className="w-3 h-3 text-rose-600 shrink-0" />
                  <span className="hidden sm:inline">Reset Element</span>
                  <span className="sm:hidden">Reset</span>
                </button>

                {/* Down/Up Arrow Toggle Button to Collapse/Expand Panel */}
                <button
                  type="button"
                  onClick={() => setIsInspectorCollapsed(!isInspectorCollapsed)}
                  className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer flex items-center gap-1"
                  title={isInspectorCollapsed ? "Expand editing options" : "Collapse options to view full canvas preview"}
                  aria-label={isInspectorCollapsed ? "Expand editing options" : "Collapse options"}
                >
                  {isInspectorCollapsed ? (
                    <>
                      <ChevronUp className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="text-[10px] font-bold text-rose-700 hidden sm:inline">Options</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 text-stone-600 shrink-0" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedElementKey(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Close inspector (Deselect)"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CONTEXTUAL CONTROLS (Rendered only when NOT collapsed in a scrollable body) */}
            {!isInspectorCollapsed && (
              <div className="flex-1 overflow-y-auto px-3.5 sm:px-6 py-3.5 sm:py-4 space-y-3.5 min-h-0">
              {/* 1. TITLE CONTROLS */}
              {selectedElementKey === 'title' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Event Title / Couple Names
                    </label>
                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => handleUpdate({ title: e.target.value })}
                      placeholder="e.g. Priya & Rahul"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* 2. RECIPIENT / SUBTITLE CONTROLS */}
              {selectedElementKey === 'recipient' && (
                <div className="space-y-3">
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
              )}

              {/* 3. QUOTE / TAGLINE CONTROLS */}
              {selectedElementKey === 'quote' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Welcome Tagline / Auspicious Quote
                    </label>
                    <input
                      type="text"
                      value={event.shlokaText || ''}
                      onChange={(e) => handleUpdate({ shlokaText: e.target.value })}
                      placeholder="e.g. Under the Auspicious Divine Blessings"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* 4. DETAILS (DATE & VENUE) CONTROLS */}
              {selectedElementKey === 'details' && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-600" />
                      <span>Event Date & Time</span>
                    </label>
                    <input
                      type="text"
                      value={event.eventDate || ''}
                      onChange={(e) => handleUpdate({ eventDate: e.target.value })}
                      placeholder="e.g. December 24, 2026 at 6:30 PM"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      <span>Venue / Location</span>
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
              )}

              {/* 5. MESSAGE PARAGRAPH CONTROLS */}
              {selectedElementKey?.startsWith('message_') && messageIdx !== null && (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-stone-700">
                        Message Content (Paragraph {messageIdx + 1})
                      </label>
                      {messagesList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMessage(messageIdx)}
                          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete Paragraph</span>
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={messagesList[messageIdx] || ''}
                      onChange={(e) => handleUpdateMessage(messageIdx, e.target.value)}
                      placeholder="Write your invitation note or greeting..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* 6. CENTER ELEMENT CONTROLS */}
              {selectedElementKey === 'motif' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    Select Center Element / Symbol
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {MOTIF_PRESETS.map((motif) => {
                      const isSelected = (event.decorativeMotif || 'auspicious-kalash') === motif.id;
                      return (
                        <button
                          key={motif.id}
                          type="button"
                          onClick={() => handleUpdate({ decorativeMotif: motif.id as DecorativeMotif })}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-rose-50/70 border-rose-600 ring-2 ring-rose-600/30 shadow-xs'
                              : 'bg-stone-50 border-stone-200 hover:bg-white'
                          }`}
                        >
                          <span className="text-xl">{motif.icon}</span>
                          <span className="text-[10px] font-bold text-stone-800 truncate w-full">
                            {motif.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SHARED TEXT FORMATTING BAR (For all text elements) */}
              {['title', 'recipient', 'quote', 'details'].includes(selectedElementKey) || selectedElementKey?.startsWith('message_') ? (
                <div className="pt-2.5 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Font Family Selection */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Font Style
                    </label>
                    <select
                      value={activeStyle.fontFamily || ''}
                      onChange={(e) => handleUpdateElementStyle(selectedElementKey, { fontFamily: e.target.value || undefined })}
                      className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:bg-white cursor-pointer"
                    >
                      <option value="">Default Font (Outfit / Fraunces)</option>
                      {PROFESSIONAL_FONTS.map((f) => (
                        <option key={f.id} value={f.family}>
                          {f.name} · {f.category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Font Size Presets */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Font Size
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { label: 'Sm', size: 14 },
                        { label: 'Md', size: 20 },
                        { label: 'Lg', size: 30 },
                        { label: 'Xl', size: 44 }
                      ].map((s) => (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => handleUpdateElementStyle(selectedElementKey, { fontSize: s.size })}
                          className={`py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            activeStyle.fontSize === s.size
                              ? 'bg-rose-700 text-white border-rose-700'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-white'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Alignment & Text Color */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Alignment & Color
                    </label>
                    <div className="flex items-center gap-1.5">
                      <div className="flex p-0.5 bg-stone-100 rounded-lg border border-stone-200">
                        <button
                          type="button"
                          onClick={() => handleUpdateElementStyle(selectedElementKey, { align: 'left' })}
                          className={`p-1 rounded text-stone-600 hover:text-stone-900 cursor-pointer ${
                            activeStyle.align === 'left' ? 'bg-white shadow-xs text-rose-700' : ''
                          }`}
                          title="Align Left"
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateElementStyle(selectedElementKey, { align: 'center' })}
                          className={`p-1 rounded text-stone-600 hover:text-stone-900 cursor-pointer ${
                            !activeStyle.align || activeStyle.align === 'center' ? 'bg-white shadow-xs text-rose-700' : ''
                          }`}
                          title="Align Center"
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateElementStyle(selectedElementKey, { align: 'right' })}
                          className={`p-1 rounded text-stone-600 hover:text-stone-900 cursor-pointer ${
                            activeStyle.align === 'right' ? 'bg-white shadow-xs text-rose-700' : ''
                          }`}
                          title="Align Right"
                        >
                          <AlignRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quick Color Swatches */}
                      <div className="flex items-center gap-1 ml-auto">
                        {['#881337', '#1c1917', '#B45309', '#047857', '#1D4ED8'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleUpdateElementStyle(selectedElementKey, { color: c })}
                            className={`w-5 h-5 rounded-full border border-white transition-transform hover:scale-110 cursor-pointer ${
                              activeStyle.color === c ? 'ring-2 ring-stone-900' : ''
                            }`}
                            style={{ backgroundColor: c }}
                            title={`Set color: ${c}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL DRAWER FOR BACKGROUND / BORDERS / FEATURES */}
      <AnimatePresence>
        {activeGlobalDrawer && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            transition={{ duration: 0.2 }}
            className={`w-full max-w-4xl mx-auto bg-white/98 backdrop-blur-md border border-stone-200/90 rounded-2xl shadow-2xl z-40 mb-2 transition-all duration-300 flex flex-col overflow-hidden ${
              isGlobalDrawerCollapsed
                ? 'max-h-[64px]'
                : 'max-h-[44vh] sm:max-h-[38vh]'
            }`}
          >
            {/* Pinned Top Navigation Bar */}
            <div className={`shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/95 border-stone-200/80 flex items-center justify-between gap-2 rounded-t-2xl z-10 ${isGlobalDrawerCollapsed ? '' : 'border-b'}`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="p-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                  {activeGlobalDrawer === 'background' && <Palette className="w-3.5 h-3.5" />}
                  {activeGlobalDrawer === 'borders' && <Layout className="w-3.5 h-3.5" />}
                  {activeGlobalDrawer === 'features' && <Sliders className="w-3.5 h-3.5" />}
                </span>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 capitalize truncate">
                    {activeGlobalDrawer === 'background' && 'Colors & Background Textures'}
                    {activeGlobalDrawer === 'borders' && 'Frames & Decorative Borders'}
                    {activeGlobalDrawer === 'features' && 'Music, RSVP & Interactive Features'}
                  </h3>
                  <p className="text-[10px] text-stone-500 hidden sm:block truncate">
                    {isGlobalDrawerCollapsed
                      ? 'Drawer collapsed. Expand options to view and edit.'
                      : activeGlobalDrawer === 'background'
                        ? 'Select curated color palettes and delicate background paper textures.'
                        : activeGlobalDrawer === 'borders'
                          ? 'Choose ornate invitation arches and floral border motifs.'
                          : 'Manage background celebration music, RSVP form, and UPI gifting.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Reset, Collapse/Expand Toggle, Close X */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleResetCurrentDrawer}
                  className="px-2 py-1 text-[11px] font-bold text-stone-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 border border-stone-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset this section to default configuration"
                >
                  <RotateCcw className="w-3 h-3 text-rose-600 shrink-0" />
                  <span className="hidden sm:inline">Reset</span>
                  <span className="sm:hidden">Reset</span>
                </button>

                {/* Down/Up Arrow Toggle Button to Collapse/Expand Panel */}
                <button
                  type="button"
                  onClick={() => setIsGlobalDrawerCollapsed(!isGlobalDrawerCollapsed)}
                  className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer flex items-center gap-1"
                  title={isGlobalDrawerCollapsed ? "Expand drawer options" : "Collapse options to view full canvas preview"}
                  aria-label={isGlobalDrawerCollapsed ? "Expand drawer options" : "Collapse options"}
                >
                  {isGlobalDrawerCollapsed ? (
                    <>
                      <ChevronUp className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="text-[10px] font-bold text-rose-700 hidden sm:inline">Options</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 text-stone-600 shrink-0" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveGlobalDrawer(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Close drawer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Elements Body */}
            {!isGlobalDrawerCollapsed && (
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 min-h-0">
                {/* Background & Colors */}
                {activeGlobalDrawer === 'background' && (
                  <div className="space-y-4">
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

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-2">
                        Background Texture Overlay
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {TEXTURE_PRESETS.map((tex) => (
                          <button
                            key={tex.id}
                            type="button"
                            onClick={() => handleUpdate({ textureType: tex.id as BackgroundTexture })}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                              (event.textureType || 'gold-dust') === tex.id
                                ? 'bg-rose-50 text-rose-700 border-rose-600 shadow-xs'
                                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-white'
                            }`}
                          >
                            {tex.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Borders & Frames */}
                {activeGlobalDrawer === 'borders' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-2">
                      Select Invitation Arch & Frame
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {FRAME_PRESETS.map((frame) => {
                        const isSelected = (event.frameType || 'mandap-arch') === frame.id;
                        return (
                          <button
                            key={frame.id}
                            type="button"
                            onClick={() => handleUpdate({ frameType: frame.id as FrameType })}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px] ${
                              isSelected
                                ? 'bg-rose-50/70 border-rose-600 ring-2 ring-rose-600/30 shadow-xs'
                                : 'bg-stone-50 border-stone-200 hover:bg-white hover:border-stone-300'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-stone-900">{frame.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-rose-600" />}
                              </div>
                              <p className="text-[10px] text-stone-500 line-clamp-2">{frame.badge || frame.category}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Features (Music, RSVP, UPI) */}
                {activeGlobalDrawer === 'features' && (
                  <div className="space-y-4">
                    <AudioUploader
                      event={event}
                      onChange={handleUpdate}
                      variant="minimal"
                    />

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                            <Heart className="w-4 h-4 text-rose-600" />
                            <span>Interactive RSVP Form</span>
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
                        <p className="text-[11px] text-stone-500">Collect guest responses and headcount</p>
                      </div>

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
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SLEEK FLOATING BOTTOM TOOLBAR (Canva-style) */}
      <nav className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-lg px-2 sm:px-6 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Global Theme & Architecture Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setSelectedElementKey(null);
                setIsGlobalDrawerCollapsed(false);
                setActiveGlobalDrawer(activeGlobalDrawer === 'background' ? null : 'background');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeGlobalDrawer === 'background'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Colors &amp; BG</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedElementKey(null);
                setIsGlobalDrawerCollapsed(false);
                setActiveGlobalDrawer(activeGlobalDrawer === 'borders' ? null : 'borders');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeGlobalDrawer === 'borders'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Frames</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveGlobalDrawer(null);
                setIsInspectorCollapsed(false);
                setSelectedElementKey(selectedElementKey === 'motif' ? null : 'motif');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedElementKey === 'motif'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Center Elements</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedElementKey(null);
                setIsGlobalDrawerCollapsed(false);
                setActiveGlobalDrawer(activeGlobalDrawer === 'features' ? null : 'features');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeGlobalDrawer === 'features'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Features</span>
            </button>

            <button
              type="button"
              onClick={handleAddMessage}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 flex items-center gap-1 cursor-pointer shrink-0"
              title="Add a new message paragraph"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Text</span>
            </button>

            <button
              type="button"
              onClick={handleResetAllDesign}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center gap-1 cursor-pointer shrink-0"
              title="Reset entire design to sample defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Reset All</span>
            </button>
          </div>

          {/* Canva Helper Tip */}
          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-medium text-stone-500 bg-stone-100/80 px-2.5 py-1 rounded-full border border-stone-200 shrink-0">
            <span>💡 Click any element on canvas to edit</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
