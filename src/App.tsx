import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDocFromServer } from 'firebase/firestore';
import { auth, googleProvider, db, firebaseReady } from './firebase';
import type { LovinglyEvent, DesignStyle, TierType, PlanTier, CreationCategory } from './types';
import { firebaseService } from './lib/firebase-service';
import { createBlankEvent, getEventCreatorPath } from './lib/utils';
import type { SampleInvite } from './data/samples';
import { Landing } from './components/Landing';
import { Dashboard, type DashboardTab } from './components/Dashboard';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { SampleCanvasEditor } from './components/sample-editor/SampleCanvasEditor';
import { createDraftFromSample } from './lib/sampleAdapter';

// Note: creation components are imported here for the next phase.
import { TemplateStep } from './components/creation/TemplateStep';
import { DetailsStep } from './components/creation/DetailsStep';
import { ElementsStep } from './components/creation/ElementsStep';
import { PreviewStep } from './components/creation/PreviewStep';
import { FeaturesStep } from './components/creation/FeaturesStep';
import { PublishStep } from './components/creation/PublishStep';
import { PublicViewerPage } from './components/PublicViewerPage';
import { PublishService } from './domain/publishing/publishService';
import { InviteRepository } from './domain/invite/repository';

function CreationFlowWrapper({
  user,
  handleSignIn,
  setEvents,
}: {
  user: User | null;
  handleSignIn: () => Promise<User | null>;
  setEvents: React.Dispatch<React.SetStateAction<LovinglyEvent[]>>;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const inviteId = pathParts[2];
  const step = pathParts[3];

  const handleNext = (nextStep: string) => navigate(`/create/${inviteId}/${nextStep}`);
  const handleBack = (prevStep: string) => navigate(`/create/${inviteId}/${prevStep}`);

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
      setEvents((prev) => {
        if (prev.some((e) => e.id === updated.id)) {
          return prev.map((e) => (e.id === updated.id ? updated : e));
        }
        return [updated, ...prev];
      });
    } else {
      localStorage.setItem(`draft_${inviteId}`, JSON.stringify(updated));
    }
  };

  const handlePublish = async (selectedTier: TierType = 'basic', requiresPayment = false): Promise<boolean> => {
    if (!event) return false;
    const isPremiumSelection = selectedTier === 'premium' || selectedTier === 'extended';

    // If payment is required, do NOT mark as published yet — route to Payment Boundary
    if (requiresPayment) {
      const pendingTier: PlanTier = isPremiumSelection ? 'premium_99' : 'basic_49';
      const draftUpdated: LovinglyEvent = {
        ...event,
        isPublished: false,
        tier: isPremiumSelection ? 'premium' : 'standard',
        planTier: pendingTier,
      };
      setEvent(draftUpdated);
      if (user) {
        await firebaseService.saveUserEvent(user.uid, draftUpdated);
        setEvents((prev) => {
          if (prev.some((e) => e.id === draftUpdated.id)) {
            return prev.map((e) => (e.id === draftUpdated.id ? draftUpdated : e));
          }
          return [draftUpdated, ...prev];
        });
      } else {
        localStorage.setItem(`draft_${inviteId}`, JSON.stringify(draftUpdated));
      }
      handleNext('payment');
      return false;
    }

    // Free Basic Page (1st Page Credit = ₹0): Publish immediately in Step 6
    const creatorPath = getEventCreatorPath(event, user);
    const publishedAt = new Date().toISOString();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 15);
    const expiresAt = expiryDate.toISOString();

    const updated: LovinglyEvent = { 
      ...event, 
      ownerId: user?.uid || event.ownerId,
      creatorPath,
      isPublished: true,
      tier: 'free',
      planTier: 'free',
      isLifetime: false,
      publishedAt,
      expiresAt,
    };
    setEvent(updated);
    if (user) {
      await firebaseService.saveUserEvent(user.uid, updated);
      const { invite, pages, elements } = InviteRepository.adaptLegacyEvent(updated);
      await PublishService.publishInvite(user.uid, invite, pages, elements, updated);
      setEvents((prev) => {
        if (prev.some((e) => e.id === updated.id)) {
          return prev.map((e) => (e.id === updated.id ? updated : e));
        }
        return [updated, ...prev];
      });
    }
    return true;
  };

  if (!event) return <div>Loading...</div>;

  const stepNames: Record<string, string> = {
    'template': '1. Event & Template',
    'details': '2. Invite Details',
    'elements': '3. Center Elements & Styles',
    'features': '4. Features & Integrations',
    'preview': '5. Final Guest Preview',
    'publish': '6. Hosting, Plan & Launch'
  };

  const currentStepKey = (step === 'event-type' || !step) ? 'template' : step;

  const getStepNumber = (s: string) => {
    const keys = Object.keys(stepNames);
    const idx = keys.indexOf(s);
    return idx >= 0 ? idx + 1 : 1;
  };

  const handleSaveDraft = () => {
    if (event) {
      handleUpdate({});
    }
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-stone-100/95 flex items-center justify-center p-0 sm:p-3 md:p-4 overflow-hidden z-20">
      {/* Subtle 30% Opacity Korean Finger Heart Watermark Behind Creation Steps */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden print:hidden">
        <img
          src="/logo.png"
          alt=""
          className="w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] object-contain opacity-30 select-none mix-blend-multiply"
        />
      </div>

      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-xs sm:rounded-3xl shadow-xl border-0 sm:border border-stone-200 overflow-hidden h-full flex flex-col relative max-w-full z-10">
         {/* Fixed Creation Header */}
         <div className="p-3 sm:p-4 border-b border-stone-200 bg-white flex items-center justify-between shrink-0 z-30 shadow-2xs">
           <div className="flex items-center gap-2 min-w-0">
             <button 
               onClick={() => navigate(user ? '/dashboard' : '/')} 
               className="text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors shrink-0 flex items-center gap-1 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-stone-50"
             >
               &larr; Exit
             </button>
             <span className="text-stone-300 font-light">•</span>
             <h2 className="font-serif font-bold text-stone-900 text-xs sm:text-base truncate">
               Create Page
             </h2>
           </div>

           <div className="flex items-center gap-2 shrink-0">
             <button
               onClick={handleSaveDraft}
               className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold rounded-full hover:bg-rose-100 transition-colors hidden sm:flex items-center gap-1 cursor-pointer"
             >
               Save Draft
             </button>
             <span className="px-2.5 py-1 bg-rose-50 border border-rose-200/80 text-rose-700 text-[10px] sm:text-xs font-bold rounded-full">
               Step {getStepNumber(currentStepKey)} of 6
             </span>
             <span className="text-[11px] font-medium text-stone-500 hidden md:inline">
               {stepNames[currentStepKey]}
             </span>
           </div>
         </div>

         {/* Step Content Container */}
         <div className="flex-1 overflow-hidden min-h-0 flex flex-col max-w-full">
            {(step === 'event-type' || step === 'template' || !step) && (
              <TemplateStep 
                event={event} 
                onUpdateEvent={handleUpdate} 
                onSelectTemplate={(t) => { 
                  handleUpdate({ 
                    templateId: t.id, 
                    designStyle: t.id as DesignStyle,
                    primaryColor: t.primaryColor,
                    secondaryColor: t.secondaryColor,
                    highlightColor: t.highlightColor,
                    frameType: t.frameType,
                    decorativeMotif: t.decorativeMotif,
                    textureType: t.textureType,
                    shlokaText: t.shlokaText,
                    title: event.title || t.defaultTitle,
                    recipientName: event.recipientName || t.defaultRecipient,
                    location: event.location || t.defaultLocation,
                    eventDate: event.eventDate || t.defaultDate,
                    messages: (event.messages && event.messages.length > 0 && event.messages[0] !== '') ? event.messages : t.defaultMessages,
                    elements: t.defaultElements
                  }); 
                  handleNext('details'); 
                }} 
                onSelectBlank={() => { 
                  handleUpdate({ 
                    templateId: undefined,
                    primaryColor: '#1c1917',
                    secondaryColor: '#ffffff',
                    highlightColor: '#d97706',
                    frameType: 'none',
                    decorativeMotif: 'none',
                    textureType: 'none',
                    shlokaText: '',
                    title: '',
                    recipientName: '',
                    location: '',
                    eventDate: '',
                    messages: [''],
                    elements: []
                  }); 
                  handleNext('details'); 
                }} 
                onBack={() => navigate(user ? '/dashboard' : '/')} 
                onNext={() => handleNext('details')} 
                onSaveDraft={handleSaveDraft}
              />
            )}
            {step === 'details' && <DetailsStep event={event} onUpdate={handleUpdate} onNext={() => handleNext('elements')} onBack={() => handleBack('template')} onSaveDraft={handleSaveDraft} />}
            {step === 'elements' && <ElementsStep event={event} onUpdate={handleUpdate} onNext={() => handleNext('features')} onBack={() => handleBack('details')} onSaveDraft={handleSaveDraft} />}
            {step === 'features' && <FeaturesStep event={event} onUpdate={handleUpdate} onNext={() => handleNext('preview')} onBack={() => handleBack('elements')} onSaveDraft={handleSaveDraft} />}
            {step === 'preview' && (
              <PreviewStep 
                event={event} 
                onNext={() => handleNext('publish')} 
                onBack={() => handleBack('features')} 
                onSaveDraft={handleSaveDraft} 
              />
            )}
            {step === 'publish' && (
              <PublishStep 
                event={event} 
                user={user} 
                onSignIn={handleSignIn} 
                onUpdateEvent={handleUpdate}
                onPublish={handlePublish} 
                onNext={() => navigate(user ? '/dashboard' : '/')} 
                onBack={() => handleBack('preview')} 
                onSaveDraft={handleSaveDraft}
              />
            )}
            {step === 'payment' && (
              <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex items-center justify-center">
                <div className="max-w-lg w-full bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto font-bold text-lg">
                    ₹
                  </div>
                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold uppercase tracking-wider">
                      Payment Gateway Pending
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                      Online Checkout Integration Pending
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      Your invitation has been safely saved as a <strong>Draft</strong>. Because the payment gateway is not yet connected, paid plans cannot complete checkout right now. You can return to Step 6 and remove premium features to publish a <strong>Free Basic Page (₹0)</strong> with your 1st page credit.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleBack('publish')}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      &larr; Back to Step 6 (Switch to Basic)
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Go to Workspace
                    </button>
                  </div>
                </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}

function DashboardRouteWrapper({
  user,
  events,
  handleEdit,
  handleSoftDelete,
  handleRestore,
  handlePermanentDelete,
  handleStartGuestCreation,
  handleExtendHosting,
  handleSignOut
}: {
  user: User | null;
  events: LovinglyEvent[];
  handleEdit: (e: LovinglyEvent) => void;
  handleSoftDelete: (e: LovinglyEvent) => Promise<void>;
  handleRestore: (e: LovinglyEvent) => Promise<void>;
  handlePermanentDelete: (e: LovinglyEvent) => Promise<void>;
  handleStartGuestCreation: (sampleOrCat?: SampleInvite | { category: CreationCategory }) => void;
  handleExtendHosting: (e: LovinglyEvent) => Promise<void>;
  handleSignOut: () => void;
}) {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  const validTab: DashboardTab = (['all', 'drafts', 'published', 'expired', 'trash', 'templates', 'account'].includes(tab || '')
    ? (tab as DashboardTab)
    : 'all');

  if (!user) return <Navigate to="/" replace />;

  return (
    <Dashboard
      user={user}
      events={events}
      onEdit={handleEdit}
      onDelete={handleSoftDelete}
      onRestore={handleRestore}
      onPermanentDelete={handlePermanentDelete}
      onNew={() => handleStartGuestCreation()}
      onSelectSample={(sample) => navigate(`/customize/sample/${sample.id}`)}
      onNavigateHome={() => navigate('/')}
      onExtendHosting={handleExtendHosting}
      onSignOut={handleSignOut}
      activeTab={validTab}
      onTabChange={(newTab) => navigate(newTab === 'all' ? '/dashboard' : `/dashboard/${newTab}`)}
    />
  );
}

function SampleEditorRouteWrapper({ user, onSignIn }: { user: User | null; onSignIn?: () => Promise<User | null> }) {
  const { sampleId } = useParams<{ sampleId: string }>();
  return <SampleCanvasEditor key={sampleId || 'sample'} user={user} onSignIn={onSignIn} />;
}

function AppRoutes({ user, handleSignIn, handleSignOut, events, setEvents }: { user: User | null, handleSignIn: () => Promise<User | null>, handleSignOut: () => void, events: LovinglyEvent[], setEvents: React.Dispatch<React.SetStateAction<LovinglyEvent[]>> }) {
  const navigate = useNavigate();

  const handleStartGuestCreation = (sampleOrCategory?: SampleInvite | { category: CreationCategory }) => {
    const newId = 'evt_' + Date.now().toString(36);
    
    if (sampleOrCategory && 'title' in sampleOrCategory) {
      const sample = sampleOrCategory as SampleInvite;
      const draft = createDraftFromSample(sample, user?.uid || 'guest', user?.displayName || 'guest');
      localStorage.setItem(`draft_${draft.id}`, JSON.stringify(draft));
      navigate(`/create/${draft.id}/details`);
    } else {
      if (sampleOrCategory && 'category' in sampleOrCategory) {
        const draft = createBlankEvent(user?.uid || 'guest', 'wedding', user?.displayName || 'guest');
        draft.id = newId;
        draft.creationCategory = sampleOrCategory.category;
        localStorage.setItem(`draft_${newId}`, JSON.stringify(draft));
      }
      navigate(`/create/${newId}/event-type`);
    }
  };

  const handleEdit = (event: LovinglyEvent) => {
    try {
      localStorage.setItem(`draft_${event.id}`, JSON.stringify(event));
    } catch {
      // ignore
    }
    navigate(`/create/${event.id}/details`);
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

  const handleSignInFromLanding = async () => {
    const signedIn = await handleSignIn();
    if (signedIn) {
      navigate('/dashboard');
    }
    return signedIn;
  };

  return (
    <Routes>
      <Route path="/" element={
        <Landing 
          user={user} 
          onSignIn={handleSignInFromLanding} 
          onSignOut={handleSignOut} 
          onStart={() => handleStartGuestCreation()}
          onStartWithCategory={(cat) => handleStartGuestCreation({ category: cat })}
          onSelectSample={(sample) => navigate(`/customize/sample/${sample.id}`)}
          onNavigateToDashboard={() => navigate('/dashboard')}
        />
      } />
      
      {/* Dedicated Isolated Canvas Editor for Landing Page & Workspace Samples */}
      <Route path="/customize/sample/:sampleId" element={
        <SampleEditorRouteWrapper user={user} onSignIn={handleSignIn} />
      } />

      <Route path="/dashboard" element={
        <DashboardRouteWrapper 
          user={user}
          events={events}
          handleEdit={handleEdit}
          handleSoftDelete={handleSoftDelete}
          handleRestore={handleRestore}
          handlePermanentDelete={handlePermanentDelete}
          handleStartGuestCreation={handleStartGuestCreation}
          handleExtendHosting={handleExtendHosting}
          handleSignOut={handleSignOut}
        />
      } />

      <Route path="/dashboard/:tab" element={
        <DashboardRouteWrapper 
          user={user}
          events={events}
          handleEdit={handleEdit}
          handleSoftDelete={handleSoftDelete}
          handleRestore={handleRestore}
          handlePermanentDelete={handlePermanentDelete}
          handleStartGuestCreation={handleStartGuestCreation}
          handleExtendHosting={handleExtendHosting}
          handleSignOut={handleSignOut}
        />
      } />

      {/* Edit redirect into unified create flow */}
      <Route path="/edit/:eventId" element={<EditRedirectWrapper />} />

      {/* New Creation Flow Routes (T05) */}
      <Route path="/create/:inviteId/:step" element={<CreationFlowWrapper user={user} handleSignIn={handleSignIn} setEvents={setEvents} />} />

      {/* Canonical Viewer Route */}
      <Route path="/:creator/:eventType/:slug" element={<PublicViewerPage />} />
      <Route path="/p/:slug" element={<PublicViewerPage />} />
      
    </Routes>
  );
}

// Redirects any legacy /edit/:eventId links to the unified 6-step creation/customizer flow
function EditRedirectWrapper() {
  const { eventId } = useParams<{ eventId: string }>();
  return <Navigate to={eventId ? `/create/${eventId}/details` : '/dashboard'} replace />;
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
      <div className="min-h-screen relative selection:bg-rose-100 selection:text-rose-900">
        {/* Global Fixed 30% Opacity Korean Finger Heart Background Logo */}
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden print:hidden">
          <img
            src="/logo.png"
            alt=""
            className="w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] object-contain opacity-30 select-none mix-blend-multiply"
          />
        </div>
        <div className="relative z-10">
          <Analytics />
          <OfflineIndicator />
          <AppRoutes user={user} handleSignIn={handleSignIn} handleSignOut={handleSignOut} events={events} setEvents={setEvents} />
        </div>
      </div>
    </BrowserRouter>
  );
}

