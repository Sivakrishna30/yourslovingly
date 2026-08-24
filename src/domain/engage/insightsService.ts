import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase';

export class InsightsService {
  /**
   * Atomically increments the view count for a published invite.
   */
  static async recordView(slug: string): Promise<void> {
    const ref = doc(db, 'public_invites', slug, 'insights', 'general');
    
    try {
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          views: 1,
          lastViewedAt: new Date().toISOString()
        });
      } else {
        await updateDoc(ref, {
          views: increment(1),
          lastViewedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Failed to record view:', err);
    }
  }
}
