import { useEffect, useMemo, useState, useCallback } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, type User } from 'firebase/auth'
import './App.css'
import { auth, completeRedirectSignIn, firebaseReady, getAuthErrorMessage, googleProvider } from './firebase'

type EventKind =
  | 'birthday'
  | 'wedding'
  | 'baby-shower'
  | 'anniversary'
  | 'proposal'
  | 'housewarming'
  | 'farewell'
  | 'memorial'
  | 'friendship'
  | 'custom'

type LovinglyEvent = {
  id: string
  slug: string
  creatorPath: string
  title: string
  eventType: EventKind
  customType: string
  recipientName: string
  messages: string[]
  eventDate: string
  location: string
  primaryColor: string
  secondaryColor: string
  highlightColor: string
  elements: string[]
  backgroundText: string
  photos: string[]
  contentBlocks: ContentBlock[]
  messageAlignment: 'left' | 'center' | 'right'
  photoAlignment: 'left' | 'center' | 'right'
  photoSize: 'compact' | 'medium' | 'large'
  backgroundPattern: BackgroundPattern
  isPublished: boolean
  createdAt: string
  spotifyUrl?: string
  showAds?: boolean
  driveFolderId?: string
  driveFileId?: string
  drivePhotoFileIds?: string[]
  drivePublishedAt?: string
  visibility?: PageVisibility
  allowedEmails?: string
}

type TextAlign = 'left' | 'center' | 'right'
type PhotoSize = 'compact' | 'medium' | 'large'
type FontStyle = 'sweet' | 'classic' | 'playful' | 'clean' | 'script' | 'rounded' | 'bold'
type BackgroundPattern = 'none' | 'hearts' | 'stars' | 'gifts' | 'flowers'
type BorderStyle = 'none' | 'soft' | 'solid' | 'glow' | 'dashed' | 'double'
type PageVisibility = 'anyone' | 'restricted'
type PublicRoute = {
  slug: string
  creatorPath?: string
  eventPath?: string
  driveFileId?: string
}

type DriveUploadResult = {
  fileId: string
  folderId: string
  photoFileIds: string[]
  event: LovinglyEvent
}

type ContentBlock =
  | {
      id: string
      kind: 'message'
      text: string
      align: TextAlign
      fontStyle: FontStyle
      fontSize: number
      borderStyle: BorderStyle
    }
  | {
      id: string
      kind: 'photo'
      src: string
      align: TextAlign
      size: PhotoSize
      width: number
      positionX: number
      positionY: number
      borderStyle: BorderStyle
    }

const FREE_EVENT_LIMIT = 1
const MAX_PHOTOS = 10
const MAX_ELEMENTS = 5
const STORAGE_KEY = 'lovingly-demo-events'
const EDITING_ID_KEY = 'lovingly-editing-id'
const DRIVE_TOKEN_KEY = 'lovingly-drive-access-token'
const RESERVED_PUBLIC_PATHS = new Set(['builder', 'create', 'page', 'p', 'samples', 'subscription', 'user', 'terms', 'about', 'contact'])

const eventTypes: Array<{ id: EventKind; label: string; description: string }> = [
  { id: 'birthday', label: 'Birthday', description: 'Warm wishes and joyful photos' },
  { id: 'wedding', label: 'Wedding', description: 'Invitation style page' },
  { id: 'baby-shower', label: 'Baby Shower', description: 'Soft and sweet celebration' },
  { id: 'anniversary', label: 'Anniversary', description: 'A page for shared years' },
  { id: 'proposal', label: 'Proposal', description: 'A romantic memory page' },
  { id: 'housewarming', label: 'Housewarming', description: 'Invite people home' },
  { id: 'farewell', label: 'Farewell', description: 'Goodbye notes and memories' },
  { id: 'memorial', label: 'Memorial', description: 'A respectful remembrance page' },
  { id: 'friendship', label: 'Friendship', description: 'Photos and messages for friends' },
  { id: 'custom', label: 'Custom Event', description: 'Use your own event type' },
]

const palettePresets = [
  { name: 'Neon Love', primary: '#ff2fb3', secondary: '#fff7e8', highlight: '#7ddcff' },
  { name: 'Sky Bloom', primary: '#1677c8', secondary: '#eef9ff', highlight: '#ff7ac8' },
  { name: 'Wedding Pearl', primary: '#6d4c8d', secondary: '#fffaf1', highlight: '#d9b66f' },
  { name: 'Game Night', primary: '#171717', secondary: '#f7fbff', highlight: '#00d4ff' },
  { name: 'Midnight Rose', primary: '#8b0000', secondary: '#1a1a1a', highlight: '#ff4d4d' },
  { name: 'Ocean Mist', primary: '#008080', secondary: '#f0ffff', highlight: '#20b2aa' },
  { name: 'Sunset Glow', primary: '#ff4500', secondary: '#fff5ee', highlight: '#ffa500' },
  { name: 'Lavender Dream', primary: '#9370db', secondary: '#f8f8ff', highlight: '#e6e6fa' },
]

const elementOptions = ['hearts', 'sparkles', 'flowers', 'stars', 'balloons', 'rings', 'home', 'ribbon']

const fontStyles: Array<{ id: FontStyle; label: string }> = [
  { id: 'sweet', label: 'Sweet' },
  { id: 'classic', label: 'Classic' },
  { id: 'playful', label: 'Playful' },
  { id: 'clean', label: 'Clean' },
  { id: 'script', label: 'Script' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'bold', label: 'Bold' },
]

const borderStyles: Array<{ id: BorderStyle; label: string }> = [
  { id: 'none', label: 'None' },
  { id: 'soft', label: 'Soft' },
  { id: 'solid', label: 'Solid' },
  { id: 'glow', label: 'Glow' },
  { id: 'dashed', label: 'Dashed' },
  { id: 'double', label: 'Double' },
]

const elementGlyphs: Record<string, string> = {
  hearts: '💖',
  sparkles: '✨',
  flowers: '🌸',
  stars: '⭐',
  balloons: '🎈',
  rings: '💍',
  home: '🏠',
  ribbon: '🎀',
}

function createBlankEvent(type: EventKind = 'birthday', creatorPath = 'lovingly'): LovinglyEvent {
  return {
    id: crypto.randomUUID(),
    slug: createSlug(),
    creatorPath,
    title: '',
    eventType: type,
    customType: '',
    recipientName: '',
    messages: [''],
    eventDate: '',
    location: '',
    primaryColor: '#ff2fb3',
    secondaryColor: '#fff7e8',
    highlightColor: '#7ddcff',
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
  }
}

const sampleEvents: LovinglyEvent[] = [
  {
    ...createBlankEvent('birthday'),
    id: 'sample-birthday-neon',
    slug: 'SAMPLE1',
    title: 'Neon Birthday Bash',
    recipientName: 'Aarav',
    messages: ['A bright little page for wishes, photos, and the best birthday moments.'],
    eventDate: '2026-08-18',
    primaryColor: '#ff2fb3',
    secondaryColor: '#fff7e8',
    highlightColor: '#7ddcff',
    elements: ['hearts', 'sparkles', 'balloons'],
    isPublished: true,
  },
  {
    ...createBlankEvent('wedding'),
    id: 'sample-wedding-pearl',
    slug: 'SAMPLE2',
    title: 'Riya and Karthik',
    recipientName: 'Family and friends',
    messages: ['A calm wedding invite style with soft pearl colors and a warm personal note.'],
    eventDate: '2026-11-22',
    primaryColor: '#6d4c8d',
    secondaryColor: '#fffaf1',
    highlightColor: '#d9b66f',
    elements: ['rings', 'flowers', 'sparkles'],
    isPublished: true,
  },
  {
    ...createBlankEvent('baby-shower'),
    id: 'sample-baby-sky',
    slug: 'SAMPLE3',
    title: 'Baby Shower Wishes',
    recipientName: 'Meera',
    messages: ['A soft sky-blue page for blessings, tiny details, and family photos.'],
    eventDate: '2026-09-05',
    primaryColor: '#1677c8',
    secondaryColor: '#eef9ff',
    highlightColor: '#ffb8d9',
    elements: ['stars', 'flowers', 'ribbon'],
    isPublished: true,
  },
  {
    ...createBlankEvent('friendship'),
    id: 'sample-game-night',
    slug: 'SAMPLE4',
    title: 'Game Night Memories',
    recipientName: 'The squad',
    messages: ['A sharper theme for fun pages, friend groups, and playful event memories.'],
    eventDate: '2026-07-12',
    primaryColor: '#171717',
    secondaryColor: '#f7fbff',
    highlightColor: '#00d4ff',
    elements: ['stars', 'sparkles', 'ribbon'],
    isPublished: true,
  },
]

const sampleVisuals: Record<string, string> = {
  'sample-birthday-neon': '🎂',
  'sample-wedding-pearl': '💍',
  'sample-baby-sky': '🍼',
  'sample-game-night': '🎮',
}

const homeDecorations = ['🎈', '🎉', '💖', '✨', '🎊', '🌸', '⭐', '🎀', '🎂', '💝', '🎁', '🫰']

function LogoMark({ onClick }: { onClick?: () => void }) {
  const content = (
    <>
      <span className="logo-hand">🫰</span>
      <span className="logo-heart">♥</span>
    </>
  )

  if (onClick) {
    return (
      <button className="site-logo logo-button" aria-label="Go to dashboard" type="button" onClick={onClick}>
        {content}
      </button>
    )
  }

  return (
    <div className="site-logo" aria-label="Yours Lovingly">
      {content}
    </div>
  )
}

function createMessageBlock(text = ''): ContentBlock {
  return {
    id: crypto.randomUUID(),
    kind: 'message',
    text,
    align: 'center',
    fontStyle: 'sweet',
    fontSize: 20,
    borderStyle: 'soft',
  }
}

function createPhotoBlock(src: string): ContentBlock {
  return {
    id: crypto.randomUUID(),
    kind: 'photo',
    src,
    align: 'center',
    size: 'medium',
    width: 560,
    positionX: 50,
    positionY: 50,
    borderStyle: 'soft',
  }
}

function getContentBlocks(event: LovinglyEvent): ContentBlock[] {
  const savedBlocks = event.contentBlocks?.filter((block) =>
    block.kind === 'message' ? block.text.trim() : Boolean(block.src),
  ).map(normalizeBlock)
  if (savedBlocks?.length) return savedBlocks

  const messageBlocks = event.messages
    .filter(Boolean)
    .map((message) => ({
      ...createMessageBlock(message),
      align: event.messageAlignment ?? 'center',
    }))
  const photoBlocks = event.photos.map((photo) => ({
    ...createPhotoBlock(photo),
    align: event.photoAlignment ?? 'center',
    size: event.photoSize ?? 'medium',
  }))
  const rows = Math.max(messageBlocks.length, Math.ceil(photoBlocks.length / 2))
  const blocks: ContentBlock[] = []

  for (let index = 0; index < rows; index += 1) {
    if (messageBlocks[index]) blocks.push(messageBlocks[index])
    blocks.push(...photoBlocks.slice(index * 2, index * 2 + 2))
  }

  return blocks
}

