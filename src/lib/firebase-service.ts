import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, serverTimestamp, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';
import type { LovinglyEvent, EventRSVP, EventTransaction, EventInsights } from '../types';
import { DashboardAggregationService } from '../domain/engage/aggregationService';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const code = (error as { code?: string })?.code;
  const isOfflineOrUnavailable =
    code === 'unavailable' ||
    code === 'failed-precondition' ||
    (error instanceof Error && (
      error.message.includes('offline') ||
      error.message.includes('unavailable') ||
      error.message.includes('Could not reach')
    ));

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  if (isOfflineOrUnavailable) {
    console.warn(`Firestore currently unreachable (${operationType} at ${path}). Operating in cached mode.`);
    return;
  }

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const firebaseService = {
  async saveUserEvent(uid: string, event: LovinglyEvent) {
    const path = `users/${uid}/events/${event.id}`;
    try {
      await setDoc(doc(db, 'users', uid, 'events', event.id), {
        ...event,
        ownerId: uid,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getUserEvents(uid: string): Promise<LovinglyEvent[]> {
    const path = `users/${uid}/events`;
    try {
      const snap = await getDocs(collection(db, 'users', uid, 'events'));
      return snap.docs.map(d => d.data() as LovinglyEvent);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
    return [];
  },

  async deleteUserEvent(uid: string, eventId: string) {
    const path = `users/${uid}/events/${eventId}`;
    try {
      await deleteDoc(doc(db, 'users', uid, 'events', eventId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async publishEvent(event: LovinglyEvent) {
    const path = `public_invites/${event.slug}`;
    try {
      const payload = {
        ...event,
        isPublished: true,
        lastPublishedAt: serverTimestamp()
      };
      await setDoc(doc(db, 'public_invites', event.slug), payload);
      return payload;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async extendEventHosting(
    uid: string,
    updatedEvent: LovinglyEvent
  ): Promise<LovinglyEvent> {
    try {
      // 1. Update user private collection
      await setDoc(doc(db, 'users', uid, 'events', updatedEvent.id), {
        ...updatedEvent,
        ownerId: uid,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // 2. If published, sync to public_invites collection
      if (updatedEvent.isPublished && updatedEvent.slug) {
        await setDoc(doc(db, 'public_invites', updatedEvent.slug), {
          ...updatedEvent,
          lastUpdated: serverTimestamp()
        }, { merge: true });
      }

      return updatedEvent;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${uid}/events/${updatedEvent.id}`);
      return updatedEvent;
    }
  },

  async unpublishEvent(slug: string) {
    const path = `public_invites/${slug}`;
    try {
      await deleteDoc(doc(db, 'public_invites', slug));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async getPublishedEvent(slug: string): Promise<LovinglyEvent | null> {
    const path = `public_invites/${slug}`;
    try {
      const snap = await getDoc(doc(db, 'public_invites', slug));
      return snap.exists() ? (snap.data() as LovinglyEvent) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
    return null;
  },

  async recordPageView(slug: string): Promise<void> {
    try {
      await setDoc(
        doc(db, 'public_invites', slug, 'insights', 'general'),
        {
          views: increment(1),
          lastViewedAt: serverTimestamp()
        },
        { merge: true }
      );
    } catch (error) {
      // Non-fatal analytics recording
      console.warn('Could not record page view:', error);
    }
  },

  async submitRSVP(slug: string, rsvpData: Omit<EventRSVP, 'id' | 'createdAt'>): Promise<EventRSVP> {
    const rsvpId = 'rsvp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const path = `public_invites/${slug}/rsvps/${rsvpId}`;
    const newRSVP: EventRSVP = {
      ...rsvpData,
      id: rsvpId,
      slug,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'public_invites', slug, 'rsvps', rsvpId), newRSVP);
      return newRSVP;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return newRSVP;
    }
  },

  async getEventRSVPs(slug: string): Promise<EventRSVP[]> {
    try {
      const snap = await getDocs(collection(db, 'public_invites', slug, 'rsvps'));
      const rsvps = snap.docs.map(d => d.data() as EventRSVP);
      return rsvps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.warn('Could not fetch RSVPs:', error);
      return [];
    }
  },

  async submitTransaction(slug: string, txData: Omit<EventTransaction, 'id' | 'createdAt'>): Promise<EventTransaction> {
    const txId = 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const path = `public_invites/${slug}/transactions/${txId}`;
    const newTx: EventTransaction = {
      ...txData,
      id: txId,
      slug,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'public_invites', slug, 'transactions', txId), newTx);
      return newTx;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return newTx;
    }
  },

  async getEventInsights(slug: string): Promise<EventInsights> {
    const agg = await DashboardAggregationService.getInsights(slug);
    return {
      views: agg.views,
      rsvps: agg.rsvps.map(r => ({
        id: r.id || '',
        slug,
        guestName: r.guestName,
        attending: r.attending,
        guestCount: r.guestCount,
        createdAt: r.createdAt || new Date().toISOString(),
      })),
      totalAttendingCount: agg.totalAttending,
      totalDeclinedCount: agg.totalDeclined,
      totalGuestCount: agg.totalGuests,
      transactions: agg.transactions.map(t => ({
        id: t.id || '',
        slug,
        senderName: t.senderName,
        amount: t.amount,
        createdAt: t.createdAt || new Date().toISOString(),
      })),
      totalAmountCollected: agg.totalAmountRaised,
    };
  }
};
