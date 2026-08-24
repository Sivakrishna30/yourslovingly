import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutTemplate, 
  Type, 
  Layout, 
  ArrowLeft,
  ArrowRight,
  Eye,
  Check,
  Globe,
  Share2,
  Copy,
  MapPin,
  IndianRupee,
  Music,
  LogIn,
  X,
  Plus,
  Trash2,
  Sparkles,
  Search,
  FileDown,
  Clock,
  QrCode,
  Upload,
  Image,
  Palette
} from 'lucide-react';
import type { User } from 'firebase/auth';
import type { LovinglyEvent, StudioElementKey, StudioElementStyle, FrameType, DecorativeMotif, BackgroundTexture } from '../types';
import { getEventCreatorPath, getEventTypePath } from '../lib/utils';
import { getHostingStatus } from '../lib/hosting';
import { EventViewer } from './Viewer';
import { HostingRenewalModal } from './HostingRenewalModal';
import { StudioInspector } from './StudioInspector';
import { SmartMessageSuggestion } from './SmartMessageSuggestion';
import { 
  FONT_PAIRINGS, 
  filterMasterTemplates,
  type MasterTemplate
} from '../lib/designSystem';

interface EditorProps {
  event: LovinglyEvent;
  user: User | null;
  onSignIn: () => Promise<User | null>;
  onUpdate: (updates: Partial<LovinglyEvent>) => void;
  onPublishAndSave: (event: LovinglyEvent, activeUser: User | null) => Promise<boolean>;
  onExtendHosting?: (updatedEvent: LovinglyEvent) => Promise<void>;
  onBack: () => void;
  onPreview: () => void;
}

type StepKey = 'design' | 'content' | 'features' | 'canvas';

