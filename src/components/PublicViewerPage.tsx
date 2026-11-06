import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { PublishService } from '../domain/publishing/publishService';
import { firebaseService } from '../lib/firebase-service';
import type { PublicationSnapshot } from '../domain/invite/types';
import type { LovinglyEvent } from '../types';
import { CanvasViewer } from './canvas/CanvasViewer';
import { EventViewer } from './Viewer';

import { InsightsService } from '../domain/engage/insightsService';

function shouldRecordGuestView(slug: string, ownerId?: string, inviteId?: string): boolean {
  if (!slug || slug.startsWith('sample-')) return false;
  const currentUid = auth.currentUser?.uid;
  // Never count views from the creator / owner
  if (currentUid && ownerId && currentUid === ownerId) {
    return false;
  }
  // Also check if the current browser holds the creator's local draft for this invite
  if (typeof window !== 'undefined') {
    if (inviteId && localStorage.getItem(`draft_${inviteId}`)) {
      return false;
    }
    const sessionKey = `yl_viewed_${slug}`;
    if (sessionStorage.getItem(sessionKey)) {
      return false;
    }
    sessionStorage.setItem(sessionKey, '1');
  }
  return true;
}

export function PublicViewerPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [snapshot, setSnapshot] = useState<PublicationSnapshot | null>(null);
  const [legacyEvent, setLegacyEvent] = useState<LovinglyEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug) {
        navigate('/');
        return;
      }

      try {
        // 1. Try loading from Canonical Normalized Public Projections (T09/T10)
        const snap = await PublishService.getPublicProjection(slug);
        
        if (snap) {
          // Check expiry
          if (snap.expiresAt && new Date(snap.expiresAt) < new Date()) {
            setIsExpired(true);
            return;
          }

          const ownerId = snap.ownerId || snap.invite?.ownerId;
          if (shouldRecordGuestView(slug, ownerId, snap.inviteId)) {
            InsightsService.recordView(slug).catch(console.error);
          }

          // Prefer full LovinglyEvent payload for exact design fidelity (frames, motifs, textures, RSVP, QR, print)
          if (snap.legacyEvent && Array.isArray(snap.legacyEvent.messages)) {
            setLegacyEvent({ ...snap.legacyEvent, isPublished: true });
            return;
          }

          const rawSnap = snap as unknown as Partial<LovinglyEvent>;
          if (Array.isArray(rawSnap.messages) && rawSnap.designStyle) {
            setLegacyEvent({ ...(rawSnap as LovinglyEvent), isPublished: true });
            return;
          }

          // For older published invites where legacyEvent was not embedded in public_invites, try fetching source event
          if (ownerId && snap.inviteId) {
            try {
              const sourceDoc = await getDoc(doc(db, 'users', ownerId, 'events', snap.inviteId));
              if (sourceDoc.exists()) {
                const sourceData = sourceDoc.data() as LovinglyEvent;
                if (sourceData && Array.isArray(sourceData.messages)) {
                  setLegacyEvent({ ...sourceData, isPublished: true });
                  return;
                }
              }
            } catch {
              // Ignore permission error if guest cannot read private user event collection
            }
          }

          setSnapshot(snap);
          return;
        }

        // 2. Fallback to Legacy Prototype Event in public_invites
        const legacy = await firebaseService.getPublishedEvent(slug);
        if (legacy && Array.isArray(legacy.messages)) {
          if (legacy.expiresAt && new Date(legacy.expiresAt) < new Date()) {
            setIsExpired(true);
          } else if (shouldRecordGuestView(slug, legacy.ownerId, legacy.id)) {
            InsightsService.recordView(slug).catch(console.error);
          }
          setLegacyEvent(legacy);
          return;
        }

        // 3. Fallback for Creator / Owner previewing or printing their own unpublished draft in the same browser
        if (typeof window !== 'undefined') {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('draft_')) {
              try {
                const parsed = JSON.parse(localStorage.getItem(key) || '{}') as LovinglyEvent;
                if (parsed && parsed.slug === slug && Array.isArray(parsed.messages)) {
                  setLegacyEvent(parsed);
                  return;
                }
              } catch {
                // ignore malformed draft
              }
            }
          }
        }

        if (auth.currentUser) {
          const userEvents = await firebaseService.getUserEvents(auth.currentUser.uid);
          const matchingOwnEvent = userEvents.find(ev => ev.slug === slug);
          if (matchingOwnEvent) {
            setLegacyEvent(matchingOwnEvent);
            return;
          }
        }

        // 4. Not found
        navigate('/');
      } catch (err) {
        console.error(err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-100">
        <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // T10: Lock screen for expired invites
  if (isExpired) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-stone-900 mb-2">Invite Expired</h1>
            <p className="text-sm text-stone-500">
              The hosting period for this invitation has concluded. If you are the creator, you can extend the hosting duration from your dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (legacyEvent) {
    return <EventViewer event={legacyEvent} />;
  }

  if (snapshot) {
    return <CanvasViewer snapshot={snapshot} />;
  }

  return null;
}

