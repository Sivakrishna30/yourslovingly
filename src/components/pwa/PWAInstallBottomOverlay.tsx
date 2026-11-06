import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, ChevronDown, ChevronUp, X, Share2, PlusSquare, Smartphone, Monitor } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallBottomOverlay: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  // Default to the compact minimized button on the bottom-right; opens full panel only when clicked
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showGuide, setShowGuide] = useState<'ios' | 'browser' | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running inside standalone PWA window, or dismissed, hide completely
  if (isInstalled || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
      return;
    }

    if (isIOS) {
      setShowGuide('ios');
      return;
    }

    setShowGuide('browser');
  };

  return (
    <>
      <aside
        aria-label="Install App"
        className={`fixed bottom-4 right-4 z-40 print:hidden pointer-events-auto ${
          isCollapsed ? 'w-auto' : 'left-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96'
        }`}
      >
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            /* DEFAULT: COLLAPSED MINI-PILL ON BOTTOM RIGHT */
            <motion.div
              key="collapsed-pill"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-end"
            >
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-900/95 hover:bg-stone-900 text-white shadow-xl backdrop-blur-md border border-stone-800 text-xs font-bold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                title="Open Install App options"
              >
                <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center shrink-0">
                  <Download className="w-3 h-3 text-white" />
                </div>
                <span>Install App</span>
                <ChevronUp className="w-3.5 h-3.5 text-stone-400 group-hover:text-white transition-colors" />
              </button>
            </motion.div>
          ) : (
            /* EXPANDED FULL PANEL OVERLAY (Opened only when user clicks Install App) */
            <motion.div
              key="expanded-overlay"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="bg-white/98 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-stone-200/90 ring-1 ring-black/5 space-y-3"
            >
              {/* Header with App Logo, Title, and Collapse/Dismiss */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="/apple-touch-icon.png"
                    alt="Yours Lovingly"
                    className="w-10 h-10 rounded-xl object-cover shadow-xs border border-stone-200/80 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        Install Yours Lovingly
                      </h4>
                      <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold shrink-0">
                        App
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
                      Add to home screen for instant 1-tap launch &amp; offline access
                    </p>
                  </div>
                </div>

                {/* Control buttons: Minimize & Close */}
                <div className="flex items-center gap-1 shrink-0 -mr-1">
                  <button
                    type="button"
                    onClick={() => setIsCollapsed(true)}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Minimize panel"
                    aria-label="Minimize"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDismissed(true)}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Dismiss"
                    aria-label="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inline Quick Instructions & Details */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-600 space-y-1.5">
                {isIOS ? (
                  <>
                    <p className="font-bold text-stone-800 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>Install on iPhone / iPad (Add to Home Screen):</span>
                    </p>
                    <p className="leading-relaxed">
                      1. Tap <strong>Share</strong> in Safari toolbar &rarr; 2. Select <strong>Add to Home Screen</strong> &rarr; 3. Tap <strong>Add</strong>.
                    </p>
                  </>
                ) : isInstallable ? (
                  <>
                    <p className="font-bold text-stone-800 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>Ready to Install on Phone / Device:</span>
                    </p>
                    <p className="leading-relaxed">
                      Tap the button below to add Yours Lovingly directly to your home screen or desktop app launcher.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-stone-800 flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>Install on Phone or Desktop (Add to Home Screen):</span>
                    </p>
                    <p className="leading-relaxed">
                      Tap <strong>Install on Phone / Add to Home Screen</strong> below or use your browser menu (<strong>⋮</strong> &rarr; <strong>Add to Home screen / Install App</strong>).
                    </p>
                  </>
                )}
              </div>

              {/* Action Buttons: Install on Phone / Add to Home Screen & Later */}
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>
                    {isInstalling
                      ? 'Installing...'
                      : isInstallable
                      ? 'Install on Phone / Add to Home Screen'
                      : 'Install on Phone / Add to Home Screen'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  className="py-2.5 px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                >
                  Later
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* Installation Guide Modal (iOS Safari or Desktop Browser Menu) */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-xs">
              {showGuide === 'ios' ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
            </div>

            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">Install Yours Lovingly</h3>
              <p className="text-xs text-stone-500 mt-1">
                {showGuide === 'ios'
                  ? 'Install as a full-screen native app on your iPhone or iPad with offline speed.'
                  : 'Install on your computer or phone to launch like a native app.'}
              </p>
            </div>

            {showGuide === 'ios' ? (
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 text-left space-y-3 text-xs text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-stone-200 flex items-center justify-center shrink-0 font-bold text-[11px] text-stone-700">
                    1
                  </div>
                  <div>
                    Tap the <strong className="text-stone-900 inline-flex items-center gap-1">Share <Share2 className="w-3.5 h-3.5 text-stone-600 inline" /></strong> button in Safari's bottom toolbar.
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
            ) : (
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 text-left space-y-3 text-xs text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-stone-200 flex items-center justify-center shrink-0 font-bold text-[11px] text-stone-700">
                    1
                  </div>
                  <div>
                    In Google Chrome or Microsoft Edge, look for the <strong className="text-stone-900">Install App</strong> icon in your browser's address bar.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-stone-200 flex items-center justify-center shrink-0 font-bold text-[11px] text-stone-700">
                    2
                  </div>
                  <div>
                    Or click browser menu (<strong className="text-stone-900">⋮</strong>) &rarr; <strong className="text-stone-900">Cast, save and share</strong> / <strong className="text-stone-900">Install Yours Lovingly</strong>.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-stone-200 flex items-center justify-center shrink-0 font-bold text-[11px] text-stone-700">
                    3
                  </div>
                  <div>
                    Launch instantly from your desktop, taskbar, or app launcher with fast offline performance!
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(null)}
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
