import { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  Smartphone,
  Monitor
} from 'lucide-react';
import type { LovinglyEvent } from '../../types';
import { EventViewer } from '../Viewer';

interface PreviewStepProps {
  event: LovinglyEvent;
  onBack: () => void;
  onNext: () => void;
}

export function PreviewStep({ event, onBack, onNext }: PreviewStepProps) {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Step 5 of 7</span>
            <span>•</span>
            <span>Live Guest Preview</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Preview How Your Invite Looks to Guests
          </h2>
        </div>

        {/* Device Switcher Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              deviceMode === 'mobile' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Phone</span>
          </button>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              deviceMode === 'desktop' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      {/* Embedded Live Viewer Container */}
      <div className="flex justify-center bg-stone-900/5 rounded-3xl p-4 sm:p-8 border border-stone-200 overflow-hidden min-h-[550px]">
        <div className={`transition-all duration-300 w-full ${
          deviceMode === 'mobile' 
            ? 'max-w-sm rounded-[40px] border-[10px] border-stone-900 shadow-2xl overflow-hidden bg-white max-h-[750px] overflow-y-auto' 
            : 'max-w-4xl rounded-2xl border border-stone-300 shadow-xl overflow-hidden bg-white max-h-[750px] overflow-y-auto'
        }`}>
          <EventViewer event={event} />
        </div>
      </div>

      {/* Sticky Navigation Footer */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs border-t border-stone-200 p-3 sm:p-4 rounded-2xl z-20 shadow-lg flex items-center justify-between gap-2 max-w-full overflow-x-hidden">
        <button
          onClick={onBack}
          className="px-3.5 sm:px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Previous Section</span>
          <span className="sm:hidden">Back</span>
        </button>
        <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider hidden xs:inline">
          Step 5 of 7
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
