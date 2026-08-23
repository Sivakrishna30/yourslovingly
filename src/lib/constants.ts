import type { EventKind, FontStyle, BorderStyle, CreationCategory, DesignStyle } from '../types';

export const FREE_EVENT_LIMIT = 3;
export const MAX_PHOTOS = 10;
export const MAX_ELEMENTS = 5;
export const STORAGE_KEY = 'lovingly-demo-events';
export const EDITING_ID_KEY = 'lovingly-editing-id';
export const DRIVE_TOKEN_KEY = 'lovingly-drive-access-token';
export const RESERVED_PUBLIC_PATHS = new Set(['builder', 'create', 'page', 'p', 'samples', 'subscription', 'user', 'terms', 'about', 'contact']);

export interface CreationCategoryItem {
  id: CreationCategory;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  defaultTitle: string;
  defaultRecipient: string;
  defaultMessages: string[];
}

export const creationCategories: CreationCategoryItem[] = [
  {
    id: 'invite',
    title: 'Digital Invite',
    subtitle: 'Weddings, Birthdays, Housewarming, Parties',
    icon: '',
    description: 'Interactive page with venue map, WhatsApp RSVP, Spotify music player, and UPI gift QR.',
    defaultTitle: 'Anand and Divya',
    defaultRecipient: 'Our Family and Friends',
    defaultMessages: [
      'With joyful hearts, we lovingly invite you to celebrate our special wedding ceremony.',
      'Your presence and warm blessings will grace our celebration.'
    ]
  },
  {
    id: 'business-card',
    title: 'Digital Business Card',
    subtitle: 'Gyms, Boutiques, Studios, Shops and Online Stores',
    icon: '',
    description: 'Digital business card with WhatsApp messaging, call button, location map, product catalog links, and UPI QR.',
    defaultTitle: 'Aura Fitness and Yoga Studio',
    defaultRecipient: 'Personal Training and Wellness Club',
    defaultMessages: [
      'Join our daily fitness batches, personalized workout sessions, and yoga programs.',
      'Tap below to connect directly on WhatsApp or find our studio on Google Maps.'
    ]
  },
  {
    id: 'flyer',
    title: 'Digital Pamphlet and Flyer',
    subtitle: 'Product Launches, Special Offers, Workshops',
    icon: '',
    description: 'High impact digital flyer showcasing announcements, special offers, event schedules, and direct contact.',
    defaultTitle: 'Grand Festival Collection Launch',
    defaultRecipient: 'Exclusive Fashion Preview',
    defaultMessages: [
      'Join us for the unveiling of our luxury handloom silk sarees and couture collection.',
      'Special offers for early registrants. Tap venue map for store directions!'
    ]
  },
  {
    id: 'portfolio',
    title: 'Digital Portfolio',
    subtitle: 'Designers, Photographers, Creators, Resume',
    icon: '',
    description: 'Elegant personal showcase to highlight creative projects, client testimonials, and direct inquiries.',
    defaultTitle: 'Kavya Nair Photography',
    defaultRecipient: 'Wedding and Portrait Visual Artist',
    defaultMessages: [
      'Capturing timeless human emotions and romantic stories through aesthetic visual storytelling.',
      'Browse featured wedding albums below and reach out via WhatsApp for bookings.'
    ]
  }
];

export interface DesignStyleItem {
  id: DesignStyle;
  name: string;
  tagline: string;
  primary: string;
  secondary: string;
  highlight: string;
  badge: string;
  floralBorder: string;
}

export const designStyles: DesignStyleItem[] = [
  {
    id: 'botanical-rose',
    name: 'Classic Crimson & Gold',
    tagline: 'Traditional vibrant red with gold accents',
    primary: '#E52324',
    secondary: '#FFD100',
    highlight: '#006874',
    badge: '🌹 Classic Crimson',
    floralBorder: 'border-amber-400'
  },
  {
    id: 'emerald-gold',
    name: 'Royal Azure',
    tagline: 'Deep Royal Blue with Electric Azure highlights',
    primary: '#002F6C',
    secondary: '#f8fafc',
    highlight: '#00A3E0',
    badge: '🌊 Royal Azure',
    floralBorder: 'border-blue-400'
  },
  {
    id: 'royal-heritage',
    name: 'Desert Sand & Sunset',
    tagline: 'Warm terracotta sand with sunset orange accents',
    primary: '#D9A05B',
    secondary: '#fff7ed',
    highlight: '#F58220',
    badge: '🏜️ Desert Sand',
    floralBorder: 'border-orange-300'
  },
  {
    id: 'blush-pastel',
    name: 'Blush Pastel Garland',
    tagline: 'Soft lavender pink with delicate floral sprigs',
    primary: '#831843',
    secondary: '#fdf2f8',
    highlight: '#e11d48',
    badge: '🌸 Delicate Pastel',
    floralBorder: 'border-pink-300'
  },
  {
    id: 'midnight-luxe',
    name: 'Midnight Gold Luxury',
    tagline: 'Deep obsidian navy with glowing stardust frame',
    primary: '#0f172a',
    secondary: '#f8fafc',
    highlight: '#f59e0b',
    badge: '✨ Midnight Stardust',
    floralBorder: 'border-amber-300'
  },
  {
    id: 'sunlit-marigold',
    name: 'Sunlit Marigold Festive',
    tagline: 'Warm saffron amber with marigold garland vibes',
    primary: '#b45309',
    secondary: '#fefce8',
    highlight: '#dc2626',
    badge: '🌼 Marigold Festive',
    floralBorder: 'border-amber-400'
  }
];

