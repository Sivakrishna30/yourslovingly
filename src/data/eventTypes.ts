import { 
  Heart, 
  Cake, 
  Home, 
  Sparkles, 
  Baby, 
  Flame, 
  Briefcase, 
  PartyPopper,
  Compass
} from 'lucide-react';
import type { EventKind } from '../types';

export interface EventTypeOption {
  id: EventKind;
  title: string;
  subtitle: string;
  icon: typeof Heart;
  badge?: string;
  popular?: boolean;
  category: 'personal' | 'celebration' | 'traditional' | 'professional';
  color: string;
  bgLight: string;
  defaultTitle: string;
  defaultRecipient: string;
  defaultMessage: string;
}

export const EVENT_TYPE_OPTIONS: EventTypeOption[] = [
  {
    id: 'wedding',
    title: 'Wedding & Reception',
    subtitle: 'Wedding ceremony, dinner party, and reception celebrations',
    icon: Heart,
    popular: true,
    category: 'traditional',
    color: 'text-rose-700',
    bgLight: 'bg-rose-50 border-rose-200',
    defaultTitle: 'The Wedding Ceremony',
    defaultRecipient: 'Together with their families',
    defaultMessage: 'We lovingly request the honor of your presence and blessings as we begin our new journey together.'
  },
  {
    id: 'birthday',
    title: 'Birthday Celebration',
    subtitle: 'Kids birthdays, milestone celebrations, themed parties',
    icon: Cake,
    popular: true,
    category: 'celebration',
    color: 'text-amber-700',
    bgLight: 'bg-amber-50 border-amber-200',
    defaultTitle: "Aarav's 5th Birthday Bash!",
    defaultRecipient: 'Join us for cake, games & magic',
    defaultMessage: 'Come dressed up and celebrate an evening filled with laughter, delicious snacks, and fun games.'
  },
  {
    id: 'housewarming',
    title: 'Housewarming Celebration',
    subtitle: 'New home blessing, housewarming feast, family gathering',
    icon: Home,
    popular: true,
    category: 'traditional',
    color: 'text-emerald-700',
    bgLight: 'bg-emerald-50 border-emerald-200',
    defaultTitle: 'Housewarming & Blessing Ceremony',
    defaultRecipient: 'With blessings of elders',
    defaultMessage: 'We request your gracious presence to grace our new home and share our joy.'
  },
  {
    id: 'anniversary',
    title: 'Anniversary Celebration',
    subtitle: 'Silver Jubilee, Golden Jubilee, intimate dinner gala',
    icon: Sparkles,
    popular: true,
    category: 'personal',
    color: 'text-teal-700',
    bgLight: 'bg-teal-50 border-teal-200',
    defaultTitle: 'Silver Jubilee Anniversary',
    defaultRecipient: 'Celebrating 25 Years of Love',
    defaultMessage: 'Raise a toast with us to 25 unforgettable years and countless cherished memories.'
  },
  {
    id: 'engagement',
    title: 'Engagement & Ring Ceremony',
    subtitle: 'Ring exchange ceremony, cocktail party, family celebration',
    icon: Sparkles,
    category: 'personal',
    color: 'text-pink-700',
    bgLight: 'bg-pink-50 border-pink-200',
    defaultTitle: 'The Engagement Ceremony',
    defaultRecipient: 'Two hearts unite',
    defaultMessage: 'Please join us as we celebrate the promise of love and exchange rings.'
  },
  {
    id: 'baby-shower',
    title: 'Baby Shower & Celebration',
    subtitle: 'Baby shower, Naming ceremony, Cradle ceremony',
    icon: Baby,
    category: 'personal',
    color: 'text-purple-700',
    bgLight: 'bg-purple-50 border-purple-200',
    defaultTitle: 'Baby Shower Celebration',
    defaultRecipient: 'Welcoming our little blessing',
    defaultMessage: 'Join us to shower blessings and love on the mom-to-be and the baby on the way.'
  },
  {
    id: 'festival',
    title: 'Festive Gathering & Party',
    subtitle: 'Holiday party, seasonal celebration, festive dinner',
    icon: Flame,
    category: 'traditional',
    color: 'text-orange-700',
    bgLight: 'bg-orange-50 border-orange-200',
    defaultTitle: 'Auspicious Festive Gathering & Feast',
    defaultRecipient: 'Cordial Invitation',
    defaultMessage: 'May joy and light bring prosperity and health to all of us. Join us for celebrations and lunch.'
  },
  {
    id: 'corporate',
    title: 'Business Launch & Meetup',
    subtitle: 'Store inaugurations, product launches, corporate galas',
    icon: Briefcase,
    category: 'professional',
    color: 'text-blue-700',
    bgLight: 'bg-blue-50 border-blue-200',
    defaultTitle: 'Grand Launch & Inauguration',
    defaultRecipient: 'Exclusive Preview Event',
    defaultMessage: 'We cordially invite you to the grand opening and exclusive product showcase.'
  },
  {
    id: 'party',
    title: 'Cocktails, Reunion & Party',
    subtitle: 'Get-togethers, farewell parties, bachelorette, dinner',
    icon: PartyPopper,
    category: 'celebration',
    color: 'text-rose-600',
    bgLight: 'bg-rose-50 border-rose-200',
    defaultTitle: 'Weekend Reunion & Gala Night',
    defaultRecipient: 'Good vibes & music',
    defaultMessage: 'Good friends, good food, and unforgettable music. Let us catch up and make new memories.'
  },
  {
    id: 'custom',
    title: 'Custom Event / Any Occasion',
    subtitle: 'Build completely customized page for any special event',
    icon: Compass,
    category: 'personal',
    color: 'text-stone-700',
    bgLight: 'bg-stone-100 border-stone-300',
    defaultTitle: 'Special Celebration',
    defaultRecipient: 'You are cordially invited',
    defaultMessage: 'Please join us for a delightful celebration with family and friends.'
  }
];
