import { Heart, Cake, Home, Sparkles, PartyPopper, Briefcase } from 'lucide-react';
import type { EventKind } from '../types';

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
  hasRsvp: boolean;
  hasMap: boolean;
  hasQr: boolean;
}

export const SAMPLE_INVITES: SampleInvite[] = [
  {
    id: 'sample-wedding-priya-rahul',
    title: 'The Wedding Celebration',
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
    secondaryColor: '#D97706',
    highlightColor: '#F59E0B',
    bgGradient: 'from-rose-950 via-rose-900 to-amber-950',
    musicTrack: 'Mangalyam Tantunanena • Royal Shehnai',
    spotifySong: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
    hasRsvp: true,
    hasMap: true,
    hasQr: true
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
    secondaryColor: '#F59E0B',
    highlightColor: '#10B981',
    bgGradient: 'from-amber-900 via-amber-800 to-orange-950',
    musicTrack: 'Happy Birthday Celebration Beat',
    spotifySong: 'https://open.spotify.com/track/7iN1Perform6052026',
    hasRsvp: true,
    hasMap: true,
    hasQr: true
  },
  {
    id: 'sample-housewarming-mehta',
    title: 'Housewarming Celebration',
    subtitle: 'Blessings for our new abode',
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
    secondaryColor: '#047857',
    highlightColor: '#FBBF24',
    bgGradient: 'from-emerald-950 via-emerald-900 to-teal-950',
    musicTrack: 'Vedic Shanti Mantra & Classical Flute',
    spotifySong: 'https://open.spotify.com/track/1PFluteTrack2026',
    hasRsvp: true,
    hasMap: true,
    hasQr: true
  },
  {
    id: 'sample-anniversary-sharma',
    title: '25th Silver Jubilee Anniversary',
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
    secondaryColor: '#0D9488',
    highlightColor: '#F59E0B',
    bgGradient: 'from-teal-950 via-teal-900 to-cyan-950',
    musicTrack: 'Romantic Violin & Piano Symphony',
    hasRsvp: true,
    hasMap: true,
    hasQr: true
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
    secondaryColor: '#7E22CE',
    highlightColor: '#EC4899',
    bgGradient: 'from-purple-950 via-purple-900 to-pink-950',
    musicTrack: 'Retro Nostalgia Pop Playlist',
    hasRsvp: true,
    hasMap: true,
    hasQr: true
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
    secondaryColor: '#334155',
    highlightColor: '#38BDF8',
    bgGradient: 'from-slate-950 via-slate-900 to-zinc-950',
    musicTrack: 'Ambient Corporate Lounge Beats',
    hasRsvp: true,
    hasMap: true,
    hasQr: true
  }
];
