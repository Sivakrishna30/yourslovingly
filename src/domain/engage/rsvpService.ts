import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { sanitizeForFirestore } from '../../lib/utils';

export interface RsvpEntry {
  id?: string;
  guestName: string;
  attending: boolean;
  guestCount: number;
  message?: string;
  createdAt?: string;
}

export class RsvpService {
  static async submitRsvp(slug: string, entry: Omit<RsvpEntry, 'id' | 'createdAt'>): Promise<string> {
    const colRef = collection(db, 'public_invites', slug, 'rsvps');
    const docRef = await addDoc(colRef, sanitizeForFirestore({
      ...entry,
      createdAt: serverTimestamp()
    }));
    return docRef.id;
  }
}
