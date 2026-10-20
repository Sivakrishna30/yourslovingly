import type { LovinglyEvent, DesignStyle } from '../types';
import type { SampleInvite } from '../data/samples';
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
    photos: [],
    contentBlocks: [],
    messageAlignment: 'center',
    photoAlignment: 'center',
    photoSize: 'medium',
    backgroundPattern: 'none',
    isPublished: true,
    createdAt: new Date().toISOString(),
    spotifyUrl: sample.spotifySong || '',
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