export function EventEditor({ 
  event, 
  user, 
  onSignIn, 
  onUpdate, 
  onPublishAndSave, 
  onExtendHosting,
  onBack,
  onPreview 
}: EditorProps) {
  const [activeTab, setActiveTab] = useState<StepKey>('design');
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('all');
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishStep, setPublishStep] = useState<'cart' | 'success'>('cart');
  const [isHostingModalOpen, setIsHostingModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tmpl-wedding-ivory-botanical');

  // Studio Element Editor State
  const [activeElementKey, setActiveElementKey] = useState<StudioElementKey>('title');

  const stepsList: { id: StepKey; label: string; stepNumber: number; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'design', label: '1. Choose Template', stepNumber: 1, icon: LayoutTemplate },
    { id: 'content', label: '2. Names & Content', stepNumber: 2, icon: Type },
    { id: 'features', label: '3. Features & Tools', stepNumber: 3, icon: Sparkles },
    { id: 'canvas', label: '4. Frames & URL', stepNumber: 4, icon: Palette },
  ];

  const handleUpdateElementStyle = (key: StudioElementKey, styleUpdates: Partial<StudioElementStyle>) => {
    const currentStylesMap = event.elementStyles || {};
    const existingElementStyle = currentStylesMap[key] || {};

    const updatedStylesMap = {
      ...currentStylesMap,
      [key]: {
        ...existingElementStyle,
        ...styleUpdates
      }
    };

    onUpdate({
      elementStyles: updatedStylesMap,
      activeElementKey: key
    });
  };

  const handleApplyMasterTemplate = (template: MasterTemplate) => {
    setSelectedTemplateId(template.id);
    
    // Find matching font pairing
    const fontPairing = FONT_PAIRINGS.find(f => f.id === template.fontPairingId) || FONT_PAIRINGS[0];

    onUpdate({
      eventType: template.category === 'all' ? event.eventType : template.category,
      title: template.defaultTitle,
      recipientName: template.defaultRecipient,
      eventDate: template.defaultDate,
      location: template.defaultLocation,
      messages: template.defaultMessages,
      elements: template.defaultElements,
      primaryColor: template.primaryColor,
      secondaryColor: template.secondaryColor,
      highlightColor: template.highlightColor,
      frameType: template.frameType || 'traditional-marigold-gold',
      decorativeMotif: template.decorativeMotif || 'auspicious-kalash',
      shlokaText: template.shlokaText || '',
      textureType: template.textureType || 'gold-dust',
      spotifyUrl: template.spotifySuggestion || event.spotifyUrl,
      elementStyles: {
        title: { fontFamily: fontPairing.headingFont, animation: template.animations.title },
        recipient: { fontFamily: fontPairing.accentFont },
        messages: { fontFamily: fontPairing.bodyFont },
        details: { animation: template.animations.details },
        photos: { animation: template.animations.photos }
      }
    });
  };

  const hostingInfo = getHostingStatus(event);

  const updateField = <K extends keyof LovinglyEvent>(field: K, value: LovinglyEvent[K]) => {
    onUpdate({ [field]: value });
  };

  const handleAddMessage = (text: string) => {
    onUpdate({ messages: [...event.messages, text] });
  };

  const handleUpdateMessage = (index: number, text: string) => {
    const updated = [...event.messages];
    updated[index] = text;
    onUpdate({ messages: updated });
  };

  const handleRemoveMessage = (index: number) => {
    const updated = event.messages.filter((_, i) => i !== index);
    onUpdate({ messages: updated });
  };

  const handlePublishClick = () => {
    setPublishStep('cart');
    setIsPublishModalOpen(true);
  };

  const handleSignInAndPublish = async () => {
    setPublishing(true);
    await onSignIn();
    setPublishing(false);
  };

  const handlePayAndPublish = async () => {
    if (user) {
      setPublishing(true);
      await onPublishAndSave(event, user);
      setPublishStep('success');
      setPublishing(false);
    }
  };

  const handleConfirmExtension = async (updatedEvent: LovinglyEvent) => {
    if (onExtendHosting) {
      await onExtendHosting(updatedEvent);
    } else {
      onUpdate(updatedEvent);
    }
    setIsHostingModalOpen(false);
  };

  const publicUrl = `${window.location.origin}/${getEventCreatorPath(event, user)}/${getEventTypePath(event)}/${event.slug}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(publicUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPdf = () => {
    const printUrl = `/${getEventCreatorPath(event, user)}/${getEventTypePath(event)}/${event.slug}?print=true`;
    const printWindow = window.open(printUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  };

  const filteredTemplates = filterMasterTemplates(
    templateCategoryFilter === 'all' ? undefined : templateCategoryFilter,
    templateSearch
  );

  return (
    <div className="flex flex-col h-screen bg-stone-100 overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-stone-200 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 z-20 shrink-0">
        <div className="flex items-center justify-between gap-2 max-w-full">
          <div className="flex items-center gap-2 min-w-0 shrink">
            <button 
              onClick={onBack}
              className="p-1.5 sm:p-2 hover:bg-stone-100 text-stone-600 rounded-xl transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-medium shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="h-4 w-px bg-stone-200 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <h1 className="font-serif font-bold text-stone-900 text-xs sm:text-base truncate max-w-[110px] xs:max-w-[150px] sm:max-w-xs md:max-w-md">
                  {event.title || 'Untitled Event'}
                </h1>
                <span className="px-1.5 py-0.5 bg-brand-red/10 text-primary text-[9px] sm:text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0">
                  {event.eventType}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden md:block truncate">
                Predesigned canvas templates • Rich typography & themes • One click publish
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Hosting Status Pill */}
            <button
              onClick={() => setIsHostingModalOpen(true)}
              className="px-2 py-1.5 sm:px-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 shrink-0"
              title="View Hosting Validity & Extension"
            >
              <Clock className={`w-3.5 h-3.5 ${hostingInfo.isExpired ? 'text-primary' : 'text-stone-600'}`} />
              <span className="hidden lg:inline text-stone-600">Hosting:</span>
              <span className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] sm:text-[10px] uppercase tracking-wider ${hostingInfo.badgeBg} ${hostingInfo.badgeBorder}`}>
                {hostingInfo.isLifetime ? 'Lifetime' : `${hostingInfo.daysRemaining}d`}
              </span>
            </button>

            {event.isPublished && (
              <button 
                onClick={handleExportPdf}
                className="p-2 sm:px-3 sm:py-2 bg-stone-100 text-stone-700 hover:bg-brand-teal/5 hover:text-secondary hover:border-brand-teal/20 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 shrink-0"
                title="Export as PDF to print physical cards and flyers"
              >
                <FileDown className="w-4 h-4 text-secondary" />
                <span className="hidden md:inline">Export PDF</span>
              </button>
            )}

            <button 
              onClick={() => {
                onPreview();
                setMobileView('preview');
              }}
              className="p-2 sm:px-3 sm:py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 shrink-0"
              title="Full Screen Preview"
            >
              <Eye className="w-4 h-4 text-secondary" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            <button 
              onClick={handlePublishClick}
              className="px-2.5 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-brand-red/20 flex items-center gap-1.5 shrink-0"
            >
              <Globe className="w-4 h-4" />
              <span className="inline">Publish</span>
              <span className="hidden sm:inline">& Share</span>
            </button>
          </div>
        </div>

        {/* Mobile View Toggle Bar (Edit Form vs Live Preview) */}
        <div className="flex md:hidden items-center mt-2 pt-2 border-t border-stone-100 gap-2">
          <div className="flex-1 bg-stone-100 p-1 rounded-xl border border-stone-200 flex text-xs">
            <button
              type="button"
              onClick={() => setMobileView('editor')}
              className={`flex-1 py-1.5 px-3 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mobileView === 'editor'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              Edit Details
            </button>
            <button
              type="button"
              onClick={() => setMobileView('preview')}
              className={`flex-1 py-1.5 px-3 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mobileView === 'preview'
                  ? 'bg-white text-secondary shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-secondary" />
              Live Preview
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar Controls */}
        <aside className={`w-full md:w-[420px] lg:w-[440px] bg-white border-r border-stone-200 flex flex-col z-10 shrink-0 shadow-sm ${mobileView === 'editor' ? 'flex' : 'hidden md:flex'}`}>
          {/* Multi-step Guided Navigation Tabs Bar */}
          <nav className="flex border-b border-stone-200 bg-stone-50/80 p-1.5 gap-1 overflow-x-auto no-scrollbar">
            {stepsList.map((step) => {
              const isActive = activeTab === step.id;
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`flex-1 min-w-0 py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                    isActive 
                      ? 'bg-white text-secondary shadow-xs border border-stone-200/80 ring-1 ring-secondary/20' 
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0 text-secondary" />
                  <span className="truncate">{step.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Form Content Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            <AnimatePresence mode="wait">
              {/* STEP 1: CHOOSE PREDESIGNED COMPLETE CANVAS TEMPLATES */}
              {activeTab === 'design' && (
                <motion.div 
                  key="design"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-5"
                >
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3.5 rounded-2xl border border-emerald-200/70">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                        Step 1: Choose a Master Template
                      </h3>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Select any complete predesigned canvas design below. It fills ready-to-use dummy names, wordings, layouts, and typography which you can customize in the next step!
                    </p>
                  </div>

                  {/* Category Filter Pills & Search */}
                  <div className="space-y-2.5">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input 
                        type="text"
                        placeholder="Search wedding, birthday, griha pravesh..."
                        value={templateSearch}
                        onChange={(e) => setTemplateSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-secondary outline-none transition-all"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
                      {[
                        { id: 'all', label: 'All Templates' },
                        { id: 'wedding', label: '💍 Wedding' },
                        { id: 'birthday', label: '🎂 Birthday' },
                        { id: 'engagement', label: '🥂 Engagement' },
                        { id: 'housewarming', label: '🏡 Housewarming' },
                        { id: 'baby-shower', label: '👶 Baby' },
                        { id: 'anniversary', label: '🎉 Anniversary' },
                        { id: 'business-card', label: '🎴 Business Card' },
                        { id: 'flyer', label: '📄 Flyer & Pamphlet' },
                        { id: 'portfolio', label: '🎨 Portfolio' }
                      ].map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setTemplateCategoryFilter(cat.id)}
                          className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition-all ${
                            templateCategoryFilter === cat.id
                              ? 'bg-secondary text-white font-bold shadow-xs'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Predesigned Template Cards Grid */}
                  <div className="grid grid-cols-1 gap-4">
                    {filteredTemplates.map((tmpl) => {
                      const isSelected = selectedTemplateId === tmpl.id || event.title === tmpl.defaultTitle;
                      
                      const elementIcons: Record<string, string> = {
                        rings: '💍 Rings',
                        flowers: '🌸 Flowers',
                        sparkles: '✨ Sparkles',
                        music: '🎵 Music',
                        champagne: '🥂 Toast',
                        hearts: '❤️ Hearts',
                        stars: '⭐ Stars',
                        balloons: '🎈 Balloons',
                        confetti: '🎊 Confetti',
                        cake: '🎂 Cake',
                        ribbon: '🎀 Ribbon'
                      };

                      return (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => handleApplyMasterTemplate(tmpl)}
                          className={`p-4 rounded-2xl border transition-all text-left group flex flex-col gap-3 relative overflow-hidden ${
                            isSelected 
                              ? 'border-secondary bg-teal-50/40 ring-2 ring-secondary/20 shadow-md' 
                              : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                                  {tmpl.categoryLabel}
                                </span>
                                <span className="text-[10px] font-bold text-accent">
                                  {tmpl.badge}
                                </span>
                              </div>
                              <h4 className="font-serif font-bold text-base text-stone-900 group-hover:text-secondary transition-colors truncate">
                                {tmpl.name}
                              </h4>
                              <p className="text-xs text-stone-500 line-clamp-1">
                                {tmpl.tagline}
                              </p>
                            </div>

                            <div className="shrink-0 flex items-center gap-1">
                              {isSelected ? (
                                <span className="px-3 py-1.5 bg-secondary text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-2xs">
                                  <Check className="w-3.5 h-3.5" /> Selected
                                </span>
                              ) : (
                                <span className="px-3 py-1.5 bg-stone-100 group-hover:bg-stone-200 text-stone-600 text-xs font-bold rounded-full transition-colors">
                                  Use Template
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Template Elements & Ornaments Chips */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            {tmpl.defaultElements && tmpl.defaultElements.length > 0 && tmpl.defaultElements.map((elemKey) => (
                              <span 
                                key={elemKey} 
                                className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-full text-[10px] font-medium flex items-center gap-1"
                              >
                                {elementIcons[elemKey] || elemKey}
                              </span>
                            ))}
                            {tmpl.frameType && (
                              <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-full text-[10px] font-medium">
                                🖼️ {tmpl.frameType.replace(/-/g, ' ')}
                              </span>
                            )}
                            {tmpl.decorativeMotif && (
                              <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-full text-[10px] font-medium">
                                🪷 {tmpl.decorativeMotif.replace(/-/g, ' ')}
                              </span>
                            )}
                          </div>

                          {/* Live Visual Card Snippet with Elements & Dummy Content */}
                          <div 
                            className="p-3.5 rounded-xl border border-stone-200/80 flex flex-col items-center justify-center text-center space-y-1.5 relative shadow-inner"
                            style={{ 
                              backgroundColor: tmpl.secondaryColor || '#FAFAFA',
                              borderLeft: `5px solid ${tmpl.primaryColor}`
                            }}
                          >
                            {tmpl.shlokaText && (
                              <span 
                                className="text-[10px] font-serif font-bold italic tracking-wide"
                                style={{ color: tmpl.highlightColor || tmpl.primaryColor }}
                              >
                                {tmpl.shlokaText}
                              </span>
                            )}
                            <span 
                              className="text-sm font-serif font-bold tracking-tight"
                              style={{ color: tmpl.primaryColor }}
                            >
                              {tmpl.defaultTitle}
                            </span>
                            <span className="text-[11px] text-stone-600 italic truncate max-w-[300px]">
                              {tmpl.defaultRecipient}
                            </span>
                            <div className="w-16 h-px bg-stone-300 my-0.5" />
                            <span className="text-[10px] text-stone-500 font-medium truncate max-w-[300px]">
                              📍 {tmpl.defaultLocation}
                            </span>

                            {/* Color Palette Dots */}
                            <div className="flex items-center gap-1.5 pt-1">
                              <span className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs" style={{ backgroundColor: tmpl.primaryColor }} title="Primary Color" />
                              <span className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs" style={{ backgroundColor: tmpl.highlightColor }} title="Accent / Highlight" />
                              <span className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-2xs" style={{ backgroundColor: tmpl.secondaryColor }} title="Background Surface" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Step 1 Next Button */}
                  <div className="pt-4 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('content')}
                      className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-brand-red/20 flex items-center justify-center gap-2"
                    >
                      <span>Next: Edit Names & Content</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: NAMES, DATES, MESSAGES & PHOTOS */}
              {activeTab === 'content' && (
                <motion.div 
                  key="content"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-5"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3.5 rounded-2xl border border-blue-200/70">
                    <div className="flex items-center gap-2 mb-1">
                      <Type className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                        Step 2: Customize Names, Words & Gallery
                      </h3>
                    </div>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      Replace the dummy names and venue with your actual details. You can also pick smart message blessings or upload photos.
                    </p>
                  </div>

                  {/* Main Event Title */}
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                      Main Event Title / Names
                    </label>
                    <input 
                      type="text"
                      value={event.title}
                      placeholder="e.g. Aarav & Meera or Rahul is Turning 30!"
                      onChange={(e) => updateField('title', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-secondary transition-all outline-none font-serif font-bold text-stone-900"
                    />
                  </div>

                  {/* Subtitle or Recipient */}
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                      Subtitle / Inviting Family / Recipient
                    </label>
                    <input 
                      type="text"
                      value={event.recipientName || ''}
                      placeholder="e.g. Together with their families or Dear Family and Friends"
                      onChange={(e) => updateField('recipientName', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-secondary transition-all outline-none"
                    />
                  </div>

                  {/* Date & Location Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                        Event Date (Optional)
                      </label>
                      <input 
                        type="date"
                        value={event.eventDate || ''}
                        onChange={(e) => updateField('eventDate', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-secondary transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                        Venue / Location (Optional)
                      </label>
                      <input 
                        type="text"
                        value={event.location || ''}
                        placeholder="e.g. The Grand Palace, Chennai"
                        onChange={(e) => updateField('location', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-secondary transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Smart Message Generator */}
                  <SmartMessageSuggestion 
                    pageType={event.eventType || 'wedding'} 
                    onApplyMessage={(text) => handleAddMessage(text)} 
                  />

                  {/* Message Blocks List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                        Custom Invitation Wordings ({event.messages.length})
                      </label>
                      <button 
                        type="button"
                        onClick={() => handleAddMessage('')}
                        className="text-xs text-secondary hover:text-secondary/90 font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Message Block
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {event.messages.map((msg, i) => (
                        <div key={i} className="flex gap-2 items-start bg-stone-50 p-2 rounded-xl border border-stone-200">
                          <textarea 
                            value={msg}
                            rows={2}
                            placeholder="Type invitation paragraph..."
                            onChange={(e) => handleUpdateMessage(i, e.target.value)}
                            className="flex-1 p-2 bg-white border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-secondary transition-all outline-none resize-none leading-relaxed"
                          />
                          <button 
                            type="button"
                            onClick={() => handleRemoveMessage(i)}
                            className="p-2 text-stone-400 hover:text-primary transition-colors"
                            title="Remove message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Event Photos & Gallery Images */}
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <Image className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Event Photos & Gallery Images</span>
                      </label>
                      <span className="text-[10px] font-bold text-stone-500">
                        {(event.photos || []).length} photo{(event.photos || []).length === 1 ? '' : 's'}
                      </span>
                    </div>

                    {(event.photos || []).length > 0 && (
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {(event.photos || []).map((imgUrl, idx) => (
                          <div key={idx} className="relative group rounded-lg overflow-hidden border border-stone-200 aspect-square bg-stone-100">
                            <img src={imgUrl} alt={`Event photo ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (event.photos || []).filter((_, i) => i !== idx);
                                updateField('photos', updated);
                              }}
                              className="absolute top-1 right-1 p-1 bg-stone-900/80 hover:bg-red-600 text-white rounded-md text-[10px] transition-colors"
                              title="Remove photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <label className="flex items-center justify-center gap-2 p-2.5 bg-white hover:bg-stone-100 border border-dashed border-stone-300 hover:border-blue-400 rounded-xl text-xs font-bold text-stone-700 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span>Upload Event Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (reader.result) {
                                updateField('photos', [...(event.photos || []), reader.result as string]);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Step 2 Back / Next Buttons */}
                  <div className="flex items-center gap-2 pt-4 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('design')}
                      className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('features')}
                      className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-brand-red/20 flex items-center justify-center gap-2"
                    >
                      <span>Next: Features & Tools</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: FEATURES & INTERACTIVE TOOLS */}
              {activeTab === 'features' && (
                <motion.div 
                  key="features"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-5"
                >
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3.5 rounded-2xl border border-purple-200/70">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wide">
                        Step 3: Add Interactive Tools & Features
                      </h3>
                    </div>
                    <p className="text-[11px] text-purple-800 leading-relaxed">
                      Enable one-click Google Maps navigation, auto location QR generator, Spotify music embeds, UPI gift collections, and passcode security.
                    </p>
                  </div>

                  {/* 1. Google Maps Direction Link */}
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                    <label className="block text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-accent shrink-0" />
                      <span>Google Maps Directions Link</span>
                    </label>
                    <input 
                      type="url"
                      value={event.googleMapsUrl || ''}
                      placeholder="https://maps.google.com/?q=..."
                      onChange={(e) => updateField('googleMapsUrl', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-secondary transition-all outline-none"
                    />
                    <p className="text-[10px] text-stone-500 leading-tight">
                      Guests can tap once to launch GPS directions to your venue.
                    </p>

                    {/* Location QR Code Generator */}
                    <div className="pt-2 border-t border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                          <QrCode className="w-3.5 h-3.5 text-secondary" />
                          <span>Venue Directions QR Code</span>
                        </label>
                        <input
                          type="checkbox"
                          checked={!!event.showLocationQrCode}
                          disabled={!event.googleMapsUrl}
                          onChange={(e) => updateField('showLocationQrCode', e.target.checked)}
                          className="w-4 h-4 accent-secondary rounded cursor-pointer disabled:opacity-50"
                        />
                      </div>
                      <p className="text-[10px] text-stone-500">
                        Displays a scannable QR code on the live event page and in printed PDF invitations.
                      </p>
                    </div>
                  </div>

                  {/* 2. Spotify Background Music Player */}
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Music className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Spotify Background Music (Song or Playlist)</span>
                    </label>
                    <input 
                      type="url"
                      value={event.spotifyUrl || ''}
                      placeholder="https://open.spotify.com/track/..."
                      onChange={(e) => updateField('spotifyUrl', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-secondary transition-all outline-none"
                    />
                    <p className="text-[10px] text-stone-500 leading-tight">
                      Embeds an interactive Spotify player so visitors can listen to your celebration melody.
                    </p>
                  </div>

                  {/* 3. UPI Gift & QR Code Module */}
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-purple-950 flex items-center gap-1.5">
                        <IndianRupee className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>UPI Shagun & Gift Collection</span>
                      </label>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                        Pro Feature
                      </span>
                    </div>

                    <div className="space-y-2">
                      <input 
                        type="text"
                        value={event.upiId || ''}
                        placeholder="UPI ID (e.g. yourname@upi)"
                        onChange={(e) => updateField('upiId', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                      />

                      {event.upiQrImageUrl ? (
                        <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
                          <img src={event.upiQrImageUrl} alt="UPI QR" className="w-12 h-12 object-contain bg-white rounded border" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-stone-800 truncate">Custom QR Screenshot Uploaded</p>
                            <button
                              type="button"
                              onClick={() => updateField('upiQrImageUrl', '')}
                              className="text-[10px] text-red-600 font-bold hover:underline"
                            >
                              Remove custom QR image
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 p-2 bg-white hover:bg-stone-100 border border-dashed border-stone-300 rounded-xl text-xs font-bold text-stone-700 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5 text-purple-600" />
                          <span>Upload GPay / PhonePe QR Screenshot</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  updateField('upiQrImageUrl', reader.result as string);
                                  updateField('showUpiQrCode', true);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Step 3 Back / Next Buttons */}
                  <div className="flex items-center gap-2 pt-4 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('content')}
                      className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('canvas')}
                      className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-brand-red/20 flex items-center justify-center gap-2"
                    >
                      <span>Next: Frames & URL</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: ORNAMENTS, FRAMES, MOTIFS & URL */}
              {activeTab === 'canvas' && (
                <motion.div 
                  key="canvas"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-5"
                >
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3.5 rounded-2xl border border-amber-200/70">
                    <div className="flex items-center gap-2 mb-1">
                      <Palette className="w-4 h-4 text-amber-600" />
                      <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                        Step 4: Frames, Motifs & URL
                      </h3>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Customize your decorative frame, auspicious shloka blessing, sacred center motif, background texture, and custom shareable link.
                    </p>
                  </div>

                  {/* Traditional & Floral Decorative Frames */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center justify-between">
                      <span>Floral & Traditional Frames</span>
                      <span className="text-[10px] text-amber-700 font-semibold">High Definition Vector</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'grand-rangoli-mandala', label: '🌸 Grand Rangoli Arch' },
                        { id: 'grand-kolam-heritage', label: '✨ Royal Kolam Heritage' },
                        { id: 'royal-rose-garden', label: '🌹 Grand Royal Rose' },
                        { id: 'royal-peacock-crest-frame', label: '🦚 Royal Peacock Crest' },
                        { id: 'banana-leaf-traditional', label: '🌿 Traditional Banana Leaf' },
                        { id: 'luxury-damask', label: '👑 Luxury Gilded Damask' },
                        { id: 'traditional-marigold-gold', label: '🪷 Royal Marigold Toran' },
                        { id: 'royal-rajasthani-mandap', label: '🏰 Rajasthani Mandap' },
                        { id: 'south-temple-arch', label: '🛕 Temple Gopuram Arch' },
                        { id: 'botanical-peony-gold', label: '🌸 Peony & Gold Arch' },
                        { id: 'vintage-eucalyptus-wreath', label: '🌿 Eucalyptus Wreath' },
                        { id: 'art-deco-geometric', label: '✨ Art Deco Geometric' },
                        { id: 'baby-pastel-floral', label: '🍼 Baby Pastel Floral' },
                        { id: 'modern-minimal-filigree', label: '📐 Modern Filigree' }
                      ].map((f) => {
                        const isCurrent = (event.frameType || 'grand-rangoli-mandala') === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => updateField('frameType', f.id as FrameType)}
                            className={`p-2 rounded-xl text-left text-xs font-bold transition-all border ${
                              isCurrent
                                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            <span className="truncate block">{f.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Auspicious Blessing Header */}
                  <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Auspicious Blessing & Top Header
                    </label>
                    <input 
                      type="text" 
                      value={event.shlokaText || ''}
                      placeholder="e.g. In The Presence Of Divine Grace or Together With Their Families"
                      onChange={(e) => updateField('shlokaText', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-serif font-bold text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        'In The Presence Of Divine Grace',
                        'With The Blessings Of Our Ancestors',
                        'Cordially Invites You To Celebrate',
                        'Together With Their Families',
                        'Two Souls, One Forever Love',
                        'A Joyful New Beginning',
                        'Welcome Little Star ✨'
                      ].map((blessing) => (
                        <button
                          key={blessing}
                          type="button"
                          onClick={() => updateField('shlokaText', blessing)}
                          className="px-2 py-0.5 bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-400 rounded text-[10px] text-stone-600 hover:text-amber-800 transition-colors"
                        >
                          {blessing}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Decorative Center Motifs */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                      Sacred & Decorative Motifs
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'grand-rangoli-center', label: '🌸 Grand Rangoli Mandala' },
                        { id: 'auspicious-kalash', label: '🪷 Auspicious Kalash' },
                        { id: 'ganesha-minimal', label: '🕉️ Sacred Emblem' },
                        { id: 'royal-peacock', label: '🦚 Royal Peacock' },
                        { id: 'temple-bells', label: '🔔 Temple Bells' },
                        { id: 'brass-diya', label: '🪔 Brass Diya' },
                        { id: 'sacred-lotus', label: '🌸 Sacred Lotus' },
                        { id: 'botanical-rose-wreath', label: '🌹 Rose Wreath' },
                        { id: 'gilded-rings', label: '💍 Gilded Rings' },
                        { id: 'monogram-crest', label: '👑 Royal Crest' },
                        { id: 'cradle-baby', label: '🍼 Baby Cradle' },
                        { id: 'sparkle-burst', label: '✨ Sparkle Burst' }
                      ].map((m) => {
                        const isCurrent = (event.decorativeMotif || 'grand-rangoli-center') === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => updateField('decorativeMotif', m.id as DecorativeMotif)}
                            className={`p-2 rounded-xl text-left text-xs font-medium transition-all border ${
                              isCurrent
                                ? 'bg-amber-600 text-white border-amber-700 font-bold shadow-xs'
                                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            <span className="truncate block">{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Background Luxury Textures */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                      Luxury Background Texture
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'rangoli-mandala', label: '🌸 Rangoli Mandala' },
                        { id: 'royal-kolam', label: '✨ Royal Kolam' },
                        { id: 'gold-dust', label: '✨ Gold Dust' },
                        { id: 'jali-lattice', label: '🕌 Jaali Lattice' },
                        { id: 'floral-damask', label: '🌸 Floral Damask' },
                        { id: 'parchment', label: '📜 Parchment' },
                        { id: 'none', label: '🚫 Clean None' }
                      ].map((t) => {
                        const isCurrent = (event.textureType || 'rangoli-mandala') === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => updateField('textureType', t.id as BackgroundTexture)}
                            className={`p-2 rounded-xl text-center text-xs font-medium transition-all border ${
                              isCurrent
                                ? 'bg-amber-600 text-white border-amber-700 font-bold shadow-xs'
                                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            <span className="truncate block">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom URL Slug */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                      Custom URL Slug
                    </label>
                    <div className="flex items-center bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs">
                      <span className="text-stone-400 font-mono">/yours-lovingly/</span>
                      <input 
                        type="text" 
                        value={event.slug}
                        onChange={(e) => updateField('slug', e.target.value)}
                        className="flex-1 bg-transparent border-none font-bold text-stone-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Step 4 Back & Publish Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('features')}
                      className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePublishClick}
                      className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-brand-red/20 flex items-center justify-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Publish & Share Online</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Right Interactive Live Preview Frame */}
        <main className={`flex-1 relative bg-stone-200/80 overflow-y-auto p-2 sm:p-6 md:p-8 flex flex-col items-center justify-start lg:justify-center gap-4 ${mobileView === 'preview' ? 'flex' : 'hidden md:flex'}`}>
          {/* Detailed Studio Element Inspector Toolbar */}
          <div className="w-full max-w-3xl xl:max-w-4xl mx-auto z-10 shrink-0">
            <StudioInspector 
              activeElementKey={activeElementKey}
              event={event}
              onSelectElement={(key) => setActiveElementKey(key)}
              onUpdateElementStyle={handleUpdateElementStyle}
              onUpdateEvent={(updates) => onUpdate({ ...event, ...updates })}
            />
          </div>

          <div className="w-full max-w-3xl xl:max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-stone-200 overflow-hidden min-h-[85vh] my-auto">
            <EventViewer 
              event={event} 
              isBuilderMode={true}
              activeElementKey={activeElementKey}
              onSelectElementKey={(key) => setActiveElementKey(key)}
              onUpdateEvent={(updates) => onUpdate({ ...event, ...updates })}
            />
          </div>
        </main>
      </div>

      {/* Hosting Renewal Modal */}
      {isHostingModalOpen && (
        <HostingRenewalModal
          event={event}
          onClose={() => setIsHostingModalOpen(false)}
          onConfirmExtension={handleConfirmExtension}
        />
      )}

      {/* Publish Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-100 relative">
            <button 
              onClick={() => setIsPublishModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            {publishStep === 'cart' ? (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-brand-red/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
                    Ready to Publish & Share?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Publish your customized digital event invitation to generate your permanent link, live RSVP dashboard, and scannable QR code.
                  </p>
                </div>

                <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-stone-700">Digital Event Microsite</span>
                    <span className="font-bold text-stone-900">Free Included</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-stone-700">Location GPS & Auto QR</span>
                    <span className="font-bold text-stone-900">Active</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-stone-700">Spotify Music & RSVP Tracking</span>
                    <span className="font-bold text-stone-900">Included</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {!user ? (
                    <button
                      onClick={handleSignInAndPublish}
                      disabled={publishing}
                      className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-brand-red/20 flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In with Google to Save</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePayAndPublish}
                      disabled={publishing}
                      className="w-full py-3.5 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-brand-teal/20 flex items-center justify-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      <span>{publishing ? 'Publishing...' : 'Publish & Save Now'}</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-5">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-2xl text-stone-900">Your Invitation is Live!</h3>
                  <p className="text-xs text-stone-600">Share your digital invitation or export printable assets.</p>
                </div>

                {/* QR Code */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 inline-block mx-auto">
                  <img src={qrCodeUrl} alt="QR Code" className="w-28 h-28 mx-auto rounded-lg shadow-xs" />
                  <p className="text-[10px] text-stone-500 font-mono mt-1">Scan for Mobile View</p>
                </div>

                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-2">
                  <span className="text-xs text-stone-600 truncate font-mono">{publicUrl}</span>
                  <button 
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleExportPdf}
                    className="py-2.5 px-3 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Export PDF</span>
                  </button>
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent('You are lovingly invited! View here: ' + publicUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-stone-100">
                  <button 
                    onClick={() => window.open(publicUrl, '_blank')}
                    className="flex-1 py-3 bg-secondary text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Live Invitation</span>
                  </button>
                  <button 
                    onClick={() => setIsPublishModalOpen(false)}
                    className="flex-1 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl text-xs sm:text-sm hover:bg-stone-200 transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
