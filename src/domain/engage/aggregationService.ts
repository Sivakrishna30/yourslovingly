import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import type { RsvpEntry } from './rsvpService';
import type { TransactionEntry } from './ledgerService';

export interface DashboardInsights {
  views: number;
  lastViewedAt: string | null;
  rsvps: RsvpEntry[];
  totalAttending: number;
  totalDeclined: number;
  totalGuests: number;
  transactions: TransactionEntry[];
  totalAmountRaised: number;
}

export class DashboardAggregationService {
  static async getInsights(slug: string): Promise<DashboardInsights> {
    const insights: DashboardInsights = {
      views: 0,
      lastViewedAt: null,
      rsvps: [],
      totalAttending: 0,
      totalDeclined: 0,
      totalGuests: 0,
      transactions: [],
      totalAmountRaised: 0,
    };

    try {
      // 1. Get General Views
      const generalRef = doc(db, 'public_invites', slug, 'insights', 'general');
      const generalSnap = await getDoc(generalRef);
      if (generalSnap.exists()) {
        const data = generalSnap.data();
        insights.views = data.views || 0;
        insights.lastViewedAt = data.lastViewedAt || null;
      }

      // 2. Get RSVPs
      const rsvpsRef = collection(db, 'public_invites', slug, 'rsvps');
      const rsvpSnaps = await getDocs(rsvpsRef);
      
      rsvpSnaps.forEach((doc) => {
        const rsvp = doc.data() as RsvpEntry;
        rsvp.id = doc.id;
        insights.rsvps.push(rsvp);
        
        if (rsvp.attending) {
          insights.totalAttending++;
          insights.totalGuests += (rsvp.guestCount || 1);
        } else {
          insights.totalDeclined++;
        }
      });

      // 3. Get Transactions
      const txRef = collection(db, 'public_invites', slug, 'transactions');
      const txSnaps = await getDocs(txRef);
      
      txSnaps.forEach((doc) => {
        const tx = doc.data() as TransactionEntry;
        tx.id = doc.id;
        insights.transactions.push(tx);
        insights.totalAmountRaised += (tx.amount || 0);
      });

      // Sort by newest first
      insights.rsvps.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      insights.transactions.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    } catch (err) {
      console.error('Failed to aggregate insights:', err);
    }

    return insights;
  }
}
