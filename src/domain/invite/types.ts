import type { EntitlementTier } from '../entitlement/types';
import type { Page, ElementInstance } from '../element/types';
import type { LovinglyEvent } from '../../types';

export type InviteStatus = 'draft' | 'published';

/**
 * Core normalized Invite entity.
 * Stored in /users/{uid}/invites/{inviteId}
 */
export interface Invite {
  id: string;
  ownerId: string;
  slug: string;
  title: string;
  tier: EntitlementTier;
  status: InviteStatus;
  
  /** Access control mode via Google Account session ('anyone' or 'restricted') */
  visibility?: 'anyone' | 'restricted';
  allowedEmails?: string;
  
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  expiresAt: string | null;
}

/**
 * Immutable snapshot generated during the Publication Pipeline.
 * Stored in /public_invites/{inviteId}/versions/{snapshotId}
 */
export interface PublicationSnapshot {
  id: string; 
  inviteId: string;
  publishedAt: string;
  expiresAt: string | null;
  
  /** Frozen copy of the invite metadata at time of publication */
  invite: Readonly<Omit<Invite, 'status' | 'updatedAt'>>;
  
  /** Frozen copy of all pages */
  pages: ReadonlyArray<Readonly<Page>>;
  
  /** Frozen copy of all element instances, mapped by pageId */
  elements: Readonly<Record<string, ReadonlyArray<Readonly<ElementInstance>>>>;

  /** Full rich invitation event configuration for exact EventViewer rendering and PDF export */
  legacyEvent?: LovinglyEvent;
}

