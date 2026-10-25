import { useState, useMemo } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Check 
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

export function PreviewStep({ event, onBack, onNext, onSaveDraft }: PreviewStepProps) {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isBlankCanvas = !event.templateId;

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-6xl mx-auto">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Step 6 of 6</span>
              <span>•</span>
              <span>Final Guest Preview & Share</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-stone-900 truncate">
              {event.title || 'Live Guest Preview'}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5 truncate">
              {event.recipientName || 'Interactive final preview of your published invitation page'}
            </p>
          </div>

          {/* Device Switcher Toggle */}
          <div className="hidden md:flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
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
              <span>Desktop</span>
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
        <div className="flex justify-center bg-stone-900/5 rounded-3xl p-2 sm:p-6 border border-stone-200 overflow-hidden min-h-[520px] max-w-6xl mx-auto">
          <div className={`transition-all duration-300 w-full ${
            deviceMode === 'mobile' 
              ? 'w-full max-w-[340px] sm:max-w-[380px] rounded-[32px] sm:rounded-[40px] border-4 sm:border-[8px] border-stone-900 shadow-2xl overflow-hidden bg-white max-h-[720px] overflow-y-auto mx-auto' 
              : 'max-w-4xl rounded-2xl border border-stone-300 shadow-xl overflow-hidden bg-white max-h-[750px] overflow-y-auto'
          }`}>
            <EventViewer event={livePreviewEvent} deviceMode={deviceMode} isBuilderMode={false} />
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <CreationBottomNav 
        onBack={onBack}
        onNext={onNext}
        onSaveDraft={handleSaveDraftClick}
        backLabel="Back to Hosting"
        mobileBackLabel="Back"
        nextLabel="Finish & Go to Dashboard"
        mobileNextLabel="Done"
      />
    </div>
  );
}
