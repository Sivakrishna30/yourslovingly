import type { User } from 'firebase/auth';
import type { LovinglyEvent, MessageBlock, PhotoBlock, EventKind } from '../types';
import { RESERVED_PUBLIC_PATHS } from './constants';

export function createSlug() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function toFriendlyPathSegment(name: string) {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!clean || RESERVED_PUBLIC_PATHS.has(clean)) return 'lovingly-' + Math.floor(Math.random() * 1000);
  return clean;
}

export function getEventCreatorPath(event: LovinglyEvent, user?: Pick<User, 'displayName' | 'email'> | null) {
  if (event.creatorPath) return event.creatorPath;
  const seed = user?.displayName || user?.email?.split('@')[0] || 'lovingly';
  return toFriendlyPathSegment(seed);
}

export function getEventTypePath(event: LovinglyEvent) {
  return event.eventType === 'custom' ? toFriendlyPathSegment(event.customType || 'event') : event.eventType;
}

export function createMessageBlock(text = ''): MessageBlock {
  return {
    id: crypto.randomUUID(),
    kind: 'message',
    text,
    align: 'center',
    fontStyle: 'sweet',
    fontSize: 1.25,
    borderStyle: 'none'
  };
}

export function createPhotoBlock(src = ''): PhotoBlock {
  return {
    id: crypto.randomUUID(),
    kind: 'photo',
    src,
    align: 'center',
    size: 'medium',
    width: 100,
    positionX: 0,
    positionY: 0,
    borderStyle: 'none'
  };
}

export function createBlankEvent(ownerId: string, type: EventKind = 'wedding', creatorPath = 'yours-lovingly'): LovinglyEvent {
  return {
    id: crypto.randomUUID(),
    slug: createSlug(),
    creatorPath,
    title: '',
    eventType: type,
    customType: '',
    recipientName: '',
    messages: [],
    eventDate: '',
    location: '',
    primaryColor: '#881337',
    secondaryColor: '#fff1f2',
    highlightColor: '#f59e0b',
    elements: ['hearts', 'sparkles'],
    backgroundText: '',
    photos: [],
    contentBlocks: [createMessageBlock('')],
    messageAlignment: 'center',
    photoAlignment: 'center',
    photoSize: 'medium',
    backgroundPattern: 'none',
    isPublished: false,
    createdAt: new Date().toISOString(),
    spotifyUrl: '',
    showAds: true,
    visibility: 'anyone',
    allowedEmails: '',
    ownerId,
    tier: 'free',
    planTier: 'free',
    hostingDurationDays: 15,
    isLifetime: false,
    publishedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    hostingExtensions: []
  };
}
