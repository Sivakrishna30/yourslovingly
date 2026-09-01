import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { sanitizeForFirestore } from '../../lib/utils';

export interface TransactionEntry {
  id?: string;
  senderName: string;
  amount: number;
  message?: string;
  createdAt?: string;
}

export class LedgerService {
  static async recordTransaction(slug: string, entry: Omit<TransactionEntry, 'id' | 'createdAt'>): Promise<string> {
    const colRef = collection(db, 'public_invites', slug, 'transactions');
    const docRef = await addDoc(colRef, sanitizeForFirestore({
      ...entry,
      createdAt: serverTimestamp()
    }));
    return docRef.id;
  }
}
