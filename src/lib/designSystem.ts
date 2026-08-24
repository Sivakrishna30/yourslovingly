import type { EventKind, AnimationType, FrameType, DecorativeMotif, BackgroundTexture } from '../types';

export interface PaletteDefinition {
  id: string;
  name: string;
  category: 'wedding' | 'luxury' | 'kids' | 'vibrant' | 'professional' | 'traditional';
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  headingText: string;
  bodyText: string;
  mutedText: string;
  borderColor: string;
  gradient?: string;
  badge: string;
}

export interface FontPairing {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
  accentFont: string;
  category: 'elegant' | 'luxury' | 'romantic' | 'modern' | 'editorial' | 'traditional' | 'playful' | 'corporate';
}

export interface LayoutSystem {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  frameStyle: 'card' | 'arch' | 'wreath' | 'editorial' | 'full-bleed' | 'split' | 'border' | 'storybook';
}

export interface SvgAssetMeta {
  id: string;
  name: string;
  family: 
    | 'flowers'
    | 'botanical'
    | 'compositions'
    | 'frames'
    | 'dividers'
    | 'wedding'
    | 'baby'
    | 'party'
    | 'architecture'
    | 'cultural'
    | 'geometric'
    | 'abstract'
    | 'typography'
    | 'patterns'
    | 'effects'
    | 'decorative';
  icon: string;
  svgData: string; // SVG path or SVG snippet
  viewBox?: string;
}

export interface MasterTemplate {
  id: string;
  name: string;
  category: EventKind | 'all';
  categoryLabel: string;
  layoutCode: string;
  paletteId: string;
  fontPairingId: string;
  tagline: string;
  badge: string;
  // Dummy content prefilled
  defaultTitle: string;
  defaultRecipient: string;
  defaultDate: string;
  defaultLocation: string;
  defaultMessages: string[];
  defaultElements: string[];
  spotifySuggestion?: string;
  primaryColor: string;
  secondaryColor: string;
  highlightColor: string;
  frameType?: FrameType;
  decorativeMotif?: DecorativeMotif;
  shlokaText?: string;
  textureType?: BackgroundTexture;
  animations: {
    title: AnimationType;
    details: AnimationType;
    photos: AnimationType;
  };
}

// -------------------------------------------------------------
// 1. 30+ CURATED PALETTES
// -------------------------------------------------------------
export const PALETTES: PaletteDefinition[] = [
  // Wedding Palettes
  {
    id: 'pal-ivory-sage-gold',
    name: 'Ivory, Sage & Gold',
    category: 'wedding',
    primary: '#2D4A3E',
    secondary: '#F4F7F4',
    accent: '#D4AF37',
    background: '#FAFBF9',
    surface: '#FFFFFF',
    headingText: '#1B3028',
    bodyText: '#3D544A',
    mutedText: '#7A9187',
    borderColor: '#E2E8E3',
    badge: '🌿 Sage & Gold'
  },
  {
    id: 'pal-cream-terracotta',
    name: 'Cream & Terracotta',
    category: 'wedding',
    primary: '#C85A32',
    secondary: '#FDF8F5',
    accent: '#E0926B',
    background: '#FAF5F0',
    surface: '#FFFFFF',
    headingText: '#873618',
    bodyText: '#543023',
    mutedText: '#A87A6C',
    borderColor: '#F0DEC8',
    badge: '🏺 Warm Terracotta'
  },
  {
    id: 'pal-blush-champagne',
    name: 'Blush & Champagne',
    category: 'wedding',
    primary: '#9E3A59',
    secondary: '#FFF5F7',
    accent: '#DFB76C',
    background: '#FAF2F4',
    surface: '#FFFFFF',
    headingText: '#6A1F36',
    bodyText: '#4A2A33',
    mutedText: '#9E7883',
    borderColor: '#FCE7EC',
    badge: '🌸 Blush Floral'
  },
  {
    id: 'pal-crimson-gold',
    name: 'Royal Crimson & Gold',
    category: 'traditional',
    primary: '#881337',
    secondary: '#FFFBEB',
    accent: '#D97706',
    background: '#FEF2F2',
    surface: '#FFFFFF',
    headingText: '#4C0519',
    bodyText: '#451A03',
    mutedText: '#9A3412',
    borderColor: '#FDE68A',
    badge: '👑 Royal Crimson'
  },
  {
    id: 'pal-emerald-heritage',
    name: 'Temple Emerald & Gold',
    category: 'traditional',
    primary: '#064E3B',
    secondary: '#ECFDF5',
    accent: '#F59E0B',
    background: '#F0FDF4',
    surface: '#FFFFFF',
    headingText: '#022C22',
    bodyText: '#064E3B',
    mutedText: '#047857',
    borderColor: '#A7F3D0',
    badge: '🛕 Temple Emerald'
  },
  {
    id: 'pal-royal-azure',
    name: 'Royal Azure & Sapphire',
    category: 'luxury',
    primary: '#0F2C59',
    secondary: '#F8FAFC',
    accent: '#38BDF8',
    background: '#F0F9FF',
    surface: '#FFFFFF',
    headingText: '#082F49',
    bodyText: '#1E293B',
    mutedText: '#64748B',
    borderColor: '#BAE6FD',
    badge: '🌊 Royal Azure'
  },
  {
    id: 'pal-black-gold-luxury',
    name: 'Obsidian & Gold Stardust',
    category: 'luxury',
    primary: '#09090B',
    secondary: '#18181B',
    accent: '#FBBF24',
    background: '#09090B',
    surface: '#18181B',
    headingText: '#FEF08A',
    bodyText: '#E4E4E7',
    mutedText: '#A1A1AA',
    borderColor: '#3F3F46',
    badge: '✨ Obsidian Stardust'
  },
  {
    id: 'pal-dusty-rose-burgundy',
    name: 'Dusty Rose & Burgundy',
    category: 'wedding',
    primary: '#831843',
    secondary: '#FDF2F8',
    accent: '#DB2777',
    background: '#FFF1F2',
    surface: '#FFFFFF',
    headingText: '#500724',
    bodyText: '#374151',
    mutedText: '#9CA3AF',
    borderColor: '#FCE7F3',
    badge: '🌹 Vintage Rose'
  },
  {
    id: 'pal-marigold-saffron',
    name: 'Sunlit Saffron & Marigold',
    category: 'traditional',
    primary: '#B45309',
    secondary: '#FEFCE8',
    accent: '#EA580C',
    background: '#FFFBEB',
    surface: '#FFFFFF',
    headingText: '#78350F',
    bodyText: '#451A03',
    mutedText: '#92400E',
    borderColor: '#FDE68A',
    badge: '🌼 Festive Marigold'
  },
  {
    id: 'pal-pastel-rainbow',
    name: 'Playful Pastel Cloud',
    category: 'kids',
    primary: '#6366F1',
    secondary: '#EEF2FF',
    accent: '#EC4899',
    background: '#FAF5FF',
    surface: '#FFFFFF',
    headingText: '#3730A3',
    bodyText: '#1F2937',
    mutedText: '#6B7280',
    borderColor: '#E0E7FF',
    badge: '🎈 Pastel Joy'
  },
  {
    id: 'pal-baby-blue-cream',
    name: 'Baby Blue & Cloud Cream',
    category: 'kids',
    primary: '#0284C7',
    secondary: '#F0F9FF',
    accent: '#F59E0B',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    headingText: '#0369A1',
    bodyText: '#334155',
    mutedText: '#94A3B8',
    borderColor: '#E2E8F0',
    badge: '👶 Cloud Blue'
  },
  {
    id: 'pal-baby-blush-cream',
    name: 'Baby Blush & Sweet Peach',
    category: 'kids',
    primary: '#DB2777',
    secondary: '#FDF2F8',
    accent: '#FB923C',
    background: '#FFF7ED',
    surface: '#FFFFFF',
    headingText: '#9D174D',
    bodyText: '#374151',
    mutedText: '#9CA3AF',
    borderColor: '#FCE7F3',
    badge: '🍼 Sweet Peach'
  },
  {
    id: 'pal-deep-plum-gold',
    name: 'Deep Plum & Rose Gold',
    category: 'luxury',
    primary: '#4C1D95',
    secondary: '#F5F3FF',
    accent: '#F472B6',
    background: '#FAF5FF',
    surface: '#FFFFFF',
    headingText: '#2E1065',
    bodyText: '#374151',
    mutedText: '#6B7280',
    borderColor: '#EDE9FE',
    badge: '🔮 Royal Amethyst'
  },
  {
    id: 'pal-corporate-navy-cyan',
    name: 'Corporate Executive Navy',
    category: 'professional',
    primary: '#0F172A',
    secondary: '#F1F5F9',
    accent: '#0284C7',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    headingText: '#0F172A',
    bodyText: '#334155',
    mutedText: '#64748B',
    borderColor: '#E2E8F0',
    badge: '💼 Executive Modern'
  },
  {
    id: 'pal-warm-minimal-mono',
    name: 'Warm Editorial Monochrome',
    category: 'professional',
    primary: '#18181B',
    secondary: '#F4F4F5',
    accent: '#71717A',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    headingText: '#09090B',
    bodyText: '#27272A',
    mutedText: '#71717A',
    borderColor: '#E4E4E7',
    badge: '📰 Clean Editorial'
  }
];

