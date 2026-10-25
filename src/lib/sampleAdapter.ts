import type { LovinglyEvent, DesignStyle, EventKind } from '../types';
import type { SampleInvite } from '../data/samples';
import type { MasterTemplate } from './designSystem';
import { createSlug } from './utils';

/**
 * Adapter that converts a high-level SampleInvite definition into a fully-formed,
 * production-ready LovinglyEvent model supported by the single-source-of-truth
 * EventViewer rendering pipeline.
 */
export function sampleToLovinglyEvent(sample: SampleInvite, overrideOwnerId = 'sample-preview'): LovinglyEvent {
  // Format ISO date if valid, otherwise keep raw date
  const rawDate = sample.date || '2026-12-24';
  let isoDate = rawDate;
  try {
    const parsed = new Date(rawDate);
    if (!isNaN(parsed.getTime())) {
      isoDate = parsed.toISOString().split('T')[0];
    }
  } catch {
    isoDate = rawDate;
  }

  return {
    id: sample.id,
    slug: sample.id,
    creatorPath: 'yours-lovingly',
    title: sample.title,
    eventType: sample.category || 'wedding',
    customType: '',
    creationCategory: 'invite',
    designStyle: (sample.designStyle || 'royal-heritage') as DesignStyle,
    templateId: sample.templateId || 'tmpl-wedding-traditional-marigold',
    recipientName: sample.coupleOrHost || sample.subtitle,
    messages: sample.messages && sample.messages.length > 0 ? [...sample.messages] : [sample.subtitle],
    eventDate: isoDate,
    location: sample.location,
    primaryColor: sample.primaryColor,
    secondaryColor: sample.secondaryColor,
    highlightColor: sample.highlightColor || '#D4AF37',
    frameType: sample.frameType || 'traditional-marigold-gold',
    decorativeMotif: sample.decorativeMotif || 'auspicious-kalash',
    textureType: sample.textureType || 'gold-dust',
    shlokaText: sample.shlokaText || sample.subtitle,
    elements: sample.elements && sample.elements.length > 0 ? [...sample.elements] : ['sparkles', 'flowers'],
    backgroundText: '',
    photos: sample.photos && sample.photos.length > 0 ? [...sample.photos] : [],
    contentBlocks: [],
    messageAlignment: 'center',
    photoAlignment: 'center',
    photoSize: 'medium',
    backgroundPattern: 'none',
    isPublished: true,
    createdAt: new Date().toISOString(),
    musicType: sample.musicType || (sample.bgAudioUrl || sample.bgAudioPresetId ? 'mp3' : sample.spotifySong ? 'spotify' : 'none'),
    spotifyUrl: sample.spotifySong || '',
    bgAudioUrl: sample.bgAudioUrl || '',
    bgAudioPresetId: sample.bgAudioPresetId,
    bgAudioTitle: sample.bgAudioTitle || sample.musicTrack || '',
    bgAudioStart: sample.bgAudioStart ?? 0,
    bgAudioEnd: sample.bgAudioEnd ?? 30,
    bgAudioAutoPlay: sample.bgAudioAutoPlay ?? true,
    showAds: false,
    visibility: 'anyone',
    ownerId: overrideOwnerId,
    tier: 'premium',
    planTier: 'premium_99',
    hostingDurationDays: 15,
    isLifetime: false,
    publishedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    hostingExtensions: [],
    googleMapsUrl: sample.hasMap 
      ? `https://maps.google.com/?q=${encodeURIComponent(sample.location)}` 
      : undefined,
    showLocationQrCode: sample.hasMap,
    rsvpConfig: {
      enabled: sample.hasRsvp,
      collectPhone: true,
      collectGuestCount: true,
      collectDietary: false,
      collectAccommodation: false,
    },
    upiId: sample.hasQr ? 'lovingly@upi' : undefined,
    upiName: sample.coupleOrHost,
    showUpiQrCode: sample.hasQr,
  };
}

/**
 * Creates an independent, fully editable LovinglyEvent draft from a selected sample
 * for the customization workflow.
 */
export function createDraftFromSample(sample: SampleInvite, ownerId = 'guest', creatorName = 'guest'): LovinglyEvent {
  const newId = 'evt_' + Date.now().toString(36);
  const baseEvent = sampleToLovinglyEvent(sample, ownerId);

  return {
    ...baseEvent,
    id: newId,
    slug: createSlug(),
    creatorPath: creatorName || 'guest',
    ownerId: ownerId || 'guest',
    isPublished: false,
    createdAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

/**
 * Converts a MasterTemplate into a live LovinglyEvent model for real visual previews.
 */
export function masterTemplateToLovinglyEvent(tmpl: MasterTemplate, overrideOwnerId = 'template-preview'): LovinglyEvent {
  return {
    id: tmpl.id,
    slug: tmpl.id,
    creatorPath: 'yours-lovingly',
    title: tmpl.defaultTitle,
    eventType: (tmpl.category === 'all' ? 'wedding' : tmpl.category) as EventKind,
    customType: '',
    creationCategory: 'invite',
    designStyle: tmpl.id as DesignStyle,
    templateId: tmpl.id,
    recipientName: tmpl.defaultRecipient,
    messages: tmpl.defaultMessages && tmpl.defaultMessages.length > 0 ? [...tmpl.defaultMessages] : [tmpl.tagline],
    eventDate: tmpl.defaultDate || '2026-11-28',
    location: tmpl.defaultLocation || 'Grand Celebration Palace, Chennai',
    primaryColor: tmpl.primaryColor,
    secondaryColor: tmpl.secondaryColor,
    highlightColor: tmpl.highlightColor || '#D4AF37',
    frameType: tmpl.frameType || 'traditional-marigold-gold',
    decorativeMotif: tmpl.decorativeMotif || 'auspicious-kalash',
    textureType: tmpl.textureType || 'gold-dust',
    shlokaText: tmpl.shlokaText || tmpl.tagline,
    elements: tmpl.defaultElements && tmpl.defaultElements.length > 0 ? [...tmpl.defaultElements] : ['sparkles', 'flowers'],
    backgroundText: '',
    photos: [],
    contentBlocks: [],
    messageAlignment: 'center',
    photoAlignment: 'center',
    photoSize: 'medium',
    backgroundPattern: 'none',
    isPublished: true,
    createdAt: new Date().toISOString(),
    musicType: tmpl.spotifySuggestion ? 'spotify' : 'none',
    spotifyUrl: tmpl.spotifySuggestion || '',
    bgAudioUrl: '',
    showAds: false,
    visibility: 'anyone',
    ownerId: overrideOwnerId,
    tier: 'premium',
    planTier: 'premium_99',
    hostingDurationDays: 15,
    isLifetime: false,
    publishedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    hostingExtensions: [],
    showLocationQrCode: true,
    googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(tmpl.defaultLocation || 'Grand Celebration Palace, Chennai')}`,
    rsvpConfig: {
      enabled: false,
      collectPhone: true,
      collectGuestCount: true,
      collectDietary: false,
      collectAccommodation: false,
    },
    upiId: undefined,
    showUpiQrCode: false,
  };
}

