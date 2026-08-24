export type ElementType = 
  | 'text'
  | 'photo'
  | 'spotify'
  | 'map'
  | 'rsvp'
  | 'upi_qr'
  | 'shape'
  | 'custom';

/**
 * Represents a distinct visual canvas within an Invite.
 * Stored in /users/{uid}/invites/{inviteId}/pages/{pageId}
 */
export interface Page {
  id: string;
  inviteId: string;
  order: number;
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

/**
 * Represents a placeable element on a Page canvas.
 * Stored in /users/{uid}/invites/{inviteId}/pages/{pageId}/elements/{elementId}
 */
export interface ElementInstance {
  id: string;
  pageId: string;
  type: ElementType;
  
  /** Semantic binding role (e.g., 'groom_name') */
  role?: string;     
  
  /** Coordinate-based placement */
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  rotation?: number;
  
  /** Raw payload and visual overrides */
  content: Record<string, unknown>;
  styleOverrides?: Record<string, unknown>;
}

/**
 * Defines semantic roles decoupled from visual elements.
 */
export interface TemplateFieldDefinition {
  role: string;      // e.g., 'event_date'
  type: 'text' | 'image' | 'date' | 'location';
  label: string;
  required: boolean;
}

/**
 * Defines the capabilities and default dimensions of an element type.
 */
export interface ElementDefinition {
  type: ElementType;
  defaultWidth: number;
  defaultHeight: number;
  resizable: boolean;
}
