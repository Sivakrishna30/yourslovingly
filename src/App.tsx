import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDocFromServer } from 'firebase/firestore';
import { auth, googleProvider, db, firebaseReady } from './firebase';
import type { LovinglyEvent, CreationCategory, DesignStyle, EventKind } from './types';
import { firebaseService } from './lib/firebase-service';
import { createBlankEvent, toFriendlyPathSegment, getEventCreatorPath, getEventTypePath } from './lib/utils';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { EventEditor } from './components/Editor';
import { EventViewer } from './components/Viewer';

type AppView = 'home' | 'dashboard' | 'editor' | 'viewer';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => firebaseReady);
  const [view, setView] = useState<AppView>('home');
  const [events, setEvents] = useState<LovinglyEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<LovinglyEvent | null>(null);
  const [viewingEvent, setViewingEvent] = useState<LovinglyEvent | null>(null);

  // Connection Test
  useEffect(() => {
    if (!firebaseReady) return;
    let mounted = true;
    const testConnection = async (retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          await getDocFromServer(doc(db, 'test', 'connection'));
          if (mounted) break;
        } catch (error) {
          const isUnavailable = 
            (error as { code?: string })?.code === 'unavailable' ||
            (error instanceof Error && (
              error.message.includes('offline') || 
              error.message.includes('unavailable') || 
              error.message.includes('Could not reach')
            ));
          
          if (i < retries - 1 && isUnavailable) {
            await new Promise((res) => setTimeout(res, 1200));
          } else if (isUnavailable) {
            console.warn("Firestore operating in offline or cached mode.");
          } else {
            console.error("Firebase connection check error:", error);
          }
        }
      }
    };
    testConnection();
    return () => { mounted = false; };
  }, []);

  // Auth Listener
  useEffect(() => {
    if (!firebaseReady) return;
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userEvents = await firebaseService.getUserEvents(u.uid);
        setEvents(userEvents);
      } else {
        setEvents([]);
      }
      setLoading(false);
    });
  }, []);

  // Simple Router
  useEffect(() => {
    const handleRoute = async () => {
      const path = window.location.pathname.slice(1);
      const parts = path.split('/').filter(Boolean);

      if (parts.length === 0) {
        setView(user ? 'dashboard' : 'home');
        return;
      }

      if (parts[0] === 'pricing') {
        setView('home');
        setTimeout(() => {
          document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }

      if (parts[0] === 'builder' || parts[0] === 'dashboard') {
        setView('dashboard');
        return;
      }

      // Viewer detection: /:creator/:type/:slug or legacy /p/:slug
      let slug = '';
      if (parts[0] === 'p' || parts[0] === 'page') {
        slug = parts[1];
      } else if (parts.length >= 3) {
        slug = parts[2];
      }

      if (slug) {
        const event = await firebaseService.getPublishedEvent(slug);
        if (event) {
          setViewingEvent(event);
          setView('viewer');
        } else {
          setView('home');
        }
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, [user]);

  const handleStartGuestCreation = (category: CreationCategory = 'invite', style: DesignStyle = 'botanical-rose') => {
    const ownerId = user ? user.uid : 'guest-creator';
    const creatorPath = user?.displayName ? toFriendlyPathSegment(user.displayName) : 'yours-lovingly';
    
    // Map category to a default event type
    let defaultType: EventKind = 'wedding';
    if (category === 'business-card') defaultType = 'business-card';
    if (category === 'flyer') defaultType = 'flyer';
    if (category === 'portfolio') defaultType = 'portfolio';

    const newEvent = createBlankEvent(ownerId, defaultType, creatorPath);
    newEvent.creationCategory = category;
    newEvent.designStyle = style;

    setEditingEvent(newEvent);
    setView('editor');
  };

  const handleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      return res.user;
    } catch (err) {
      console.error('Sign in failed', err);
      return null;
    }
  };

  const handleSignOut = () => signOut(auth);

  const handleCreateNew = () => {
    handleStartGuestCreation();
  };

  const handleEdit = (event: LovinglyEvent) => {
    setEditingEvent(event);
    setView('editor');
  };

  const handleDelete = async (event: LovinglyEvent) => {
    if (!user || !confirm('Delete this event?')) return;
    await firebaseService.deleteUserEvent(user.uid, event.id);
    setEvents(prev => prev.filter(e => e.id !== event.id));
  };

  const handleUpdateEvent = async (updates: Partial<LovinglyEvent>) => {
    if (!editingEvent) return;
    const updated = { ...editingEvent, ...updates };
    setEditingEvent(updated);
    if (user) {
      await firebaseService.saveUserEvent(user.uid, updated);
      setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
    }
  };

  const handlePublishAndSave = async (eventToPublish: LovinglyEvent, activeUser: User | null): Promise<boolean> => {
    const targetUser = activeUser || user;
    if (!targetUser) return false;

    const creatorPath = getEventCreatorPath(eventToPublish, targetUser);
    const updatedEvent: LovinglyEvent = {
      ...eventToPublish,
      ownerId: targetUser.uid,
      creatorPath,
      isPublished: true,
    };

    await firebaseService.saveUserEvent(targetUser.uid, updatedEvent);
    setEditingEvent(updatedEvent);
    setEvents(prev => {
      const exists = prev.some(e => e.id === updatedEvent.id);
      if (exists) return prev.map(e => e.id === updatedEvent.id ? updatedEvent : e);
      return [updatedEvent, ...prev];
    });
    return true;
  };

  const handleExtendHosting = async (updatedEvent: LovinglyEvent) => {
    if (!user) return;
    await firebaseService.extendEventHosting(user.uid, updatedEvent);
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    if (editingEvent?.id === updatedEvent.id) {
      setEditingEvent(updatedEvent);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!firebaseReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-6 mx-auto">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-4">Firebase Setup Required</h1>
          <p className="text-slate-600 mb-8">
            Please add your Firebase credentials in the <strong>Settings &gt; Secrets</strong> menu to start using Yours Lovingly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-rose-100 selection:text-rose-900">
      <Analytics />
      {view === 'home' && (
        <Landing 
          user={user} 
          onSignIn={handleSignIn} 
          onSignOut={handleSignOut} 
          onStart={() => handleStartGuestCreation('invite')}
          onStartWithCategory={(cat, style) => handleStartGuestCreation(cat, style)}
        />
      )}
      
      {view === 'dashboard' && user && (
        <Dashboard 
          events={events} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onNew={handleCreateNew} 
          onExtendHosting={handleExtendHosting}
        />
      )}

      {view === 'editor' && editingEvent && (
        <EventEditor 
          event={editingEvent} 
          user={user}
          onSignIn={handleSignIn}
          onUpdate={handleUpdateEvent}
          onPublishAndSave={handlePublishAndSave}
          onExtendHosting={handleExtendHosting}
          onBack={() => {
            window.history.pushState({}, '', '/');
            setView(user ? 'dashboard' : 'home');
          }}
          onPreview={() => {
             const url = `/${getEventCreatorPath(editingEvent, user)}/${getEventTypePath(editingEvent)}/${editingEvent.slug}`;
             window.open(url, '_blank');
          }}
        />
      )}

      {view === 'viewer' && viewingEvent && (
        <EventViewer event={viewingEvent} />
      )}
    </div>
  );
}