function normalizeBlock(block: ContentBlock): ContentBlock {
  if (block.kind === 'message') {
    return {
      ...block,
      align: block.align ?? 'center',
      fontStyle: block.fontStyle ?? 'sweet',
      fontSize: block.fontSize ?? 20,
      borderStyle: block.borderStyle ?? 'soft',
    }
  }

  return {
    ...block,
    align: block.align ?? 'center',
    size: block.size ?? 'medium',
    width: block.width ?? (block.size === 'compact' ? 320 : block.size === 'large' ? 840 : 560),
    positionX: block.positionX ?? 50,
    positionY: block.positionY ?? 50,
    borderStyle: block.borderStyle ?? 'soft',
  }
}

function getDisplayElements(event: LovinglyEvent) {
  return event.elements.map((element) => elementGlyphs[element] ?? element).slice(0, MAX_ELEMENTS)
}

function createSlug() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

function toFriendlyPathSegment(value?: string | null) {
  const cleaned = (value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 40)

  return cleaned || 'lovingly'
}

function getUserPathName(user?: Pick<User, 'displayName' | 'email'> | null) {
  const firstName = user?.displayName?.trim().split(/\s+/)[0]
  return toFriendlyPathSegment(firstName || user?.email?.split('@')[0])
}

function getEventCreatorPath(event: LovinglyEvent, user?: Pick<User, 'displayName' | 'email'> | null) {
  return event.creatorPath || getUserPathName(user)
}

function getEventTypePath(event: Pick<LovinglyEvent, 'eventType' | 'customType'>) {
  const eventLabel = event.eventType === 'custom' ? event.customType || 'event' : event.eventType
  return toFriendlyPathSegment(eventLabel)
}

function getPublicPath(event: LovinglyEvent, user?: Pick<User, 'displayName' | 'email'> | null) {
  const driveQuery = event.driveFileId ? `?drive=${encodeURIComponent(event.driveFileId)}` : ''
  return `/${getEventCreatorPath(event, user)}/${getEventTypePath(event)}/${event.slug}${driveQuery}`
}

function getCurrentPath() {
  return `${window.location.pathname}${window.location.search}`
}

function getPublicRoute(pathnameWithSearch: string): PublicRoute | null {
  const [pathname, search = ''] = pathnameWithSearch.split('?')
  const params = new URLSearchParams(search)
  const driveFileId = params.get('drive') || undefined
  const legacySlug = pathname.match(/^\/(?:page|p)\/([^/]+)/)?.[1]
  if (legacySlug) return { slug: decodeURIComponent(legacySlug), creatorPath: undefined, driveFileId }

  const parts = pathname.split('/').filter(Boolean).map((part) => decodeURIComponent(part))
  if (!([2, 3].includes(parts.length)) || RESERVED_PUBLIC_PATHS.has(parts[0].toLowerCase())) return null

  return {
    creatorPath: toFriendlyPathSegment(parts[0]),
    eventPath: parts.length === 3 ? toFriendlyPathSegment(parts[1]) : undefined,
    slug: parts.length === 3 ? parts[2] : parts[1],
    driveFileId,
  }
}

function getSeoKeywords(event?: LovinglyEvent) {
  const baseKeywords = [
    'Lovingly',
    'event website',
    'event microsite',
    'online invitation',
    'digital invitation',
    'memory page',
    'photo memory page',
    'Google Drive invitation',
    'wedding invitation website',
    'marriage invitation website',
    'birthday website',
    'anniversary website',
    'baby shower invitation website',
    'housewarming invitation website',
    'farewell memory page',
    'friendship memory page',
  ]

  if (!event) return baseKeywords.join(', ')

  const eventLabel = getEventLabel(event)
  // Add type‑specific SEO phrases
  const typeKeywordsMap: Record<EventKind, string[]> = {
    birthday: ['create website for birthday', 'birthday invitation site', 'birthday microsite'],
    wedding: ['create website for wedding', 'wedding invitation site', 'wedding microsite'],
    'baby-shower': ['create website for baby shower', 'baby shower invitation site'],
    anniversary: ['create website for anniversary', 'anniversary invitation site'],
    proposal: ['create website for proposal', 'proposal invitation site'],
    housewarming: ['create website for housewarming', 'housewarming invitation site'],
    farewell: ['create website for farewell', 'farewell invitation site'],
    memorial: ['create website for memorial', 'memorial invitation site'],
    friendship: ['create website for friendship', 'friendship invitation site'],
    custom: []
  }

  const extra = typeKeywordsMap[event.eventType] || []

  return [
    event.title,
    event.recipientName,
    eventLabel,
    `${eventLabel} website`,
    `${eventLabel} invitation website`,
    `${eventLabel} digital invitation`,
    `${eventLabel} memory page`,
    event.location,
    ...extra,
    ...baseKeywords,
  ].filter(Boolean).join(', ')
}

function getSeoTitle(event?: LovinglyEvent) {
  if (!event) return 'Lovingly | Event Microsite Builder'
  const eventLabel = getEventLabel(event)
  return `${event.title || `${eventLabel} Website`} | ${eventLabel} Invitation | Lovingly`
}

function getSeoDescription(event?: LovinglyEvent) {
  if (!event) {
    return 'Create beautiful wedding invitation websites, birthday websites, digital event invitations, and personal memory pages with Lovingly.'
  }

  const eventLabel = getEventLabel(event)
  const recipient = event.recipientName ? ` for ${event.recipientName}` : ''
  return `${event.title || `${eventLabel} invitation website`}${recipient}. A digital ${eventLabel.toLowerCase()} invitation and memory page created with Lovingly.`
}

function setMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, name)
    document.head.appendChild(tag)
  }
  tag.content = content
}

function setPageSeo(event?: LovinglyEvent) {
  const title = getSeoTitle(event)
  const description = getSeoDescription(event)
  const keywords = getSeoKeywords(event)
  const image = event?.contentBlocks.find((block) => block.kind === 'photo')?.src

  document.title = title
  setMetaTag('description', description)
  setMetaTag('keywords', keywords)
  setMetaTag('og:title', title, 'property')
  setMetaTag('og:description', description, 'property')
  setMetaTag('og:type', event ? 'website' : 'product', 'property')
  setMetaTag('twitter:card', image ? 'summary_large_image' : 'summary')
  setMetaTag('twitter:title', title)
  setMetaTag('twitter:description', description)
  if (image && !image.startsWith('data:')) {
    setMetaTag('og:image', image, 'property')
    setMetaTag('twitter:image', image)
  }
}