export const eventTypes: Array<{ id: EventKind; label: string; description: string }> = [
  { id: 'wedding', label: 'Wedding', description: 'Ceremony and reception invitations' },
  { id: 'engagement', label: 'Engagement', description: 'Ring ceremony and celebrations' },
  { id: 'birthday', label: 'Birthday and Milestone', description: 'Warm wishes and party photos' },
  { id: 'housewarming', label: 'Housewarming (Griha Pravesham)', description: 'Invite family home' },
  { id: 'baby-shower', label: 'Baby Shower', description: 'Welcome the little one' },
  { id: 'naming-ceremony', label: 'Naming Ceremony', description: 'Blessings for the newborn' },
  { id: 'anniversary', label: 'Anniversary', description: 'A page for shared years' },
  { id: 'proposal', label: 'Proposal and Romance', description: 'A romantic memory page' },
  { id: 'party', label: 'Party & Gathering', description: 'Celebrations, festivals, and get-togethers' },
  { id: 'festival', label: 'Festival Celebration', description: 'Diwali, Christmas, and more' },
  { id: 'graduation', label: 'Graduation', description: 'School or college convocation' },
  { id: 'farewell', label: 'Farewell & Reunion', description: 'Goodbye notes and reunions' },
  { id: 'corporate', label: 'Corporate Event', description: 'Conferences, seminars, and meetups' },
  { id: 'workshop', label: 'Workshop & Training', description: 'Posters and registrations' },
  { id: 'charity', label: 'Charity & Gala', description: 'Fundraisers and social events' },
  { id: 'sports', label: 'Sports & Marathon', description: 'Race events and tournaments' },
  { id: 'business-card', label: 'Digital Business Card', description: 'Professional contact card' },
  { id: 'flyer', label: 'Digital Pamphlet and Flyer', description: 'Announcements and promotions' },
  { id: 'portfolio', label: 'Digital Portfolio', description: 'Creative showcase and resume' },
  { id: 'memorial', label: 'Memorial', description: 'In loving memory' },
  { id: 'friendship', label: 'Friendship', description: 'Memory pages for friends' },
  { id: 'custom', label: 'Custom Design', description: 'Custom creation' },
];

export const elementOptions = [
  'hearts', 'sparkles', 'flowers', 'stars', 'balloons', 'rings', 'home', 'ribbon',
  'cake', 'gift', 'confetti', 'champagne', 'camera', 'music', 'briefcase', 'graduation',
  'trophy', 'marathon', 'leaf', 'sun', 'moon', 'cloud', 'envelope', 'location'
];

export const fontStyles: Array<{ id: FontStyle; label: string }> = [
  { id: 'sweet', label: 'Sweet' },
  { id: 'classic', label: 'Classic' },
  { id: 'playful', label: 'Playful' },
  { id: 'clean', label: 'Clean' },
  { id: 'script', label: 'Script' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'bold', label: 'Bold' },
];

export const borderStyles: Array<{ id: BorderStyle; label: string }> = [
  { id: 'none', label: 'None' },
  { id: 'soft', label: 'Soft' },
  { id: 'solid', label: 'Solid' },
  { id: 'glow', label: 'Glow' },
  { id: 'dashed', label: 'Dashed' },
  { id: 'double', label: 'Double' },
];

export const elementGlyphs: Record<string, string> = {
  hearts: '💖',
  sparkles: '✨',
  flowers: '🌸',
  stars: '⭐',
  balloons: '🎈',
  rings: '💍',
  home: '🏠',
  ribbon: '🎀',
  cake: '🎂',
  gift: '🎁',
  confetti: '🎊',
  champagne: '🥂',
  camera: '📸',
  music: '🎵',
  briefcase: '💼',
  graduation: '🎓',
  trophy: '🏆',
  marathon: '🏃',
  leaf: '🍃',
  sun: '☀️',
  moon: '🌙',
  cloud: '☁️',
  envelope: '✉️',
  location: '📍',
};
