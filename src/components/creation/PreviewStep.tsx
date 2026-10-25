import { useState, useMemo } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Check, 
  ArrowRight,
  Eye
} from 'lucide-react';
import type { LovinglyEvent } from '../../types';
import { EventViewer } from '../Viewer';
import { CreationBottomNav } from './CreationBottomNav';

interface PreviewStepProps {
  event: LovinglyEvent;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
}

export function PreviewStep({ 
  event, 
  onBack, 
  onNext, 
  onSaveDraft 
}: PreviewStepProps) {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isBlankCanvas = !event.templateId;

  // Active Premium Features Detection for quick info badge
  const activeFeatures = useMemo(() => {
    const list: string[] = [];
    if (event.rsvpConfig?.enabled) list.push('Interactive RSVP');
    if (event.upiId || event.upiQrImageUrl) list.push('UPI Shagun QR');
    if (event.password && event.password.trim() !== '') list.push('4-Digit Security PIN');
    if (event.showLocationQrCode) list.push('Location QR');
    if (event.bgAudioUrl) list.push('Audio Soundtrack');
    if (event.spotifyUrl) list.push('Spotify Player');
    return list;
  }, [event]);

  // Live Preview Event
  const livePreviewEvent: LovinglyEvent = useMemo(() => {
    return {
      ...event,
      ...(isBlankCanvas ? {
        primaryColor: (event.primaryColor && event.primaryColor !== '#881337') ? event.primaryColor : '#1c1917',
        secondaryColor: (event.secondaryColor && event.secondaryColor !== '#fff1f2') ? event.secondaryColor : '#ffffff',
        frameType: event.frameType || 'none',
        decorativeMotif: event.decorativeMotif || 'none',
        textureType: event.textureType || 'none',
        elements: [],
      } : {}),
      title: event.title?.trim() || 'Event Title',
      recipientName: event.recipientName?.trim() || (isBlankCanvas ? '' : 'Host / Subtitle'),
      eventDate: event.eventDate?.trim() || 'Date & Time',
      location: event.location?.trim() || 'Venue Location',
      messages: (event.messages && event.messages.some(m => m && m.trim()))
        ? event.messages.filter(m => m && m.trim())
        : []
    };
  }, [event, isBlankCanvas]);

  const handleSaveDraftClick = () => {
    if (onSaveDraft) {
      onSaveDraft();
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden w-full max-w-full">
      {/* Scrollable Preview Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 lg:p-8 space-y-6 max-w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-5xl mx-auto">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Step 5 of 6</span>
              <span>•</span>
              <span>Live Guest Preview</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-stone-900 truncate">
              {event.title || 'Live Guest Preview'}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5 truncate">
              {event.recipientName || 'Interactive guest preview • Inspect your page before publishing'}
            </p>
          </div>

          {/* Device Switcher Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200 self-stretch sm:self-auto justify-center">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                deviceMode === 'mobile' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-rose-600" />
              <span>Mobile Phone</span>
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                deviceMode === 'desktop' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-rose-600" />
              <span>Desktop View</span>
            </button>
          </div>
        </div>

        {/* Save Draft Toast */}
        {saveSuccess && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 max-w-xl mx-auto">
            <Check className="w-4 h-4 text-emerald-200" />
            <span>Draft Saved Successfully! You can resume anytime from your Dashboard.</span>
          </div>
        )}

        {/* Embedded Live Viewer Container */}
        <div className="flex justify-center bg-stone-900/5 rounded-3xl p-2 sm:p-6 border border-stone-200 overflow-hidden min-h-[480px] max-w-5xl mx-auto">
          <div className={`transition-all duration-300 w-full ${
            deviceMode === 'mobile' 
              ? 'w-full max-w-[340px] sm:max-w-[380px] rounded-[32px] sm:rounded-[40px] border-4 sm:border-[8px] border-stone-900 shadow-2xl overflow-hidden bg-white max-h-[700px] overflow-y-auto mx-auto' 
              : 'max-w-4xl rounded-2xl border border-stone-300 shadow-xl overflow-hidden bg-white max-h-[720px] overflow-y-auto'
          }`}>
            <EventViewer event={livePreviewEvent} deviceMode={deviceMode} isBuilderMode={false} />
          </div>
        </div>

        {/* Informational Guidance Callout Below Preview */}
        <div className="max-w-4xl mx-auto bg-stone-50 border border-stone-200 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800">Preview Inspection</span>
              {activeFeatures.length > 0 && (
                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                  {activeFeatures.length} active features
                </span>
              )}
            </div>
            <p className="text-xs text-stone-600">
              Satisfied with your invitation preview? Proceed to Step 6 to verify your account's Free Page credits, manage features, and launch your live link.
            </p>
          </div>

          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
          >
            <span>Proceed to Step 6: Launch Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <CreationBottomNav 
        onBack={onBack}
        onNext={onNext}
        onSaveDraft={handleSaveDraftClick}
        backLabel="Back to Features"
        mobileBackLabel="Back"
        nextLabel="Continue to Hosting & Launch (Step 6)"
        mobileNextLabel="Launch Hub"
      />
    </div>
  );
}
