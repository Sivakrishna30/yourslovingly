import { Heart, Cake, Home, Sparkles, PartyPopper, Briefcase } from 'lucide-react';
import type { 
  EventKind, 
  FrameType, 
  DecorativeMotif, 
  BackgroundTexture, 
  DesignStyle 
} from '../types';

export interface SampleInvite {
  id: string;
  title: string;
  subtitle: string;
  category: EventKind;
  categoryLabel: string;
  icon: typeof Heart;
  tagline: string;
  badge: string;
  badgeColor: string;
  date: string;
  time: string;
  location: string;
  coupleOrHost: string;
  messages: string[];
  primaryColor: string;
  secondaryColor: string;
  highlightColor: string;
  bgGradient: string;
  musicTrack?: string;
  spotifySong?: string;
  musicType?: 'spotify' | 'mp3' | 'none';
  bgAudioPresetId?: string;
  bgAudioUrl?: string;
  bgAudioTitle?: string;
  bgAudioStart?: number;
  bgAudioEnd?: number;
  bgAudioAutoPlay?: boolean;
  photos?: string[];
  hasRsvp: boolean;
  hasMap: boolean;
  hasQr: boolean;
  templateId?: string;
  frameType?: FrameType;
  decorativeMotif?: DecorativeMotif;
  textureType?: BackgroundTexture;
  shlokaText?: string;
  designStyle?: DesignStyle;
  elements?: string[];
}

