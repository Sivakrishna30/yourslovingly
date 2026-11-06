import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'subtle' | 'pill';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running inside standalone PWA window, suppress button
  if (isInstalled) {
    return null;
  }

  // Handle Chrome / Edge / Android native install flow
  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  const buttonContent = (
    <>
      <Download className="w-3.5 h-3.5 text-rose-600 shrink-0" />
      <span className="hidden sm:inline">Install App</span>
      <span className="sm:hidden">Install</span>
    </>
  );

  return (
    <>
      {isInstallable ? (
        <button
          type="button"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={
            className ||
            `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              variant === 'pill'
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                : 'bg-stone-900 text-white hover:bg-stone-800'
            }`
          }
          title="Add Yours Lovingly to your home screen or desktop as a native app"
        >
          {buttonContent}
        </button>
      ) : isIOS ? (
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={
            className ||
            `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              variant === 'pill'
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                : 'bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200'
            }`
          }
          title="Install on iPhone / iPad"
        >
          {buttonContent}
        </button>
      ) : null}

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-xs">
              <Download className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">Install Yours Lovingly</h3>
              <p className="text-xs text-stone-500 mt-1">
                Install as a full-screen native app on your iPhone or iPad with offline speed.
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 text-left space-y-3 text-xs text-stone-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-stone-200 flex items-center justify-center shrink-0 font-bold text-[11px] text-stone-700">
                  1
                </div>
                <div>
                  Tap the <strong className="text-stone-900 inline-flex items-center gap-1">Share <Share2 className="w-3.5 h-3.5 text-stone-600 inline" /></strong> button in the Safari bottom bar.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-stone-200 flex items-center justify-center shrink-0 font-bold text-[11px] text-stone-700">
                  2
                </div>
                <div>
                  Scroll down and tap <strong className="text-stone-900 inline-flex items-center gap-1">Add to Home Screen <PlusSquare className="w-3.5 h-3.5 text-stone-600 inline" /></strong>.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-stone-200 flex items-center justify-center shrink-0 font-bold text-[11px] text-stone-700">
                  3
                </div>
                <div>
                  Tap <strong className="text-stone-900">Add</strong> at top right. Launch from your home screen anytime!
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Got it</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