function validateEvent(event: LovinglyEvent): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  
  if (!event.title || !event.title.trim()) {
    errors.title = 'Event title is required.'
  }
  
  if (!event.recipientName || !event.recipientName.trim()) {
    errors.recipientName = 'Recipient name is required.'
  }
  
  if (!event.eventDate) {
    errors.eventDate = 'Event date is required.'
  } else {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventTime = new Date(`${event.eventDate}T00:00:00`).getTime()
    if (isNaN(eventTime)) {
      errors.eventDate = 'Invalid event date.'
    } else if (eventTime < today.getTime()) {
      errors.eventDate = 'Event date must be today or in the future.'
    }
  }

  const blocks = event.contentBlocks || []
  const photoCount = blocks.filter((b) => b.kind === 'photo').length
  if (photoCount > MAX_PHOTOS) {
    errors.photos = `Maximum of ${MAX_PHOTOS} photos allowed (currently ${photoCount}).`
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

function getInitialEvents(): LovinglyEvent[] {
  return []
}

function getUserStorageKey(uid: string) {
  return `${STORAGE_KEY}:${uid}`
}

function getUserEditingKey(uid: string) {
  return `${EDITING_ID_KEY}:${uid}`
}

function getStoredEventsForUser(uid: string): LovinglyEvent[] {
  try {
    const value = localStorage.getItem(getUserStorageKey(uid))
    return value ? JSON.parse(value) : []
  } catch {
    return []
  }
}

function getStoredEditingIdForUser(uid: string) {
  return localStorage.getItem(getUserEditingKey(uid))
}

function getCountdown(dateValue: string) {
  if (!dateValue) return ''
  const target = new Date(`${dateValue}T00:00:00`).getTime()
  const days = Math.ceil((target - Date.now()) / 86400000)
  if (days > 1) return `${days} days to go`
  if (days === 1) return 'Tomorrow'
  if (days === 0) return 'Today'
  return 'A memory worth keeping'
}

async function compressImage(file: File): Promise<string> {
  const image = new Image()
  const objectUrl = URL.createObjectURL(file)
  image.src = objectUrl

  await new Promise((resolve, reject) => {
    image.onload = resolve
    image.onerror = reject
  })

  const maxWidth = 1400
  const scale = Math.min(1, maxWidth / image.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(image.width * scale)
  canvas.height = Math.round(image.height * scale)
  const context = canvas.getContext('2d')
  context?.drawImage(image, 0, 0, canvas.width, canvas.height)
  URL.revokeObjectURL(objectUrl)
  return canvas.toDataURL('image/jpeg', 0.82)
}

function getGoogleApiKey() {
  return import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY
}

function dataUrlToBlob(dataUrl: string) {
  const [header, data] = dataUrl.split(',')
  const mime = header.match(/data:(.*?);base64/)?.[1] || 'application/octet-stream'
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return new Blob([bytes], { type: mime })
}

function getDriveMediaUrl(fileId: string) {
  return `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media&key=${encodeURIComponent(getGoogleApiKey())}`
}

async function driveJsonRequest<T>(accessToken: string, url: string, init: RequestInit = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : null
  if (!response.ok) throw new Error(data?.error?.message || 'Google Drive request failed.')
  return data as T
}

async function uploadDriveFile(accessToken: string, metadata: Record<string, unknown>, body: Blob) {
  const boundary = `lovingly-${crypto.randomUUID()}`
  const delimiter = `\r\n--${boundary}\r\n`
  const closeDelimiter = `\r\n--${boundary}--`
  const multipartBody = new Blob([
    delimiter,
    'Content-Type: application/json; charset=UTF-8\r\n\r\n',
    JSON.stringify(metadata),
    delimiter,
    `Content-Type: ${body.type || 'application/octet-stream'}\r\n\r\n`,
    body,
    closeDelimiter,
  ])

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartBody,
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data?.error?.message || 'Drive upload failed.')
  return data.id as string
}

async function createDriveFolder(accessToken: string, event: LovinglyEvent) {
  return driveJsonRequest<{ id: string }>(accessToken, 'https://www.googleapis.com/drive/v3/files?fields=id', {
    method: 'POST',
    body: JSON.stringify({
      name: `Lovingly - ${event.title || event.recipientName || event.slug}`,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  }).then((folder) => folder.id)
}

async function addDrivePermission(accessToken: string, fileId: string, permission: Record<string, unknown>) {
  await driveJsonRequest(
    accessToken,
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}/permissions`,
    {
      method: 'POST',
      body: JSON.stringify(permission),
    },
  )
}

async function applyDrivePermissions(accessToken: string, fileIds: string[], event: LovinglyEvent) {
  if ((event.visibility ?? 'anyone') === 'anyone') {
    await Promise.all(fileIds.map((fileId) => addDrivePermission(accessToken, fileId, {
      type: 'anyone',
      role: 'reader',
    })))
    return
  }

  const emails = (event.allowedEmails || '')
    .split(/[,\n]/)
    .map((email) => email.trim())
    .filter(Boolean)

  await Promise.all(fileIds.flatMap((fileId) =>
    emails.map((emailAddress) => addDrivePermission(accessToken, fileId, {
      type: 'user',
      role: 'reader',
      emailAddress,
    })),
  ))
}

async function publishEventToDrive(accessToken: string, event: LovinglyEvent): Promise<DriveUploadResult> {
  const folderId = await createDriveFolder(accessToken, event)
  const photoFileIds: string[] = []
  const drivePhotoUrlBySrc = new Map<string, string>()

  for (const block of getContentBlocks(event)) {
    if (block.kind !== 'photo' || !block.src.startsWith('data:')) continue
    const fileId = await uploadDriveFile(accessToken, {
      name: `photo-${photoFileIds.length + 1}.jpg`,
      parents: [folderId],
    }, dataUrlToBlob(block.src))
    photoFileIds.push(fileId)
    drivePhotoUrlBySrc.set(block.src, getDriveMediaUrl(fileId))
  }

  const useDriveImageUrls = (event.visibility ?? 'anyone') === 'anyone'
  const driveEvent: LovinglyEvent = {
    ...event,
    photos: event.photos.map((photo) => useDriveImageUrls ? drivePhotoUrlBySrc.get(photo) || photo : photo),
    contentBlocks: event.contentBlocks.map((block) =>
      block.kind === 'photo' && useDriveImageUrls ? { ...block, src: drivePhotoUrlBySrc.get(block.src) || block.src } : block,
    ),
    driveFolderId: folderId,
    drivePhotoFileIds: photoFileIds,
    drivePublishedAt: new Date().toISOString(),
    isPublished: true,
  }
  const jsonBlob = new Blob([JSON.stringify(driveEvent)], { type: 'application/json' })
  const fileId = await uploadDriveFile(accessToken, {
    name: 'lovingly-page.json',
    parents: [folderId],
  }, jsonBlob)
  const publishedEvent = { ...driveEvent, driveFileId: fileId }

  await applyDrivePermissions(accessToken, [folderId, fileId, ...photoFileIds], publishedEvent)

  return {
    fileId,
    folderId,
    photoFileIds,
    event: publishedEvent,
  }
}

async function deleteDriveFileOrFolder(accessToken: string, fileId: string) {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  if (!response.ok) {
    const text = await response.text()
    const data = text ? JSON.parse(text) : null
    if (response.status !== 404) {
      throw new Error(data?.error?.message || 'Google Drive delete request failed.')
    }
  }
}

async function unpublishEventFromDrive(accessToken: string, event: LovinglyEvent) {
  const targetId = event.driveFolderId || event.driveFileId
  if (targetId) {
    await deleteDriveFileOrFolder(accessToken, targetId)
  }
}

async function fetchDriveEvent(fileId: string, accessToken?: string) {
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined
  const keyQuery = accessToken ? '' : `&key=${encodeURIComponent(getGoogleApiKey())}`
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media${keyQuery}`,
    { headers },
  )
  const data = await response.json()
  if (!response.ok) {
    const message = data?.error?.message || ''
    if (response.status === 404 || message.toLowerCase().includes('file not found')) {
      throw new Error('Lovingly page not available - the backing Google Drive file has been deleted or moved by the creator.')
    }
    if (response.status === 403) {
      throw new Error('Access restricted. This page is private. Please sign in with an authorized Google account.')
    }
    throw new Error(message || 'Unable to load Drive page.')
  }
  return data as LovinglyEvent
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  const [authLoading, setAuthLoading] = useState(() => Boolean(auth))
  const [authError, setAuthError] = useState<string | null>(null)
  const [driveAccessToken, setDriveAccessToken] = useState(() => sessionStorage.getItem(DRIVE_TOKEN_KEY) || '')
  const [driveError, setDriveError] = useState<string | null>(null)
  const [drivePublishing, setDrivePublishing] = useState(false)
  const [publicDriveEvent, setPublicDriveEvent] = useState<{ fileId: string; event: LovinglyEvent } | null>(null)
  const [publicDriveError, setPublicDriveError] = useState<{ fileId: string; message: string } | null>(null)
  const [events, setEvents] = useState<LovinglyEvent[]>(getInitialEvents)
  const [editingId, setEditingId] = useState<string | null>(() => localStorage.getItem(EDITING_ID_KEY))
  const [selectedType, setSelectedType] = useState<EventKind>('birthday')
  const [path, setPath] = useState(getCurrentPath)
  const [publicReturnPath, setPublicReturnPath] = useState('/user')
  const isLoggedIn = Boolean(user)
  const pageLimit = FREE_EVENT_LIMIT

  useEffect(() => {
    if (!auth) return

    let active = true

    completeRedirectSignIn().catch((error) => {
      if (active) setAuthError(getAuthErrorMessage(error))
    })

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      if (!active) return
      setUser(nextUser)
      if (nextUser) {
        setEvents(getStoredEventsForUser(nextUser.uid))
        setEditingId(getStoredEditingIdForUser(nextUser.uid))
      } else {
        setEvents([])
        setEditingId(null)
      }
      setAuthLoading(false)
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (authLoading || !user) return
    if (path === '/' || path === '') {
      navigate('/user', true)
    }
  }, [authLoading, user, path])

  useEffect(() => {
    if (!user) return
    localStorage.setItem(getUserStorageKey(user.uid), JSON.stringify(events))
  }, [events, user])

  useEffect(() => {
    if (!user) return
    const editingKey = getUserEditingKey(user.uid)
    if (editingId) {
      localStorage.setItem(editingKey, editingId)
    } else {
      localStorage.removeItem(editingKey)
    }
  }, [editingId, user])

  useEffect(() => {
    const onPopState = () => setPath(getCurrentPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const editingEvent = events.find((event) => event.id === editingId) ?? null
  const publicRoute = getPublicRoute(path)
  const localPublicEvent = publicRoute
    ? [...events, ...sampleEvents].find((event) => {
        const hasSlug = event.slug.toLowerCase() === publicRoute.slug.toLowerCase()
        const hasCreatorPath = !publicRoute.creatorPath || !event.creatorPath || event.creatorPath === publicRoute.creatorPath
        const hasEventPath = !publicRoute.eventPath || getEventTypePath(event) === publicRoute.eventPath
        return hasSlug && hasCreatorPath && hasEventPath
      })
    : undefined
  const publicEvent = publicRoute?.driveFileId
    ? publicDriveEvent?.fileId === publicRoute.driveFileId ? publicDriveEvent.event : undefined
    : localPublicEvent
  const currentPublicDriveError = publicRoute?.driveFileId && publicDriveError?.fileId === publicRoute.driveFileId
    ? publicDriveError.message
    : null
  const publicDriveLoading = Boolean(publicRoute?.driveFileId && !publicEvent && !currentPublicDriveError)

  useEffect(() => {
    if (!publicRoute?.driveFileId) return

    let active = true
    fetchDriveEvent(publicRoute.driveFileId, driveAccessToken || undefined)
      .then((event) => {
        if (active && publicRoute.driveFileId) setPublicDriveEvent({ fileId: publicRoute.driveFileId, event })
      })
      .catch((error) => {
        if (active && publicRoute.driveFileId) {
          setPublicDriveError({
            fileId: publicRoute.driveFileId,
            message: error instanceof Error ? error.message : 'Unable to load Drive page.',
          })
        }
      })

    return () => {
      active = false
    }
  }, [publicRoute?.driveFileId, driveAccessToken])

  useEffect(() => {
    if (path === '/builder' && editingEvent?.isPublished) {
      navigate(getPublicPath(editingEvent, user), true)
    }
  }, [editingEvent, path, user])

  useEffect(() => {
    if (publicRoute) {
      setPageSeo(publicEvent)
      return
    }

    if (path === '/samples') {
      document.title = 'Sample Event Websites | Lovingly'
      setMetaTag('description', 'Explore sample wedding invitation websites, birthday websites, baby shower pages, and personal event microsites made with Lovingly.')
      setMetaTag('keywords', getSeoKeywords())
      return
    }

    if (path === '/builder' && editingEvent) {
      setPageSeo(editingEvent)
      return
    }

    setPageSeo()
  }, [editingEvent, path, publicEvent, publicRoute])

  function navigate(nextPath: string, replace = false) {
    if (replace) {
      window.history.replaceState({}, '', nextPath)
    } else {
      window.history.pushState({}, '', nextPath)
    }
    setPath(nextPath)
  }

  function updateEvent(nextEvent: LovinglyEvent) {
    setEvents((currentEvents) =>
      currentEvents.map((event) => (event.id === nextEvent.id ? nextEvent : event)),
    )
  }

  async function requestDriveAccess() {
    if (!firebaseReady || !auth) {
      setDriveError('Firebase is not configured. Add Firebase web app keys before publishing to Drive.')
      return ''
    }

    const result = await signInWithPopup(auth, googleProvider)
    const credential = GoogleAuthProvider.credentialFromResult(result)
    const token = credential?.accessToken || ''
    if (!token) throw new Error('Google Drive access was not granted. Please try again.')
    sessionStorage.setItem(DRIVE_TOKEN_KEY, token)
    setDriveAccessToken(token)
    return token
  }

  async function publishEvent(event: LovinglyEvent) {
    if (drivePublishing) return
    if (event.isPublished) {
      navigate(getPublicPath(event, user))
      return
    }

    const { isValid, errors } = validateEvent(event)
    if (!isValid) {
      alert(`Cannot publish. Please fix the following errors:\n${Object.values(errors).map(err => `- ${err}`).join('\n')}`)
      return
    }

    const confirmed = confirm(
      'Please preview this page before publishing. Once published, this event cannot be edited. Publish now?',
    )
    if (!confirmed) return

    setDrivePublishing(true)
    setDriveError(null)
    try {
      const token = driveAccessToken || await requestDriveAccess()
      const { event: driveEvent } = await publishEventToDrive(token, {
        ...event,
        creatorPath: getEventCreatorPath(event, user),
      })

      updateEvent(driveEvent)
      setPublicReturnPath('/user')
      showToast('Successfully published to Google Drive!', 'success')
      navigate(getPublicPath(driveEvent, user))
    } catch (error) {
      setDriveError(error instanceof Error ? error.message : 'Unable to publish to Google Drive.')
    } finally {
      setDrivePublishing(false)
    }
  }

  async function unpublishEvent(event: LovinglyEvent) {
    const confirmed = confirm(
      'Are you sure you want to unpublish this page? It will be removed from your Google Drive and converted back to a Draft. Anyone with the link will no longer be able to view it.'
    )
    if (!confirmed) return

    setDrivePublishing(true)
    setDriveError(null)
    try {
      const token = driveAccessToken || await requestDriveAccess()
      await unpublishEventFromDrive(token, event)
      
      const updated: LovinglyEvent = {
        ...event,
        isPublished: false,
        driveFileId: undefined,
        driveFolderId: undefined,
        drivePhotoFileIds: undefined,
        drivePublishedAt: undefined,
      }
      updateEvent(updated)
      showToast('Page unpublished successfully and restored to Draft.', 'success')
    } catch (error) {
      setDriveError(error instanceof Error ? error.message : 'Unable to unpublish from Google Drive.')
    } finally {
      setDrivePublishing(false)
    }
  }

  function deleteEvent(id: string) {
    const confirmed = confirm('Are you sure you want to delete this draft event? This action cannot be undone.')
    if (!confirmed) return

    setEvents((currentEvents) => currentEvents.filter((e) => e.id !== id))
    if (editingId === id) {
      setEditingId(null)
    }
    showToast('Event deleted successfully.', 'success')
  }

  function startEvent(type = selectedType) {
    if (events.length >= pageLimit) {
      navigate('/subscription')
      return
    }
    const nextEvent = createBlankEvent(type, getUserPathName(user))
    setEvents((currentEvents) => [nextEvent, ...currentEvents])
    setEditingId(nextEvent.id)
    navigate('/builder')
  }

  async function handleGoogleLogin() {
    setAuthError(null)
    if (!firebaseReady || !auth) {
      setAuthError('Firebase is not configured. Add a .env.local file with your Firebase web app keys.')
      return
    }

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      if (credential?.accessToken) {
        sessionStorage.setItem(DRIVE_TOKEN_KEY, credential.accessToken)
        setDriveAccessToken(credential.accessToken)
      }
      if (result.user) navigate('/user', true)
    } catch (error) {
      const code = (error as { code?: string }).code
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return
      if (code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider)
        return
      }
      setAuthError(getAuthErrorMessage(error))
    }
  }

  async function handleLogout() {
    if (auth) await signOut(auth)
    sessionStorage.removeItem(DRIVE_TOKEN_KEY)
    setDriveAccessToken('')
    setEvents([])
    setEditingId(null)
    navigate('/', true)
  }

  const renderContent = () => {
    if (authLoading) {
      return (
        <main className="home-shell">
          <section className="home-hero">
            <div className="hero-copy centered">
              <p className="hero-description">Loading...</p>
            </div>
          </section>
        </main>
      )
    }

    if (publicRoute) {
      return (
        <PublicPage
          event={publicEvent}
          loading={publicDriveLoading}
          error={currentPublicDriveError}
          onRequestDriveAccess={publicRoute.driveFileId ? async () => {
            try {
              const token = await requestDriveAccess()
              if (!publicRoute.driveFileId || !token) return
              const event = await fetchDriveEvent(publicRoute.driveFileId, token)
              setPublicDriveEvent({ fileId: publicRoute.driveFileId, event })
            } catch (error) {
              if (publicRoute.driveFileId) {
                setPublicDriveError({
                  fileId: publicRoute.driveFileId,
                  message: error instanceof Error ? error.message : 'Unable to load Drive page.',
                })
              }
            }
          } : undefined}
          onBack={() => navigate(isLoggedIn ? publicReturnPath : '/')}
          onHome={() => navigate(isLoggedIn ? '/user' : '/')}
          onPublish={isLoggedIn && publicEvent && !publicEvent.isPublished ? () => publishEvent(publicEvent) : undefined}
        />
      )
    }

    if (path === '/samples') {
      return <SamplesPage onBack={() => navigate(isLoggedIn ? '/user' : '/')} onHome={() => navigate(isLoggedIn ? '/user' : '/')} />
    }

    if (path === '/terms') {
      return <TermsPage onBack={() => navigate(isLoggedIn ? '/user' : '/')} onHome={() => navigate(isLoggedIn ? '/user' : '/')} />
    }

    if (path === '/about') {
      return <AboutPage onBack={() => navigate(isLoggedIn ? '/user' : '/')} onHome={() => navigate(isLoggedIn ? '/user' : '/')} />
    }

    if (path === '/contact') {
      return <ContactPage onBack={() => navigate(isLoggedIn ? '/user' : '/')} onHome={() => navigate(isLoggedIn ? '/user' : '/')} />
    }

    if (!isLoggedIn) {
      return (
        <Home
          authError={authError}
          onLogin={handleGoogleLogin}
          onSamples={() => navigate('/samples')}
          onTerms={() => navigate('/terms')}
          onAbout={() => navigate('/about')}
          onContact={() => navigate('/contact')}
        />
      )
    }

    if (path === '/create') {
      return (
        <CreateEvent
          user={user!}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          canCreate={events.length < pageLimit}
          onBack={() => navigate('/user')}
          onHome={() => navigate('/user')}
          onLogout={handleLogout}
          onCreate={() => startEvent()}
          onSubscription={() => navigate('/subscription')}
        />
      )
    }

    if (path === '/subscription') {
      return (
        <SubscriptionPage
          activeEvents={events.length}
          pageLimit={pageLimit}
          user={user!}
          onBack={() => navigate('/user')}
          onHome={() => navigate('/user')}
          onLogout={handleLogout}
        />
      )
    }

    if (path === '/builder' && editingEvent) {
      return (
        <EventEditor
          user={user!}
          event={editingEvent}
          onBack={() => navigate('/user')}
          onHome={() => navigate('/user')}
          onLogout={handleLogout}
          onOpenPublic={() => {
            setPublicReturnPath('/builder')
            navigate(getPublicPath(editingEvent, user))
          }}
          onPublish={() => publishEvent(editingEvent)}
          publishing={drivePublishing}
          driveError={driveError}
          onUpdate={updateEvent}
          showToast={showToast}
        />
      )
    }

    return (
      <Dashboard
        user={user!}
        events={events}
        pageLimit={pageLimit}
        onCreate={() => navigate('/create')}
        onSubscription={() => navigate('/subscription')}
        onEdit={(id) => {
          setEditingId(id)
          navigate('/builder')
        }}
        onOpenPublic={(event) => {
          setPublicReturnPath('/user')
          navigate(getPublicPath(event, user))
        }}
        onHome={() => navigate('/user')}
        onLogout={handleLogout}
        onTerms={() => navigate('/terms')}
        onAbout={() => navigate('/about')}
        onContact={() => navigate('/contact')}
        onDelete={deleteEvent}
        onUnpublish={unpublishEvent}
      />
    )
  }

  return (
    <>
      {renderContent()}
      {drivePublishing && (
        <div className="loading-overlay" role="alert" aria-busy="true">
          <div className="spinner-container">
            <div className="spinner"></div>
            <p className="spinner-text">Publishing to Google Drive...</p>
            <span className="spinner-subtext">Creating secure files and saving your assets.</span>
          </div>
        </div>
      )}
      {toast && (
        <div className={`toast toast-${toast.type}`} role="alert">
          <span className="toast-icon">{toast.type === 'success' ? '✨' : '⚠️'}</span>
          <p className="toast-message">{toast.message}</p>
          <button className="toast-close" onClick={() => setToast(null)}>&times;</button>
        </div>
      )}
    </>
  )
}

function UserBadge({ user, onLogout }: { user: User; onLogout: () => void }) {
  const label = user.displayName || user.email?.split('@')[0] || 'You'

  return (
    <div className="user-badge">
      {user.photoURL ? (
        <img className="user-avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
      ) : (
        <span className="user-avatar user-avatar-fallback" aria-hidden="true">
          {label.charAt(0).toUpperCase()}
        </span>
      )}
      <div className="user-badge-copy">
        <strong>{label}</strong>
        <span>Logged in with Google</span>
      </div>
      <button className="ghost-action" type="button" onClick={onLogout}>
        Sign out
      </button>
    </div>
  )
}

function AdSlot({ position, className = '' }: { position: 'top' | 'bottom'; className?: string }) {
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID
  const slotId = position === 'top' 
    ? import.meta.env.VITE_ADSENSE_TOP_SLOT_ID 
    : import.meta.env.VITE_ADSENSE_BOTTOM_SLOT_ID

  useEffect(() => {
    if (clientId && slotId) {
      // Dynamic injection of AdSense script
      const scriptId = 'google-adsense-script'
      let script = document.getElementById(scriptId) as HTMLScriptElement
      if (!script) {
        script = document.createElement('script')
        script.id = scriptId
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
        script.async = true
        script.crossOrigin = 'anonymous'
        document.body.appendChild(script)
      }

      try {
        // @ts-expect-error window.adsbygoogle is not typed globally
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        console.warn('AdSense ad push failed:', e)
      }
    }
  }, [clientId, slotId])

  if (!clientId || !slotId) {
    return (
      <div className={`ad-slot ${position} ${className}`}>
        <span>Advertisement Space ({position})</span>
      </div>
    )
  }

  return (
    <div className={`ad-slot adsense-slot ${position} ${className}`} style={{ minHeight: '90px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0', overflow: 'hidden' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minWidth: '250px' }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

function Home({
  authError,
  onLogin,
  onSamples,
  onTerms,
  onAbout,
  onContact,
}: {
  authError: string | null
  onLogin: () => void | Promise<void>
  onSamples: () => void
  onTerms: () => void
  onAbout: () => void
  onContact: () => void
}) {
  const [isSigningIn, setIsSigningIn] = useState(false)

  async function handleLoginClick() {
    setIsSigningIn(true)
    try {
      await onLogin()
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <main className="home-shell">
      <div className="celebration-bg" aria-hidden="true">
        {homeDecorations.map((decoration, index) => (
          <span key={`${decoration}-${index}`}>{decoration}</span>
        ))}
      </div>
      <nav className="topbar">
        <LogoMark />
        <button className="nav-link" type="button" onClick={onSamples}>
          Samples
        </button>
      </nav>
      <section className="home-hero">
        <div className="hero-copy centered">
          <div className="brand-lockup">
            <span>Yours</span>
            <h1>Lovingly</h1>
          </div>
          <p className="hero-description">Custom event microsite builder</p>
          <button
            className="primary-action"
            type="button"
            onClick={handleLoginClick}
            disabled={isSigningIn}
          >
            <span className="google-dot">G</span>
            {isSigningIn ? 'Signing in...' : 'Continue with Google'}
          </button>
          {authError && <p className="notice">{authError}</p>}
        </div>
      </section>
      <AdSlot position="bottom" />
      <footer className="home-footer">
        <p>To create custom event websites or digital products, reach out to the creator at <a href="mailto:unpredictable.knucklehead.era@gmail.com">unpredictable.knucklehead.era@gmail.com</a></p>
        <div className="footer-links">
          <button className="text-link" type="button" onClick={onAbout}>About</button>
          <button className="text-link" type="button" onClick={onContact}>Contact</button>
          <button className="text-link" type="button" onClick={onTerms}>Terms & Security Policy</button>
        </div>
      </footer>
    </main>
  )
}

function SamplesPage({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  return (
    <main className="samples-shell">
      <nav className="topbar page-topbar">
        <LogoMark onClick={onHome} />
        <button className="page-back" type="button" onClick={onBack}>
          Back
        </button>
      </nav>
      <header className="samples-header">
        <p className="eyebrow">Samples</p>
        <h1>Event page ideas</h1>
        <p>Different color moods for birthdays, weddings, baby showers, and playful memory pages.</p>
      </header>
      <section className="samples-grid">
        {sampleEvents.map((event) => (
          <article className="sample-frame" key={event.id}>
            <div className="sample-art" aria-hidden="true">
              {sampleVisuals[event.id]}
            </div>
            <PublicPage event={event} embedded />
          </article>
        ))}
      </section>
    </main>
  )
}

function TermsPage({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  return (
    <main className="samples-shell">
      <nav className="topbar page-topbar">
        <LogoMark onClick={onHome} />
        <button className="page-back" type="button" onClick={onBack}>
          Back
        </button>
      </nav>
      <header className="samples-header">
        <p className="eyebrow">Legal & Security</p>
        <h1>Terms, Security & Policies</h1>
        <p>Everything you need to know about how Yours Lovingly works, what we do with your data, and how payments and refunds are handled.</p>
      </header>
      <section className="terms-container">

        <article className="form-section">
          <h2>1. Data Security & Storage</h2>
          <p>
            Yours Lovingly is a serverless, client-side application. Your event configurations, photos, and settings are stored directly in your own browser's local storage, or published directly into a secure folder inside <strong>your own personal Google Drive</strong> (as a file named <code>lovingly-page.json</code>).
          </p>
          <p>
            Because we do not operate an intermediate database or backend server, <strong>your files and data are never stored or intercepted by us.</strong> All data transfers happen directly and securely between your browser and Google's API endpoints.
          </p>
        </article>

        <article className="form-section">
          <h2>2. Scope of Google Drive Access</h2>
          <p>
            We request access only using the limited <code>drive.file</code> OAuth scope. This permission is strictly confined:
          </p>
          <ul>
            <li>We can <strong>only</strong> read and write files that Yours Lovingly itself created.</li>
            <li>We <strong>cannot</strong> access, scan, read, or modify any other files, folders, spreadsheets, or personal documents in your Google Drive.</li>
            <li>We do <strong>not</strong> harvest or store your credentials. Access tokens are kept transiently in browser session storage and are destroyed upon logout.</li>
          </ul>
        </article>

        <article className="form-section">
          <h2>3. Privacy & Access Control</h2>
          <p>
            When publishing a page, you may choose <strong>Restricted</strong> access. Only users who sign in with the specific Google email addresses you authorize will be permitted by Google Drive to view your page.
          </p>
          <p>
            Access validation is performed directly by Google Cloud's security infrastructure. No unauthorized third-party can read your restricted page data.
          </p>
        </article>

        <article className="form-section">
          <h2>4. SSL & Cryptographic Safety</h2>
          <p>
            All network communication is encrypted over HTTPS (TLS/SSL). Authentication is handled via Firebase Authentication — passwords, tokens, and credentials are encrypted using industry-standard security protocols.
          </p>
        </article>

        <article className="form-section">
          <h2>5. Pricing & Payment Policy</h2>
          <p>Yours Lovingly offers the following purchase options (payments enabled in the next version):</p>
          <ul>
            <li><strong>Free Plan:</strong> 1 memory page, ad-supported. No payment required.</li>
            <li><strong>Premium — ₹499 (one-time):</strong> Unlocks 15 memory pages permanently with zero ads. This is a single one-time payment — there is no subscription, no auto-renewal, and no monthly billing.</li>
            <li><strong>Extra Page Add-on — ₹49 (one-time):</strong> Unlocks 1 additional ad-free memory page slot. Can be purchased multiple times. No recurring billing.</li>
          </ul>
          <p>
            All prices are in Indian Rupees (INR). Prices are inclusive of applicable taxes where required.
          </p>
        </article>

        <article className="form-section">
          <h2>6. Cancellation Policy</h2>
          <p>
            Since all purchases on Yours Lovingly are <strong>one-time payments</strong> and not subscriptions, there is nothing to cancel. You will not be charged again after your purchase. No auto-renewals occur.
          </p>
          <p>
            Your purchased page slots remain active in your account permanently — there is no expiry date, no renewal reminder, and no cancellation process required.
          </p>
        </article>

        <article className="form-section">
          <h2>7. Refund & Return Policy</h2>
          <p>
            All purchases on Yours Lovingly are <strong>non-refundable</strong>. Because our products are digital goods that are activated immediately upon purchase, we are unable to offer refunds or returns once a transaction is completed.
          </p>
          <ul>
            <li><strong>Premium (₹499):</strong> Non-refundable. The 15-page slots are activated immediately on your account. No refund will be issued after payment.</li>
            <li><strong>Extra Page Add-on (₹49):</strong> Non-refundable. The additional page slot is activated immediately. No refund will be issued after payment.</li>
          </ul>
          <p>
            If you experience a technical issue where a purchase is completed but your account is not upgraded, please contact us at <a href="mailto:unpredictable.knucklehead.era@gmail.com">unpredictable.knucklehead.era@gmail.com</a> within 7 days with your payment receipt, and we will investigate and manually resolve it at no additional charge.
          </p>
          <p>
            We are not responsible for purchases made in error or accidental purchases. Please review your selection carefully before completing payment.
          </p>
        </article>

        <article className="form-section">
          <h2>8. Contact</h2>
          <p>
            For any questions regarding these policies, data concerns, or billing issues, please reach out:
          </p>
          <p>
            📧 <a href="mailto:unpredictable.knucklehead.era@gmail.com">unpredictable.knucklehead.era@gmail.com</a>
          </p>
          <p>
            We aim to respond within 2 business days.
          </p>
        </article>

      </section>

      <footer className="public-footer">
        <span>Yours Lovingly — Legal & Security</span>
        <strong>Last updated: June 2026</strong>
      </footer>
    </main>
  )
}

function AboutPage({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  return (
    <main className="samples-shell">
      <nav className="topbar page-topbar">
        <LogoMark onClick={onHome} />
        <button className="page-back" type="button" onClick={onBack}>
          Back
        </button>
      </nav>
      <header className="samples-header">
        <p className="eyebrow">About Us</p>
        <h1>About Yours Lovingly</h1>
        <p>A personal, premium event microsite builder designed to celebrate life's most precious moments.</p>
      </header>
      <section className="terms-container">
        <article className="form-section">
          <h2>Our Mission</h2>
          <p>
            Yours Lovingly was born from a simple idea: that celebrating milestones should be beautiful, intimate, and free from complex website builders. Whether it's a birthday bash, a dream wedding, or a quiet memorial, we provide a premium, modern space to capture your memories.
          </p>
        </article>

        <article className="form-section">
          <h2>Drive-Backed Architecture</h2>
          <p>
            We care deeply about ownership. Unlike traditional platforms that lock your photos and text in proprietary databases, Yours Lovingly saves your events directly into <strong>your own Google Drive</strong>. Your memories remain yours forever, completely under your control, even if you stop using our service.
          </p>
        </article>

        <article className="form-section">
          <h2>Free & Premium Options</h2>
          <p>
            We believe digital celebrations should be accessible to everyone. Our Free Plan includes one ad-supported memory page slot. For users seeking an ad-free experience with multiple slots, our Premium options offer lifelong access with a single, transparent one-time fee.
          </p>
        </article>
      </section>
      <footer className="public-footer">
        <span>Yours Lovingly — About Us</span>
        <strong>Last updated: June 2026</strong>
      </footer>
    </main>
  )
}

function ContactPage({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  return (
    <main className="samples-shell">
      <nav className="topbar page-topbar">
        <LogoMark onClick={onHome} />
        <button className="page-back" type="button" onClick={onBack}>
          Back
        </button>
      </nav>
      <header className="samples-header">
        <p className="eyebrow">Support & Contact</p>
        <h1>Contact Us</h1>
        <p>Have questions, feedback, or need technical assistance? We're here to help.</p>
      </header>
      <section className="terms-container">
        <article className="form-section">
          <h2>Get in Touch</h2>
          <p>
            We want your experience with Yours Lovingly to be seamless. For customer support, general inquiries, business proposals, or technical assistance regarding your pages or Google Drive integration, you can email us directly:
          </p>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '1rem 0' }}>
            📧 <a href="mailto:unpredictable.knucklehead.era@gmail.com">unpredictable.knucklehead.era@gmail.com</a>
          </p>
          <p>
            We read every email and aim to respond within 24 to 48 business hours.
          </p>
        </article>

        <article className="form-section">
          <h2>Billing & Payment Issues</h2>
          <p>
            If you encounter any issues during checkouts or premium feature upgrades, please include your transaction receipt or transaction ID in your email. We will verify and manually activate your upgrades.
          </p>
        </article>

        <article className="form-section">
          <h2>Data Concerns & Abuse</h2>
          <p>
            If you wish to report copyright infringement, abuse, or inappropriate content hosted via public Yours Lovingly pages, please email us with the link to the offending page. Since files are hosted on individual Google Drives, we will coordinate with the respective owner and Google Support as necessary.
          </p>
        </article>
      </section>
      <footer className="public-footer">
        <span>Yours Lovingly — Contact Us</span>
        <strong>Last updated: June 2026</strong>
      </footer>
    </main>
  )
}

function Dashboard({
  user,
  events,
  pageLimit,
  onCreate,
  onSubscription,
  onEdit,
  onOpenPublic,
  onHome,
  onLogout,
  onTerms,
  onAbout,
  onContact,
  onDelete,
  onUnpublish,
}: {
  user: User
  events: LovinglyEvent[]
  pageLimit: number
  onCreate: () => void
  onSubscription: () => void
  onEdit: (id: string) => void
  onOpenPublic: (event: LovinglyEvent) => void
  onHome: () => void
  onLogout: () => void
  onTerms: () => void
  onAbout: () => void
  onContact: () => void
  onDelete: (id: string) => void
  onUnpublish: (event: LovinglyEvent) => void
}) {
  const limitReached = events.length >= pageLimit
  const createLabel = events.length === 0 ? 'Create first event' : 'Create new event'

  return (
    <main className="app-shell">
      <AdSlot position="top" />
      <header className="app-header">
        <div className="header-title-row">
          <LogoMark onClick={onHome} />
          <div>
            <p className="eyebrow">Lovingly dashboard</p>
            <h1>Your memory pages</h1>
          </div>
        </div>
        <UserBadge user={user} onLogout={onLogout} />
      </header>

      <section className="status-strip">
        <div>
          <strong>{events.length}/{pageLimit}</strong>
          <span>active events</span>
        </div>
        <div>
          <strong>{MAX_PHOTOS}</strong>
          <span>photos per event</span>
        </div>
        <div className="welcome-pill">
          <span>Current plan</span>
          <strong>Free</strong>
        </div>
        {events.length > 0 && (
          <button className="primary-action" type="button" onClick={limitReached ? onSubscription : onCreate}>
            {limitReached ? 'View plans' : createLabel}
          </button>
        )}
      </section>

      {limitReached && (
        <p className="notice">Your current plan includes {pageLimit} memory page{pageLimit === 1 ? '' : 's'}. Visit subscription details to unlock more.</p>
      )}

      <section className="event-grid">
        {events.length === 0 ? (
          <div className="empty-state">
            <h2>No pages yet</h2>
            <p>Start with one event type, add a few photos, write your message, and publish.</p>
            <button className="primary-action" type="button" onClick={onCreate}>
              {createLabel}
            </button>
          </div>
        ) : (
          events.map((event) => (
            <article className="event-card" key={event.id}>
              <div
                className="event-swatch"
                style={{
                  background: `linear-gradient(135deg, ${event.secondaryColor}, ${event.highlightColor})`,
                }}
              >
                {event.elements.slice(0, 2).map((element) => (
                  <span key={element}>{elementGlyphs[element]}</span>
                ))}
              </div>
              <div className="event-card-body">
                <p className="mini-label">{getEventLabel(event)}</p>
                <h2>{event.title || 'Untitled memory page'}</h2>
                <p>{event.recipientName || 'Recipient name not added yet'}</p>
                <small>{event.isPublished ? getPublicPath(event, user) : 'Draft'}</small>
              </div>
              <div className="card-actions">
                <button type="button" onClick={() => (event.isPublished ? onOpenPublic(event) : onEdit(event.id))}>
                  {event.isPublished ? 'View' : 'Edit'}
                </button>
                {event.isPublished ? (
                  <button className="unpublish-btn" type="button" onClick={() => onUnpublish(event)}>
                    Unpublish
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={() => onOpenPublic(event)}>
                      Preview
                    </button>
                    <button className="delete-btn" type="button" onClick={() => onDelete(event.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </article>
          ))
        )}
      </section>
      <AdSlot position="bottom" />
      <footer className="home-footer">
        <p>To create custom event websites or digital products, reach out to the creator at <a href="mailto:unpredictable.knucklehead.era@gmail.com">unpredictable.knucklehead.era@gmail.com</a></p>
        <div className="footer-links">
          <button className="text-link" type="button" onClick={onAbout}>About</button>
          <button className="text-link" type="button" onClick={onContact}>Contact</button>
          <button className="text-link" type="button" onClick={onTerms}>Terms & Security Policy</button>
        </div>
      </footer>
    </main>
  )
}

function CreateEvent({
  user,
  selectedType,
  setSelectedType,
  canCreate,
  onBack,
  onHome,
  onLogout,
  onCreate,
  onSubscription,
}: {
  user: User
  selectedType: EventKind
  setSelectedType: (type: EventKind) => void
  canCreate: boolean
  onBack: () => void
  onHome: () => void
  onLogout: () => void
  onCreate: () => void
  onSubscription: () => void
}) {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="header-title-row">
          <LogoMark onClick={onHome} />
          <div>
            <p className="eyebrow">Step 1</p>
            <h1>Choose event type</h1>
          </div>
        </div>
        <div className="header-actions">
          <button className="ghost-action" type="button" onClick={onBack}>
            Back
          </button>
          <UserBadge user={user} onLogout={onLogout} />
        </div>
      </header>

      <section className="type-grid">
        {eventTypes.map((eventType) => (
          <button
            className={eventType.id === selectedType ? 'type-tile selected' : 'type-tile'}
            key={eventType.id}
            type="button"
            onClick={() => setSelectedType(eventType.id)}
          >
            <strong>{eventType.label}</strong>
            <span>{eventType.description}</span>
          </button>
        ))}
      </section>

      <footer className="sticky-footer">
        <p>{canCreate ? 'Next: add details and photos.' : 'Free plan includes 1 memory page.'}</p>
        <button className="primary-action" type="button" onClick={canCreate ? onCreate : onSubscription}>
          {canCreate ? 'Continue' : 'View plans'}
        </button>
      </footer>
      <AdSlot position="bottom" />
    </main>
  )
}

function SubscriptionPage({
  activeEvents,
  pageLimit,
  user,
  onBack,
  onHome,
  onLogout,
}: {
  activeEvents: number
  pageLimit: number
  user: User
  onBack: () => void
  onHome: () => void
  onLogout: () => void
}) {
  return (
    <main className="app-shell">
      <AdSlot position="top" />
      <header className="app-header">
        <div className="header-title-row">
          <LogoMark onClick={onHome} />
          <div>
            <p className="eyebrow">Pricing</p>
            <h1>Choose your plan</h1>
          </div>
        </div>
        <div className="header-actions">
          <button className="ghost-action" type="button" onClick={onBack}>
            Dashboard
          </button>
          <UserBadge user={user} onLogout={onLogout} />
        </div>
      </header>

      <section className="status-strip">
        <div>
          <strong>{activeEvents}/{pageLimit}</strong>
          <span>page slots used</span>
        </div>
        <div>
          <strong>{MAX_PHOTOS}</strong>
          <span>photos per page</span>
        </div>
        <div className="welcome-pill">
          <span>Current plan</span>
          <strong>Free</strong>
        </div>
      </section>

      <section className="subscription-grid">
        <article className="form-section">
          <div className="section-title">
            <div>
              <h2>Free</h2>
              <span>Forever free, one page</span>
            </div>
            <p className="plan-price">₹0</p>
          </div>
          <ul className="plan-list">
            <li>1 active memory page</li>
            <li>Includes advertisements on page</li>
            <li>Preview before publishing</li>
            <li>Published pages stay viewable</li>
            <li>No payment required</li>
          </ul>
          <button className="primary-action" type="button" disabled>
            Current plan
          </button>
        </article>

        <article className="form-section plan-featured">
          <div className="plan-badge">Most Popular</div>
          <div className="section-title">
            <div>
              <h2>Premium</h2>
              <span>One-time payment — 15 pages forever</span>
            </div>
            <p className="plan-price">₹499</p>
          </div>
          <ul className="plan-list">
            <li>15 active memory pages</li>
            <li>100% Ad-free event invites</li>
            <li>More customization controls</li>
            <li>Private sharing options</li>
            <li>No subscription, no renewal</li>
            <li>No cancellation needed — pay once</li>
          </ul>
          <p className="plan-policy-note">⚠️ One-time purchase. No refunds once activated. See Refund Policy.</p>
          <button
            className="secondary-action"
            type="button"
            disabled
          >
            Coming next version
          </button>
        </article>

        <article className="form-section">
          <div className="section-title">
            <div>
              <h2>Extra page</h2>
              <span>One-time add-on for 1 extra page</span>
            </div>
            <p className="plan-price">₹49</p>
          </div>
          <ul className="plan-list">
            <li>Add 1 extra memory page slot</li>
            <li>100% Ad-free event invite</li>
            <li>One-time payment, no recurring billing</li>
            <li>Stackable — buy multiple times</li>
          </ul>
          <p className="plan-policy-note">⚠️ One-time purchase. Non-refundable. See Refund Policy.</p>
          <button
            className="secondary-action"
            type="button"
            disabled
          >
            Coming next version
          </button>
        </article>
      </section>

      <p className="notice">Payments will be enabled in the next version. All purchases are one-time — no subscriptions, no auto-renewals. Read our <strong>Refund & Cancellation Policy</strong> in the Terms page before purchasing.</p>
      <AdSlot position="bottom" />
    </main>
  )
}

function EventEditor({
  user,
  event,
  onBack,
  onHome,
  onLogout,
  onOpenPublic,
  onPublish,
  publishing,
  driveError,
  onUpdate,
  showToast,
}: {
  user: User
  event: LovinglyEvent
  onBack: () => void
  onHome: () => void
  onLogout: () => void
  onOpenPublic: () => void
  onPublish: () => void
  publishing: boolean
  driveError: string | null
  onUpdate: (event: LovinglyEvent) => void
  showToast: (message: string, type?: 'success' | 'error') => void
}) {
  const shareUrl = `${window.location.origin}${getPublicPath(event, user)}`
  const { isValid, errors } = useMemo(() => validateEvent(event), [event])

  function setField<T extends keyof LovinglyEvent>(field: T, value: LovinglyEvent[T]) {
    onUpdate({ ...event, [field]: value })
  }

  async function onPhotoInput(files: FileList | null) {
    if (!files) return
    const existingPhotos = getContentBlocks(event).filter((block) => block.kind === 'photo').length
    const availableSlots = MAX_PHOTOS - existingPhotos
    const selectedFiles = Array.from(files).slice(0, availableSlots)
    const compressedPhotos = await Promise.all(selectedFiles.map((file) => compressImage(file)))
    onUpdate({
      ...event,
      photos: [...event.photos, ...compressedPhotos],
      contentBlocks: [...getContentBlocks(event), ...compressedPhotos.map(createPhotoBlock)],
    })
  }

  return (
    <main className="builder-shell">
      <section className="editor-panel">
        <AdSlot position="top" />
        <header className="editor-header">
          <div className="header-title-row">
            <LogoMark onClick={onHome} />
            <div>
              <p className="eyebrow">Builder</p>
              <h1>Edit event settings</h1>
            </div>
          </div>
          <div className="header-actions">
            <button className="ghost-action" type="button" onClick={onBack}>
              Dashboard
            </button>
            <UserBadge user={user} onLogout={onLogout} />
          </div>
        </header>

        <div className="form-section">
          <label>
            Event type
            <select value={event.eventType} onChange={(e) => setField('eventType', e.target.value as EventKind)}>
              {eventTypes.map((eventType) => (
                <option key={eventType.id} value={eventType.id}>
                  {eventType.label}
                </option>
              ))}
            </select>
          </label>
          {event.eventType === 'custom' && (
            <label>
              Custom event name
              <input
                value={event.customType}
                onChange={(e) => setField('customType', e.target.value)}
                placeholder="Naming ceremony, graduation..."
              />
            </label>
          )}
          <label>
            Event title <span className="required-star">*</span>
            <input
              value={event.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="A birthday full of love"
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </label>
          <label>
            Recipient name <span className="required-star">*</span>
            <input
              value={event.recipientName}
              onChange={(e) => setField('recipientName', e.target.value)}
              placeholder="Name"
              className={errors.recipientName ? 'input-error' : ''}
            />
            {errors.recipientName && <span className="error-message">{errors.recipientName}</span>}
          </label>
          <div className="split-fields">
            <label>
              Event date <span className="required-star">*</span>
              <input
                type="date"
                value={event.eventDate}
                onChange={(e) => setField('eventDate', e.target.value)}
                className={errors.eventDate ? 'input-error' : ''}
              />
              {errors.eventDate && <span className="error-message">{errors.eventDate}</span>}
            </label>
            <label>
              Optional location
              <input
                value={event.location}
                onChange={(e) => setField('location', e.target.value)}
                placeholder="Chennai"
              />
            </label>
          </div>
        </div>

        <MusicEditor event={event} onUpdate={onUpdate} />
        <section className="form-section">
          <div className="section-title">
            <div>
              <h2>Google Drive access</h2>
              <span>Choose who can view the published Drive-backed page</span>
            </div>
          </div>
          <div className="segmented-row two-items">
            {([
              { id: 'anyone', label: 'Anyone with link' },
              { id: 'restricted', label: 'Specific emails' },
            ] as const).map((option) => (
              <button
                className={(event.visibility ?? 'anyone') === option.id ? 'selected' : ''}
                key={option.id}
                type="button"
                onClick={() => setField('visibility', option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          {(event.visibility ?? 'anyone') === 'restricted' && (
            <label>
              Allowed Google emails
              <textarea
                value={event.allowedEmails || ''}
                onChange={(e) => setField('allowedEmails', e.target.value)}
                placeholder="friend@gmail.com, family@gmail.com"
              />
            </label>
          )}
        </section>
        <ThemeEditor event={event} onUpdate={onUpdate} />
        <StoryEditor event={event} onPhotoInput={onPhotoInput} onUpdate={onUpdate} />

        <section className="publish-panel">
          <div>
            <h2>Publish link</h2>
            <div className="share-url-container">
              <p className="share-url-text">{event.isPublished ? shareUrl : 'Publish to create a shareable page link.'}</p>
              {event.isPublished && (
                <button
                  className="copy-link-btn"
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl)
                    showToast('Link copied to clipboard!', 'success')
                  }}
                  title="Copy link to clipboard"
                >
                  📋 Copy
                </button>
              )}
            </div>
          </div>
          <div className="publish-actions-container">
            {!isValid && !event.isPublished && (
              <p className="validation-alert">
                ⚠️ Please fix the required fields above before publishing.
              </p>
            )}
            <div className="publish-actions">
              <button
                className="secondary-action"
                type="button"
                onClick={onPublish}
                disabled={publishing || (!isValid && !event.isPublished)}
              >
                {publishing ? 'Publishing to Drive...' : 'Publish'}
              </button>
              <button className="primary-action" type="button" onClick={onOpenPublic}>
                Preview page
              </button>
            </div>
          </div>
          {driveError && <p className="notice">{driveError}</p>}
        </section>
        <AdSlot position="bottom" />
      </section>

      <aside className="live-preview">
        <PublicPage event={event} embedded onUpdate={onUpdate} />
      </aside>
    </main>
  )
}

function MusicEditor({
  event,
  onUpdate,
}: {
  event: LovinglyEvent
  onUpdate: (event: LovinglyEvent) => void
}) {
  const [search, setSearch] = useState('')
  
  function setSpotifyUrl(url: string) {
    onUpdate({ ...event, spotifyUrl: url })
  }

  const demoTracks = [
    { name: 'Perfect', artist: 'Ed Sheeran', url: 'https://open.spotify.com/track/0tgVp0qyP7v7JvjH8pST68' },
    { name: 'A Thousand Years', artist: 'Christina Perri', url: 'https://open.spotify.com/track/6lanRQR6vPd9G9HSCbpS9C' },
    { name: 'Marry You', artist: 'Bruno Mars', url: 'https://open.spotify.com/track/629By0S96pGvYvS6O0M2C3' },
  ]

  const filteredTracks = search.length > 2 
    ? demoTracks.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.artist.toLowerCase().includes(search.toLowerCase()))
    : []

  return (
    <section className="form-section">
      <div className="section-title">
        <div>
          <h2>Music</h2>
          <span>Add a Spotify song link or playlist to set the mood</span>
        </div>
      </div>

      <div className="spotify-search-container">
        <input
          type="text"
          placeholder="Search for a song or paste Spotify song link..."
          value={search || event.spotifyUrl || ''}
          onChange={(e) => {
            setSearch(e.target.value)
            if (e.target.value.includes('spotify.com')) {
              setSpotifyUrl(e.target.value)
            }
          }}
          className="spotify-input"
        />
        
        {filteredTracks.length > 0 && (
          <div className="spotify-results">
            {filteredTracks.map(track => (
              <button 
                key={track.url} 
                className="spotify-result-item"
                onClick={() => {
                  setSpotifyUrl(track.url)
                  setSearch('')
                }}
              >
                <strong>{track.name}</strong>
                <span>{track.artist}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {event.spotifyUrl && (
        <div className="spotify-preview">
          <p className="mini-label">Preview</p>
          <div className="spotify-url-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.508 17.302c-.223.367-.704.484-1.071.262-2.973-1.815-6.716-2.227-11.122-1.22-.421.096-.837-.17-.933-.591-.096-.421.17-.837.591-.933 4.829-1.104 9.006-.632 12.335 1.402.367.222.484.704.262 1.071zm1.47-3.26c-.281.455-.877.599-1.332.318-3.403-2.092-8.591-2.7-12.615-1.478-.514.156-1.054-.14-1.21-.655-.156-.514.14-1.054.655-1.21 4.597-1.395 10.334-.72 14.28 1.706.455.281.599.877.322 1.332zm.127-3.407c-4.082-2.424-10.812-2.65-14.717-1.464-.626.19-1.291-.167-1.48-.793-.19-.626.167-1.291.793-1.48 4.49-1.363 11.944-1.1 16.634 1.684.563.334.752 1.059.418 1.622-.334.563-1.059.752-1.622.418z"/>
            </svg>
            <span>{event.spotifyUrl}</span>
            <button className="text-action" onClick={() => setSpotifyUrl('')}>Remove</button>
          </div>
        </div>
      )}
    </section>
  )
}

function StoryEditor({
  event,
  onPhotoInput,
  onUpdate,
}: {
  event: LovinglyEvent
  onPhotoInput: (files: FileList | null) => void
  onUpdate: (event: LovinglyEvent) => void
}) {
  const blocks = (event.contentBlocks?.length ? event.contentBlocks : getContentBlocks(event)).map(normalizeBlock)
  const photoCount = blocks.filter((block) => block.kind === 'photo').length

  function updateBlock(nextBlock: ContentBlock) {
    onUpdate({
      ...event,
      contentBlocks: blocks.map((block) => (block.id === nextBlock.id ? nextBlock : block)),
      messages: blocks
        .map((block) => (block.id === nextBlock.id ? nextBlock : block))
        .filter((block): block is Extract<ContentBlock, { kind: 'message' }> => block.kind === 'message')
        .map((block) => block.text),
    })
  }

  function removeBlock(blockId: string) {
    const nextBlocks = blocks.filter((block) => block.id !== blockId)
    onUpdate({
      ...event,
      contentBlocks: nextBlocks,
      messages: nextBlocks
        .filter((block): block is Extract<ContentBlock, { kind: 'message' }> => block.kind === 'message')
        .map((block) => block.text),
      photos: nextBlocks
        .filter((block): block is Extract<ContentBlock, { kind: 'photo' }> => block.kind === 'photo')
        .map((block) => block.src),
    })
  }

  function moveBlock(blockId: string, direction: -1 | 1) {
    const index = blocks.findIndex((block) => block.id === blockId)
    const nextIndex = index + direction
    if (index < 0 || nextIndex < 0 || nextIndex >= blocks.length) return
    const nextBlocks = [...blocks]
    const [block] = nextBlocks.splice(index, 1)
    nextBlocks.splice(nextIndex, 0, block)
    onUpdate({ ...event, contentBlocks: nextBlocks })
  }

  return (
    <section className="form-section">
      <div className="section-title">
        <div>
          <h2>Messages and photos</h2>
          <span>Build the page in the exact order you want</span>
        </div>
        <div className="story-add-actions">
          <button type="button" onClick={() => onUpdate({ ...event, contentBlocks: [...blocks, createMessageBlock()] })}>
            Add message
          </button>
          <label className={photoCount >= MAX_PHOTOS ? 'mini-upload disabled' : 'mini-upload'}>
            Add photos
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={photoCount >= MAX_PHOTOS}
              onChange={(e) => onPhotoInput(e.target.files)}
            />
          </label>
        </div>
      </div>

      <div className="story-block-list">
        {blocks.map((block, index) => (
          <article className="story-block-editor" key={block.id}>
            <header>
              <strong>{block.kind === 'message' ? `Message ${index + 1}` : `Photo ${index + 1}`}</strong>
              <div className="block-actions">
                <button type="button" onClick={() => moveBlock(block.id, -1)} disabled={index === 0}>
                  Move up
                </button>
                <button type="button" onClick={() => moveBlock(block.id, 1)} disabled={index === blocks.length - 1}>
                  Move down
                </button>
                <button type="button" onClick={() => removeBlock(block.id)}>
                  Remove
                </button>
              </div>
            </header>

            {block.kind === 'message' ? (
              <>
                <textarea
                  value={block.text}
                  onChange={(e) => updateBlock({ ...block, text: e.target.value })}
                  placeholder="Write something personal..."
                />
                <div className="split-fields three">
                  <div>
                    <p className="control-label">Text align</p>
                    <div className="segmented-row" aria-label="Text alignment">
                      {(['left', 'center', 'right'] as const).map((alignment) => (
                        <button
                          className={block.align === alignment ? 'selected' : ''}
                          key={alignment}
                          type="button"
                          onClick={() => updateBlock({ ...block, align: alignment })}
                        >
                          {alignment}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label>
                    Font style
                    <select
                      value={block.fontStyle}
                      onChange={(e) => updateBlock({ ...block, fontStyle: e.target.value as FontStyle })}
                    >
                      {fontStyles.map((font) => (
                        <option key={font.id} value={font.id}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Font size
                    <input
                      type="range"
                      min="16"
                      max="34"
                      value={block.fontSize}
                      onChange={(e) => updateBlock({ ...block, fontSize: Number(e.target.value) })}
                    />
                  </label>
                </div>
                <div>
                  <p className="control-label">Message border</p>
                  <div className="segmented-row four" aria-label="Message border style">
                    {borderStyles.map((border) => (
                      <button
                        className={block.borderStyle === border.id ? 'selected' : ''}
                        key={border.id}
                        type="button"
                        onClick={() => updateBlock({ ...block, borderStyle: border.id })}
                      >
                        {border.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="photo-edit-preview">
                  <img
                    src={block.src}
                    alt=""
                    style={{ objectPosition: `${block.positionX}% ${block.positionY}%` }}
                  />
                </div>
                <div className="split-fields">
                  <div>
                    <p className="control-label">Photo align</p>
                    <div className="segmented-row" aria-label="Photo alignment">
                      {(['left', 'center', 'right'] as const).map((alignment) => (
                        <button
                          className={block.align === alignment ? 'selected' : ''}
                          key={alignment}
                          type="button"
                          onClick={() => updateBlock({ ...block, align: alignment })}
                        >
                          {alignment}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label>
                    Photo width
                    <input
                      type="range"
                      min="220"
                      max="920"
                      value={block.width}
                      onChange={(e) => updateBlock({ ...block, width: Number(e.target.value) })}
                    />
                  </label>
                </div>
                <div className="split-fields">
                  <label>
                    Horizontal position
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={block.positionX}
                      onChange={(e) => updateBlock({ ...block, positionX: Number(e.target.value) })}
                    />
                  </label>
                  <label>
                    Vertical position
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={block.positionY}
                      onChange={(e) => updateBlock({ ...block, positionY: Number(e.target.value) })}
                    />
                  </label>
                </div>
                <div>
                  <p className="control-label">Photo border</p>
                  <div className="segmented-row four" aria-label="Photo border style">
                    {borderStyles.map((border) => (
                      <button
                        className={block.borderStyle === border.id ? 'selected' : ''}
                        key={border.id}
                        type="button"
                        onClick={() => updateBlock({ ...block, borderStyle: border.id })}
                      >
                        {border.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function ThemeEditor({
  event,
  onUpdate,
}: {
  event: LovinglyEvent
  onUpdate: (event: LovinglyEvent) => void
}) {
  return (
    <section className="form-section">
      <div className="section-title">
        <h2>Page style</h2>
        <span>Colors, elements, and background</span>
      </div>
      <div className="subsection-title">
        <h3>Color presets</h3>
        <span>Quick color sets</span>
      </div>
      <div className="palette-row">
        {palettePresets.map((palette) => (
          <button
            className="palette-button"
            key={palette.name}
            type="button"
            onClick={() =>
              onUpdate({
                ...event,
                primaryColor: palette.primary,
                secondaryColor: palette.secondary,
                highlightColor: palette.highlight,
              })
            }
          >
            <span style={{ background: palette.primary }}></span>
            <span style={{ background: palette.secondary }}></span>
            <span style={{ background: palette.highlight }}></span>
            {palette.name}
          </button>
        ))}
      </div>
      <div className="split-fields three">
        <label>
          Primary
          <input
            type="color"
            value={event.primaryColor}
            onChange={(e) => onUpdate({ ...event, primaryColor: e.target.value })}
          />
        </label>
        <label>
          Secondary
          <input
            type="color"
            value={event.secondaryColor}
            onChange={(e) => onUpdate({ ...event, secondaryColor: e.target.value })}
          />
        </label>
        <label>
          Highlight
          <input
            type="color"
            value={event.highlightColor}
            onChange={(e) => onUpdate({ ...event, highlightColor: e.target.value })}
          />
        </label>
      </div>
      <div className="subsection-title">
        <h3>Elements</h3>
        <span>Top panel, max {MAX_ELEMENTS}</span>
      </div>
      <div className="element-row">
        {elementOptions.map((element) => (
          <button
            className={event.elements.includes(element) ? 'element-chip selected' : 'element-chip'}
            key={element}
            type="button"
            onClick={() => {
              const elements = event.elements.includes(element)
                ? event.elements.filter((item) => item !== element)
                : [...event.elements, element].slice(-MAX_ELEMENTS)
              onUpdate({ ...event, elements })
            }}
          >
            <span>{elementGlyphs[element]}</span>
            {element}
          </button>
        ))}
      </div>
      <div className="subsection-title">
        <h3>Background layer</h3>
        <span>Quick defaults</span>
      </div>
      <div className="palette-row">
        {[
          { label: 'Hearts', value: '💖 💕 💗 💓', pattern: 'hearts' },
          { label: 'Party', value: '🎈 🎉 ✨ 🎊', pattern: 'hearts' },
          { label: 'Flowers', value: '🌸 🌷 🌼 🌻', pattern: 'flowers' },
          { label: 'Stars', value: '⭐ ✨ 🌟 💫', pattern: 'stars' },
          { label: 'Clear', value: '', pattern: 'none' },
        ].map((preset) => (
          <button
            key={preset.label}
            type="button"
            className={event.backgroundPattern === preset.pattern ? 'pattern-button selected' : 'pattern-button'}
            onClick={() => onUpdate({ ...event, backgroundText: preset.value, backgroundPattern: preset.pattern as BackgroundPattern })}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <label>
        Custom background text or emojis
        <input
          value={event.backgroundText ?? ''}
          onChange={(e) => onUpdate({ ...event, backgroundText: e.target.value, backgroundPattern: e.target.value ? 'hearts' : 'none' })}
          placeholder="Example: 💖 ✨ Happy Birthday 🎈"
        />
      </label>
    </section>
  )
}

function PublicPage({
  event,
  embedded = false,
  loading = false,
  error = null,
  onBack,
  onHome,
  onPublish,
  onRequestDriveAccess,
  onUpdate,
}: {
  event?: LovinglyEvent
  embedded?: boolean
  loading?: boolean
  error?: string | null
  onBack?: () => void
  onHome?: () => void
  onPublish?: () => void
  onRequestDriveAccess?: () => void | Promise<void> | Promise<string>
  onUpdate?: (event: LovinglyEvent) => void
}) {
  const countdown = useMemo(() => getCountdown(event?.eventDate ?? ''), [event?.eventDate])
  const contentBlocks = event ? getContentBlocks(event) : []
  const displayElements = event ? getDisplayElements(event) : []

  const spotifyEmbedUrl = useMemo(() => {
    if (!event?.spotifyUrl) return null
    try {
      const url = new URL(event.spotifyUrl)
      const path = url.pathname
      if (path.includes('/playlist/')) return `https://open.spotify.com/embed/playlist/${path.split('/playlist/')[1].split('?')[0]}`
      if (path.includes('/track/')) return `https://open.spotify.com/embed/track/${path.split('/track/')[1].split('?')[0]}`
      if (path.includes('/album/')) return `https://open.spotify.com/embed/album/${path.split('/album/')[1].split('?')[0]}`
      return null
    } catch {
      return null
    }
  }, [event])

  const backgroundDecor = useMemo(() => {
    if (!event?.backgroundText) return []
    const emojis = event.backgroundText.split(/\s+/).filter(Boolean)
    if (emojis.length === 0) return []

    // 5x4 grid for plenty of space and zero overlap
    const rows = 5
    const cols = 4
    const items = []
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c
        // Use event details for stable but "unique" feel per page
        const seed = (r * 7) + (c * 13) + (event?.id?.charCodeAt(0) || 0)
        
        items.push({
          emoji: emojis[i % emojis.length],
          top: `${(r / rows) * 100 + 10}%`,
          left: `${(c / cols) * 100 + 12.5}%`,
          rotate: `${(seed % 40) - 20}deg`,
          size: '26px',
          opacity: 0.18,
        })
      }
    }
    return items
  }, [event])

  if (loading) {
    return (
      <main className="public-page missing-page">
        <h1>Loading page</h1>
        <p>Fetching this Lovingly page from Google Drive.</p>
      </main>
    )
  }

  if (!event) {
    return (
      <main className="public-page missing-page">
        <h1>Page not found</h1>
        <p>{error || 'This Lovingly page may be unavailable or the link is wrong.'}</p>
        {onRequestDriveAccess && (
          <button className="primary-action" type="button" onClick={() => void onRequestDriveAccess()}>
            Continue with Google
          </button>
        )}
        {onBack && (
          <button className="primary-action" type="button" onClick={onBack}>
            Back home
          </button>
        )}
      </main>
    )
  }

  function handleBackgroundClick(e: React.MouseEvent) {
    if (!onUpdate || !event) return
    e.stopPropagation()
    
    const allHearts = '💖 💕 💗 💓 💞 💘 💝 💟'
    const allEmojis = Object.values(elementGlyphs).join(' ')
    
    // Cycle logic: Empty -> Hearts -> Mix -> Empty
    const current = event.backgroundText || ''
    const nextText = !current ? allHearts : (current === allHearts ? allEmojis : '')

    onUpdate({
      ...event,
      backgroundText: nextText,
      backgroundPattern: nextText ? 'hearts' : 'none'
    })
  }

  return (
    <main
      className={`${embedded ? 'public-page embedded' : 'public-page'} pattern-${event.backgroundPattern ?? 'none'}`}
      onClick={handleBackgroundClick}
      style={
        {
          '--page-primary': event.primaryColor,
          '--page-secondary': event.secondaryColor,
          '--page-highlight': event.highlightColor,
          cursor: onUpdate ? 'pointer' : 'default',
        } as React.CSSProperties
      }
    >
      {event.showAds !== false && <AdSlot position="top" />}
      <div className="public-bg-decor" aria-hidden="true">
        {backgroundDecor.map((item, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              transform: `rotate(${item.rotate})`,
              fontSize: item.size,
              opacity: item.opacity,
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>
      {!embedded && onBack && (
        <div className="public-floating-nav" onClick={(event) => event.stopPropagation()}>
          {onHome && <LogoMark onClick={onHome} />}
          <button className="floating-back" type="button" onClick={onBack}>
            Back
          </button>
          {onPublish && (
            <button className="secondary-action" type="button" onClick={onPublish}>
              Publish
            </button>
          )}
        </div>
      )}
      <section className="public-cover">
        <div className="decor">
          {displayElements.map((element, index) => (
            <span key={`${element}-${index}`}>{element}</span>
          ))}
        </div>
        <p className="mini-label">{getEventLabel(event)}</p>
        <h1>{event.title || `For ${event.recipientName || 'someone special'}`}</h1>
        <p className="recipient-name">{event.recipientName || 'A page made with love'}</p>
        {countdown && <strong className="countdown">{countdown}</strong>}
      </section>

      <section className="public-content">
        {spotifyEmbedUrl && (
          <div className="spotify-embed-container">
            <iframe
              src={spotifyEmbedUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ borderRadius: '12px', marginBottom: '2rem' }}
            ></iframe>
          </div>
        )}
        {contentBlocks.map((block) => (
          block.kind === 'message' ? (
            <p
              className={`message-card align-${block.align} font-${block.fontStyle} border-${block.borderStyle}`}
              key={block.id}
              style={{ fontSize: `${block.fontSize}px` }}
            >
              {block.text}
            </p>
          ) : (
            <div
              className={`public-photo-block align-${block.align} border-${block.borderStyle}`}
              key={block.id}
              style={{ maxWidth: `${block.width}px` }}
            >
              <img
                src={block.src}
                alt=""
                style={{ objectPosition: `${block.positionX}% ${block.positionY}%` }}
              />
            </div>
          )
        ))}
        {event.location && <p className="location-line">Location: {event.location}</p>}
      </section>

      {event.showAds !== false && <AdSlot position="bottom" />}

      <footer className="public-footer">
        <span>Created with Lovingly</span>
        <strong>Yours Lovingly &lt;3</strong>
      </footer>
    </main>
  )
}

function getEventLabel(event: LovinglyEvent) {
  if (event.eventType === 'custom') return event.customType || 'Custom Event'
  return eventTypes.find((eventType) => eventType.id === event.eventType)?.label ?? 'Memory Page'
}

export default App
