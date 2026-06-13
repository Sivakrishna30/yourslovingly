import { useEffect, useMemo, useState } from 'react'
import './App.css'

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
}

type TextAlign = 'left' | 'center' | 'right'
type PhotoSize = 'compact' | 'medium' | 'large'
type FontStyle = 'sweet' | 'classic' | 'playful' | 'clean' | 'script' | 'rounded' | 'bold'
type BackgroundPattern = 'none' | 'hearts' | 'stars' | 'gifts' | 'flowers'
type BorderStyle = 'none' | 'soft' | 'solid' | 'glow' | 'dashed' | 'double'

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

const MAX_EVENTS = 3
const MAX_PHOTOS = 10
const MAX_ELEMENTS = 5
const STORAGE_KEY = 'lovingly-demo-events'
const EDITING_ID_KEY = 'lovingly-editing-id'

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

const backgroundPatterns: Array<{ id: BackgroundPattern; label: string }> = [
  { id: 'none', label: 'Clean' },
  { id: 'hearts', label: 'Hearts' },
  { id: 'stars', label: 'Stars' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'flowers', label: 'Flowers' },
]

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

function createBlankEvent(type: EventKind = 'birthday'): LovinglyEvent {
  return {
    id: crypto.randomUUID(),
    slug: createSlug(),
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

function cssContentText(value: string) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function repeatPatternText(value: string) {
  const trimmedValue = value.trim()
  if (!trimmedValue) return ''
  return Array.from({ length: 120 }, () => trimmedValue).join('  ')
}

function createSlug() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

function getInitialEvents(): LovinglyEvent[] {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value ? JSON.parse(value) : []
  } catch {
    return []
  }
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [events, setEvents] = useState<LovinglyEvent[]>(getInitialEvents)
  const [editingId, setEditingId] = useState<string | null>(() => localStorage.getItem(EDITING_ID_KEY))
  const [selectedType, setSelectedType] = useState<EventKind>('birthday')
  const [path, setPath] = useState(window.location.pathname)
  const [publicReturnPath, setPublicReturnPath] = useState('/user')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }, [events])

  useEffect(() => {
    if (editingId) {
      localStorage.setItem(EDITING_ID_KEY, editingId)
    } else {
      localStorage.removeItem(EDITING_ID_KEY)
    }
  }, [editingId])

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const editingEvent = events.find((event) => event.id === editingId) ?? null
  const publicSlug = path.match(/^\/page\/([^/]+)/)?.[1] ?? path.match(/^\/p\/([^/]+)/)?.[1]
  const publicEvent = events.find((event) => event.slug.toLowerCase() === publicSlug?.toLowerCase()) ??
                      sampleEvents.find((event) => event.slug.toLowerCase() === publicSlug?.toLowerCase())

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

  function startEvent(type = selectedType) {
    if (events.length >= MAX_EVENTS) return
    const nextEvent = createBlankEvent(type)
    setEvents((currentEvents) => [nextEvent, ...currentEvents])
    setEditingId(nextEvent.id)
    navigate('/builder')
  }

  if (publicSlug) {
    return (
      <PublicPage
        event={publicEvent}
        onBack={() => navigate(isLoggedIn ? publicReturnPath : '/')}
        onHome={() => navigate(isLoggedIn ? '/user' : '/')}
        onUpdate={updateEvent}
      />
    )
  }

  if (path === '/samples') {
    return <SamplesPage onBack={() => navigate(isLoggedIn ? '/user' : '/')} onHome={() => navigate(isLoggedIn ? '/user' : '/')} />
  }

  if (!isLoggedIn) {
    return <Home onLogin={() => {
      setIsLoggedIn(true)
      navigate('/user', true)
    }} onSamples={() => navigate('/samples')} />
  }

  if (path === '/create') {
    return (
      <CreateEvent
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        canCreate={events.length < MAX_EVENTS}
        onBack={() => navigate('/user')}
        onHome={() => navigate('/user')}
        onCreate={() => startEvent()}
      />
    )
  }

  if (path === '/builder' && editingEvent) {
    return (
      <EventEditor
        event={editingEvent}
        onBack={() => navigate('/user')}
        onHome={() => navigate('/user')}
        onDelete={() => {
          setEvents((currentEvents) => currentEvents.filter((event) => event.id !== editingEvent.id))
          setEditingId(null)
          navigate('/')
        }}
        onOpenPublic={() => {
          setPublicReturnPath('/builder')
          navigate(`/page/${editingEvent.slug}`)
        }}
        onUpdate={updateEvent}
      />
    )
  }

  return (
    <Dashboard
      events={events}
      onCreate={() => navigate('/create')}
      onEdit={(id) => {
        setEditingId(id)
        navigate('/builder')
      }}
      onDelete={(id) => setEvents((currentEvents) => currentEvents.filter((event) => event.id !== id))}
      onOpenPublic={(slug) => {
        setPublicReturnPath('/user')
        navigate(`/page/${slug}`)
      }}
      onHome={() => navigate('/user')}
      onLogout={() => {
        setIsLoggedIn(false)
        navigate('/', true)
      }}
    />
  )
}