// -------------------------------------------------------------
// 2. CURATED TYPOGRAPHY COMBINATIONS
// -------------------------------------------------------------
export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: 'font-cormorant-montserrat',
    name: 'Cormorant Garamond + Montserrat',
    headingFont: 'Cormorant Garamond, serif',
    bodyFont: 'Montserrat, sans-serif',
    accentFont: 'Playfair Display, serif',
    category: 'elegant'
  },
  {
    id: 'font-playfair-dancing',
    name: 'Playfair Display + Dancing Script',
    headingFont: 'Playfair Display, serif',
    bodyFont: 'Plus Jakarta Sans, sans-serif',
    accentFont: 'Dancing Script, cursive',
    category: 'romantic'
  },
  {
    id: 'font-cinzel-outfit',
    name: 'Cinzel + Outfit',
    headingFont: 'Cinzel, serif',
    bodyFont: 'Outfit, sans-serif',
    accentFont: 'Montserrat, sans-serif',
    category: 'luxury'
  },
  {
    id: 'font-plus-caveat',
    name: 'Plus Jakarta Sans + Caveat',
    headingFont: 'Plus Jakarta Sans, sans-serif',
    bodyFont: 'Plus Jakarta Sans, sans-serif',
    accentFont: 'Caveat, cursive',
    category: 'modern'
  },
  {
    id: 'font-dancing-garamond',
    name: 'Dancing Script + Garamond',
    headingFont: 'Dancing Script, cursive',
    bodyFont: 'Cormorant Garamond, serif',
    accentFont: 'Playfair Display, serif',
    category: 'romantic'
  },
  {
    id: 'font-bold-montserrat',
    name: 'Montserrat Editorial Bold',
    headingFont: 'Montserrat, sans-serif',
    bodyFont: 'Plus Jakarta Sans, sans-serif',
    accentFont: 'Outfit, sans-serif',
    category: 'editorial'
  }
];

