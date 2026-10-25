/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import type { LovinglyEvent, StudioElementKey, StudioElementStyle } from '../types';
import { elementGlyphs, designStyles } from '../lib/constants';
import { MapPin, MessageSquare, IndianRupee, Music, Sparkles, Check, Heart, Printer, Lock, ShieldCheck, Unlock, ExternalLink, Gift, Copy, Volume2, VolumeX, Play, Pause, Disc, X } from 'lucide-react';
import { firebaseService } from '../lib/firebase-service';
import { hasWatermark } from '../lib/hosting';
import { DecorativeFrame, DecorativeMotifBadge, DecorativeDivider, BackgroundTextureOverlay } from './DecorativeOrnaments';
import { getPresetAudioUrl } from '../lib/audioPresets';

export interface ViewerProps {
  event: LovinglyEvent;
  onUpdateEvent?: (updates: Partial<LovinglyEvent>) => void;
  activeElementKey?: StudioElementKey | null;
  onSelectElementKey?: (key: StudioElementKey | null) => void;
  isBuilderMode?: boolean;
  disableAutoplay?: boolean;
  isCompact?: boolean;
  deviceMode?: 'mobile' | 'desktop';
}

export function EventViewer({
  event,
  activeElementKey,
  onSelectElementKey,
  onUpdateEvent,
  isBuilderMode = false,
  disableAutoplay = false,
  isCompact = false,
  deviceMode
}: ViewerProps) {
  const isMobile = deviceMode === 'mobile';
  // RSVP State
  const storageKey = `rsvp_${event.slug}`;
  const [rsvpSubmitted, setRsvpSubmitted] = useState<boolean>(() => {
    return !!localStorage.getItem(storageKey);
  });
  const [storedGuestName, setStoredGuestName] = useState<string>(() => {
    return localStorage.getItem(storageKey + '_name') || '';
  });
  const [storedAttending, setStoredAttending] = useState<boolean>(() => {
    return localStorage.getItem(storageKey + '_attending') !== 'false';
  });

  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState<boolean>(true);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [submittingRsvp, setSubmittingRsvp] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Transaction / Gift Recording State
  const txStorageKey = `lovingly_tx_${event.slug}`;
  const [txSenderName, setTxSenderName] = useState('');
  const [txAmount, setTxAmount] = useState<string>('');
  const [txRef, setTxRef] = useState('');
  const [txNote, setTxNote] = useState('');
  const [submittingTx, setSubmittingTx] = useState(false);
  const [txSubmitError, setTxSubmitError] = useState<string | null>(null);
  const [txSubmitted, setTxSubmitted] = useState<boolean>(() => {
    return localStorage.getItem(txStorageKey) === 'true';
  });
  const [upiCopied, setUpiCopied] = useState(false);

  // Celebration Background MP3 Audio State & Autoplay
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isWidgetHidden, setIsWidgetHidden] = useState(false);
  const isAudioMutedRef = useRef(isAudioMuted);

  useEffect(() => {
    isAudioMutedRef.current = isAudioMuted;
    if (audioRef.current) {
      audioRef.current.muted = isAudioMuted;
    }
  }, [isAudioMuted]);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const hasBackgroundAudio = !!(event.bgAudioUrl || event.bgAudioPresetId);

  useEffect(() => {
    let isCancelled = false;
    let localAudio: HTMLAudioElement | null = null;

    async function initAudio() {
      let audioUrl = event.bgAudioUrl;
      if (!audioUrl && event.bgAudioPresetId) {
        try {
          audioUrl = await getPresetAudioUrl(event.bgAudioPresetId);
        } catch {
          audioUrl = '';
        }
      }

      if (isCancelled) return;

      if (!audioUrl) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        setIsAudioPlaying(false);
        return;
      }

      const audio = new Audio(audioUrl);
      localAudio = audio;
      audioRef.current = audio;
      audio.muted = isAudioMutedRef.current;

      const startSec = event.bgAudioStart || 0;
      const endSec = event.bgAudioEnd || 0;

      const handleTimeUpdate = () => {
        if (endSec && endSec > startSec && audio.currentTime >= endSec) {
          audio.currentTime = startSec;
          audio.play().catch(() => {});
        }
      };

      const handleEnded = () => {
        audio.currentTime = startSec;
        audio.play().catch(() => setIsAudioPlaying(false));
      };

      audio.addEventListener('loadedmetadata', () => {
        audio.currentTime = startSec;
      });
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      audio.currentTime = startSec;

      const shouldAutoplay = event.bgAudioAutoPlay !== false && !disableAutoplay && !isCompact;

      if (!shouldAutoplay) {
        setIsAudioPlaying(false);
        return;
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!isCancelled) {
              setIsAudioPlaying(true);
              setAutoplayBlocked(false);
            }
          })
          .catch(() => {
            if (isCancelled) return;
            setAutoplayBlocked(true);
            const handleFirstGesture = () => {
              if (audioRef.current) {
                audioRef.current.play()
                  .then(() => {
                    setIsAudioPlaying(true);
                    setAutoplayBlocked(false);
                  })
                  .catch(() => {});
              }
              window.removeEventListener('click', handleFirstGesture);
              window.removeEventListener('touchstart', handleFirstGesture);
              window.removeEventListener('scroll', handleFirstGesture);
              window.removeEventListener('keydown', handleFirstGesture);
            };

            window.addEventListener('click', handleFirstGesture, { once: true });
            window.addEventListener('touchstart', handleFirstGesture, { once: true });
            window.addEventListener('scroll', handleFirstGesture, { once: true });
            window.addEventListener('keydown', handleFirstGesture, { once: true });
          });
      }
    }

    initAudio();

    return () => {
      isCancelled = true;
      if (localAudio) {
        localAudio.pause();
        localAudio = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [event.bgAudioUrl, event.bgAudioPresetId, event.bgAudioStart, event.bgAudioEnd, event.bgAudioAutoPlay, disableAutoplay, isCompact]);

  const toggleAudioPlay = async () => {
    let audio = audioRef.current;

    if (!audio) {
      let audioUrl = event.bgAudioUrl;
      if (!audioUrl && event.bgAudioPresetId) {
        try {
          audioUrl = await getPresetAudioUrl(event.bgAudioPresetId);
        } catch {
          audioUrl = '';
        }
      }

      if (!audioUrl) return;

      audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.muted = isAudioMutedRef.current;

      const startSec = event.bgAudioStart || 0;
      const endSec = event.bgAudioEnd || 0;

      const handleTimeUpdate = () => {
        if (endSec && endSec > startSec && audio && audio.currentTime >= endSec) {
          audio.currentTime = startSec;
          audio.play().catch(() => {});
        }
      };

      const handleEnded = () => {
        if (audio) {
          audio.currentTime = startSec;
          audio.play().catch(() => setIsAudioPlaying(false));
        }
      };

      audio.addEventListener('loadedmetadata', () => {
        if (audio) audio.currentTime = startSec;
      });
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      audio.currentTime = startSec;
    }

    if (isAudioPlaying) {
      audio.pause();
      setIsAudioPlaying(false);
    } else {
      try {
        const startSec = event.bgAudioStart || 0;
        if (audio.currentTime === 0 && startSec > 0) {
          audio.currentTime = startSec;
        }
        await audio.play();
        setIsAudioPlaying(true);
        setAutoplayBlocked(false);
      } catch (err) {
        console.warn('Failed to play audio:', err);
        setIsAudioPlaying(false);
      }
    }
  };

  const toggleAudioMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isAudioMuted;
    audioRef.current.muted = nextMuted;
    setIsAudioMuted(nextMuted);
  };

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txSenderName.trim()) {
      setTxSubmitError('Please enter your name');
      return;
    }
    const numAmount = parseFloat(txAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setTxSubmitError('Please enter a valid gift amount in ₹');
      return;
    }

    setSubmittingTx(true);
    setTxSubmitError(null);
    try {
      await firebaseService.submitTransaction(event.slug, {
        slug: event.slug,
        senderName: txSenderName.trim(),
        amount: numAmount,
        upiId: event.upiId || '',
        transactionRef: txRef.trim() || undefined,
        note: txNote.trim() || undefined
      });
      localStorage.setItem(txStorageKey, 'true');
      setTxSubmitted(true);
    } catch (err) {
      console.error('Transaction submit error:', err);
      setTxSubmitError('Could not log transaction. Please try again.');
    } finally {
      setSubmittingTx(false);
    }
  };

  const handleCopyUpi = () => {
    if (event.upiId) {
      navigator.clipboard.writeText(event.upiId);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    }
  };

  // Check if watermark should be shown (Free Starter and ₹49 Extra Basic pages include watermarks)
  const pageHasWatermark = hasWatermark(event);
  const passcodeStorageKey = `unlocked_${event.slug}`;
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (!event.isPasscodeProtected || !event.passcode) return true;
    return localStorage.getItem(passcodeStorageKey) === event.passcode;
  });
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === event.passcode?.trim()) {
      localStorage.setItem(passcodeStorageKey, event.passcode || '');
      setIsUnlocked(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  // Record page view on load and check for auto print query parameter
  useEffect(() => {
    if (event.slug && !isCompact && !event.slug.startsWith('sample-')) {
      firebaseService.recordPageView(event.slug);
    }

    if (typeof window !== 'undefined' && !isCompact) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('print') === 'true') {
        setTimeout(() => {
          window.print();
        }, 800);
      }
    }
  }, [event.slug, isCompact]);

  // Find design style details or default to botanical rose
  const styleInfo = useMemo(() => {
    return designStyles.find(s => s.id === event.designStyle) || designStyles[0];
  }, [event.designStyle]);

  // Compute Spotify embed URL
  const spotifyEmbedUrl = useMemo(() => {
    if (!event.spotifyUrl) return null;
    try {
      const url = new URL(event.spotifyUrl);
      if (!url.hostname.includes('spotify.com')) return null;
      let path = url.pathname;
      if (!path.startsWith('/embed')) path = '/embed' + path;
      return `https://open.spotify.com${path}${url.search}`;
    } catch {
      return null;
    }
  }, [event.spotifyUrl]);

  // Clean title without lone ampersands
  const displayTitle = useMemo(() => {
    return (event.title || '').replace(/\s+&\s+/g, ' and ');
  }, [event.title]);

  const displayRecipient = useMemo(() => {
    return (event.recipientName || '').replace(/\s+&\s+/g, ' and ');
  }, [event.recipientName]);

  const handlePrint = () => {
    window.print();
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setSubmitError('Please enter your name');
      return;
    }

    setSubmittingRsvp(true);
    setSubmitError(null);
    try {
      await firebaseService.submitRSVP(event.slug, {
        slug: event.slug,
        eventId: event.id,
        ownerId: event.ownerId,
        guestName: guestName.trim(),
        attending,
        guestCount: attending ? Number(guestCount) : 0,
        phone: phone.trim() || undefined,
        note: note.trim() || undefined,
      });

      localStorage.setItem(storageKey, 'true');
      localStorage.setItem(storageKey + '_name', guestName.trim());
      localStorage.setItem(storageKey + '_attending', String(attending));

      setStoredGuestName(guestName.trim());
      setStoredAttending(attending);
      setRsvpSubmitted(true);
    } catch (err) {
      console.error('Failed to submit RSVP', err);
      setSubmitError('Unable to record RSVP. Please try again.');
    } finally {
      setSubmittingRsvp(false);
    }
  };

  // Stable seed for floating glyphs
  const elements = useMemo(() => {
    const seed = event.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pseudoRandom = (offset: number) => {
      const x = Math.sin(seed + offset) * 10000;
      return x - Math.floor(x);
    };

    return (event.elements || []).map((el, i) => ({
      glyph: elementGlyphs[el] || '✨',
      top: `${pseudoRandom(i * 10) * 100}%`,
      left: `${pseudoRandom(i * 20) * 100}%`,
      delay: `${pseudoRandom(i * 30) * 5}s`,
      duration: `${3 + pseudoRandom(i * 40) * 5}s`
    }));
  }, [event.id, event.elements]);

  const getElementStyle = (key: StudioElementKey) => {
    const style: StudioElementStyle = (event.elementStyles && event.elementStyles[key]) || {};
    const isSelected = isBuilderMode && activeElementKey === key;
    const isLocked = !!style.isLocked;
    const animClass = style.animation && style.animation !== 'none' ? `anim-${style.animation}` : '';

    const customStyle: React.CSSProperties = {
      fontFamily: style.fontFamily || undefined,
      color: style.color || undefined,
      backgroundColor: style.backgroundColor && style.backgroundColor !== 'transparent' ? style.backgroundColor : undefined,
      borderColor: style.borderColor || undefined,
      borderStyle: style.borderStyle || undefined,
      borderRadius: style.borderRadius !== undefined ? `${style.borderRadius}px` : undefined,
      paddingTop: style.paddingY !== undefined ? `${style.paddingY}px` : undefined,
      paddingBottom: style.paddingY !== undefined ? `${style.paddingY}px` : undefined,
      paddingLeft: style.paddingX !== undefined ? `${style.paddingX}px` : undefined,
      paddingRight: style.paddingX !== undefined ? `${style.paddingX}px` : undefined,
      maxWidth: style.width !== undefined ? `${style.width}%` : undefined,
      transform: style.offsetX ? `translateX(${style.offsetX}px) translateY(${style.offsetY || 0}px)` : (style.offsetY ? `translateY(${style.offsetY}px)` : undefined),
      textAlign: style.align || undefined,
      margin: '0 auto'
    };

    return { style, isSelected, isLocked, animClass, customStyle };
  };

  const getOrder = (key: string) => {
    if (!event.elementOrder) {
      const base = ['title', 'recipient'];
      event.messages?.forEach((_, i) => base.push(`message_${i}`));
      base.push('spotify');
      event.photos?.forEach((_, i) => base.push(`photo_${i}`));
      base.push('details', 'locationQr', 'upiQr');
      return base.indexOf(key) !== -1 ? base.indexOf(key) : 99;
    }
    const idx = event.elementOrder.indexOf(key);
    return idx !== -1 ? idx : 99;
  };

  if (!isUnlocked) {
    return (
      <div 
        className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6"
        style={{ backgroundColor: event.secondaryColor || styleInfo.secondary }}
      >
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 text-center space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
              Private Event Lock
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              {event.title || 'Private Celebration'}
            </h2>
            <p className="text-xs text-stone-600">
              This invitation page is passcode protected by the host. Please enter the passcode to unlock and view event details, photos, & wishes.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Passcode / PIN"
                value={passcodeInput}
                onChange={(e) => {
                  setPasscodeInput(e.target.value);
                  setPasscodeError(false);
                }}
                className={`w-full px-4 py-3 bg-stone-50 border rounded-xl text-center font-mono font-bold text-lg tracking-widest focus:ring-2 focus:ring-teal-500 transition-all outline-none ${
                  passcodeError ? 'border-red-400 bg-red-50 text-red-900' : 'border-stone-200 text-stone-900'
                }`}
              />
              {passcodeError && (
                <p className="text-xs text-red-600 font-medium mt-1.5">
                  Incorrect passcode. Please verify with the event host.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Unlock Event Page
            </button>
          </form>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Passcode Access Control by Yours Lovingly</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => {
        if (isBuilderMode && onSelectElementKey) {
          onSelectElementKey(null);
        }
      }}
      className={`${
        isCompact 
          ? 'w-full relative overflow-hidden flex flex-col items-center' 
          : 'min-h-screen w-full relative selection:bg-brand-red/10 selection:text-primary overflow-x-hidden print:bg-white print:min-h-0 print:p-0 flex flex-col items-center justify-center'
      }`}
      style={{ backgroundColor: event.secondaryColor || styleInfo.secondary }}
    >
      {/* Export as PDF / Print Action for Visitors (Premium only, published only) */}
      {!isCompact && event.isPublished && !hasWatermark(event) && (
        <div className="absolute top-4 right-4 z-30 print:hidden">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-white/90 backdrop-blur-md hover:bg-white text-stone-700 hover:text-secondary rounded-full border border-stone-200 shadow-xs text-xs font-bold transition-all flex items-center gap-1.5 hover:scale-105"
            title="Export as PDF or print physical cards, flyers, and pamphlets"
          >
            <Printer className="w-3.5 h-3.5 text-secondary" />
            <span className="hidden sm:inline">Export PDF / Print</span>
            <span className="sm:hidden">Print</span>
          </button>
        </div>
      )}

      {/* Floating Elements (strictly bounded inside canvas, hidden in compact preview) */}
      {!isCompact && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0 print:hidden">
          {elements.map((el, i) => (
            <div 
              key={i}
              className="absolute animate-pulse text-4xl"
              style={{ 
                top: el.top, 
                left: el.left,
                animationDelay: el.delay,
                animationDuration: el.duration
              }}
            >
              {el.glyph}
            </div>
          ))}
        </div>
      )}

      {/* Main Inner Frame / Designer Card Wrapper */}
      <div className={`relative max-w-4xl mx-auto w-full z-10 print:py-2 print:px-0 print:max-w-none ${
        isCompact ? 'px-1.5 py-1.5' : (isMobile ? 'px-2 py-3' : 'px-3 sm:px-6 py-6 sm:py-8 md:py-14')
      }`}>
        <DecorativeFrame
          frameType={event.frameType || 'traditional-marigold-gold'}
          primaryColor={event.primaryColor || styleInfo.primary}
          accentColor={event.highlightColor || '#D4AF37'}
          secondaryColor={event.secondaryColor || styleInfo.secondary}
          className="shadow-2xl print:shadow-none"
          isCompact={isCompact || isMobile}
        >
          <div 
            className={`rounded-2xl sm:rounded-3xl relative overflow-hidden print:p-6 ${
              isCompact 
                ? 'p-2.5 sm:p-3.5 space-y-2 text-center' 
                : (isMobile ? 'p-3.5 sm:p-5 space-y-4 text-center' : 'p-4 sm:p-8 md:p-14 space-y-6 sm:space-y-10 md:space-y-12')
            }`}
            style={{
              backgroundColor: event.secondaryColor || '#FFFDF7',
              color: event.primaryColor || styleInfo.primary || '#1c1917'
            }}
          >
            <BackgroundTextureOverlay texture={event.textureType || 'gold-dust'} />

            {/* Shloka / Auspicious Blessing Header if present */}
            {event.shlokaText && (() => {
              const quoteElem = getElementStyle('quote');
              return (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isBuilderMode && onSelectElementKey) {
                      onSelectElementKey(quoteElem.isSelected ? null : 'quote');
                    }
                  }}
                  style={{ ...quoteElem.customStyle, order: getOrder('quote') }}
                  className={`relative z-10 text-center pt-1 transition-all rounded-xl p-1.5 ${
                    isBuilderMode ? 'cursor-pointer hover:ring-2 hover:ring-rose-400' : ''
                  } ${
                    quoteElem.isSelected ? 'ring-2 ring-rose-600 ring-offset-2 bg-rose-50/20' : ''
                  }`}
                >
                  {isBuilderMode && quoteElem.isSelected && (
                    <>
                      <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -top-3.5 left-2 px-2 py-0.5 bg-rose-700 text-white text-[9px] font-bold rounded-full shadow-md flex items-center gap-1 z-30 pointer-events-none">
                        Quote / Tagline
                      </span>
                    </>
                  )}
                  <p 
                    contentEditable={isBuilderMode && quoteElem.isSelected}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      if (onUpdateEvent) {
                        onUpdateEvent({ shlokaText: e.currentTarget.textContent || '' });
                      }
                    }}
                    className={`font-serif font-bold uppercase outline-none ${
                      isCompact ? 'tracking-wider text-[10px] sm:text-[11px]' : 'tracking-widest text-xs sm:text-sm md:text-base'
                    }`}
                    style={{ 
                      color: quoteElem.style.color || event.primaryColor || styleInfo.primary,
                      fontSize: quoteElem.style.fontSize ? `${quoteElem.style.fontSize}px` : undefined,
                      fontFamily: quoteElem.style.fontFamily || undefined
                    }}
                  >
                    {event.shlokaText}
                  </p>
                  <div className={`${isCompact ? 'mt-1' : 'mt-2'} flex justify-center`}>
                    <DecorativeDivider styleType="paisley" color={event.highlightColor || '#D4AF37'} />
                  </div>
                </div>
              );
            })()}

            {(() => {
              const motifElem = getElementStyle('motif');
              return (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isBuilderMode && onSelectElementKey) {
                      onSelectElementKey(motifElem.isSelected ? null : 'motif');
                    }
                  }}
                  className={`flex flex-col items-center ${isCompact ? 'gap-1' : 'gap-4'} text-center relative z-10 p-2 rounded-2xl transition-all ${
                    isBuilderMode ? 'cursor-pointer hover:ring-2 hover:ring-rose-400' : ''
                  } ${
                    motifElem.isSelected ? 'ring-2 ring-rose-600 ring-offset-2 bg-rose-50/20' : ''
                  }`}
                >
                  {isBuilderMode && motifElem.isSelected && (
                    <>
                      <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -top-3.5 left-2 px-2 py-0.5 bg-rose-700 text-white text-[9px] font-bold rounded-full shadow-md flex items-center gap-1 z-30 pointer-events-none">
                        Center Element
                      </span>
                    </>
                  )}
                  <DecorativeMotifBadge 
                    motif={event.decorativeMotif || (event.eventType === 'wedding' ? 'auspicious-kalash' : 'sacred-lotus')}
                    primaryColor={event.primaryColor || styleInfo.primary}
                    accentColor={event.highlightColor || '#D4AF37'}
                    size={isCompact ? 'sm' : 'md'}
                  />
                </div>
              );
            })()}
            
            <div className={`flex flex-col ${isCompact ? 'gap-2 max-w-lg' : isMobile ? 'gap-4 sm:gap-6 max-w-md' : 'gap-8 md:gap-12 max-w-2xl'} mx-auto w-full relative z-10`}>
            {/* Main Title Element */}
            {(() => {
              const titleElem = getElementStyle('title');
              return (
                <motion.div 
                  key={`title_${titleElem.style.offsetX || 0}_${titleElem.style.offsetY || 0}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isBuilderMode && onSelectElementKey) {
                      onSelectElementKey(titleElem.isSelected ? null : 'title');
                    }
                  }}
                  drag={isBuilderMode && titleElem.isSelected && !titleElem.isLocked}
                  dragMomentum={false}
                  onDragEnd={(_, info: any) => {
                    if (isBuilderMode && onUpdateEvent) {
                      const currentStylesMap = event.elementStyles || {};
                      const existingStyle = currentStylesMap['title'] || {};
                      onUpdateEvent({
                        elementStyles: {
                          ...currentStylesMap,
                          title: {
                            ...existingStyle,
                            offsetX: (existingStyle.offsetX || 0) + info.offset.x,
                            offsetY: (existingStyle.offsetY || 0) + info.offset.y
                          }
                        }
                      });
                    }
                  }}
                  style={{ ...titleElem.customStyle, order: getOrder('title') }}
                  className={`relative transition-all duration-300 rounded-xl ${isCompact ? 'p-1' : 'p-2'} text-center w-full ${
                    titleElem.animClass
                  } ${
                    isBuilderMode ? 'cursor-pointer hover:ring-2 hover:ring-rose-400' : ''
                  } ${
                    titleElem.isSelected ? 'ring-2 ring-rose-600 ring-offset-2 bg-rose-50/20' : ''
                  }`}
                >
                  {isBuilderMode && titleElem.isSelected && (
                    <>
                      <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -top-3.5 left-2 px-2 py-0.5 bg-rose-700 text-white text-[9px] font-bold rounded-full shadow-md flex items-center gap-1 z-30 pointer-events-none">
                        {titleElem.isLocked ? <Lock className="w-2.5 h-2.5 text-brand-yellow" /> : <Sparkles className="w-2.5 h-2.5" />}
                        Event Title
                      </span>
                    </>
                  )}
                  <h1 
                    contentEditable={isBuilderMode && titleElem.isSelected}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      if (onUpdateEvent) {
                        onUpdateEvent({ title: e.currentTarget.textContent || '' });
                      }
                    }}
                    className={`${
                      isCompact 
                        ? 'text-lg sm:text-xl leading-snug' 
                        : isMobile 
                          ? 'text-2xl sm:text-3xl leading-snug' 
                          : 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight'
                    } font-serif font-bold tracking-tight break-words outline-none`}
                    style={{ 
                      color: titleElem.style.color || event.primaryColor || styleInfo.primary,
                      fontSize: titleElem.style.fontSize ? `${titleElem.style.fontSize}px` : undefined,
                      fontFamily: titleElem.style.fontFamily || undefined
                    }}
                  >
                    {displayTitle || 'Untitled Event'}
                  </h1>
                </motion.div>
              );
            })()}

            {/* Recipient / Subtitle Element */}
            {displayRecipient && (() => {
              const recElem = getElementStyle('recipient');
              return (
                <motion.div 
                  key={`rec_${recElem.style.offsetX || 0}_${recElem.style.offsetY || 0}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isBuilderMode && onSelectElementKey) {
                      onSelectElementKey(recElem.isSelected ? null : 'recipient');
                    }
                  }}
                  drag={isBuilderMode && recElem.isSelected && !recElem.isLocked}
                  dragMomentum={false}
                  onDragEnd={(_, info: any) => {
                    if (isBuilderMode && onUpdateEvent) {
                      const currentStylesMap = event.elementStyles || {};
                      const existingStyle = currentStylesMap['recipient'] || {};
                      onUpdateEvent({
                        elementStyles: {
                          ...currentStylesMap,
                          recipient: {
                            ...existingStyle,
                            offsetX: (existingStyle.offsetX || 0) + info.offset.x,
                            offsetY: (existingStyle.offsetY || 0) + info.offset.y
                          }
                        }
                      });
                    }
                  }}
                  style={{ ...recElem.customStyle, order: getOrder('recipient') }}
                  className={`relative transition-all duration-300 rounded-xl p-2 text-center w-full ${
                    recElem.animClass
                  } ${
                    isBuilderMode ? 'cursor-pointer hover:ring-2 hover:ring-rose-400' : ''
                  } ${
                    recElem.isSelected ? 'ring-2 ring-rose-600 ring-offset-2 bg-rose-50/20' : ''
                  }`}
                >
                  {isBuilderMode && recElem.isSelected && (
                    <>
                      <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -top-3.5 left-2 px-2 py-0.5 bg-rose-700 text-white text-[9px] font-bold rounded-full shadow-md flex items-center gap-1 z-30 pointer-events-none">
                        {recElem.isLocked ? <Lock className="w-2.5 h-2.5 text-brand-yellow" /> : <Sparkles className="w-2.5 h-2.5" />}
                        Subtitle / Host
                      </span>
                    </>
                  )}
                  <div className={`flex flex-col items-center ${isCompact ? 'gap-1' : 'gap-2'}`}>
                    <span className="h-0.5 w-16 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 rounded-full" />
                    <p 
                      contentEditable={isBuilderMode && recElem.isSelected}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => {
                        if (onUpdateEvent) {
                          onUpdateEvent({ recipientName: e.currentTarget.textContent || '' });
                        }
                      }}
                      className={`${
                        isCompact 
                          ? 'text-xs sm:text-sm' 
                          : isMobile 
                            ? 'text-sm sm:text-base' 
                            : 'text-base sm:text-xl md:text-2xl'
                      } font-medium text-stone-600 italic outline-none`}
                      style={{
                        color: recElem.style.color || undefined,
                        fontSize: recElem.style.fontSize ? `${recElem.style.fontSize}px` : undefined,
                        fontFamily: recElem.style.fontFamily || undefined
                      }}
                    >
                      {displayRecipient}
                    </p>
                  </div>
                </motion.div>
              );
            })()}

            {/* Messages Elements */}
            {event.messages.slice(0, isCompact ? 1 : undefined).map((msg, i) => {
              if (!msg.trim()) return null;
              const key = `message_${i}`;
              const msgElem = getElementStyle(key);
              return (
                <motion.section 
                  key={`${key}_${msgElem.style.offsetX || 0}_${msgElem.style.offsetY || 0}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isBuilderMode && onSelectElementKey) {
                      onSelectElementKey(msgElem.isSelected ? null : key);
                    }
                  }}
                  drag={isBuilderMode && msgElem.isSelected && !msgElem.isLocked}
                  dragMomentum={false}
                  onDragEnd={(_, info: any) => {
                    if (isBuilderMode && onUpdateEvent) {
                      const currentStylesMap = event.elementStyles || {};
                      const existingStyle = currentStylesMap[key] || {};
                      onUpdateEvent({
                        elementStyles: {
                          ...currentStylesMap,
                          [key]: {
                            ...existingStyle,
                            offsetX: (existingStyle.offsetX || 0) + info.offset.x,
                            offsetY: (existingStyle.offsetY || 0) + info.offset.y
                          }
                        }
                      });
                    }
                  }}
                  style={{ ...msgElem.customStyle, order: getOrder(key) }}
                  className={`${
                    isCompact 
                      ? 'text-xs p-1 leading-snug line-clamp-2' 
                      : isMobile 
                        ? 'text-xs sm:text-sm p-2 sm:p-3 leading-relaxed' 
                        : 'prose prose-stone prose-lg sm:prose-xl p-4 leading-relaxed'
                  } max-w-2xl mx-auto text-center font-medium transition-all duration-300 rounded-2xl w-full relative ${
                    msgElem.animClass
                  } ${
                    isBuilderMode ? 'cursor-pointer hover:ring-2 hover:ring-rose-400' : ''
                  } ${
                    msgElem.isSelected ? 'ring-2 ring-rose-600 ring-offset-2 bg-rose-50/20' : ''
                  }`}
                >
                  {isBuilderMode && msgElem.isSelected && (
                    <>
                      <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -top-3.5 left-2 px-2 py-0.5 bg-rose-700 text-white text-[9px] font-bold rounded-full shadow-md flex items-center gap-1 z-30 pointer-events-none">
                        {msgElem.isLocked ? <Lock className="w-2.5 h-2.5 text-brand-yellow" /> : <Sparkles className="w-2.5 h-2.5" />}
                        Message {i + 1}
                      </span>
                    </>
                  )}
                  <p 
                    contentEditable={isBuilderMode && msgElem.isSelected}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      if (onUpdateEvent) {
                        const updated = [...event.messages];
                        updated[i] = e.currentTarget.textContent || '';
                        onUpdateEvent({ messages: updated });
                      }
                    }}
                    className="outline-none"
                    style={{ 
                      color: msgElem.style.color || (event.primaryColor || styleInfo.primary) + 'ee',
                      fontSize: msgElem.style.fontSize ? `${msgElem.style.fontSize}px` : undefined,
                      fontFamily: msgElem.style.fontFamily || undefined
                    }}
                  >
                    {msg.replace(/\s+&\s+/g, ' and ')}
                  </p>
                </motion.section>
              );
            })}

            {/* Celebration Audio Player (MP3 Autoplay or Spotify) */}
            {hasBackgroundAudio ? (
              isCompact ? (
                <div style={{ order: getOrder('spotify') }} className="bg-rose-50/90 rounded-2xl p-2.5 sm:p-3 border border-rose-200 shadow-xs flex items-center justify-between gap-2 text-rose-900 font-bold text-xs w-full">
                  <div className="flex items-center gap-2 truncate">
                    <div className={`w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 ${isAudioPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
                      <Disc className="w-3 h-3" />
                    </div>
                    <span className="truncate">{event.bgAudioTitle || 'Celebration Music'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleAudioPlay}
                    className="px-2.5 py-1 bg-white hover:bg-rose-100 rounded-lg text-rose-700 font-bold text-[11px] border border-rose-200 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {isAudioPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isAudioPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                </div>
              ) : (
                <section style={{ order: getOrder('spotify') }} className="bg-linear-to-r from-rose-50/90 via-amber-50/60 to-rose-50/90 rounded-2xl p-4 sm:p-5 border border-rose-200/80 shadow-xs space-y-3 print:hidden w-full text-left">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-rose-900 font-bold text-xs tracking-wide">
                      <div className={`w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 ${isAudioPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
                        <Disc className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{event.bgAudioTitle || 'Celebration Background Melody'}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-rose-600" />
                      {isAudioPlaying ? 'Playing' : 'Autoplay Audio'}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={toggleAudioMute}
                      className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      title={isAudioMuted ? 'Unmute' : 'Mute'}
                    >
                      {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-600" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{isAudioMuted ? 'Unmute' : 'Mute'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleAudioPlay}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      {isAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isAudioPlaying ? 'Pause' : 'Play Audio'}</span>
                    </button>
                  </div>
                </section>
              )
            ) : spotifyEmbedUrl ? (
              isCompact ? (
                <div style={{ order: getOrder('spotify') }} className="bg-stone-50/90 rounded-2xl p-2.5 sm:p-3 border border-emerald-200 shadow-xs flex items-center justify-center gap-2 text-emerald-800 font-bold text-xs w-full">
                  <Music className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
                  <span className="truncate">Featured Spotify Song: {event.spotifyUrl?.split('/').pop() || 'Celebration Track'}</span>
                </div>
              ) : (
                <section style={{ order: getOrder('spotify') }} className="bg-stone-50/80 rounded-2xl p-4 sm:p-6 border border-stone-200/80 shadow-sm space-y-3 print:hidden w-full">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs tracking-wide">
                    <Music className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span>Featured Spotify Playlist and Music</span>
                  </div>
                  <div className="w-full rounded-xl overflow-hidden shadow-xs border border-stone-200">
                    <iframe
                      src={spotifyEmbedUrl}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="w-full rounded-xl"
                      title="Spotify Music Player"
                    />
                  </div>
                </section>
              )
            ) : null}

            {/* Photos Showcase */}
            {event.photos.map((photo, i) => {
              const key = `photo_${i}`;
              const photoElem = getElementStyle(key);
              return (
                <motion.section 
                  key={`${key}_${photoElem.style.offsetX || 0}_${photoElem.style.offsetY || 0}`}
                  onClick={() => isBuilderMode && onSelectElementKey && onSelectElementKey(key)}
                  drag={isBuilderMode && photoElem.isSelected && !photoElem.isLocked}
                  dragMomentum={false}
                  onDragEnd={(_, info: any) => {
                    if (isBuilderMode && onUpdateEvent) {
                      const currentStylesMap = event.elementStyles || {};
                      const existingStyle = currentStylesMap[key] || {};
                      onUpdateEvent({
                        elementStyles: {
                          ...currentStylesMap,
                          [key]: {
                            ...existingStyle,
                            offsetX: (existingStyle.offsetX || 0) + info.offset.x,
                            offsetY: (existingStyle.offsetY || 0) + info.offset.y
                          }
                        }
                      });
                    }
                  }}
                  style={{ ...photoElem.customStyle, order: getOrder(key) }}
                  className={`relative transition-all duration-300 rounded-2xl p-3 w-full ${
                    photoElem.animClass
                  } ${
                    isBuilderMode ? 'cursor-pointer hover:ring-2 hover:ring-teal-400' : ''
                  } ${
                    photoElem.isSelected ? 'ring-2 ring-teal-500 ring-offset-2 bg-teal-50/20' : ''
                  }`}
                >
                  {isBuilderMode && photoElem.isSelected && (
                    <span className="absolute -top-3 left-2 px-2 py-0.5 bg-teal-800 text-white text-[9px] font-bold rounded-full shadow-xs flex items-center gap-1 z-20">
                      {photoElem.isLocked ? <Lock className="w-2.5 h-2.5 text-amber-300" /> : <Sparkles className="w-2.5 h-2.5" />}
                      Image {i + 1}
                    </span>
                  )}
                  <div className="relative rounded-2xl overflow-hidden shadow-md group border-2 border-amber-100 max-w-full">
                    <img 
                      src={photo} 
                      alt="" 
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.section>
              );
            })}

            {/* Date and Location (Details Element) */}
            {(event.eventDate || event.location) && (() => {
              const detElem = getElementStyle('details');
              const dateElem = getElementStyle('date');
              const venueElem = getElementStyle('venue');
              const locQrElem = getElementStyle('locationQr');
              return (
                <motion.section 
                  key={`details_${detElem.style.offsetX || 0}_${detElem.style.offsetY || 0}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isBuilderMode && onSelectElementKey) {
                      onSelectElementKey(detElem.isSelected ? null : 'details');
                    }
                  }}
                  drag={isBuilderMode && detElem.isSelected && !detElem.isLocked}
                  dragMomentum={false}
                  onDragEnd={(_, info: any) => {
                    if (isBuilderMode && onUpdateEvent) {
                      const currentStylesMap = event.elementStyles || {};
                      const existingStyle = currentStylesMap['details'] || {};
                      onUpdateEvent({
                        elementStyles: {
                          ...currentStylesMap,
                          details: {
                            ...existingStyle,
                            offsetX: (existingStyle.offsetX || 0) + info.offset.x,
                            offsetY: (existingStyle.offsetY || 0) + info.offset.y
                          }
                        }
                      });
                    }
                  }}
                  style={{ ...detElem.customStyle, order: getOrder('details') }}
                  className={`${
                    isCompact 
                      ? 'bg-stone-50/90 rounded-xl p-2.5 border border-amber-200/60 shadow-xs flex flex-col items-center gap-2 text-center' 
                      : isMobile
                        ? 'bg-stone-50/90 rounded-2xl p-4 sm:p-5 border border-amber-200/60 shadow-sm flex flex-col items-center gap-4 text-center'
                        : 'bg-stone-50/90 rounded-2xl p-6 sm:p-10 border border-amber-200/60 shadow-sm flex flex-col items-center gap-8 text-center'
                  } print:bg-white print:border relative transition-all duration-300 w-full ${
                    detElem.animClass
                  } ${
                    isBuilderMode ? 'cursor-pointer hover:ring-2 hover:ring-rose-400' : ''
                  } ${
                    detElem.isSelected ? 'ring-2 ring-rose-600 ring-offset-2 bg-rose-50/20' : ''
                  }`}
                >
                  {isBuilderMode && detElem.isSelected && (
                    <>
                      <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-rose-600 rounded-[2px] shadow-xs z-30 pointer-events-none" />
                      <span className="absolute -top-3.5 left-2 px-2 py-0.5 bg-rose-700 text-white text-[9px] font-bold rounded-full shadow-md flex items-center gap-1 z-30 pointer-events-none">
                        {detElem.isLocked ? <Lock className="w-2.5 h-2.5 text-brand-yellow" /> : <Sparkles className="w-2.5 h-2.5" />}
                        Date & Venue Details
                      </span>
                    </>
                  )}
                  <div className={`${
                    isCompact 
                      ? 'flex flex-col gap-1.5 w-full' 
                      : isMobile 
                        ? 'flex flex-col items-center gap-4 sm:gap-6 w-full' 
                        : 'grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full'
                  }`}>
                    {event.eventDate && (
                      <div className="w-full">
                        <h3 className={`${isCompact ? 'text-[10px] mb-0.5' : isMobile ? 'text-[11px] mb-1' : 'text-xs mb-1'} font-bold uppercase tracking-widest text-amber-800/80`}>When</h3>
                        <p 
                          className={`${
                            isCompact 
                              ? 'text-xs sm:text-sm font-semibold' 
                              : isMobile 
                                ? 'text-sm sm:text-base font-bold' 
                                : 'text-xl sm:text-2xl font-bold'
                          } font-serif text-stone-800`}
                          style={{
                            color: dateElem.style.color || detElem.style.color || undefined,
                            fontFamily: dateElem.style.fontFamily || detElem.style.fontFamily || undefined,
                            fontSize: dateElem.style.fontSize ? `${dateElem.style.fontSize}px` : undefined,
                          }}
                        >
                          {(() => {
                            try {
                              const d = new Date(event.eventDate);
                              if (!isNaN(d.getTime())) {
                                return d.toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                });
                              }
                            } catch {
                              // fallback
                            }
                            return event.eventDate;
                          })()}
                        </p>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex flex-col items-center w-full">
                        <h3 className={`${isCompact ? 'text-[10px] mb-0.5' : isMobile ? 'text-[11px] mb-1' : 'text-xs mb-1'} font-bold uppercase tracking-widest text-amber-800/80`}>Where</h3>
                        {event.googleMapsUrl ? (
                          <a 
                            href={event.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${
                              isCompact 
                                ? 'text-xs font-semibold underline mb-0.5' 
                                : isMobile 
                                  ? 'text-sm sm:text-base font-bold underline mb-2.5' 
                                  : 'text-xl sm:text-2xl font-bold underline mb-3'
                            } font-serif text-stone-900 hover:text-red-700 transition-colors inline-flex items-center justify-center gap-1.5 decoration-amber-300 underline-offset-4 max-w-full text-center px-1 break-words`}
                            style={{
                              color: venueElem.style.color || detElem.style.color || undefined,
                              fontFamily: venueElem.style.fontFamily || detElem.style.fontFamily || undefined,
                              fontSize: venueElem.style.fontSize ? `${venueElem.style.fontSize}px` : undefined,
                            }}
                          >
                            <span className="break-words line-clamp-2 text-center">{event.location}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          </a>
                        ) : (
                          <p 
                            className={`${
                              isCompact 
                                ? 'text-xs font-semibold mb-0.5' 
                                : isMobile 
                                  ? 'text-sm sm:text-base font-bold mb-2.5' 
                                  : 'text-xl sm:text-2xl font-bold mb-3'
                            } font-serif text-stone-800 text-center max-w-full break-words line-clamp-2`}
                            style={{
                              color: venueElem.style.color || detElem.style.color || undefined,
                              fontFamily: venueElem.style.fontFamily || detElem.style.fontFamily || undefined,
                              fontSize: venueElem.style.fontSize ? `${venueElem.style.fontSize}px` : undefined,
                            }}
                          >
                            {event.location}
                          </p>
                        )}

                        {!isCompact && event.googleMapsUrl && (
                          <a 
                            href={event.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full max-w-[280px] mx-auto inline-flex items-center justify-center gap-2 ${
                              isMobile ? 'px-3.5 py-2 text-xs' : 'px-5 py-2.5 text-xs sm:text-sm'
                            } bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-md shadow-red-200/50 print:hidden mb-2 text-center active:scale-95`}
                          >
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span className="truncate">Get Directions on Maps</span>
                          </a>
                        )}

                        {!isCompact && event.showLocationQrCode && event.googleMapsUrl && (
                          <div 
                            onClick={(e) => {
                              if (isBuilderMode && onSelectElementKey) {
                                e.stopPropagation();
                                onSelectElementKey('locationQr');
                              }
                            }}
                            style={locQrElem.customStyle}
                            className={`mt-2 p-2.5 sm:p-3 bg-white rounded-2xl border border-stone-200 shadow-xs inline-flex flex-col items-center gap-1.5 sm:gap-2 print:block relative transition-all duration-300 max-w-[240px] mx-auto ${
                              locQrElem.animClass
                            } ${
                              isBuilderMode ? 'cursor-pointer hover:ring-2 hover:ring-teal-400' : ''
                            } ${
                              locQrElem.isSelected ? 'ring-2 ring-teal-500 ring-offset-2 bg-teal-50/20' : ''
                            }`}
                          >
                            {isBuilderMode && locQrElem.isSelected && (
                              <span className="absolute -top-3 left-2 px-2 py-0.5 bg-teal-800 text-white text-[9px] font-bold rounded-full shadow-xs flex items-center gap-1 z-20">
                                {locQrElem.isLocked ? <Lock className="w-2.5 h-2.5 text-amber-300" /> : <Sparkles className="w-2.5 h-2.5" />}
                                Location Directions QR Code
                              </span>
                            )}
                            <a href={event.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block relative group">
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(event.googleMapsUrl)}`}
                                alt="Location Directions QR Code"
                                className={`${isMobile ? 'w-24 h-24' : 'w-28 h-28'} object-contain rounded-lg border border-stone-100 group-hover:opacity-90 transition-opacity`}
                              />
                            </a>
                            <span className="text-[10px] sm:text-[11px] font-bold text-stone-700 flex items-center justify-center gap-1 text-center">
                              <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                              <span className="truncate">Scan for Venue Directions</span>
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                {/* In-Page RSVP Submission Box */}
                {!isCompact && event.rsvpConfig?.enabled && (
                  <div className="pt-8 border-t border-stone-200/80 w-full text-left print:hidden">
                  <div className="max-w-md mx-auto bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4">
                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-2">
                        <Heart className="w-5 h-5 fill-red-600 text-red-600" />
                      </div>
                      <h3 className="font-serif font-bold text-stone-900 text-lg sm:text-xl">Will You Join Us?</h3>
                      <p className="text-xs text-stone-500">Please confirm your attendance below</p>
                    </div>

                    {rsvpSubmitted ? (
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-emerald-900 text-sm">RSVP Received!</h4>
                          <p className="text-xs text-emerald-700 mt-1">
                            Thank you, <span className="font-bold">{storedGuestName || 'friend'}</span>. Your response (
                            {storedAttending ? 'attending' : 'declined'}) has been saved.
                          </p>
                        </div>

                        {event.whatsappNumber && (
                          <div className="pt-2 border-t border-emerald-200/60">
                            <a
                              href={`https://wa.me/${event.whatsappNumber.replace(/\D/g, '')}?text=Hi! I submitted my RSVP for ${encodeURIComponent(displayTitle)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 text-xs text-emerald-800 font-bold hover:underline"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              Send Personal Wish to Host
                            </a>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setRsvpSubmitted(false)}
                          className="text-[11px] text-stone-500 hover:text-stone-800 underline block mx-auto"
                        >
                          Change my response
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleRsvpSubmit} className="space-y-3.5">
                        {submitError && (
                          <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                            {submitError}
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Your Full Name or Family Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh and Sneha"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-red-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1.5">Attendance Status</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setAttending(true)}
                              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                                attending
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              Attending
                            </button>
                            <button
                              type="button"
                              onClick={() => setAttending(false)}
                              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                                !attending
                                  ? 'bg-stone-800 text-white border-stone-800 shadow-xs'
                                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              Can't Attend
                            </button>
                          </div>
                        </div>

                        {attending && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-bold text-stone-700 mb-1">Total Guests</label>
                              <select
                                value={guestCount}
                                onChange={(e) => setGuestCount(Number(e.target.value))}
                                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-red-500"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                  <option key={n} value={n}>
                                    {n} {n === 1 ? 'Guest' : 'Guests'}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-stone-700 mb-1">Phone (Optional)</label>
                              <input
                                type="tel"
                                placeholder="+91 98765..."
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-red-500 focus:bg-white"
                              />
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Blessing or Personal Note (Optional)</label>
                          <input
                            type="text"
                            placeholder="Warmest wishes..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:border-red-500 focus:bg-white"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submittingRsvp}
                          className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-red-200 transition-all flex items-center justify-center gap-2"
                        >
                          {submittingRsvp ? 'Submitting...' : 'Submit RSVP'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {isCompact && event.rsvpConfig?.enabled && (
                <div className="pt-3 border-t border-stone-200/80 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50/60 py-2 px-3 rounded-xl">
                  <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600 shrink-0" />
                  <span>RSVP & Headcount Tracking Included</span>
                </div>
              )}

                {/* UPI Gift Section & Transaction Form */}
                {!isCompact && (event.upiQrImageUrl || event.upiId) && (() => {
                  const upiElem = getElementStyle('upiQr');
                  return (
                    <div 
                      onClick={() => isBuilderMode && onSelectElementKey && onSelectElementKey('upiQr')}
                      style={upiElem.customStyle}
                      className={`pt-6 sm:pt-8 border-t border-stone-200/80 w-full flex flex-col items-center print:bg-white relative transition-all duration-300 rounded-2xl p-2 sm:p-4 max-w-full overflow-hidden ${
                        upiElem.animClass
                      } ${
                        isBuilderMode ? 'cursor-pointer hover:ring-2 hover:ring-teal-400' : ''
                      } ${
                        upiElem.isSelected ? 'ring-2 ring-teal-500 ring-offset-2 bg-teal-50/20' : ''
                      }`}
                    >
                      {isBuilderMode && upiElem.isSelected && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-teal-800 text-white text-[9px] font-bold rounded-full shadow-xs flex items-center gap-1 z-20">
                          {upiElem.isLocked ? <Lock className="w-2.5 h-2.5 text-amber-300" /> : <Sparkles className="w-2.5 h-2.5" />}
                          UPI Gift & Payment QR
                        </span>
                      )}
                      <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3 sm:mb-4 flex items-center gap-1.5 text-center">
                        <Gift className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>Send Blessings & Digital Gifts</span>
                      </h3>
                      
                      <div className="p-3.5 sm:p-5 bg-white rounded-2xl shadow-sm border border-stone-200/90 flex flex-col items-center gap-3.5 sm:gap-4 max-w-sm w-full text-center overflow-hidden min-w-0">
                        {event.showUpiQrCode !== false && (event.upiQrImageUrl || event.upiId) && (
                          <div className="p-2 bg-stone-50 rounded-xl border border-stone-100 shadow-inner flex flex-col items-center gap-1 max-w-full">
                            <img 
                              src={
                                event.upiQrImageUrl ||
                                `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${event.upiId}&pn=${encodeURIComponent(displayRecipient || displayTitle)}&cu=INR`)}`
                              }
                              alt="UPI QR Code"
                              className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-lg bg-white p-1 border border-stone-200 max-w-full"
                            />
                            <span className="text-[10px] text-stone-500 font-mono">
                              {event.upiQrImageUrl ? 'Scan uploaded QR code' : 'Scan with any UPI App'}
                            </span>
                          </div>
                        )}

                      {event.upiId && (
                        <div className="w-full space-y-2 min-w-0">
                          <div className="flex items-center justify-between gap-1.5 px-2.5 py-2 bg-purple-50/70 border border-purple-200/80 rounded-xl text-xs font-bold text-purple-950 min-w-0 w-full overflow-hidden">
                            <a 
                              href={`upi://pay?pa=${event.upiId}&pn=${encodeURIComponent(displayRecipient || displayTitle)}&cu=INR`}
                              className="flex items-center gap-1.5 hover:underline font-mono min-w-0 overflow-hidden text-left"
                              title={event.upiId}
                            >
                              <IndianRupee className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                              <span className="truncate min-w-0 text-[11px] sm:text-xs text-purple-950">{event.upiId}</span>
                            </a>
                            <button
                              type="button"
                              onClick={handleCopyUpi}
                              className="px-2.5 py-1 bg-white hover:bg-purple-100 border border-purple-200 rounded-lg text-[10px] font-bold text-purple-800 transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0"
                            >
                              <Copy className="w-3 h-3 shrink-0" />
                              <span>{upiCopied ? 'Copied!' : 'Copy'}</span>
                            </button>
                          </div>
                          <p className="text-[10px] text-stone-500">Supports all UPI payment apps</p>
                        </div>
                      )}

                      {/* Record / Confirm Transaction Form */}
                      {!isCompact && (
                        <div className="w-full pt-3 border-t border-stone-100 text-left print:hidden min-w-0">
                        {txSubmitted ? (
                          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1">
                            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1">
                              <Check className="w-4 h-4" />
                            </div>
                            <h4 className="font-bold text-emerald-900 text-xs">Gift Transaction Logged!</h4>
                            <p className="text-[11px] text-emerald-700">
                              Thank you! Your contribution has been recorded for the host and logged in page insights.
                            </p>
                          </div>
                        ) : (
                          <form onSubmit={handleTransactionSubmit} className="space-y-2.5 w-full min-w-0">
                            <p className="text-[11px] font-bold text-stone-700 text-center">
                              Sent a gift? Log transaction details for host:
                            </p>
                            {txSubmitError && (
                              <div className="p-2 bg-red-50 text-red-700 text-[11px] rounded-lg border border-red-200">
                                {txSubmitError}
                              </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full min-w-0">
                              <input
                                type="text"
                                required
                                placeholder="Sender Name *"
                                value={txSenderName}
                                onChange={(e) => setTxSenderName(e.target.value)}
                                className="w-full min-w-0 px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-purple-500 focus:bg-white"
                              />
                              <input
                                type="number"
                                required
                                placeholder="Amount (₹) *"
                                value={txAmount}
                                onChange={(e) => setTxAmount(e.target.value)}
                                className="w-full min-w-0 px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-purple-500 focus:bg-white"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="UPI Txn Ref / UTR (Optional)"
                              value={txRef}
                              onChange={(e) => setTxRef(e.target.value)}
                              className="w-full min-w-0 px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-purple-500 focus:bg-white"
                            />
                            <input
                              type="text"
                              placeholder="Wish / Personal Note (Optional)"
                              value={txNote}
                              onChange={(e) => setTxNote(e.target.value)}
                              className="w-full min-w-0 px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-purple-500 focus:bg-white"
                            />
                            <button
                              type="submit"
                              disabled={submittingTx}
                              className="w-full py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                              <span>{submittingTx ? 'Logging...' : 'Confirm & Log Gift Transaction'}</span>
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                    </div>
                  </div>
                );
              })()}
            </motion.section>
          );
        })()}
          </div>

          {pageHasWatermark && (
            <footer className="pt-6 text-center border-t border-stone-200/40 pb-2 print:hidden">
              <div className="flex items-center justify-center gap-1.5 text-[7px] text-stone-400/80 font-bold uppercase tracking-[0.25em]">
                created with yours lovingly
              </div>
            </footer>
          )}
        </div>
        </DecorativeFrame>
      </div>

      {/* Floating Celebration Melody Player Widget (Autoplay Control) */}
      {hasBackgroundAudio && !isWidgetHidden && (
        <div className="fixed bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-40 print:hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-stone-900/95 backdrop-blur-md text-white border border-stone-700/80 rounded-full pl-3 pr-2 py-1.5 shadow-2xl flex items-center gap-2 sm:gap-2.5 transition-all hover:bg-stone-900">
            {/* Spinning Disc / Sound Wave */}
            <button
              type="button"
              onClick={toggleAudioPlay}
              className="flex items-center gap-2 group cursor-pointer focus:outline-hidden"
              title={isAudioPlaying ? 'Pause celebration melody' : 'Play celebration melody'}
            >
              <div
                className={`w-7 h-7 rounded-full bg-linear-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-xs ${
                  isAudioPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '4s' }}
              >
                <Disc className="w-4 h-4" />
              </div>
              <div className="text-left max-w-[110px] sm:max-w-[160px] truncate">
                <div className="text-[11px] font-bold leading-tight truncate text-stone-100 flex items-center gap-1">
                  {isAudioPlaying && <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />}
                  <span>{event.bgAudioTitle || 'Celebration Music'}</span>
                </div>
                <div className="text-[9px] text-amber-300/80 font-medium tracking-wide">
                  {isAudioPlaying
                    ? 'Autoplay Active'
                    : autoplayBlocked
                    ? 'Tap to play melody'
                    : 'Paused'}
                </div>
              </div>
            </button>

            {/* Play / Pause Toggle Button */}
            <button
              type="button"
              onClick={toggleAudioPlay}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-200 transition-colors cursor-pointer"
              title={isAudioPlaying ? 'Pause' : 'Play'}
            >
              {isAudioPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
            </button>

            {/* Mute Toggle Button */}
            <button
              type="button"
              onClick={toggleAudioMute}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-200 transition-colors cursor-pointer"
              title={isAudioMuted ? 'Unmute' : 'Mute'}
            >
              {isAudioMuted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3" />}
            </button>

            {/* Pause & Hide Widget Button */}
            <button
              type="button"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                }
                setIsAudioPlaying(false);
                setIsWidgetHidden(true);
              }}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-rose-600/80 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer ml-0.5"
              title="Pause and hide music widget"
              aria-label="Pause and hide music player"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
