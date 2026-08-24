import type { EntitlementTier } from '../entitlement/types';
import type { Page, ElementInstance } from '../element/types';

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
  
  /** True if this invite is protected via a secure password mechanism */
  isPasswordProtected: boolean;
  
  /** Depending on the mechanism, could be hashed or raw. Handled securely by backend. */
  password?: string;
  
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
}