// -------------------------------------------------------------
// 3. 15 LAYOUT SYSTEMS
// -------------------------------------------------------------
export const LAYOUT_SYSTEMS: LayoutSystem[] = [
  {
    id: 'L01',
    code: 'L01',
    name: 'Centered Hero & Floating Crown',
    description: 'Prominent central celebration emblem with structured focal hierarchy and soft foil accenting.',
    icon: '👑',
    frameStyle: 'card'
  },
  {
    id: 'L02',
    code: 'L02',
    name: 'Top Typography & Editorial Cascade',
    description: 'Generous top typography header flowing smoothly into event specifics and message highlights.',
    icon: '📜',
    frameStyle: 'editorial'
  },
  {
    id: 'L03',
    code: 'L03',
    name: 'Bottom Botanical Floral Bouquet',
    description: 'Spacious airy central layout with romantic lush botanical base flourishes.',
    icon: '💐',
    frameStyle: 'card'
  },
  {
    id: 'L04',
    code: 'L04',
    name: 'Dual Corner Botanical Frame',
    description: 'Balanced diagonally mirrored decorative corners framing custom invitation text.',
    icon: '🌿',
    frameStyle: 'border'
  },
  {
    id: 'L05',
    code: 'L05',
    name: 'Full Bleed Palace Filigree',
    description: 'Full edge-to-edge luxury background with delicate gold filigree and royal emblems.',
    icon: '🏰',
    frameStyle: 'full-bleed'
  },
  {
    id: 'L06',
    code: 'L06',
    name: 'Modern Asymmetric Editorial',
    description: 'Bold oversized typography pairings with contemporary asymmetry and clean negative space.',
    icon: '📰',
    frameStyle: 'editorial'
  },
  {
    id: 'L07',
    code: 'L07',
    name: 'Photo Spotlight Hero',
    description: 'Large central visual photo window with surrounding celebration details and direct links.',
    icon: '🖼️',
    frameStyle: 'split'
  },
  {
    id: 'L08',
    code: 'L08',
    name: 'Split Screen Duo Layout',
    description: 'Harmonious two-column balance pairing featured imagery with invitation itinerary.',
    icon: '🌓',
    frameStyle: 'split'
  },
  {
    id: 'L09',
    code: 'L09',
    name: 'Mughal & Temple Arch Window',
    description: 'Classic heritage curved architectural arch enclosing event names and sacred blessings.',
    icon: '🕌',
    frameStyle: 'arch'
  },
  {
    id: 'L10',
    code: 'L10',
    name: 'Circular Floral Wreath Monogram',
    description: 'Intricately illustrated floral and botanical wreath circling the primary couple names.',
    icon: '⭕',
    frameStyle: 'wreath'
  },
  {
    id: 'L11',
    code: 'L11',
    name: 'Ornate Kolam & Henna Border',
    description: 'Intricate traditional Indian Kolam, Rangoli and paisley mandala border enclosing the card.',
    icon: '🪷',
    frameStyle: 'border'
  },
  {
    id: 'L12',
    code: 'L12',
    name: 'Polaroid Memory Collage Grid',
    description: 'Playful photo snapshot frames with handwritten captions, sticker elements and maps.',
    icon: '📸',
    frameStyle: 'storybook'
  },
  {
    id: 'L13',
    code: 'L13',
    name: 'Modern Event Poster & Flyer',
    description: 'High-impact promotional poster layout with bold dates, badges, callouts, and RSVP.',
    icon: '🏷️',
    frameStyle: 'editorial'
  },
  {
    id: 'L14',
    code: 'L14',
    name: 'Storybook Fairytale Illustration',
    description: 'Warm illustrated children storybook motifs with soft clouds, stars, and playful accents.',
    icon: '🧸',
    frameStyle: 'storybook'
  },
  {
    id: 'L15',
    code: 'L15',
    name: 'Luxury Wax Seal & Gold Foil Card',
    description: 'Minimalist ultra-premium stationery aesthetic with gold stamped typography and wax seal.',
    icon: '✨',
    frameStyle: 'card'
  }
];