function Home({ onLogin, onSamples }: { onLogin: () => void; onSamples: () => void }) {
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
          <button className="primary-action" type="button" onClick={onLogin}>
            <span className="google-dot">G</span>
            Continue with Google
          </button>
        </div>
      </section>
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

function Dashboard({
  events,
  onCreate,
  onEdit,
  onDelete,
  onOpenPublic,
  onHome,
  onLogout,
}: {
  events: LovinglyEvent[]
  onCreate: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onOpenPublic: (slug: string) => void
  onHome: () => void
  onLogout: () => void
}) {
  const limitReached = events.length >= MAX_EVENTS
  const createLabel = events.length === 0 ? 'Create first event' : 'Create new event'

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="header-title-row">
          <LogoMark onClick={onHome} />
          <div>
            <p className="eyebrow">Lovingly dashboard</p>
            <h1>Your memory pages</h1>
          </div>
        </div>
        <button className="ghost-action" type="button" onClick={onLogout}>
          Sign out
        </button>
      </header>

      <section className="status-strip">
        <div>
          <strong>{events.length}/{MAX_EVENTS}</strong>
          <span>active events</span>
        </div>
        <div>
          <strong>{MAX_PHOTOS}</strong>
          <span>photos per event</span>
        </div>
        {events.length > 0 && (
          <button className="primary-action" type="button" onClick={onCreate} disabled={limitReached}>
            {createLabel}
          </button>
        )}
      </section>

      {limitReached && (
        <p className="notice">Limit reached. Delete one old event to create a new memory page.</p>
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
                <small>{event.isPublished ? `/page/${event.slug}` : 'Draft'}</small>
              </div>
              <div className="card-actions">
                <button type="button" onClick={() => onEdit(event.id)}>
                  Edit
                </button>
                <button type="button" onClick={() => onOpenPublic(event.slug)}>
                  View
                </button>
                <button type="button" onClick={() => onDelete(event.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  )
}

function CreateEvent({
  selectedType,
  setSelectedType,
  canCreate,
  onBack,
  onHome,
  onCreate,
}: {
  selectedType: EventKind
  setSelectedType: (type: EventKind) => void
  canCreate: boolean
  onBack: () => void
  onHome: () => void
  onCreate: () => void
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
        <button className="ghost-action" type="button" onClick={onBack}>
          Back
        </button>
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
        <p>{canCreate ? 'Next: add details and photos.' : 'Delete an old event before creating one.'}</p>
        <button className="primary-action" type="button" onClick={onCreate} disabled={!canCreate}>
          Continue
        </button>
      </footer>
    </main>
  )
}

function EventEditor({
  event,
  onBack,
  onHome,
  onDelete,
  onOpenPublic,
  onUpdate,
}: {
  event: LovinglyEvent
  onBack: () => void
  onHome: () => void
  onDelete: () => void
  onOpenPublic: () => void
  onUpdate: (event: LovinglyEvent) => void
}) {
  const shareUrl = `${window.location.origin}/page/${event.slug}`

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
        <header className="editor-header">
          <div className="header-title-row">
            <LogoMark onClick={onHome} />
            <div>
              <p className="eyebrow">Builder</p>
              <h1>Edit memory page</h1>
            </div>
          </div>
          <button className="ghost-action" type="button" onClick={onBack}>
            Dashboard
          </button>
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
            Event title
            <input
              value={event.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="A birthday full of love"
            />
          </label>
          <label>
            Recipient name
            <input
              value={event.recipientName}
              onChange={(e) => setField('recipientName', e.target.value)}
              placeholder="Name"
            />
          </label>
          <div className="split-fields">
            <label>
              Event date
              <input
                type="date"
                value={event.eventDate}
                onChange={(e) => setField('eventDate', e.target.value)}
              />
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

        <ThemeEditor event={event} onUpdate={onUpdate} />
        <StoryEditor event={event} onPhotoInput={onPhotoInput} onUpdate={onUpdate} />

        <section className="publish-panel">
          <div>
            <h2>Publish link</h2>
            <p>{event.isPublished ? shareUrl : 'Publish to create a shareable page link.'}</p>
          </div>
          <div className="publish-actions">
            <button className="ghost-action" type="button" onClick={onDelete}>
              Delete
            </button>
            <button
              className="secondary-action"
              type="button"
              onClick={() => setField('isPublished', true)}
            >
              Publish
            </button>
            <button className="primary-action" type="button" onClick={onOpenPublic}>
              Preview page
            </button>
          </div>
        </section>
      </section>

      <aside className="live-preview">
        <PublicPage event={event} embedded onUpdate={onUpdate} />
      </aside>
    </main>
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
          { label: 'Hearts', value: '💖 💕 💗 💓' },
          { label: 'Party', value: '🎈 🎉 ✨ 🎊' },
          { label: 'Flowers', value: '🌸 🌷 🌼 🌻' },
          { label: 'Stars', value: '⭐ ✨ 🌟 💫' },
          { label: 'Clear', value: '' },
        ].map((preset) => (
          <button
            key={preset.label}
            type="button"
            className={event.backgroundText === preset.value ? 'pattern-button selected' : 'pattern-button'}
            onClick={() => onUpdate({ ...event, backgroundText: preset.value, backgroundPattern: preset.value ? 'hearts' : 'none' })}
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
  onBack,
  onHome,
  onUpdate,
}: {
  event?: LovinglyEvent
  embedded?: boolean
  onBack?: () => void
  onHome?: () => void
  onUpdate?: (event: LovinglyEvent) => void
}) {
  const countdown = useMemo(() => getCountdown(event?.eventDate ?? ''), [event?.eventDate])
  const contentBlocks = event ? getContentBlocks(event) : []
  const displayElements = event ? getDisplayElements(event) : []

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
        const seed = (r * 7) + (c * 13) + (event.id.charCodeAt(0) || 0)
        
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
  }, [event?.backgroundText, event?.id])

  if (!event) {
    return (
      <main className="public-page missing-page">
        <h1>Page not found</h1>
        <p>This Lovingly page may have been deleted or the link is wrong.</p>
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
    let nextText = ''
    
    // Cycle logic: Empty -> Hearts -> Mix -> Empty
    const current = event.backgroundText || ''
    if (!current) {
      nextText = allHearts
    } else if (current === allHearts) {
      nextText = allEmojis
    } else {
      nextText = ''
    }

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
        <div className="public-floating-nav">
          {onHome && <LogoMark onClick={onHome} />}
          <button className="floating-back" type="button" onClick={onBack}>
            Back
          </button>
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
        <p>{event.recipientName || 'A page made with love'}</p>
        {countdown && <strong className="countdown">{countdown}</strong>}
      </section>

      <section className="public-content">
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
