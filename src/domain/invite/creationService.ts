import type { Invite } from './types';
import { InviteRepository } from './repository';
import type { Page, ElementInstance } from '../element/types';

export class CreationService {
  /**
   * Initializes a new draft invite.
   */
  static createDraft(ownerId: string, id: string): Invite {
    return {
      id,
      ownerId,
      slug: Math.random().toString(36).substring(2, 10),
      title: 'Untitled Invite',
      tier: 'free',
      status: 'draft',
      isPasswordProtected: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: null,
      expiresAt: null,
    };
  }

  static createDefaultPage(inviteId: string): Page {
    return {
      id: `page_${Date.now()}`,
      inviteId,
      order: 0,
      backgroundColor: '#ffffff'
    };
  }

  /**
   * Loads a draft from local storage for guests, or from Firestore for users.
   */
  static async loadOrCreateDraft(uid: string | null, inviteId: string): Promise<{ invite: Invite, pages: Page[], elements: ElementInstance[] }> {
    if (uid) {
      const existing = await InviteRepository.getInvite(uid, inviteId);
      if (existing) return existing;
    } else {
      // Local storage fallback for guests
      const localData = localStorage.getItem(`draft_${inviteId}`);
      if (localData) {
        return JSON.parse(localData);
      }
    }

    // Create new
    const draft = this.createDraft(uid || 'guest', inviteId);
    const page = this.createDefaultPage(inviteId);
    const data = { invite: draft, pages: [page], elements: [] };
    
    if (uid) {
      await InviteRepository.saveInvite(uid, draft, data.pages, data.elements);
    } else {
      localStorage.setItem(`draft_${inviteId}`, JSON.stringify(data));
    }
    
    return data;
  }

  static async saveDraft(uid: string | null, invite: Invite, pages: Page[], elements: ElementInstance[]) {
    invite.updatedAt = new Date().toISOString();
    if (uid) {
      await InviteRepository.saveInvite(uid, invite, pages, elements);
    } else {
      localStorage.setItem(`draft_${invite.id}`, JSON.stringify({ invite, pages, elements }));
    }
  }
}