// -------------------------------------------------------------
// 4. RICH PREDESIGNED COMPLETE MASTER TEMPLATES WITH DUMMY CONTENT
// -------------------------------------------------------------
export const MASTER_TEMPLATES: MasterTemplate[] = [
  // ---------------- WEDDING TEMPLATES ----------------
  {
    id: 'tmpl-wedding-traditional-marigold',
    name: 'Traditional Royal Marigold Mandap',
    category: 'wedding',
    categoryLabel: 'Wedding',
    layoutCode: 'L09',
    paletteId: 'pal-crimson-gold',
    fontPairingId: 'font-cinzel-outfit',
    tagline: 'Auspicious fresh marigold toran, sacred kalash & royal gold filigree',
    badge: '🪷 Royal Marigold',
    defaultTitle: 'Aarav & Meera',
    defaultRecipient: 'The Families of Sri. Sundar & Sri. Ramanathan',
    defaultDate: '2026-11-28',
    defaultLocation: 'The Grand Mandapam, ECR Coast, Chennai',
    defaultMessages: [
      'With the divine blessings of our beloved elders and almighty, we solicit the pleasure of your gracious presence at our wedding ceremony.',
      'Muhurtham: 7:30 AM to 9:00 AM on Sunday, 28th November 2026.',
      'Grand Reception to follow in the evening with traditional feast & live music.'
    ],
    defaultElements: ['rings', 'flowers', 'sparkles', 'music'],
    primaryColor: '#991B1B',
    secondaryColor: '#FFFDF7',
    highlightColor: '#F59E0B',
    frameType: 'traditional-marigold-gold',
    decorativeMotif: 'auspicious-kalash',
    shlokaText: 'Under the Auspicious Divine Blessings',
    textureType: 'gold-dust',
    animations: {
      title: 'fade-in',
      details: 'slide-up',
      photos: 'zoom-in'
    }
  },
  {
    id: 'tmpl-wedding-banana-leaf-traditional',
    name: 'Sacred Banana Leaf & Jasmine Kalyanam',
    category: 'wedding',
    categoryLabel: 'Wedding',
    layoutCode: 'L09',
    paletteId: 'pal-emerald-heritage',
    fontPairingId: 'font-cinzel-outfit',
    tagline: 'Traditional verdant banana leaves, fragrant jasmine strands & brass deepams',
    badge: '🍃 Banana Leaf Heritage',
    defaultTitle: 'Santhosh & Ananya',
    defaultRecipient: 'Request the honor of your presence',
    defaultDate: '2026-10-24',
    defaultLocation: 'Sri Karpagambal Kalyana Mandapam, Mylapore, Chennai',
    defaultMessages: [
      'Joined in holy matrimony under the gracious blessings of our families and elders.',
      'Muhurtham: 6:00 AM to 7:30 AM on Saturday, 24th October 2026.',
      'Traditional Kalyana Virundhu (Feast on Banana Leaf) to follow.'
    ],
    defaultElements: ['flowers', 'rings', 'sparkles', 'music'],
    primaryColor: '#064E3B',
    secondaryColor: '#F0FDF4',
    highlightColor: '#F59E0B',
    frameType: 'banana-leaf-traditional',
    decorativeMotif: 'brass-diya',
    shlokaText: 'With the Grace of the Almighty',
    textureType: 'banana-palm',
    animations: {
      title: 'slide-up',
      details: 'fade-in',
      photos: 'zoom-in'
    }
  },
  {
    id: 'tmpl-wedding-regal-peacock-palace',
    name: 'Regal Twin Peacock Palace Sapphire',
    category: 'wedding',
    categoryLabel: 'Wedding',
    layoutCode: 'L05',
    paletteId: 'pal-royal-azure',
    fontPairingId: 'font-cinzel-outfit',
    tagline: 'Majestic twin peacocks with feather plumes, royal blue dome and jaali lattice',
    badge: '🦚 Regal Peacock',
    defaultTitle: 'Ranveer & Shanaya',
    defaultRecipient: 'Cordially Invite You to Celebrate Their Royal Wedding',
    defaultDate: '2026-12-12',
    defaultLocation: 'Umaid Heritage Palace, Jodhpur, Rajasthan',
    defaultMessages: [
      'Two royal hearts unite in eternal love amidst the golden sands of Rajasthan.',
      'Sangeet & Royal Cocktails: 11th Dec • Royal Baraat & Pheras: 12th Dec at Sunset.',
      'Your esteemed presence will honor our families on this joyous milestone.'
    ],
    defaultElements: ['sparkles', 'champagne', 'stars', 'rings'],
    primaryColor: '#0F2C59',
    secondaryColor: '#F0F9FF',
    highlightColor: '#D4AF37',
    frameType: 'royal-peacock-crest-frame',
    decorativeMotif: 'royal-peacock',
    shlokaText: 'Celebrating Our Holy Matrimony',
    textureType: 'jali-lattice',
    animations: {
      title: 'zoom-in',
      details: 'slide-up',
      photos: 'fade-in'
    }
  },
  {
    id: 'tmpl-wedding-south-indian-temple',
    name: 'South Indian Temple Kalyanam',
    category: 'wedding',
    categoryLabel: 'Wedding',
    layoutCode: 'L09',
    paletteId: 'pal-marigold-saffron',
    fontPairingId: 'font-cinzel-outfit',
    tagline: 'Traditional temple gopuram arch with brass bells, deep maroon and Kanjeevaram gold',
    badge: '🛕 Temple Heritage',
    defaultTitle: 'Karthik & Deepa',
    defaultRecipient: 'Together with their families',
    defaultDate: '2026-09-15',
    defaultLocation: 'Sri Lakshmi Narayana Kalyana Mandapam, Mylapore, Chennai',
    defaultMessages: [
      'With the divine grace of Sri Mahaganapathi, we request the pleasure of your presence and blessings at our holy wedding ceremony.',
      'Muhurtham: 6:00 AM to 7:30 AM on Sunday, 15th September 2026.',
      'Kalyana Virundhu (Traditional Feast) to follow immediately.'
    ],
    defaultElements: ['rings', 'flowers', 'sparkles', 'music'],
    primaryColor: '#7C2D12',
    secondaryColor: '#FFFDF5',
    highlightColor: '#D97706',
    frameType: 'south-temple-arch',
    decorativeMotif: 'temple-bells',
    shlokaText: 'With the Divine Blessings of Lord Mahavishnu',
    textureType: 'jali-lattice',
    animations: {
      title: 'slide-up',
      details: 'fade-in',
      photos: 'zoom-in'
    }
  },
  {
    id: 'tmpl-wedding-rajasthani-jharokha',
    name: 'Royal Rajasthani Palace Jharokha',
    category: 'wedding',
    categoryLabel: 'Wedding',
    layoutCode: 'L05',
    paletteId: 'pal-royal-azure',
    fontPairingId: 'font-cinzel-outfit',
    tagline: 'Majestic Mughal Jharokha scalloped dome, royal peacock crest & jaali lattice',
    badge: '🏰 Royal Palace',
    defaultTitle: 'Dev & Natasha',
    defaultRecipient: 'Invite You to Celebrate Their Grand Wedding',
    defaultDate: '2026-11-20',
    defaultLocation: 'The Oberoi Rajvilas, Jaipur',
    defaultMessages: [
      'With the blessings of our parents, we invite you to be part of our wedding celebrations.',
      'Join us for an enchanting evening filled with dance, music, and eternal love.'
    ],
    defaultElements: ['sparkles', 'flowers', 'rings', 'champagne'],
    primaryColor: '#0F2C59',
    secondaryColor: '#FFFDF9',
    highlightColor: '#D4AF37',
    frameType: 'royal-rajasthani-mandap',
    decorativeMotif: 'royal-peacock',
    shlokaText: 'In the Gracious Presence of Family & Friends',
    textureType: 'jali-lattice',
    animations: {
      title: 'zoom-in',
      details: 'slide-up',
      photos: 'fade-in'
    }
  },
  {
    id: 'tmpl-wedding-ivory-botanical',
    name: 'Ivory Botanical Peony & Eucalyptus',
    category: 'wedding',
    categoryLabel: 'Wedding',
    layoutCode: 'L04',
    paletteId: 'pal-ivory-sage-gold',
    fontPairingId: 'font-cormorant-montserrat',
    tagline: 'Delicate watercolor peony blossoms, eucalyptus sprigs & rose gold borders',
    badge: '🌿 Botanical Peony',
    defaultTitle: 'Aarav & Meera',
    defaultRecipient: 'Together with their families',
    defaultDate: '2026-11-28',
    defaultLocation: 'The Glasshouse Pavilion, ECR, Chennai',
    defaultMessages: [
      'With joyful hearts and the blessings of our parents, we warmly invite you to celebrate our union.',
      'Join us as we step into our forever and share an evening of love, laughter, and vows.',
      'Dinner, music, and celebrations to follow the ceremony.'
    ],
    defaultElements: ['hearts', 'sparkles', 'flowers', 'rings'],
    primaryColor: '#2D4A3E',
    secondaryColor: '#FAFBF9',
    highlightColor: '#D4AF37',
    frameType: 'botanical-peony-gold',
    decorativeMotif: 'botanical-rose-wreath',
    shlokaText: 'Together With Their Families',
    textureType: 'floral-damask',
    animations: {
      title: 'fade-in',
      details: 'slide-up',
      photos: 'zoom-in'
    }
  },
  {
    id: 'tmpl-wedding-blush-garland',
    name: 'Blush Watercolor Rose Garland',
    category: 'wedding',
    categoryLabel: 'Wedding',
    layoutCode: 'L10',
    paletteId: 'pal-blush-champagne',
    fontPairingId: 'font-playfair-dancing',
    tagline: 'Romantic blush peony petals with soft calligraphy script and glowing rings',
    badge: '🌸 Blush Garland',
    defaultTitle: 'Siddharth & Tanya',
    defaultRecipient: 'Are getting married!',
    defaultDate: '2026-11-14',
    defaultLocation: 'ITC Grand Chola, Garden Terrace, Chennai',
    defaultMessages: [
      'Two souls, one heart. Please join us as we say "I Do" beneath the stars.',
      'Followed by dinner, cocktails, and memorable celebrations.'
    ],
    defaultElements: ['hearts', 'flowers', 'sparkles', 'ribbon'],
    primaryColor: '#9E3A59',
    secondaryColor: '#FFF5F7',
    highlightColor: '#DFB76C',
    frameType: 'botanical-peony-gold',
    decorativeMotif: 'gilded-rings',
    shlokaText: 'Forever Begins Today',
    textureType: 'floral-damask',
    animations: {
      title: 'slide-left',
      details: 'slide-up',
      photos: 'zoom-in'
    }
  },
  {
    id: 'tmpl-wedding-obsidian-gold',
    name: 'Black & Gold Midnight Luxe',
    category: 'wedding',
    categoryLabel: 'Wedding',
    layoutCode: 'L15',
    paletteId: 'pal-black-gold-luxury',
    fontPairingId: 'font-cinzel-outfit',
    tagline: 'Deep velvet obsidian with glowing gold stamped foil typography & art deco lines',
    badge: '✨ Midnight Stardust',
    defaultTitle: 'Vikram & Natasha',
    defaultRecipient: 'Request the pleasure of your company',
    defaultDate: '2026-12-19',
    defaultLocation: 'The Leela Palace Ballroom, Bengaluru',
    defaultMessages: [
      'Together with their families, Vikram & Natasha invite you to an enchanting evening of celebration.',
      'Black Tie / Formal Evening Attire. Cocktails, dinner, and dancing till dawn.'
    ],
    defaultElements: ['sparkles', 'champagne', 'stars'],
    primaryColor: '#FBBF24',
    secondaryColor: '#111418',
    highlightColor: '#FEF08A',
    frameType: 'art-deco-geometric',
    decorativeMotif: 'monogram-crest',
    shlokaText: 'An Evening of Black Tie Elegance',
    textureType: 'gold-dust',
    animations: {
      title: 'zoom-in',
      details: 'fade-in',
      photos: 'rotate-in'
    }
  },

  // ---------------- ENGAGEMENT TEMPLATES ----------------
  {
    id: 'tmpl-engagement-gold-rings',
    name: 'Auspicious Ring Ceremony & Sangeet',
    category: 'engagement',
    categoryLabel: 'Engagement',
    layoutCode: 'L01',
    paletteId: 'pal-crimson-gold',
    fontPairingId: 'font-cinzel-outfit',
    tagline: 'Sacred blessings, interlocking golden rings & marigold garland border',
    badge: '💍 Ring Ceremony',
    defaultTitle: 'Aditya & Rhea',
    defaultRecipient: 'Ring Ceremony & Engagement Celebration',
    defaultDate: '2026-08-30',
    defaultLocation: 'Taj Coromandel, Ball Room, Nungambakkam',
    defaultMessages: [
      'He asked, and she said YES! Join us as we exchange rings and celebrate our commitment.',
      'We would be blessed to have our family and closest friends by our side on this magical evening.'
    ],
    defaultElements: ['rings', 'sparkles', 'champagne', 'hearts'],
    primaryColor: '#881337',
    secondaryColor: '#FFFBEB',
    highlightColor: '#D97706',
    frameType: 'traditional-marigold-gold',
    decorativeMotif: 'ganesha-minimal',
    shlokaText: 'With Gracious Blessings & Joyful Hearts',
    textureType: 'gold-dust',
    animations: {
      title: 'zoom-in',
      details: 'slide-up',
      photos: 'fade-in'
    }
  },
  {
    id: 'tmpl-engagement-doves-peace',
    name: 'Twin Doves of Love & Peace',
    category: 'engagement',
    categoryLabel: 'Engagement',
    layoutCode: 'L04',
    paletteId: 'pal-blush-champagne',
    fontPairingId: 'font-playfair-dancing',
    tagline: 'Delicate love doves carrying olive sprigs, soft rose blush & gold border',
    badge: '🕊️ Love Doves',
    defaultTitle: 'Kabir & Tara',
    defaultRecipient: 'Are Excited to Announce Their Engagement',
    defaultDate: '2026-11-05',
    defaultLocation: 'The Leela Kovalam Beach Pavilion, Kerala',
    defaultMessages: [
      'Hand in hand, heart to heart, our forever begins today.',
      'Please join us for a sunset cocktail celebration by the sea.'
    ],
    defaultElements: ['hearts', 'sparkles', 'champagne', 'flowers'],
    primaryColor: '#9E3A59',
    secondaryColor: '#FFF5F7',
    highlightColor: '#DFB76C',
    frameType: 'botanical-peony-gold',
    decorativeMotif: 'doves-peace',
    shlokaText: 'Two Souls, One Forever Love',
    textureType: 'floral-damask',
    animations: {
      title: 'fade-in',
      details: 'slide-up',
      photos: 'zoom-in'
    }
  },
  {
    id: 'tmpl-engagement-champagne-love',
    name: 'Champagne Sunset Romance',
    category: 'engagement',
    categoryLabel: 'Engagement',
    layoutCode: 'L06',
    paletteId: 'pal-cream-terracotta',
    fontPairingId: 'font-cormorant-montserrat',
    tagline: 'Warm terracotta sunset hues with modern botanical framing',
    badge: '🥂 Champagne Toast',
    defaultTitle: 'Naveen & Shreya',
    defaultRecipient: 'Decided on Forever',
    defaultDate: '2026-10-10',
    defaultLocation: 'The Glass House, Hyatt Regency',
    defaultMessages: [
      'We are officially engaged! Come raise a glass of champagne and celebrate our love story with us.',
      'Music, live barbecue, and endless memories.'
    ],
    defaultElements: ['champagne', 'sparkles', 'hearts'],
    primaryColor: '#C85A32',
    secondaryColor: '#FAF5F0',
    highlightColor: '#E0926B',
    frameType: 'botanical-peony-gold',
    decorativeMotif: 'champagne-toast',
    shlokaText: 'Decided on Forever',
    textureType: 'parchment',
    animations: {
      title: 'fade-in',
      details: 'slide-up',
      photos: 'pulse'
    }
  },

  // ---------------- HOUSEWARMING / GRIHA PRAVESH ----------------
  {
    id: 'tmpl-housewarming-traditional-kolam',
    name: 'Auspicious Griha Pravesham (Housewarming)',
    category: 'housewarming',
    categoryLabel: 'Housewarming',
    layoutCode: 'L11',
    paletteId: 'pal-marigold-saffron',
    fontPairingId: 'font-cinzel-outfit',
    tagline: 'Traditional sacred brass diya lamp, mango leaf toran, and welcoming kolam',
    badge: '🏡 Griha Pravesh',
    defaultTitle: 'The Sharma Family Home',
    defaultRecipient: 'Warmly Invites You to Our Griha Pravesham',
    defaultDate: '2026-09-08',
    defaultLocation: 'Villa 42, Green Meadows Enclave, OMR, Chennai',
    defaultMessages: [
      'With the blessings of Almighty and our elders, we are stepping into our new dream home.',
      'Puja & Ganapathi Homam: 6:00 AM onwards. Followed by traditional feast & house tour.',
      'Your presence and warm prayers will bring prosperity and light to our abode.'
    ],
    defaultElements: ['home', 'flowers', 'sparkles', 'sun'],
    primaryColor: '#B45309',
    secondaryColor: '#FFFDF5',
    highlightColor: '#EA580C',
    frameType: 'traditional-marigold-gold',
    decorativeMotif: 'brass-diya',
    shlokaText: 'Auspicious Griha Pravesh & Housewarming',
    textureType: 'gold-dust',
    animations: {
      title: 'slide-up',
      details: 'fade-in',
      photos: 'zoom-in'
    }
  },

  // ---------------- BABY & KIDS BIRTHDAYS ----------------
  {
    id: 'tmpl-baby-cloud-stars',
    name: 'Dreamy Moon, Cradle & Pastels (Baby Shower)',
    category: 'baby-shower',
    categoryLabel: 'Baby Shower',
    layoutCode: 'L14',
    paletteId: 'pal-blush-champagne',
    fontPairingId: 'font-plus-caveat',
    tagline: 'Soft pastel blossoms, delicate cradle, floating stars and gentle lullaby vibe',
    badge: '🍼 Baby Shower',
    defaultTitle: 'A Little Star is on the Way!',
    defaultRecipient: 'Baby Shower in Honor of Radhika',
    defaultDate: '2026-08-25',
    defaultLocation: 'The Courtyard Villa, Besant Nagar',
    defaultMessages: [
      'We\'re over the moon! Join us in showering love and sweet blessings on mama-to-be Radhika.',
      'Games, high tea, and warm blessings for the upcoming bundle of joy.'
    ],
    defaultElements: ['moon', 'stars', 'cloud', 'gift', 'hearts'],
    primaryColor: '#EC4899',
    secondaryColor: '#FFF9FA',
    highlightColor: '#F59E0B',
    frameType: 'baby-pastel-floral',
    decorativeMotif: 'cradle-baby',
    shlokaText: 'Welcome Little Bundle of Joy 🌸',
    textureType: 'parchment',
    animations: {
      title: 'fade-in',
      details: 'slide-up',
      photos: 'zoom-in'
    }
  },
  {
    id: 'tmpl-birthday-luxury-gold',
    name: 'Milestone Golden Jubilee Birthday',
    category: 'birthday',
    categoryLabel: 'Birthday',
    layoutCode: 'L01',
    paletteId: 'pal-black-gold-luxury',
    fontPairingId: 'font-cinzel-outfit',
    tagline: 'Glamorous black & gold starburst explosion for milestone birthdays',
    badge: '🎂 Milestone Jubilee',
    defaultTitle: 'Arvind is Turning 50!',
    defaultRecipient: 'Celebrating 5 Decades of Joy, Wisdom & Laughter',
    defaultDate: '2026-09-20',
    defaultLocation: 'Sky Terrace Lounge, Park Hyatt, Guindy',
    defaultMessages: [
      'Join us for an unforgettable evening celebrating Arvind\'s 50th Milestone Birthday!',
      'Dress Code: Smart Casuals with a Touch of Gold. Cocktails, dinner & DJ night.'
    ],
    defaultElements: ['cake', 'champagne', 'balloons', 'sparkles', 'confetti'],
    primaryColor: '#FBBF24',
    secondaryColor: '#111418',
    highlightColor: '#FEF08A',
    frameType: 'art-deco-geometric',
    decorativeMotif: 'sparkle-burst',
    shlokaText: 'Cheers to 50 Glorious Years ✨',
    textureType: 'gold-dust',
    animations: {
      title: 'bounce-in',
      details: 'slide-up',
      photos: 'zoom-in'
    }
  },
  {
    id: 'tmpl-birthday-pastel-garden',
    name: 'Pastel Floral Garden Tea Party',
    category: 'birthday',
    categoryLabel: 'Birthday',
    layoutCode: 'L03',
    paletteId: 'pal-blush-champagne',
    fontPairingId: 'font-playfair-dancing',
    tagline: 'Sweet floral blooms, watercolor roses, cupcakes & afternoon rosé aesthetics',
    badge: '🌸 Garden Tea Party',
    defaultTitle: 'Pooja\'s Sweet 25',
    defaultRecipient: 'An Afternoon of Cake, Sunflowers & Rosé',
    defaultDate: '2026-09-12',
    defaultLocation: 'The Secret Garden Café, Adyar',
    defaultMessages: [
      'Join me in celebrating my 25th birthday surrounded by sweet friends, flowers, and delicious desserts!',
      'Can\'t wait to make unforgettable memories with you all.'
    ],
    defaultElements: ['cake', 'flowers', 'balloons', 'gift'],
    primaryColor: '#9E3A59',
    secondaryColor: '#FFF5F7',
    highlightColor: '#DFB76C',
    frameType: 'botanical-peony-gold',
    decorativeMotif: 'botanical-rose-wreath',
    shlokaText: 'A Day of Sunshine & Sweet Flowers',
    textureType: 'floral-damask',
    animations: {
      title: 'fade-in',
      details: 'slide-up',
      photos: 'zoom-in'
    }
  },

  // ---------------- BUSINESS CARD & FLYER ----------------
  {
    id: 'tmpl-business-card-studio',
    name: 'Aura Wellness & Design Studio',
    category: 'business-card',
    categoryLabel: 'Business Card',
    layoutCode: 'L13',
    paletteId: 'pal-ivory-sage-gold',
    fontPairingId: 'font-bold-montserrat',
    tagline: 'Executive digital visiting card with WhatsApp, Google Map, and UPI QR',
    badge: '🎴 Digital Visiting Card',
    defaultTitle: 'Aura Fitness & Yoga Studio',
    defaultRecipient: 'Personal Training • Nutrition • Mindfulness',
    defaultDate: '2026-08-20',
    defaultLocation: 'Level 3, KNK Road, Nungambakkam, Chennai',
    defaultMessages: [
      'Transform your physical wellness with tailored morning yoga batches and functional strength coaching.',
      'Tap below to connect directly on WhatsApp or navigate via Google Maps.'
    ],
    defaultElements: ['briefcase', 'location', 'sparkles'],
    primaryColor: '#2D4A3E',
    secondaryColor: '#FAFBF9',
    highlightColor: '#D4AF37',
    frameType: 'modern-minimal-filigree',
    decorativeMotif: 'monogram-crest',
    shlokaText: 'Connect & Experience Wellness',
    textureType: 'none',
    animations: {
      title: 'slide-up',
      details: 'fade-in',
      photos: 'zoom-in'
    }
  },
  {
    id: 'tmpl-flyer-festival-offer',
    name: 'Festival Grand Launch Flyer',
    category: 'flyer',
    categoryLabel: 'Flyer & Pamphlet',
    layoutCode: 'L13',
    paletteId: 'pal-crimson-gold',
    fontPairingId: 'font-bold-montserrat',
    tagline: 'High-impact promotional pamphlet for product launches and festive sales',
    badge: '📄 Digital Flyer',
    defaultTitle: 'Grand Handloom Silk Exhibition',
    defaultRecipient: 'Exclusive Festive Preview & Launch Offers',
    defaultDate: '2026-10-01',
    defaultLocation: 'Valluvar Kottam Exhibition Hall, Chennai',
    defaultMessages: [
      'Discover over 5,000 pure Kanchipuram silk sarees, designer lehengas, and artisanal jewelry.',
      'Special 20% inaugural discount for the first 100 visitors. Tap the map below for direct directions!'
    ],
    defaultElements: ['gift', 'sparkles', 'flowers'],
    primaryColor: '#881337',
    secondaryColor: '#FFFDF7',
    highlightColor: '#D97706',
    frameType: 'traditional-marigold-gold',
    decorativeMotif: 'brass-diya',
    shlokaText: 'Festive Grand Launch & Special Preview',
    textureType: 'gold-dust',
    animations: {
      title: 'zoom-in',
      details: 'slide-up',
      photos: 'fade-in'
    }
  }
];

