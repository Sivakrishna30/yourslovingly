import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDocFromServer } from 'firebase/firestore';
import { auth, googleProvider, db, firebaseReady } from './firebase';
import type { LovinglyEvent, DesignStyle, TierType, PlanTier } from './types';
import { firebaseService } from './lib/firebase-service';
import { createBlankEvent, getEventCreatorPath, getEventTypePath } from './lib/utils';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { EventEditor } from './components/Editor';

// Note: creation components are imported here for the next phase.
import { EventTypeStep } from './components/creation/EventTypeStep';
import { TemplateStep } from './components/creation/TemplateStep';
import { DetailsStep } from './components/creation/DetailsStep';
import { ElementsStep } from './components/creation/ElementsStep';
import { PreviewStep } from './components/creation/PreviewStep';
import { FeaturesStep } from './components/creation/FeaturesStep';
import { PublishStep } from './components/creation/PublishStep';
import { PublicViewerPage } from './components/PublicViewerPage';
import { PublishService } from './domain/publishing/publishService';
import { InviteRepository } from './domain/invite/repository';

function CreationFlowWrapper({ user, handleSignIn }: { user: User | null, handleSignIn: () => Promise<User | null> }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const inviteId = pathParts[2];
  const step = pathParts[3];

  const handleNext = (nextStep: string) => navigate(`/create/${inviteId}/${nextStep}`);
  const handleBack = (prevStep: string) => navigate(`/create/${inviteId}/${prevStep}`);

  // Autosave and state would be loaded here. For now, we mock the event object 
  // just to satisfy the compiler while we implement T05 fully.
  const [event, setEvent] = useState<LovinglyEvent | null>(null);

  useEffect(() => {
    async function load() {
      let draft: LovinglyEvent | null = null;
      if (user) {
        const events = await firebaseService.getUserEvents(user.uid);
        draft = events.find((e: LovinglyEvent) => e.id === inviteId) || null;
      }
      if (!draft) {
        const local = localStorage.getItem(`draft_${inviteId}`);
        if (local) draft = JSON.parse(local);
      }
      if (!draft) {
        draft = createBlankEvent(user?.uid || 'guest', 'wedding', user?.displayName || 'guest');
        draft.id = inviteId;
      }
      setEvent(draft);
    }
    load();
  }, [inviteId, user]);

  const handleUpdate = async (updates: Partial<LovinglyEvent>) => {
    if (!event) return;
    const updated = { ...event, ...updates } as LovinglyEvent;
    setEvent(updated);
    
    // Autosave
    if (user) {
      await firebaseService.saveUserEvent(user.uid, updated);
    } else {
      localStorage.setItem(`draft_${inviteId}`, JSON.stringify(updated));
    }
  };

  const handlePublish = async (selectedTier: TierType = 'basic') => {
    if (!event) return;
    const isLifetime = selectedTier === 'lifetime';
    const planTier: PlanTier = (selectedTier === 'premium' || selectedTier === 'extended') ? 'premium_99' : 'basic_49';
    const tier = (selectedTier === 'premium' || selectedTier === 'extended') ? 'premium' : 'standard';
    const updated = { 
      ...event, 
      isPublished: true,
      tier,
      planTier,
      isLifetime,
      publishedAt: new Date().toISOString(),
    } as LovinglyEvent;
    setEvent(updated);
    if (user) {
      await firebaseService.saveUserEvent(user.uid, updated);
      
      // T09: Publication Pipeline Snapshot
      const { invite, pages, elements } = InviteRepository.adaptLegacyEvent(updated);
      await PublishService.publishInvite(user.uid, invite, pages, elements);
    }
    handleNext('payment');
  };

  if (!event) return <div>Loading...</div>;

  const stepNames: Record<string, string> = {
    'event-type': '1. Event Category',
    'template': '2. Template Canvas',
    'details': '3. Invite Details',
    'elements': '4. Motifs & Styles',
    'preview': '5. Guest Preview',
    'features': '6. Integrations',
    'publish': '7. Publish & Share'
  };

  const getStepNumber = (s: string) => {
    const keys = Object.keys(stepNames);
    const idx = keys.indexOf(s);
    return idx >= 0 ? idx + 1 : 1;
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-stone-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-6xl bg-white sm:rounded-3xl shadow-md border-0 sm:border border-stone-200 overflow-hidden min-h-[100dvh] flex flex-col relative max-w-full">
         {/* Creation Header */}
         <div className="p-3.5 sm:p-4 border-b border-stone-200 bg-white flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-2xs">
           <div className="flex items-center gap-2 min-w-0">
             <button 
               onClick={() => navigate(user ? '/dashboard' : '/')} 
               className="text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors shrink-0"
             >
               &larr; Exit
             </button>
             <span className="text-stone-300 font-light">|</span>
             <h2 className="font-serif font-bold text-stone-900 text-xs sm:text-base truncate">
               Yours Lovingly Creator
             </h2>
           </div>

           <div className="flex items-center gap-2 shrink-0">
             <span className="px-2.5 py-1 bg-rose-50 border border-rose-200/80 text-rose-700 text-[10px] sm:text-xs font-bold rounded-full">
               Step {getStepNumber(step || 'event-type')} of 7
             </span>
             <span className="text-[11px] font-medium text-stone-500 hidden md:inline">
               {stepNames[step || 'event-type']}
             </span>
           </div>
         </div>

         {/* Step Content */}
         <div className="flex-1 p-2 sm:p-6 overflow-y-auto overflow-x-hidden max-w-full">
            {step === 'event-type' && <EventTypeStep selectedEventType={event.eventType} onSelectEventType={(type, data) => { handleUpdate({ eventType: type, ...data }); handleNext('template'); }} onNext={() => handleNext('template')} />}
            {step === 'template' && <TemplateStep event={event} onSelectTemplate={(t) => { handleUpdate({ templateId: t.id, designStyle: t.id as DesignStyle }); handleNext('details'); }} onSelectBlank={() => { handleUpdate({ templateId: undefined }); handleNext('details'); }} onBack={() => handleBack('event-type')} onNext={() => handleNext('details')} />}
            {step === 'details' && <DetailsStep event={event} onUpdate={handleUpdate} onNext={() => handleNext('elements')} onBack={() => handleBack('template')} />}
            {step === 'elements' && <ElementsStep event={event} onUpdate={handleUpdate} onNext={() => handleNext('preview')} onBack={() => handleBack('details')} />}
            {step === 'preview' && <PreviewStep event={event} onNext={() => handleNext('features')} onBack={() => handleBack('elements')} />}
            {step === 'features' && <FeaturesStep event={event} onUpdate={handleUpdate} onNext={() => handleNext('publish')} onBack={() => handleBack('preview')} />}
            {step === 'publish' && <PublishStep event={event} user={user} onSignIn={handleSignIn} onPublish={handlePublish} onBack={() => handleBack('features')} />}
            {step === 'payment' && <div className="text-center p-12">Payment Boundary (T12 Skipped) <br/><button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded">Go to Dashboard</button></div>}
         </div>
      </div>
    </div>
  );
}

function AppRoutes({ user, handleSignIn, handleSignOut, events, setEvents }: { user: User | null, handleSignIn: () => Promise<User | null>, handleSignOut: () => void, events: LovinglyEvent[], setEvents: React.Dispatch<React.SetStateAction<LovinglyEvent[]>> }) {
  const navigate = useNavigate();

  const handleStartGuestCreation = () => {
    // Generate a temporary ID and redirect to the creation flow
    // A proper autosave draft will be created when we implement the new CreationFlow layout
    const newId = 'evt_' + Date.now().toString(36);
    navigate(`/create/${newId}/event-type`);
  };

  const handleEdit = (event: LovinglyEvent) => {
    // Legacy edit route
    navigate(`/edit/${event.id}`);
  };

  const handleSoftDelete = async (event: LovinglyEvent) => {
    if (!user) return;
    const updatedEvent: LovinglyEvent = { ...event, isDeleted: true, deletedAt: new Date().toISOString() };
    await firebaseService.saveUserEvent(user.uid, updatedEvent);
    setEvents((prev) => prev.map((e) => e.id === event.id ? updatedEvent : e));
  };

  const handleRestore = async (event: LovinglyEvent) => {
    if (!user) return;
    const updatedEvent: LovinglyEvent = { ...event, isDeleted: false, deletedAt: undefined };
    await firebaseService.saveUserEvent(user.uid, updatedEvent);
    setEvents((prev) => prev.map((e) => e.id === event.id ? updatedEvent : e));
  };

  const handlePermanentDelete = async (event: LovinglyEvent) => {
    if (!user || !window.confirm('Permanently delete this creation? This cannot be undone.')) return;
    await firebaseService.deleteUserEvent(user.uid, event.id);
    setEvents((prev) => prev.filter((e) => e.id !== event.id));
  };

  const handleExtendHosting = async (updatedEvent: LovinglyEvent) => {
    if (!user) return;
    await firebaseService.extendEventHosting(user.uid, updatedEvent);
    setEvents((prev) => prev.map((e) => e.id === updatedEvent.id ? updatedEvent : e));
  };

  return (
    <Routes>
      <Route path="/" element={
        user ? <Navigate to="/dashboard" replace /> : <Landing 
          user={user} 
          onSignIn={handleSignIn} 
          onSignOut={handleSignOut} 
          onStart={() => handleStartGuestCreation()}
          onStartWithCategory={() => handleStartGuestCreation()}
          onSelectSample={() => handleStartGuestCreation()}
        />
      } />
      
      <Route path="/dashboard" element={
        user ? <Dashboard 
          events={events} 
          onEdit={handleEdit} 
          onDelete={handleSoftDelete} 
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
          onNew={() => handleStartGuestCreation()} 
          onExtendHosting={handleExtendHosting}
          activeTab="all"
          onTabChange={(tab) => navigate(tab === 'all' ? '/dashboard' : `/dashboard/${tab}`)}
        /> : <Navigate to="/" replace />
      } />

      <Route path="/dashboard/:tab" element={
        user ? <Dashboard 
          events={events} 
          onEdit={handleEdit} 
          onDelete={handleSoftDelete} 
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
          onNew={() => handleStartGuestCreation()} 
          onExtendHosting={handleExtendHosting}
          activeTab="all" // Will be overridden inside Dashboard based on URL params
          onTabChange={(tab) => navigate(tab === 'all' ? '/dashboard' : `/dashboard/${tab}`)}
        /> : <Navigate to="/" replace />
      } />

      {/* Legacy Editor path for compatibility during migration */}
      <Route path="/edit/:eventId" element={
        <LegacyEditorWrapper user={user} handleSignIn={handleSignIn} setEvents={setEvents} />
      } />

      {/* New Creation Flow Routes (T05) */}
      <Route path="/create/:inviteId/:step" element={<CreationFlowWrapper user={user} handleSignIn={handleSignIn} />} />

      {/* Canonical Viewer Route */}
      <Route path="/:creator/:eventType/:slug" element={<PublicViewerPage />} />
      <Route path="/p/:slug" element={<PublicViewerPage />} />
      
    </Routes>
  );
}

// Wrapper to handle fetching legacy event for editor
function LegacyEditorWrapper({ user, handleSignIn, setEvents }: { user: User | null, handleSignIn: () => Promise<User | null>, setEvents: React.Dispatch<React.SetStateAction<LovinglyEvent[]>> }) {
  const [editingEvent, setEditingEvent] = useState<LovinglyEvent | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const eventId = location.pathname.split('/').pop();

  useEffect(() => {
    if (user && eventId) {
      firebaseService.getUserEvents(user.uid).then(events => {
        const ev = events.find(e => e.id === eventId);
        if (ev) setEditingEvent(ev);
        else navigate('/dashboard');
      });
    }
  }, [user, eventId, navigate]);

  if (!editingEvent) return <div className="p-8 text-center">Loading editor...</div>;

  const handleUpdateEvent = async (updates: Partial<LovinglyEvent>) => {
    const updated = { ...editingEvent, ...updates } as LovinglyEvent;
    setEditingEvent(updated);
    if (user) {
      await firebaseService.saveUserEvent(user.uid, updated);
      setEvents((prev) => prev.map((e) => e.id === updated.id ? updated : e));
    }
  };

  const handlePublishAndSave = async (eventToPublish: LovinglyEvent, activeUser: User | null): Promise<boolean> => {
    const targetUser = activeUser || user;
    if (!targetUser) return false;
    const creatorPath = getEventCreatorPath(eventToPublish, targetUser);
    const updatedEvent: LovinglyEvent = { ...eventToPublish, ownerId: targetUser.uid, creatorPath, isPublished: true };
    await firebaseService.saveUserEvent(targetUser.uid, updatedEvent);
    setEditingEvent(updatedEvent);
    setEvents((prev) => {
      if (prev.some(e => e.id === updatedEvent.id)) return prev.map(e => e.id === updatedEvent.id ? updatedEvent : e);
      return [updatedEvent, ...prev];
    });
    return true;
  };

  const handleExtendHosting = async (updatedEvent: LovinglyEvent) => {
    if (!user) return;
    await firebaseService.extendEventHosting(user.uid, updatedEvent);
    setEvents((prev) => prev.map((e) => e.id === updatedEvent.id ? updatedEvent : e));
    setEditingEvent(updatedEvent);
  };

  return <EventEditor 
    event={editingEvent} 
    user={user}
    onSignIn={handleSignIn}
    onUpdate={handleUpdateEvent}
    onPublishAndSave={handlePublishAndSave}
    onExtendHosting={handleExtendHosting}
    onBack={() => navigate(user ? '/dashboard' : '/')}
    onPreview={() => window.open(`/${getEventCreatorPath(editingEvent, user)}/${getEventTypePath(editingEvent)}/${editingEvent.slug}`, '_blank')}
  />;
}

// Wrapper to handle fetching published event for viewer
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => firebaseReady);
  const [events, setEvents] = useState<LovinglyEvent[]>([]);

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
          const code = (error as { code?: string })?.code;
          const isUnavailable = code === 'unavailable' || (error instanceof Error && (error.message.includes('offline') || error.message.includes('unavailable')));
          if (i < retries - 1 && isUnavailable) await new Promise((res) => setTimeout(res, 1200));
          else if (isUnavailable) console.warn("Firestore operating in offline or cached mode.");
          else console.error("Firebase connection check error:", error);
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
    <BrowserRouter>
      <div className="min-h-screen selection:bg-rose-100 selection:text-rose-900">
        <Analytics />
        <AppRoutes user={user} handleSignIn={handleSignIn} handleSignOut={handleSignOut} events={events} setEvents={setEvents} />
      </div>
    </BrowserRouter>
  );
}
