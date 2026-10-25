import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface CreationBottomNavProps {
  onBack: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
  backLabel?: string;
  mobileBackLabel?: string;
  nextLabel?: string;
  mobileNextLabel?: string;
  nextDisabled?: boolean;
}

/**
 * Standardized fixed bottom navigation bar for all Creation steps.
 * Pinned at the bottom with shrink-0, mobile-first responsive sizing,
 * preventing any horizontal cropping or viewport overflow.
 */
export function CreationBottomNav({
  onBack,
  onNext,
  onSaveDraft,
  backLabel = 'Back',
  mobileBackLabel = 'Back',
  nextLabel = 'Move to Next Section',
  mobileNextLabel = 'Next',
  nextDisabled = false,
}: CreationBottomNavProps) {
  return (
    <div className="shrink-0 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-2.5 sm:px-6 sm:py-3.5 z-30 shadow-lg flex items-center justify-between gap-2 w-full max-w-full">
      {/* Left: Back / Exit Button */}
      <button
        type="button"
        onClick={onBack}
        className="px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
      >
        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-stone-600" />
        <span className="hidden sm:inline">{backLabel}</span>
        <span className="sm:hidden">{mobileBackLabel}</span>
      </button>

      {/* Center: Save Draft Button */}
      {onSaveDraft && (
        <button
          type="button"
          onClick={onSaveDraft}
          className="px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50/70 hover:bg-rose-100 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 shrink-0" />
          <span className="hidden xs:inline">Save Draft</span>
          <span className="xs:hidden">Save</span>
        </button>
      )}

      {/* Right: Next / Continue Button */}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="min-w-0 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0 max-w-[50%] sm:max-w-none"
      >
        <span className="hidden sm:inline truncate">{nextLabel}</span>
        <span className="sm:hidden truncate">{mobileNextLabel}</span>
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
      </button>
    </div>
  );
}
