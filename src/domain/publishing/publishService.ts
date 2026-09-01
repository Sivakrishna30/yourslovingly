import { doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import type { Invite, PublicationSnapshot } from '../invite/types';
import type { Page, ElementInstance } from '../element/types';
import { EntitlementService } from '../entitlement/entitlementService';
import { sanitizeForFirestore } from '../../lib/utils';

export class PublishService {
  /**
   * Generates an immutable snapshot of the invite and its elements.
   * Then writes it to the public_invites and public_invites/{id}/versions collections.
   */
  static async publishInvite(
    uid: string, 
    invite: Invite, 
    pages: Page[], 
    elements: ElementInstance[]
  ): Promise<string> {
    
    // 1. Entitlement validation is assumed to have happened before calling this,
    // or we check tier bounds here. For this implementation, we just generate the snapshot.

    const publishedAt = new Date().toISOString();
    
    // Calculate expiry if not lifetime (validityDays > 0)
    const capabilities = EntitlementService.getCapabilities(invite.tier);
    let expiresAt = null;
    if (capabilities.validityDays > 0) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + capabilities.validityDays);
      expiresAt = expiryDate.toISOString();
    }

    // Freeze deep copies
    const inviteCopy = JSON.parse(JSON.stringify(invite)) as Invite;
    const pagesCopy = JSON.parse(JSON.stringify(pages)) as Page[];
    const elementsCopy = JSON.parse(JSON.stringify(elements)) as ElementInstance[];

    // Group elements by pageId
    const elementsByPage: Record<string, ElementInstance[]> = {};
    for (const page of pagesCopy) {
      elementsByPage[page.id] = elementsCopy.filter(e => e.pageId === page.id);
    }

    const snapshotId = `v_${Date.now()}`;
    const snapshot: PublicationSnapshot = {
      id: snapshotId,
      inviteId: invite.id,
      publishedAt,
      expiresAt,
      invite: inviteCopy,
      pages: pagesCopy,
      elements: elementsByPage,
    };

    const batch = writeBatch(db);

    // 2. Write the canonical projection document (for routing and fast fetching)
    const projectionRef = doc(db, 'public_invites', invite.slug);
    batch.set(projectionRef, sanitizeForFirestore({
      ...snapshot,
      ownerId: uid // required for RSVP updates
    }));

    // 3. Write immutable version history
    const versionRef = doc(db, 'public_invites', invite.slug, 'versions', snapshotId);
    batch.set(versionRef, sanitizeForFirestore({
      ...snapshot,
      ownerId: uid
    }));

    // 4. Update the source invite to mark as published
    const sourceRef = doc(db, 'users', uid, 'invites', invite.id);
    batch.set(sourceRef, sanitizeForFirestore({
      ...inviteCopy,
      status: 'published',
      publishedAt,
      expiresAt,
      updatedAt: serverTimestamp(),
    }), { merge: true });

    await batch.commit();

    return snapshotId;
  }

  static async getPublicProjection(slug: string): Promise<(PublicationSnapshot & { ownerId: string }) | null> {
    const docRef = doc(db, 'public_invites', slug);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as (PublicationSnapshot & { ownerId: string });
    }
    return null;
  }
}
