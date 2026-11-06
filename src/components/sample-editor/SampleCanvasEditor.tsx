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
  ChevronUp,
  Music,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import type { User } from 'firebase/auth';
import type { 
  LovinglyEvent, 
  FrameType, 
  DecorativeMotif, 
  BackgroundTexture,
  StudioElementStyle
} from '../../types';

type RSVPConfig = NonNullable<LovinglyEvent['rsvpConfig']>;
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

type GlobalDrawer = 'background' | 'borders' | null;

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
  const [newCustomQuestion, setNewCustomQuestion] = useState('');
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [addMenuMode, setAddMenuMode] = useState<'main' | 'features'>('main');

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

  const defaultRsvpConfig: RSVPConfig = event.rsvpConfig || {
    enabled: false,
    collectPhone: true,
    collectGuestCount: true,
    collectDietary: false,
    collectAccommodation: false,
    customQuestions: [],
  };

  const handleUpdateRsvp = (updates: Partial<RSVPConfig>) => {
    handleUpdate({
      rsvpConfig: {
        ...defaultRsvpConfig,
        ...updates,
        enabled: updates.enabled !== undefined ? updates.enabled : true,
      },
    });
  };

  const handleAddCustomQuestion = () => {
    const trimmed = newCustomQuestion.trim();
    if (!trimmed) return;
    const currentQuestions = defaultRsvpConfig.customQuestions || [];
    handleUpdateRsvp({
      enabled: true,
      customQuestions: [...currentQuestions, trimmed],
    });
    setNewCustomQuestion('');
  };

  const handleRemoveCustomQuestion = (idx: number) => {
    const currentQuestions = defaultRsvpConfig.customQuestions || [];
    handleUpdateRsvp({
      customQuestions: currentQuestions.filter((_, i) => i !== idx),
    });
  };

  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleUpdate({
          upiQrImageUrl: reader.result,
          showUpiQrCode: true,
        });
      }
    };
    reader.readAsDataURL(file);
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
    } else if (selectedElementKey === 'audio') {
      updates.bgAudioUrl = original.bgAudioUrl;
      updates.bgAudioPresetId = original.bgAudioPresetId;
      updates.bgAudioTitle = original.bgAudioTitle;
      updates.spotifyUrl = original.spotifyUrl;
      updates.musicType = original.musicType;
    } else if (selectedElementKey === 'photos' || selectedElementKey.startsWith('photo_')) {
      updates.photos = original.photos;
    } else if (selectedElementKey === 'rsvp') {
      updates.rsvpConfig = original.rsvpConfig;
      updates.whatsappNumber = original.whatsappNumber;
    } else if (selectedElementKey === 'upi' || selectedElementKey === 'upiQr') {
      updates.upiId = original.upiId;
      updates.upiName = original.upiName;
      updates.showUpiQrCode = original.showUpiQrCode;
      updates.upiQrImageUrl = original.upiQrImageUrl;
    } else if (selectedElementKey === 'locationQr') {
      updates.showLocationQrCode = original.showLocationQrCode;
      updates.googleMapsUrl = original.googleMapsUrl;
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

  // Reset active global drawer (colors or borders) back to sample defaults
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
    navigate(`/create/${newId}/publish`);
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

        {/* Right: Save & Proceed Action (Note: Export PDF is strictly restricted to active published pages) */}
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
                  {selectedElementKey === 'audio' && <Music className="w-3.5 h-3.5" />}
                  {(selectedElementKey === 'photos' || selectedElementKey?.startsWith('photo_')) && <ImageIcon className="w-3.5 h-3.5" />}
                  {selectedElementKey === 'rsvp' && <Heart className="w-3.5 h-3.5 text-rose-600" />}
                  {(selectedElementKey === 'upi' || selectedElementKey === 'upiQr') && <QrCode className="w-3.5 h-3.5 text-purple-700" />}
                  {selectedElementKey === 'locationQr' && <MapPin className="w-3.5 h-3.5 text-rose-600" />}
                  {selectedElementKey?.startsWith('message_') && <FileText className="w-3.5 h-3.5" />}
                </span>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 capitalize truncate">
                    {selectedElementKey === 'title' && 'Editing Event Title'}
                    {selectedElementKey === 'recipient' && 'Editing Subtitle / Host Names'}
                    {selectedElementKey === 'quote' && 'Editing Welcome Tagline / Quote'}
                    {selectedElementKey === 'details' && 'Editing Date & Location'}
                    {selectedElementKey === 'motif' && 'Editing Center Element'}
                    {selectedElementKey === 'audio' && 'Editing Background Music'}
                    {(selectedElementKey === 'photos' || selectedElementKey?.startsWith('photo_')) && 'Editing Page Photos'}
                    {selectedElementKey === 'rsvp' && 'Editing Guest RSVP Form'}
                    {(selectedElementKey === 'upi' || selectedElementKey === 'upiQr') && 'Editing UPI Digital Gifts'}
                    {selectedElementKey === 'locationQr' && 'Editing Venue Directions QR'}
                    {selectedElementKey?.startsWith('message_') && `Editing Message Paragraph ${messageIdx !== null ? messageIdx + 1 : ''}`}
                  </h3>
                  <p className="text-[10px] text-stone-500 hidden sm:block truncate">
                    {isInspectorCollapsed 
                      ? 'Element selected & highlighted. Drag directly on canvas to reposition.' 
                      : selectedElementKey === 'motif'
                        ? 'Select an auspicious or celebratory center element. Edits reflect live on the canvas.'
                        : selectedElementKey === 'audio'
                          ? 'Change soundtrack, upload MP3, embed Spotify track, or remove music.'
                          : (selectedElementKey === 'photos' || selectedElementKey?.startsWith('photo_'))
                            ? 'Remove template photos or upload new pictures to personalize your page.'
                            : selectedElementKey === 'rsvp'
                              ? 'Customize guest headcount collection or remove RSVP form.'
                              : (selectedElementKey === 'upi' || selectedElementKey === 'upiQr')
                                ? 'Update UPI ID and payment scanner or remove digital gifts from this page.'
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

              {/* 4. DETAILS (DATE, VENUE & GOOGLE MAPS) CONTROLS */}
              {selectedElementKey === 'details' && (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-rose-600" />
                        <span>Event Date &amp; Time</span>
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
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Google Maps Link (For Directions &amp; QR Code)
                    </label>
                    <input
                      type="url"
                      value={event.googleMapsUrl || ''}
                      onChange={(e) => handleUpdate({ googleMapsUrl: e.target.value, showLocationQrCode: Boolean(e.target.value) })}
                      placeholder="https://maps.google.com/?q=..."
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
                          <span className="text-[10px] font-bold text-stone-800 truncate w-full">
                            {motif.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 7. AUDIO (BACKGROUND MUSIC) CONTROLS - Duplicated from Create Step 4 */}
              {selectedElementKey === 'audio' && (
                <div className="space-y-4">
                  <AudioUploader
                    event={event}
                    onChange={handleUpdate}
                    variant="card"
                  />
                  <div className="pt-2 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdate({
                          bgAudioUrl: '',
                          bgAudioPresetId: '',
                          bgAudioTitle: '',
                          spotifyUrl: '',
                          musicType: 'none',
                        });
                        setSelectedElementKey(null);
                      }}
                      className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove from this page</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 8. PHOTOS (GALLERY / SHOWCASE) CONTROLS */}
              {(selectedElementKey === 'photos' || selectedElementKey?.startsWith('photo_')) && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700">
                      Page Photos ({event.photos.length})
                    </label>
                  </div>

                  {event.photos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {event.photos.map((photoUrl, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                          <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const next = event.photos.filter((_, i) => i !== idx);
                              handleUpdate({ photos: next });
                            }}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-all cursor-pointer opacity-90 group-hover:opacity-100"
                            title="Remove this photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] rounded font-mono">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-center text-xs text-stone-500">
                      No photos on this page. Upload your first picture below.
                    </div>
                  )}

                  {/* Upload new photo input */}
                  <div className="pt-2 border-t border-stone-100">
                    <label className="block text-[11px] font-bold text-stone-600 mb-1 flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5 text-rose-600" />
                      <span>Upload &amp; Add New Photo</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (uploadEvt) => {
                            if (uploadEvt.target?.result) {
                              handleUpdate({ photos: [...event.photos, uploadEvt.target.result as string] });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
                    />
                  </div>

                  {/* Remove from this page */}
                  <div className="pt-2 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdate({ photos: [] });
                        setSelectedElementKey(null);
                      }}
                      className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove from this page</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 9. RSVP FORM CONTROLS - Full Duplication from Create Step 4 */}
              {selectedElementKey === 'rsvp' && (
                <div className="space-y-4">
                  {/* Standard Checkboxes */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                      Guest Collection Fields
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {[
                        { key: 'collectPhone', label: 'Phone / WhatsApp Number', desc: 'Collect contact number for event reminders' },
                        { key: 'collectGuestCount', label: 'Number of Attending Guests', desc: 'Track total headcount for catering' },
                        { key: 'collectDietary', label: 'Meal / Dietary Preference', desc: 'Veg / Non-Veg / Jain / Allergies' },
                        { key: 'collectAccommodation', label: 'Accommodation / Stay Needed', desc: 'Ask outstation guests if they need hotel stay' },
                      ].map((field) => {
                        const checked = Boolean(defaultRsvpConfig[field.key as keyof RSVPConfig]);
                        return (
                          <label
                            key={field.key}
                            className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                              checked
                                ? 'bg-rose-50/50 border-rose-200'
                                : 'bg-stone-50/70 border-stone-200/80 hover:bg-stone-100/70'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) =>
                                handleUpdateRsvp({
                                  enabled: true,
                                  [field.key]: e.target.checked,
                                })
                              }
                              className="mt-0.5 w-4 h-4 text-rose-700 rounded focus:ring-rose-600"
                            />
                            <div>
                              <span className="text-xs font-bold text-stone-800 block">{field.label}</span>
                              <span className="text-[10px] text-stone-500">{field.desc}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* RSVP Deadline & WhatsApp Number */}
                  <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        RSVP Response Deadline (Optional)
                      </label>
                      <input
                        type="date"
                        value={defaultRsvpConfig.deadline || ''}
                        onChange={(e) => handleUpdateRsvp({ enabled: true, deadline: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-rose-700 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Host WhatsApp Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={event.whatsappNumber || ''}
                        onChange={(e) => {
                          handleUpdate({
                            whatsappNumber: e.target.value,
                            rsvpConfig: { ...defaultRsvpConfig, enabled: true },
                          });
                        }}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-rose-700 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Custom RSVP Questions */}
                  <div className="pt-2 border-t border-stone-100 space-y-2.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Custom RSVP Questions / Fields
                    </label>

                    {(defaultRsvpConfig.customQuestions || []).length > 0 && (
                      <div className="space-y-1.5">
                        {(defaultRsvpConfig.customQuestions || []).map((q, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                          >
                            <input
                              type="text"
                              value={q}
                              onChange={(e) => {
                                const updated = [...(defaultRsvpConfig.customQuestions || [])];
                                updated[idx] = e.target.value;
                                handleUpdateRsvp({ enabled: true, customQuestions: updated });
                              }}
                              className="flex-1 bg-transparent text-xs font-medium text-stone-800 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomQuestion(idx)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Remove question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCustomQuestion}
                        onChange={(e) => setNewCustomQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomQuestion();
                          }
                        }}
                        placeholder="e.g. Arrival flight/train timing or Song request..."
                        className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-rose-700 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomQuestion}
                        className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Field</span>
                      </button>
                    </div>
                  </div>

                  {/* Remove from this page */}
                  <div className="pt-2 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdate({
                          rsvpConfig: {
                            ...defaultRsvpConfig,
                            enabled: false,
                          },
                          whatsappNumber: '',
                        });
                        setSelectedElementKey(null);
                      }}
                      className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove from this page</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 10. UPI DIGITAL GIFTS CONTROLS - Full Duplication from Create Step 4 */}
              {(selectedElementKey === 'upi' || selectedElementKey === 'upiQr') && (
                <div className="space-y-4">
                  {/* 1. Upload / Attach Custom UPI QR Code Image */}
                  <div className="p-3.5 rounded-2xl bg-stone-50/90 border border-stone-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-bold text-stone-800">
                          1. Attach Custom UPI QR Code Image (Recommended)
                        </label>
                        <p className="text-[11px] text-stone-500">
                          Upload your official bank or GPay/PhonePe QR code screenshot or paste an image link.
                        </p>
                      </div>
                    </div>

                    {event.upiQrImageUrl ? (
                      <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-stone-200 shadow-xs">
                        <img
                          src={event.upiQrImageUrl}
                          alt="Uploaded UPI QR Preview"
                          className="w-16 h-16 object-contain rounded-lg border border-stone-200 bg-stone-50 p-1 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-stone-900">Custom QR Code Image Attached</p>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5">
                            Displayed directly inside the digital gift scanner on your page.
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <label className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-bold cursor-pointer transition-colors">
                              Change QR Image
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleQrFileUpload}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleUpdate({ upiQrImageUrl: '' })}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove QR Image</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-stone-300 hover:border-purple-600 rounded-xl bg-white hover:bg-purple-50/30 cursor-pointer transition-all text-center">
                          <Upload className="w-4 h-4 text-purple-700 mb-1" />
                          <span className="text-xs font-bold text-stone-800">Upload QR Image File</span>
                          <span className="text-[10px] text-stone-400 mt-0.5">PNG, JPG, WEBP</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleQrFileUpload}
                            className="hidden"
                          />
                        </label>

                        <div className="flex flex-col justify-center p-3 bg-white rounded-xl border border-stone-200">
                          <label className="block text-[11px] font-bold text-stone-600 mb-1">
                            Or Paste Image URL Directly
                          </label>
                          <input
                            type="url"
                            value={event.upiQrImageUrl || ''}
                            onChange={(e) =>
                              handleUpdate({
                                upiQrImageUrl: e.target.value,
                                showUpiQrCode: Boolean(e.target.value || event.upiId),
                              })
                            }
                            placeholder="https://.../my-upi-qr.png"
                            className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-purple-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. UPI ID / VPA & Payee Display Name */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        2. UPI ID / VPA (Auto-generates QR if no custom image)
                      </label>
                      <input
                        type="text"
                        value={event.upiId || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdate({
                            upiId: val,
                            showUpiQrCode: Boolean(val.trim() || event.upiQrImageUrl),
                          });
                        }}
                        placeholder="e.g. rahulsharma@okaxis or 9876543210@ybl"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:border-purple-700 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Payee Display Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={event.upiName || ''}
                        onChange={(e) => handleUpdate({ upiName: e.target.value })}
                        placeholder="e.g. Rahul & Priya Wedding"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-purple-700 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Remove from this page */}
                  <div className="pt-2 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdate({
                          upiId: '',
                          upiName: '',
                          upiQrImageUrl: '',
                          showUpiQrCode: false,
                        });
                        setSelectedElementKey(null);
                      }}
                      className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove from this page</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 11. VENUE DIRECTIONS QR CONTROLS */}
              {selectedElementKey === 'locationQr' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Google Maps Venue Link (Auto-generates Directions QR Code)
                    </label>
                    <input
                      type="url"
                      value={event.googleMapsUrl || ''}
                      onChange={(e) => handleUpdate({ googleMapsUrl: e.target.value, showLocationQrCode: Boolean(e.target.value) })}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-rose-600 transition-all"
                    />
                  </div>

                  <div className="pt-2 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdate({
                          showLocationQrCode: false,
                        });
                        setSelectedElementKey(null);
                      }}
                      className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove from this page</span>
                    </button>
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

      {/* GLOBAL DRAWER FOR BACKGROUND / BORDERS */}
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
                </span>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 capitalize truncate">
                    {activeGlobalDrawer === 'background' && 'Colors & Background Textures'}
                    {activeGlobalDrawer === 'borders' && 'Frames & Decorative Borders'}
                  </h3>
                  <p className="text-[10px] text-stone-500 hidden sm:block truncate">
                    {isGlobalDrawerCollapsed
                      ? 'Drawer collapsed. Expand options to view and edit.'
                      : activeGlobalDrawer === 'background'
                        ? 'Select curated color palettes and delicate background paper textures.'
                        : 'Choose ornate invitation arches and floral border motifs.'}
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
                      Select Invitation Arch &amp; Frame
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
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SLEEK FLOATING BOTTOM TOOLBAR (Canva-style) */}
      <nav className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-lg px-2 sm:px-6 py-2 relative">
        {/* Upward Dropdown Menu for Plus (+) Button */}
        <AnimatePresence>
          {addMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => {
                  setAddMenuOpen(false);
                  setAddMenuMode('main');
                }}
              />
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-[92vw] max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200/90 p-3 z-40"
              >
                {addMenuMode === 'main' ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-2 py-1 border-b border-stone-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        What would you like to add?
                      </span>
                      <button
                        type="button"
                        onClick={() => setAddMenuOpen(false)}
                        className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Option 1: Text */}
                    <button
                      type="button"
                      onClick={() => {
                        setAddMenuOpen(false);
                        setAddMenuMode('main');
                        setActiveGlobalDrawer(null);
                        setIsInspectorCollapsed(false);
                        handleAddMessage();
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-rose-50/70 border border-transparent hover:border-rose-200 flex items-center gap-3 text-left transition-all cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0 group-hover:bg-rose-700 group-hover:text-white transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-stone-900 block">Text Paragraph</span>
                        <span className="text-[11px] text-stone-500 block truncate">
                          Add a new invitation message or note to the page
                        </span>
                      </div>
                    </button>

                    {/* Option 2: Images / Photos */}
                    <button
                      type="button"
                      onClick={() => {
                        setAddMenuOpen(false);
                        setAddMenuMode('main');
                        setActiveGlobalDrawer(null);
                        setIsInspectorCollapsed(false);
                        setSelectedElementKey('photos');
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-amber-50/70 border border-transparent hover:border-amber-200 flex items-center gap-3 text-left transition-all cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-stone-900 block">Photos / Images</span>
                        <span className="text-[11px] text-stone-500 block truncate">
                          Upload and add celebration photos to this page
                        </span>
                      </div>
                    </button>

                    {/* Option 3: Feature */}
                    <button
                      type="button"
                      onClick={() => setAddMenuMode('features')}
                      className="w-full p-2.5 rounded-xl hover:bg-purple-50/70 border border-transparent hover:border-purple-200 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0 group-hover:bg-purple-700 group-hover:text-white transition-colors">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-stone-900 block">Feature</span>
                          <span className="text-[11px] text-stone-500 block truncate">
                            Add MP3 song, RSVP, UPI QR, Photos, or Location QR
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-purple-700 shrink-0" />
                    </button>
                  </div>
                ) : (
                  /* FEATURE SELECTION SUB-MENU (Shows only features NOT currently on the page) */
                  (() => {
                    const hasAudio = Boolean(event.bgAudioUrl || event.bgAudioPresetId || event.spotifyUrl);
                    const hasPhotos = Boolean(event.photos && event.photos.length > 0);
                    const hasRsvp = Boolean(event.rsvpConfig?.enabled);
                    const hasUpi = Boolean(event.showUpiQrCode !== false && (event.upiId || event.upiQrImageUrl));
                    const hasLocationQr = Boolean(event.showLocationQrCode && event.googleMapsUrl);

                    const missingFeatures = [
                      !hasAudio && {
                        id: 'audio',
                        title: 'MP3 Song & Background Music',
                        desc: 'Add celebration MP3 autoplay or Spotify song',
                        icon: Music,
                        color: 'bg-rose-50 text-rose-700 border-rose-200',
                        onSelect: () => {
                          handleUpdate({
                            bgAudioPresetId: event.bgAudioPresetId || 'preset_mangala_vadyam',
                            bgAudioTitle: event.bgAudioTitle || 'Auspicious Celebration Melody',
                            musicType: 'mp3',
                          });
                          setSelectedElementKey('audio');
                        },
                      },
                      !hasPhotos && {
                        id: 'photos',
                        title: 'Page Photos & Image Gallery',
                        desc: 'Upload and showcase celebration pictures',
                        icon: ImageIcon,
                        color: 'bg-amber-50 text-amber-700 border-amber-200',
                        onSelect: () => {
                          setSelectedElementKey('photos');
                        },
                      },
                      !hasRsvp && {
                        id: 'rsvp',
                        title: 'Interactive Guest RSVP Form',
                        desc: 'Collect attendance, headcount, meal & custom fields',
                        icon: Heart,
                        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        onSelect: () => {
                          handleUpdateRsvp({ enabled: true });
                          setSelectedElementKey('rsvp');
                        },
                      },
                      !hasUpi && {
                        id: 'upi',
                        title: 'UPI Digital Gifts & QR Scanner',
                        desc: 'Attach custom QR image or enter UPI ID for gifts',
                        icon: QrCode,
                        color: 'bg-purple-50 text-purple-700 border-purple-200',
                        onSelect: () => {
                          handleUpdate({ showUpiQrCode: true });
                          setSelectedElementKey('upi');
                        },
                      },
                      !hasLocationQr && {
                        id: 'locationQr',
                        title: 'Venue Directions Map QR',
                        desc: 'Scannable Google Maps QR code for venue navigation',
                        icon: MapPin,
                        color: 'bg-teal-50 text-teal-700 border-teal-200',
                        onSelect: () => {
                          handleUpdate({ showLocationQrCode: true });
                          setSelectedElementKey('locationQr');
                        },
                      },
                    ].filter(Boolean) as {
                      id: string;
                      title: string;
                      desc: string;
                      icon: typeof Music;
                      color: string;
                      onSelect: () => void;
                    }[];

                    return (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-1.5 py-1 border-b border-stone-100">
                          <button
                            type="button"
                            onClick={() => setAddMenuMode('main')}
                            className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back</span>
                          </button>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                            Add Feature to Page
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setAddMenuOpen(false);
                              setAddMenuMode('main');
                            }}
                            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {missingFeatures.length === 0 ? (
                          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center space-y-1.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                              <Check className="w-4 h-4" />
                            </div>
                            <p className="text-xs font-bold text-emerald-950">
                              All features are already present on this page
                            </p>
                            <p className="text-[11px] text-emerald-800 leading-relaxed">
                              MP3 Music, Photos, RSVP, UPI Gifts, and Venue Map QR are all active. Click any feature directly on the canvas to edit or customize it.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-0.5">
                            {missingFeatures.map((feat) => {
                              const IconComp = feat.icon;
                              return (
                                <button
                                  key={feat.id}
                                  type="button"
                                  onClick={() => {
                                    setAddMenuOpen(false);
                                    setAddMenuMode('main');
                                    setActiveGlobalDrawer(null);
                                    setIsInspectorCollapsed(false);
                                    feat.onSelect();
                                  }}
                                  className="w-full p-2.5 rounded-xl bg-stone-50/80 hover:bg-white border border-stone-200/80 hover:border-rose-300 flex items-center gap-3 text-left transition-all cursor-pointer group shadow-2xs"
                                >
                                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${feat.color}`}>
                                    <IconComp className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <span className="text-xs font-bold text-stone-900 block group-hover:text-rose-700 transition-colors">
                                      {feat.title}
                                    </span>
                                    <span className="text-[10px] text-stone-500 block truncate">
                                      {feat.desc}
                                    </span>
                                  </div>
                                  <Plus className="w-4 h-4 text-stone-400 group-hover:text-rose-700 shrink-0" />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Global Theme & Architecture Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setSelectedElementKey(null);
                setAddMenuOpen(false);
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
                setAddMenuOpen(false);
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
                setAddMenuOpen(false);
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

            {/* Plus (+) Button with Upward Menu for Text, Images, or Missing Features */}
            <button
              type="button"
              onClick={() => {
                setAddMenuMode('main');
                setAddMenuOpen(!addMenuOpen);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 cursor-pointer shrink-0 transition-all ${
                addMenuOpen
                  ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
              }`}
              title="Add Text, Photos, or Features to this page"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
              <ChevronUp className={`w-3 h-3 transition-transform ${addMenuOpen ? 'rotate-180' : ''}`} />
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
            <span>Click any element on canvas to edit</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
