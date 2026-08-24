import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

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
    const docRef = await addDoc(colRef, {
      ...entry,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  }
}
