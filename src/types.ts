export type CreationCategory = 'invite' | 'business-card' | 'flyer' | 'portfolio';

export type DesignStyle = 
  | 'botanical-rose'
  | 'emerald-gold'
  | 'royal-heritage'
  | 'blush-pastel'
  | 'midnight-luxe'
  | 'sunlit-marigold';

export type EventKind =
  | 'birthday'
  | 'wedding'
  | 'engagement'
  | 'baby-shower'
  | 'naming-ceremony'
  | 'anniversary'
  | 'proposal'
  | 'housewarming'
  | 'farewell'
  | 'memorial'
  | 'friendship'
  | 'graduation'
  | 'reunion'
  | 'corporate'
  | 'party'
  | 'festival'
  | 'charity'
  | 'sports'
  | 'workshop'
  | 'business-card'
  | 'flyer'
  | 'portfolio'
  | 'custom';

export type TextAlign = 'left' | 'center' | 'right';
export type PhotoSize = 'compact' | 'medium' | 'large';
export type FontStyle = 'sweet' | 'classic' | 'playful' | 'clean' | 'script' | 'rounded' | 'bold';
export type BackgroundPattern = 'none' | 'hearts' | 'stars' | 'gifts' | 'flowers';
export type BorderStyle = 'none' | 'soft' | 'solid' | 'glow' | 'dashed' | 'double';
export type PageVisibility = 'anyone' | 'restricted';

export type PlanTier = 'free' | 'basic_49' | 'premium_99' | 'pro_499' | 'single_49';
export type HostingStatus = 'active' | 'expiring_soon' | 'expired' | 'lifetime';
export type HostingExtensionType = 'extension_30_days' | 'lifetime_single';

export interface HostingExtensionRecord {
  id: string;
  type: HostingExtensionType;
  amountPaid: number;
  extendedAt: string;
  previousExpiresAt?: string | null;
  newExpiresAt?: string | null;
  paymentReference?: string;
}

export type StudioElementKey = string;

export type FrameType = 
  | 'grand-rangoli-mandala'
  | 'royal-rose-garden'
  | 'grand-kolam-heritage'
  | 'traditional-marigold-gold'
  | 'royal-rajasthani-mandap'
  | 'south-temple-arch'
  | 'botanical-peony-gold'
  | 'banana-leaf-traditional'
  | 'royal-peacock-crest-frame'
  | 'vintage-eucalyptus-wreath'
  | 'mughal-jharokha'
  | 'art-deco-geometric'
  | 'modern-minimal-filigree'
  | 'baby-pastel-floral'
  | 'festive-diwali-diya'
  | 'luxury-damask'
  | 'none';

export type DecorativeMotif =
  | 'grand-rangoli-center'
  | 'auspicious-kalash'
  | 'royal-peacock'
  | 'sacred-lotus'
  | 'brass-diya'
  | 'ganesha-minimal'
  | 'temple-bells'
  | 'botanical-rose-wreath'
  | 'gilded-rings'
  | 'doves-peace'
  | 'champagne-toast'
  | 'monogram-crest'
  | 'sparkle-burst'
  | 'party-confetti'
  | 'cradle-baby'
  | 'none';

export type BackgroundTexture = 
  | 'rangoli-mandala'
  | 'royal-kolam'
  | 'gold-dust' 
  | 'floral-damask' 
  | 'jali-lattice' 
  | 'banana-palm'
  | 'parchment' 
  | 'silk-linen' 
  | 'none';

export type AnimationType = 
  | 'none'
  | 'fade-in'
  | 'slide-up'
  | 'slide-left'
  | 'zoom-in'
  | 'bounce-in'
  | 'pulse'
  | 'rotate-in';

export interface StudioElementStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderStyle?: BorderStyle;
  borderRadius?: number;
  paddingY?: number;
  paddingX?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  offsetX?: number;
  offsetY?: number;
  animation?: AnimationType;
  isLocked?: boolean;
}

export type StudioElementMap = Partial<Record<string, StudioElementStyle>>;
export type CanvaElementKey = StudioElementKey;
export type CanvaElementStyle = StudioElementStyle;
export type CanvaElementMap = StudioElementMap;

export interface ContentBlockBase {
  id: string;
  align: TextAlign;
  borderStyle: BorderStyle;
}

export interface MessageBlock extends ContentBlockBase {
  kind: 'message';
  text: string;
  fontStyle: FontStyle;
  fontSize: number;
}

export interface PhotoBlock extends ContentBlockBase {
  kind: 'photo';
  src: string;
  size: PhotoSize;
  width: number;
  positionX: number;
  positionY: number;
}

export type ContentBlock = MessageBlock | PhotoBlock;

export interface LovinglyEvent {
  id: string;
  slug: string;
  creatorPath: string;
  title: string;
  eventType: EventKind;
  customType: string;
  creationCategory?: CreationCategory;
  designStyle?: DesignStyle;
  recipientName: string;
  messages: string[];
  eventDate: string;
  location: string;
  primaryColor: string;
  secondaryColor: string;
  highlightColor: string;
  elements: string[];
  backgroundText: string;
  photos: string[];
  contentBlocks: ContentBlock[];
  messageAlignment: TextAlign;
  photoAlignment: TextAlign;
  photoSize: PhotoSize;
  backgroundPattern: BackgroundPattern;
  isPublished: boolean;
  createdAt: string;
  spotifyUrl?: string;
  showAds?: boolean;
  driveFolderId?: string;
  driveFileId?: string;
  drivePhotoFileIds?: string[];
  drivePublishedAt?: string;
  visibility?: PageVisibility;
  allowedEmails?: string;
  ownerId: string;
  tier?: 'free' | 'standard' | 'premium';
  planTier?: PlanTier;
  hostingDurationDays?: number;
  isLifetime?: boolean;
  publishedAt?: string;
  expiresAt?: string | null;
  hostingExtensions?: HostingExtensionRecord[];
  googleMapsUrl?: string;
  showLocationQrCode?: boolean;
  whatsappNumber?: string;
  upiId?: string;
  showUpiQrCode?: boolean;
  upiQrImageUrl?: string;
  isPasscodeProtected?: boolean;
  passcode?: string;
  elementStyles?: CanvaElementMap;
  activeElementKey?: CanvaElementKey;
  elementOrder?: string[];
  frameType?: FrameType;
  decorativeMotif?: DecorativeMotif;
  shlokaText?: string;
  textureType?: BackgroundTexture;
  guestCount?: number;
  itinerary?: {
    id: string;
    time: string;
    title: string;
    description: string;
  }[];
}

export interface PublicRoute {
  slug: string;
  creatorPath?: string;
  eventPath?: string;
  driveFileId?: string;
}

export interface EventRSVP {
  id: string;
  eventId?: string;
  slug: string;
  ownerId?: string;
  guestName: string;
  attending: boolean;
  guestCount: number;
  phone?: string;
  note?: string;
  createdAt: string;
}

export interface EventTransaction {
  id: string;
  eventId?: string;
  slug: string;
  ownerId?: string;
  senderName: string;
  amount: number;
  upiId?: string;
  transactionRef?: string;
  note?: string;
  createdAt: string;
}

export interface EventInsights {
  views: number;
  rsvps: EventRSVP[];
  totalAttendingCount: number;
  totalDeclinedCount: number;
  totalGuestCount: number;
  transactions?: EventTransaction[];
  totalAmountCollected?: number;
}
