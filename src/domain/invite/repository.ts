import { doc, getDoc, collection, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import type { Invite } from './types';
import type { EntitlementTier } from '../entitlement/types';
import type { Page, ElementInstance } from '../element/types';
import type { LovinglyEvent } from '../../types';

export class InviteRepository {
  /**
   * Migrate a legacy LovinglyEvent to the new normalized Invite structure in-memory.
   */
  public static adaptLegacyEvent(legacy: LovinglyEvent): { invite: Invite, pages: Page[], elements: ElementInstance[] } {
    const derivedTier: EntitlementTier = (legacy.tier === 'premium' || legacy.planTier === 'premium_99')
      ? 'premium'
      : (legacy.tier === 'standard' || legacy.planTier === 'basic_49' || legacy.planTier === 'single_49' || (legacy.isPublished && legacy.tier !== 'free'))
        ? 'basic'
        : 'free';

    const invite: Invite = {
      id: legacy.id,
      ownerId: legacy.ownerId,
      slug: legacy.slug,
      title: legacy.title || 'Untitled Invite',
      tier: derivedTier,
      status: legacy.isPublished ? 'published' : 'draft',
      isPasswordProtected: Boolean(legacy.isPasscodeProtected || legacy.passcode || legacy.password),
      password: legacy.passcode || legacy.password,
      createdAt: legacy.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: legacy.publishedAt || null,
      expiresAt: legacy.expiresAt || null,
    };

    const pageId = `page_${legacy.id}`;
    const pages: Page[] = [{
      id: pageId,
      inviteId: legacy.id,
      order: 0,
      backgroundColor: legacy.primaryColor || '#ffffff',
    }];

    const elements: ElementInstance[] = [];
    
    // Add text elements if exists
    if (legacy.title) {
      elements.push({
        id: `el_title_${legacy.id}`,
        pageId,
        type: 'text',
        role: 'title',
        x: 0, y: 0, z: 1, width: 300, height: 50,
        content: { text: legacy.title }
      });
    }

    return { invite, pages, elements };
  }

  static async getInvite(uid: string, inviteId: string): Promise<{ invite: Invite, pages: Page[], elements: ElementInstance[] } | null> {
    // 1. Try reading from new normalized path
    const inviteRef = doc(db, 'users', uid, 'invites', inviteId);
    const inviteSnap = await getDoc(inviteRef);
    
    if (inviteSnap.exists()) {
      const invite = inviteSnap.data() as Invite;
      const pagesSnap = await getDocs(collection(db, 'users', uid, 'invites', inviteId, 'pages'));
      const pages = pagesSnap.docs.map(d => d.data() as Page);
      const elements: ElementInstance[] = [];
      
      for (const page of pages) {
        const elSnap = await getDocs(collection(db, 'users', uid, 'invites', inviteId, 'pages', page.id, 'elements'));
        elements.push(...elSnap.docs.map(d => d.data() as ElementInstance));
      }
      
      return { invite, pages, elements };
    }

    // 2. Try reading from legacy path (Dual-read migration adapter)
    const legacyRef = doc(db, 'users', uid, 'events', inviteId);
    const legacySnap = await getDoc(legacyRef);
    if (legacySnap.exists()) {
      const legacyData = legacySnap.data() as LovinglyEvent;
      return this.adaptLegacyEvent(legacyData);
    }

    return null;
  }

  static async listInvites(uid: string): Promise<Invite[]> {
    const invites: Invite[] = [];
    
    // 1. Get normalized invites
    const normalizedSnap = await getDocs(collection(db, 'users', uid, 'invites'));
    normalizedSnap.docs.forEach(doc => invites.push(doc.data() as Invite));

    // 2. Get legacy events and adapt
    const legacySnap = await getDocs(collection(db, 'users', uid, 'events'));
    legacySnap.docs.forEach(doc => {
      const legacyData = doc.data() as LovinglyEvent;
      // Deduplicate if we already migrated and saved to normalized
      if (!invites.some(i => i.id === legacyData.id)) {
        invites.push(this.adaptLegacyEvent(legacyData).invite);
      }
    });

    return invites.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  static async saveInvite(uid: string, invite: Invite, pages: Page[], elements: ElementInstance[]): Promise<void> {
    const batch = writeBatch(db);
    
    // Save Invite
    const inviteRef = doc(db, 'users', uid, 'invites', invite.id);
    batch.set(inviteRef, { ...invite, updatedAt: serverTimestamp() }, { merge: true });

    // Save Pages
    for (const page of pages) {
      const pageRef = doc(db, 'users', uid, 'invites', invite.id, 'pages', page.id);
      batch.set(pageRef, page, { merge: true });
      
      // Save Elements for this Page
      const pageElements = elements.filter(e => e.pageId === page.id);
      for (const element of pageElements) {
        const elRef = doc(db, 'users', uid, 'invites', invite.id, 'pages', page.id, 'elements', element.id);
        batch.set(elRef, element, { merge: true });
      }
    }

    await batch.commit();
  }

  static async deleteInvite(uid: string, inviteId: string): Promise<void> {
    const batch = writeBatch(db);
    
    // Delete normalized
    const inviteRef = doc(db, 'users', uid, 'invites', inviteId);
    batch.delete(inviteRef);
    
    // Note: Due to Firestore shallow deletes, subcollections would normally require 
    // recursive deletion (either via callable function or sweeping here).
    // For T04, we'll delete the parent doc. Production would use a Cloud Function.

    // Delete legacy (if exists)
    const legacyRef = doc(db, 'users', uid, 'events', inviteId);
    batch.delete(legacyRef);
    
    await batch.commit();
  }
}