export const SAMPLE_INVITES: SampleInvite[] = [
  {
    id: 'sample-wedding-priya-rahul',
    title: 'Priya & Rahul',
    subtitle: 'Together with their families',
    category: 'wedding',
    categoryLabel: 'Royal Wedding',
    icon: Heart,
    tagline: 'Traditional Royal Crimson with Gold Motifs & Mandap',
    badge: '💍 Royal Wedding',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    date: 'December 24, 2026',
    time: '6:30 PM Onwards (Ceremony: 7:15 PM)',
    location: 'The Leela Palace Ballroom, Bengaluru',
    coupleOrHost: 'Priya & Rahul',
    messages: [
      'We lovingly request the honor of your gracious presence and blessings as we embark on this sacred journey of love and togetherness.',
      'Dinner, music & celebration to follow.'
    ],
    primaryColor: '#881337',
    secondaryColor: '#FFFDF7',
    highlightColor: '#D97706',
    bgGradient: 'from-rose-950 via-rose-900 to-amber-950',
    musicTrack: 'Mangalyam Tantunanena • Royal Shehnai',
    musicType: 'mp3',
    bgAudioPresetId: 'preset-shehnai-mangalyam',
    bgAudioTitle: 'Mangalyam Tantunanena • Royal Shehnai',
    bgAudioStart: 0,
    bgAudioEnd: 30,
    bgAudioAutoPlay: true,
    photos: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
    ],
    hasRsvp: true,
    hasMap: true,
    hasQr: true,
    templateId: 'tmpl-wedding-traditional-marigold',
    frameType: 'grand-rangoli-mandala',
    decorativeMotif: 'auspicious-kalash',
    textureType: 'gold-dust',
    shlokaText: 'Under the Auspicious Divine Blessings',
    designStyle: 'royal-heritage',
    elements: ['sparkles', 'flowers', 'rings']
  },
  {
    id: 'sample-birthday-aarav',
    title: "Aarav's 5th Birthday Bash!",
    subtitle: 'Join us for games, cake & magic',
    category: 'birthday',
    categoryLabel: 'Kids Birthday',
    icon: Cake,
    tagline: 'Festive Amber & Sunshine Yellow with Balloon Arch',
    badge: '🎂 Birthday Party',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    date: 'January 18, 2027',
    time: '4:30 PM - 8:00 PM',
    location: 'Sky High Playhouse & Clubhouse, Indiranagar',
    coupleOrHost: 'Sunita & Vikram',
    messages: [
      'Our little champion Aarav is turning 5! Come dressed in your favorite vibrant colors and join us for magic shows, fun games, and delicious treats.',
      'Cake cutting sharp at 6:00 PM.'
    ],
    primaryColor: '#B45309',
    secondaryColor: '#FFFDF5',
    highlightColor: '#F59E0B',
    bgGradient: 'from-amber-900 via-amber-800 to-orange-950',
    musicTrack: 'Happy Birthday Celebration Beat',
    musicType: 'spotify',
    spotifySong: 'https://open.spotify.com/track/7iN1Perform6052026',
    photos: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80'
    ],
    hasRsvp: false,
    hasMap: true,
    hasQr: true,
    templateId: 'tmpl-birthday-luxury-gold',
    frameType: 'art-deco-geometric',
    decorativeMotif: 'party-confetti',
    textureType: 'gold-dust',
    shlokaText: 'A Special Milestone Birthday Celebration',
    designStyle: 'sunlit-marigold',
    elements: ['sparkles', 'cake', 'party-popper']
  },
  {
    id: 'sample-housewarming-mehta',
    title: 'The Mehta Family Abode',
    subtitle: 'Blessings for our new home',
    category: 'housewarming',
    categoryLabel: 'Housewarming',
    icon: Home,
    tagline: 'Traditional Emerald & Auspicious Welcome Motifs',
    badge: '🏡 Housewarming',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    date: 'February 12, 2027',
    time: '9:00 AM Ceremony • 12:30 PM Celebration Lunch',
    location: 'Villa 42, Prestige Green Woods, Whitefield',
    coupleOrHost: 'The Mehta Family',
    messages: [
      'With the blessings of Almighty and elders, we are stepping into our new home. We warmly invite you and your family for the blessing ceremony and celebration lunch.',
      'Your warm presence will make our new house a home.'
    ],
    primaryColor: '#065F46',
    secondaryColor: '#F0FDF4',
    highlightColor: '#FBBF24',
    bgGradient: 'from-emerald-950 via-emerald-900 to-teal-950',
    musicTrack: 'Vedic Shanti Mantra & Classical Flute',
    musicType: 'mp3',
    bgAudioPresetId: 'preset-sacred-temple-flute',
    bgAudioTitle: 'Vedic Shanti Mantra & Classical Flute',
    bgAudioStart: 0,
    bgAudioEnd: 28,
    bgAudioAutoPlay: true,
    photos: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    hasRsvp: false,
    hasMap: true,
    hasQr: true,
    templateId: 'tmpl-housewarming-traditional-kolam',
    frameType: 'banana-leaf-traditional',
    decorativeMotif: 'brass-diya',
    textureType: 'banana-palm',
    shlokaText: 'Auspicious Housewarming & Blessings',
    designStyle: 'emerald-gold',
    elements: ['sparkles', 'sun', 'flowers']
  },
  {
    id: 'sample-anniversary-sharma',
    title: 'Ananya & Rajesh Sharma',
    subtitle: 'Celebrating 25 Years of Love',
    category: 'anniversary',
    categoryLabel: 'Silver Jubilee',
    icon: Sparkles,
    tagline: 'Deep Ocean Teal with Gold Leaf Borders & Gala Dinner',
    badge: '✨ Silver Jubilee',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    date: 'March 08, 2027',
    time: '7:30 PM Onwards',
    location: 'ITC Gardenia Grand Ballroom, Residency Road',
    coupleOrHost: 'Ananya & Rajesh Sharma',
    messages: [
      'Twenty-five years of laughter, shared journeys, and endless love. Please join us for an evening of cocktails, dinner, and timeless melodies.',
      'Dress code: Formal / Cocktail Attire.'
    ],
    primaryColor: '#0F766E',
    secondaryColor: '#F0FDFA',
    highlightColor: '#F59E0B',
    bgGradient: 'from-teal-950 via-teal-900 to-cyan-950',
    musicTrack: 'Romantic Violin & Acoustic Symphony',
    musicType: 'mp3',
    bgAudioPresetId: 'preset-romantic-acoustic',
    bgAudioTitle: 'Romantic Acoustic Celebration',
    bgAudioStart: 0,
    bgAudioEnd: 26,
    bgAudioAutoPlay: true,
    photos: [
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80'
    ],
    hasRsvp: true,
    hasMap: true,
    hasQr: true,
    templateId: 'tmpl-wedding-ivory-botanical',
    frameType: 'botanical-peony-gold',
    decorativeMotif: 'gilded-rings',
    textureType: 'floral-damask',
    shlokaText: 'Celebrating 25 Years of Togetherness',
    designStyle: 'botanical-rose',
    elements: ['hearts', 'sparkles', 'flowers']
  },
  {
    id: 'sample-reunion-alumni',
    title: 'Class of 2016 • Decade Reunion',
    subtitle: '10 Years of Memories & Chaos',
    category: 'party',
    categoryLabel: 'Party & Reunion',
    icon: PartyPopper,
    tagline: 'Midnight Violet & Neon Gold with DJ Night',
    badge: '🎉 Decade Reunion',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    date: 'April 25, 2027',
    time: '8:00 PM Late Night',
    location: 'Toit Brewpub Rooftop, Indiranagar, Bengaluru',
    coupleOrHost: 'Batch of 2016 Committee',
    messages: [
      'It has been 10 years since graduation! Let us catch up, relive the crazy stories, and toast to the good old times.',
      'Live DJ set & open bar.'
    ],
    primaryColor: '#581C87',
    secondaryColor: '#FAF5FF',
    highlightColor: '#F59E0B',
    bgGradient: 'from-purple-950 via-purple-900 to-pink-950',
    musicTrack: 'Retro Nostalgia Pop Playlist',
    musicType: 'spotify',
    spotifySong: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
    photos: [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'
    ],
    hasRsvp: false,
    hasMap: true,
    hasQr: true,
    templateId: 'tmpl-wedding-obsidian-gold',
    frameType: 'modern-minimal-filigree',
    decorativeMotif: 'sparkle-burst',
    textureType: 'gold-dust',
    shlokaText: 'A Decade of Cherished Memories & Friendships',
    designStyle: 'midnight-luxe',
    elements: ['sparkles', 'stars', 'champagne']
  },
  {
    id: 'sample-corporate-summit',
    title: 'NexGen Tech Launch & Gala',
    subtitle: 'Exclusive Founders & Investors Evening',
    category: 'corporate',
    categoryLabel: 'Corporate Gala',
    icon: Briefcase,
    tagline: 'Minimalist Slate & Gold with Keynote & Cocktails',
    badge: '💼 Launch Gala',
    badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
    date: 'May 14, 2027',
    time: '5:30 PM Keynote • 7:30 PM Networking Gala',
    location: 'Taj West End Convention Center, Race Course Road',
    coupleOrHost: 'NexGen Ventures Board',
    messages: [
      'We cordially invite you to the unveiling of our Next-Generation AI Ecosystem, followed by an exclusive networking gala and gourmet dinner.',
      'Valet parking and private security passes provided.'
    ],
    primaryColor: '#1E293B',
    secondaryColor: '#F8FAFC',
    highlightColor: '#38BDF8',
    bgGradient: 'from-slate-950 via-slate-900 to-zinc-950',
    musicTrack: 'Ambient Corporate Lounge Beats',
    musicType: 'mp3',
    bgAudioPresetId: 'preset-festive-sitar-chimes',
    bgAudioTitle: 'Ambient Summit Melodic Lounge',
    bgAudioStart: 0,
    bgAudioEnd: 25,
    bgAudioAutoPlay: true,
    photos: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
    ],
    hasRsvp: true,
    hasMap: true,
    hasQr: true,
    templateId: 'tmpl-business-card-studio',
    frameType: 'art-deco-geometric',
    decorativeMotif: 'monogram-crest',
    textureType: 'none',
    shlokaText: 'Exclusive Keynote & Networking Gala',
    designStyle: 'emerald-gold',
    elements: ['sparkles', 'briefcase']
  }
];