// Helper to find template by ID
export function getMasterTemplateById(id: string): MasterTemplate | undefined {
  return MASTER_TEMPLATES.find(t => t.id === id);
}

// Helper to filter templates by category or search term
export function filterMasterTemplates(category?: string, searchTerm?: string): MasterTemplate[] {
  return MASTER_TEMPLATES.filter(tmpl => {
    const matchesCategory = !category || category === 'all' || tmpl.category === category;
    const matchesSearch = !searchTerm || 
      tmpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.defaultTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

// Aliases & Preset collections
export const COLOR_PALETTES = PALETTES;
export const MASTER_TEMPLATE_PRESETS = MASTER_TEMPLATES;

export interface FramePresetOption {
  id: FrameType;
  name: string;
  category: string;
  previewUrl?: string;
  badge?: string;
  icon?: string;
}

export const FRAME_PRESETS: FramePresetOption[] = [
  { id: 'none', name: 'No Frame', category: 'minimal', icon: '🖼️' },
  { id: 'grand-rangoli-mandala', name: 'Grand Rangoli Mandala', category: 'traditional', badge: '🪷 Traditional', icon: '🪷' },
  { id: 'royal-rose-garden', name: 'Royal Rose Garden', category: 'wedding', badge: '🌹 Floral', icon: '🌹' },
  { id: 'grand-kolam-heritage', name: 'Grand Kolam Heritage', category: 'traditional', badge: '🛕 Heritage', icon: '🛕' },
  { id: 'traditional-marigold-gold', name: 'Marigold & Gold Garland', category: 'traditional', badge: '🌼 Marigold', icon: '🌼' },
  { id: 'royal-rajasthani-mandap', name: 'Rajasthani Royal Mandap', category: 'traditional', badge: '🏰 Royal', icon: '🏰' },
  { id: 'south-temple-arch', name: 'South Indian Temple Gopuram', category: 'traditional', badge: '🛕 Temple', icon: '🛕' },
  { id: 'botanical-peony-gold', name: 'Botanical Peony Gold', category: 'wedding', badge: '🌿 Botanical', icon: '🌿' },
  { id: 'banana-leaf-traditional', name: 'Verdant Banana Leaf', category: 'traditional', badge: '🍃 Leaf', icon: '🍃' },
  { id: 'royal-peacock-crest-frame', name: 'Royal Peacock Crest', category: 'luxury', badge: '🦚 Peacock', icon: '🦚' },
  { id: 'vintage-eucalyptus-wreath', name: 'Vintage Eucalyptus Wreath', category: 'wedding', badge: '🌱 Wreath', icon: '🌱' },
  { id: 'mughal-jharokha', name: 'Mughal Jharokha Scallop', category: 'luxury', badge: '🕌 Mughal', icon: '🕌' },
  { id: 'art-deco-geometric', name: 'Art Deco Golden Geometric', category: 'luxury', badge: '✨ Deco', icon: '✨' },
  { id: 'modern-minimal-filigree', name: 'Modern Filigree Border', category: 'minimal', badge: '📐 Minimal', icon: '📐' },
  { id: 'baby-pastel-floral', name: 'Baby Pastel Floral Dream', category: 'kids', badge: '🍼 Pastel', icon: '🍼' },
  { id: 'festive-diwali-diya', name: 'Diwali Diya Golden Border', category: 'traditional', badge: '🪔 Festive', icon: '🪔' },
  { id: 'luxury-damask', name: 'Luxury Damask Silk', category: 'luxury', badge: '👑 Damask', icon: '👑' },
];

export interface MotifPresetOption {
  id: DecorativeMotif;
  name: string;
  icon: string;
  category: string;
}

export const MOTIF_PRESETS: MotifPresetOption[] = [
  { id: 'none', name: 'None', icon: '✨', category: 'minimal' },
  { id: 'grand-rangoli-center', name: 'Grand Rangoli Mandala', icon: '🪷', category: 'traditional' },
  { id: 'auspicious-kalash', name: 'Auspicious Kalash', icon: '🏺', category: 'traditional' },
  { id: 'royal-peacock', name: 'Royal Twin Peacock', icon: '🦚', category: 'traditional' },
  { id: 'sacred-lotus', name: 'Sacred Lotus Blossom', icon: '🌸', category: 'traditional' },
  { id: 'brass-diya', name: 'Brass Diya Flame', icon: '🪔', category: 'traditional' },
  { id: 'ganesha-minimal', name: 'Lord Ganesha Line Art', icon: '🐘', category: 'traditional' },
  { id: 'temple-bells', name: 'Brass Temple Bells', icon: '🔔', category: 'traditional' },
  { id: 'botanical-rose-wreath', name: 'Botanical Rose Wreath', icon: '🌹', category: 'wedding' },
  { id: 'gilded-rings', name: 'Gilded Intertwined Rings', icon: '💍', category: 'wedding' },
  { id: 'doves-peace', name: 'Twin Peace Doves', icon: '🕊️', category: 'wedding' },
  { id: 'champagne-toast', name: 'Sparkling Champagne Toast', icon: '🥂', category: 'party' },
  { id: 'monogram-crest', name: 'Royal Monogram Crest', icon: '👑', category: 'luxury' },
  { id: 'sparkle-burst', name: 'Gold Sparkle Explosion', icon: '✨', category: 'party' },
  { id: 'party-confetti', name: 'Festive Confetti', icon: '🎉', category: 'party' },
  { id: 'cradle-baby', name: 'Pastel Baby Cradle', icon: '🍼', category: 'kids' },
];

export interface TexturePresetOption {
  id: BackgroundTexture;
  name: string;
  description: string;
  icon?: string;
  intensity?: string;
}

export const TEXTURE_PRESETS: TexturePresetOption[] = [
  { id: 'none', name: 'Solid Color', description: 'Clean solid background', icon: '🎨', intensity: 'Smooth' },
  { id: 'rangoli-mandala', name: 'Rangoli Watermark', description: 'Subtle mandala linework background', icon: '🪷', intensity: 'Subtle Pattern' },
  { id: 'royal-kolam', name: 'Kolam Pattern', description: 'South Indian geometric kolam watermark', icon: '🛕', intensity: 'Traditional' },
  { id: 'gold-dust', name: 'Gold Dust Stardust', description: 'Shimmering fine golden speckles', icon: '✨', intensity: 'Shimmering' },
  { id: 'floral-damask', name: 'Damask Floral Silk', description: 'Royal damask embossed texture', icon: '🌹', intensity: 'Luxury Silk' },
  { id: 'jali-lattice', name: 'Mughal Jaali Lattice', description: 'Intricate royal lattice shadow', icon: '🕌', intensity: 'Geometric' },
  { id: 'banana-palm', name: 'Banana Palm Leaf', description: 'Verdant fresh palm texture', icon: '🍃', intensity: 'Organic' },
  { id: 'parchment', name: 'Vintage Parchment', description: 'Warm organic textured paper', icon: '📜', intensity: 'Vintage Paper' },
  { id: 'silk-linen', name: 'Luxury Linen Silk', description: 'Soft fabric weave background', icon: '🧵', intensity: 'Soft Weave' },
];
