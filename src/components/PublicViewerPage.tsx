import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { PublishService } from '../domain/publishing/publishService';
import { firebaseService } from '../lib/firebase-service';
import type { PublicationSnapshot } from '../domain/invite/types';
import type { LovinglyEvent } from '../types';
import { CanvasViewer } from './canvas/CanvasViewer';
import { EventViewer } from './Viewer';

import { InsightsService } from '../domain/engage/insightsService';

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
          } else {
            // T12: Record view if not expired
            InsightsService.recordView(slug).catch(console.error);
          }
          setSnapshot(snap);
          return;
        }

        // 2. Fallback to Legacy Prototype Event
        const legacy = await firebaseService.getPublishedEvent(slug);
        if (legacy) {
          // Check expiry for legacy
          if (legacy.expiresAt && new Date(legacy.expiresAt) < new Date()) {
            setIsExpired(true);
          }
          setLegacyEvent(legacy);
          return;
        }

        // 3. Not found
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

  if (snapshot) {
    return <CanvasViewer snapshot={snapshot} />;
  }

  if (legacyEvent) {
    return <EventViewer event={legacyEvent} />;
  }

  return null;
}
