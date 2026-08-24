/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { LovinglyEvent, StudioElementKey, StudioElementStyle } from '../types';
import { elementGlyphs, designStyles } from '../lib/constants';
import { MapPin, MessageSquare, IndianRupee, Music, Sparkles, Check, Heart, Printer, Lock, ShieldCheck, Unlock, ExternalLink, Gift, Copy } from 'lucide-react';
import { firebaseService } from '../lib/firebase-service';
import { hasWatermark } from '../lib/hosting';
import { DecorativeFrame, DecorativeMotifBadge, DecorativeDivider, BackgroundTextureOverlay } from './DecorativeOrnaments';

export interface ViewerProps {
  event: LovinglyEvent;
  onUpdateEvent?: (updates: Partial<LovinglyEvent>) => void;
  activeElementKey?: StudioElementKey;
  onSelectElementKey?: (key: StudioElementKey) => void;
  isBuilderMode?: boolean;
}

export function EventViewer({
  event,
  activeElementKey,
  onSelectElementKey,
  onUpdateEvent,
  isBuilderMode = false
}: ViewerProps) {
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
    if (event.slug) {
      firebaseService.recordPageView(event.slug);
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('print') === 'true') {
        setTimeout(() => {
          window.print();
        }, 800);
      }
    }
  }, [event.slug]);

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

    return event.elements.map((el, i) => ({
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
      className="min-h-screen w-full relative selection:bg-brand-red/10 selection:text-primary overflow-x-hidden print:bg-white print:min-h-0 print:p-0 flex flex-col items-center justify-center"
      style={{ backgroundColor: event.secondaryColor || styleInfo.secondary }}
    >
      {/* Export as PDF / Print Action for Visitors (Only after published) */}
      {event.isPublished && (
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

      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 z-0 print:hidden">
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

      {/* Main Inner Frame / Designer Card Wrapper */}
      <div className="relative max-w-4xl mx-auto px-3 sm:px-6 py-8 md:py-16 z-10 print:py-2 print:px-0 print:max-w-none">
        <DecorativeFrame
          frameType={event.frameType || 'traditional-marigold-gold'}
          primaryColor={event.primaryColor || styleInfo.primary}
          accentColor={event.highlightColor || '#D4AF37'}
          secondaryColor={event.secondaryColor || styleInfo.secondary}
          className="shadow-2xl print:shadow-none"
        >
          <div 
            className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 space-y-6 sm:space-y-10 md:space-y-12 relative overflow-hidden print:p-6"
            style={{
              backgroundColor: event.secondaryColor || '#FFFDF7',
              color: event.primaryColor || styleInfo.primary || '#1c1917'
            }}
          >
            <BackgroundTextureOverlay texture={event.textureType || 'gold-dust'} />

            {/* Shloka / Auspicious Blessing Header if present */}
            {event.shlokaText && (
              <div className="relative z-10 text-center pt-2">
                <p 
                  className="font-serif font-bold tracking-widest text-xs sm:text-sm md:text-base uppercase"
                  style={{ color: event.primaryColor || styleInfo.primary }}
                >
                  {event.shlokaText}
                </p>
                <div className="mt-2 flex justify-center">
                  <DecorativeDivider styleType="paisley" color={event.highlightColor || '#D4AF37'} />
                </div>
              </div>
            )}

            <div className="flex flex-col items-center gap-4 text-center relative z-10">
              <DecorativeMotifBadge 
                motif={event.decorativeMotif || (event.eventType === 'wedding' ? 'auspicious-kalash' : 'sacred-lotus')}
                primaryColor={event.primaryColor || styleInfo.primary}
                accentColor={event.highlightColor || '#D4AF37'}
                size="md"
              />
            </div>
            
            <div className="flex flex-col gap-8 md:gap-12 max-w-2xl mx-auto w-full relative z-10">
            {/* Main Title Element */}
            {(() => {
              const titleElem = getElementStyle('title');
              return (
                <motion.div 
                  onClick={() => isBuilderMode && onSelectElementKey && onSelectElementKey('title')}
                  drag={isBuilderMode && !titleElem.isLocked}
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
                  className={`relative transition-all duration-300 rounded-xl p-2 text-center w-full ${
                    titleElem.animClass
                  } ${
                    isBuilderMode ? 'cursor-pointer hover:ring-2 hover:ring-primary' : ''
                  } ${
                    titleElem.isSelected ? 'ring-2 ring-primary ring-offset-2 bg-brand-red/5' : ''
                  }`}
                >
                  {isBuilderMode && titleElem.isSelected && (
                    <span className="absolute -top-3 left-2 px-2 py-0.5 bg-primary text-white text-[9px] font-bold rounded-full shadow-xs flex items-center gap-1 z-20">
                      {titleElem.isLocked ? <Lock className="w-2.5 h-2.5 text-brand-yellow" /> : <Sparkles className="w-2.5 h-2.5" />}
                      Main Event Title
                    </span>
                  )}
                  <h1 
                    className="text-3xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight leading-tight break-words"
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
                  onClick={() => isBuilderMode && onSelectElementKey && onSelectElementKey('recipient')}
                  drag={isBuilderMode && !recElem.isLocked}
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
                    isBuilderMode ? 'cursor-pointer hover:ring-2 hover:ring-primary' : ''
                  } ${
                    recElem.isSelected ? 'ring-2 ring-primary ring-offset-2 bg-brand-red/5' : ''
                  }`}
                >
                  {isBuilderMode && recElem.isSelected && (
                    <span className="absolute -top-3 left-2 px-2 py-0.5 bg-primary text-white text-[9px] font-bold rounded-full shadow-xs flex items-center gap-1 z-20">
                      {recElem.isLocked ? <Lock className="w-2.5 h-2.5 text-brand-yellow" /> : <Sparkles className="w-2.5 h-2.5" />}
                      Recipient / Subtitle
                    </span>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <span className="h-0.5 w-16 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 rounded-full" />
                    <p 
                      className="text-lg sm:text-xl md:text-2xl font-medium text-stone-600 italic"
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
            {event.messages.map((msg, i) => {
              if (!msg.trim()) return null;
              const key = `message_${i}`;
              const msgElem = getElementStyle(key);
              return (
                <motion.section 
                  key={key}
                  onClick={() => isBuilderMode && onSelectElementKey && onSelectElementKey(key)}
                  drag={isBuilderMode && !msgElem.isLocked}
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
                  className={`prose prose-stone prose-lg sm:prose-xl max-w-2xl mx-auto text-center leading-relaxed font-medium transition-all duration-300 rounded-2xl p-4 w-full ${
                    msgElem.animClass
                  } ${
                    isBuilderMode ? 'cursor-pointer hover:ring-2 hover:ring-primary' : ''
                  } ${
                    msgElem.isSelected ? 'ring-2 ring-primary ring-offset-2 bg-brand-red/5' : ''
                  }`}
                >
                  {isBuilderMode && msgElem.isSelected && (
                    <span className="absolute -top-3 left-2 px-2 py-0.5 bg-primary text-white text-[9px] font-bold rounded-full shadow-xs flex items-center gap-1 z-20">
                      {msgElem.isLocked ? <Lock className="w-2.5 h-2.5 text-brand-yellow" /> : <Sparkles className="w-2.5 h-2.5" />}
                      Message {i + 1}
                    </span>
                  )}
                  <p 
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

            {/* Spotify Player */}
            {spotifyEmbedUrl && (
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
            )}

            {/* Photos Showcase */}
            {event.photos.map((photo, i) => {
              const key = `photo_${i}`;
              const photoElem = getElementStyle(key);
              return (
                <motion.section 
                  key={key}
                  onClick={() => isBuilderMode && onSelectElementKey && onSelectElementKey(key)}
                  drag={isBuilderMode && !photoElem.isLocked}
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
              const locQrElem = getElementStyle('locationQr');
              return (
                <motion.section 
                  onClick={() => isBuilderMode && onSelectElementKey && onSelectElementKey('details')}
                  drag={isBuilderMode && !detElem.isLocked}
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
                  className={`bg-stone-50/90 rounded-2xl p-6 sm:p-10 border border-amber-200/60 shadow-sm flex flex-col items-center gap-8 text-center print:bg-white print:border relative transition-all duration-300 w-full ${
                    detElem.animClass
                  } ${
                    isBuilderMode ? 'cursor-pointer hover:ring-2 hover:ring-teal-400' : ''
                  } ${
                    detElem.isSelected ? 'ring-2 ring-teal-500 ring-offset-2 bg-teal-50/20' : ''
                  }`}
                >
                  {isBuilderMode && detElem.isSelected && (
                    <span className="absolute -top-3 left-2 px-2 py-0.5 bg-teal-800 text-white text-[9px] font-bold rounded-full shadow-xs flex items-center gap-1 z-20">
                      {detElem.isLocked ? <Lock className="w-2.5 h-2.5 text-amber-300" /> : <Sparkles className="w-2.5 h-2.5" />}
                      Date & Venue Details
                    </span>
                  )}
                  <div className="grid md:grid-cols-2 gap-8 w-full">
                    {event.eventDate && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-amber-800/80 mb-1">When</h3>
                        <p 
                          className="text-xl sm:text-2xl font-serif font-bold text-stone-800"
                          style={{
                            color: detElem.style.color || undefined,
                            fontFamily: detElem.style.fontFamily || undefined
                          }}
                        >
                          {new Date(event.eventDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex flex-col items-center">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-amber-800/80 mb-1">Where</h3>
                        {event.googleMapsUrl ? (
                          <a 
                            href={event.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl sm:text-2xl font-serif font-bold text-stone-900 hover:text-red-700 transition-colors inline-flex items-center gap-1.5 underline decoration-amber-300 underline-offset-4 mb-3"
                            style={{
                              color: detElem.style.color || undefined,
                              fontFamily: detElem.style.fontFamily || undefined
                            }}
                          >
                            {event.location}
                            <ExternalLink className="w-4 h-4 text-stone-400 shrink-0" />
                          </a>
                        ) : (
                          <p 
                            className="text-xl sm:text-2xl font-serif font-bold text-stone-800 mb-3"
                            style={{
                              color: detElem.style.color || undefined,
                              fontFamily: detElem.style.fontFamily || undefined
                            }}
                          >
                            {event.location}
                          </p>
                        )}

                        {event.googleMapsUrl && (
                          <a 
                            href={event.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-200/50 print:hidden mb-2"
                          >
                            <MapPin className="w-4 h-4" />
                            Get Directions on Google Maps
                          </a>
                        )}

                        {event.showLocationQrCode && event.googleMapsUrl && (
                          <div 
                            onClick={(e) => {
                              if (isBuilderMode && onSelectElementKey) {
                                e.stopPropagation();
                                onSelectElementKey('locationQr');
                              }
                            }}
                            style={locQrElem.customStyle}
                            className={`mt-2 p-3 bg-white rounded-2xl border border-stone-200 shadow-xs inline-flex flex-col items-center gap-2 print:block relative transition-all duration-300 ${
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
                                className="w-28 h-28 object-contain rounded-lg border border-stone-100 group-hover:opacity-90 transition-opacity"
                              />
                            </a>
                            <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-orange-600" />
                              Scan or Click for Venue Directions
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                {/* In-Page RSVP Submission Box */}
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

                {/* UPI Gift Section & Transaction Form */}
                {(event.upiQrImageUrl || event.upiId) && (() => {
                  const upiElem = getElementStyle('upiQr');
                  return (
                    <div 
                      onClick={() => isBuilderMode && onSelectElementKey && onSelectElementKey('upiQr')}
                      style={upiElem.customStyle}
                      className={`pt-8 border-t border-stone-200/80 w-full flex flex-col items-center print:bg-white relative transition-all duration-300 rounded-2xl p-4 ${
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
                      <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4 flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-purple-600" />
                        Send Blessings & Digital Gifts
                      </h3>
                      
                      <div className="p-5 bg-white rounded-2xl shadow-sm border border-stone-200/90 flex flex-col items-center gap-4 max-w-sm w-full text-center">
                        {event.showUpiQrCode !== false && (event.upiQrImageUrl || event.upiId) && (
                          <div className="p-2 bg-stone-50 rounded-xl border border-stone-100 shadow-inner flex flex-col items-center gap-1">
                            <img 
                              src={
                                event.upiQrImageUrl ||
                                `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${event.upiId}&pn=${encodeURIComponent(displayRecipient || displayTitle)}&cu=INR`)}`
                              }
                              alt="UPI QR Code"
                              className="w-40 h-40 object-contain rounded-lg bg-white p-1 border border-stone-200"
                            />
                            <span className="text-[10px] text-stone-500 font-mono">
                              {event.upiQrImageUrl ? 'Scan uploaded QR code' : 'Scan with any UPI App'}
                            </span>
                          </div>
                        )}

                      {event.upiId && (
                        <div className="w-full space-y-2">
                          <div className="flex items-center justify-between px-3 py-2 bg-purple-50/70 border border-purple-200/80 rounded-xl text-xs font-bold text-purple-950">
                            <a 
                              href={`upi://pay?pa=${event.upiId}&pn=${encodeURIComponent(displayRecipient || displayTitle)}&cu=INR`}
                              className="flex items-center gap-1.5 hover:underline font-mono"
                            >
                              <IndianRupee className="w-4 h-4 text-purple-700" />
                              {event.upiId}
                            </a>
                            <button
                              type="button"
                              onClick={handleCopyUpi}
                              className="px-2.5 py-1 bg-white hover:bg-purple-100 border border-purple-200 rounded-lg text-[10px] font-bold text-purple-800 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              {upiCopied ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-[10px] text-stone-500">Supports all UPI payment apps</p>
                        </div>
                      )}

                      {/* Record / Confirm Transaction Form */}
                      <div className="w-full pt-3 border-t border-stone-100 text-left print:hidden">
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
                          <form onSubmit={handleTransactionSubmit} className="space-y-2.5">
                            <p className="text-[11px] font-bold text-stone-700 text-center">
                              Sent a gift? Log transaction details for host:
                            </p>
                            {txSubmitError && (
                              <div className="p-2 bg-red-50 text-red-700 text-[11px] rounded-lg border border-red-200">
                                {txSubmitError}
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                required
                                placeholder="Sender Name *"
                                value={txSenderName}
                                onChange={(e) => setTxSenderName(e.target.value)}
                                className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-purple-500 focus:bg-white"
                              />
                              <input
                                type="number"
                                required
                                placeholder="Amount (₹) *"
                                value={txAmount}
                                onChange={(e) => setTxAmount(e.target.value)}
                                className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-purple-500 focus:bg-white"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="UPI Txn Ref / UTR (Optional)"
                              value={txRef}
                              onChange={(e) => setTxRef(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-purple-500 focus:bg-white"
                            />
                            <input
                              type="text"
                              placeholder="Wish / Personal Note (Optional)"
                              value={txNote}
                              onChange={(e) => setTxNote(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-purple-500 focus:bg-white"
                            />
                            <button
                              type="submit"
                              disabled={submittingTx}
                              className="w-full py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-60 text-white rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <IndianRupee className="w-3.5 h-3.5" />
                              {submittingTx ? 'Logging...' : 'Confirm & Log Gift Transaction'}
                            </button>
                          </form>
                        )}
                      </div>
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

    </div>
  );
}
