import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, MapPin, Share2, Trash2, Edit3, ExternalLink, BarChart3, Check, FileDown, Clock, Plus, Copy, RotateCcw, ShieldCheck, Globe, Lock, LogOut, ArrowRight, FolderKanban } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { LovinglyEvent } from '../types';
import { getEventCreatorPath, getEventTypePath } from '../lib/utils';
import { getHostingStatus, hasWatermark } from '../lib/hosting';
import { InsightsModal } from './InsightsModal';
import { HostingRenewalModal } from './HostingRenewalModal';
import koreanHeartLogo from '../assets/images/korean_heart_golden_logo_1786820911376.jpg';

export type DashboardTab = 'all' | 'drafts' | 'published' | 'expired' | 'trash' | 'account';

interface DashboardProps {
  user?: User | null;
  events: LovinglyEvent[];
  onEdit: (event: LovinglyEvent) => void;
  onDelete: (event: LovinglyEvent) => void;
  onRestore?: (event: LovinglyEvent) => void;
  onPermanentDelete?: (event: LovinglyEvent) => void;
  onNew: () => void;
  onExtendHosting?: (updatedEvent: LovinglyEvent) => Promise<void>;
  onSignOut?: () => void;
  activeTab?: DashboardTab;
  onTabChange?: (tab: DashboardTab) => void;
}

export function Dashboard({ 
  user,
  events, 
  onEdit, 
  onDelete, 
  onRestore, 
  onPermanentDelete, 
  onNew, 
  onExtendHosting,
  onSignOut,
  activeTab: externalTab = 'all',
  onTabChange
}: DashboardProps) {
  const navigate = useNavigate();
  const [internalTab, setInternalTab] = useState<DashboardTab>(externalTab);
  const activeTab = onTabChange ? externalTab : internalTab;

  const setTab = (tab: DashboardTab) => {
    if (onTabChange) onTabChange(tab);
    else setInternalTab(tab);
  };

  const [selectedEventForInsights, setSelectedEventForInsights] = useState<LovinglyEvent | null>(null);
  const [selectedEventForHosting, setSelectedEventForHosting] = useState<LovinglyEvent | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleShare = (event: LovinglyEvent) => {
    const url = `${window.location.origin}/${getEventCreatorPath(event)}/${getEventTypePath(event)}/${event.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(event.slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleExportPdf = (event: LovinglyEvent) => {
    if (hasWatermark(event)) {
      setSelectedEventForHosting(event);
      return;
    }
    const printUrl = `/${getEventCreatorPath(event)}/${getEventTypePath(event)}/${event.slug}?print=true`;
    const printWindow = window.open(printUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  };

  const handleCopyToNew = (event: LovinglyEvent) => {
    const clonedEvent: LovinglyEvent = {
      ...event,
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: `${event.title || 'Event'} (Copy)`,
      slug: `copy-${event.slug}-${Math.floor(Math.random() * 1000)}`,
      isPublished: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    };
    onEdit(clonedEvent);
  };

  const handleConfirmExtension = async (updatedEvent: LovinglyEvent) => {
    if (onExtendHosting) {
      await onExtendHosting(updatedEvent);
    }
    setSelectedEventForHosting(null);
  };

  // Tab counts
  const allCount = events.filter(e => !e.isDeleted).length;
  const draftCount = events.filter(e => !e.isPublished && !e.isDeleted).length;
  const publishedCount = events.filter(e => e.isPublished && !getHostingStatus(e).isExpired && !e.isDeleted).length;
  const expiredCount = events.filter(e => e.isPublished && getHostingStatus(e).isExpired && !e.isDeleted).length;
  const trashCount = events.filter(e => e.isDeleted === true).length;

  // Filter events based on active tab
  const filteredEvents = events.filter(e => {
    if (activeTab === 'trash') return e.isDeleted === true;
    if (e.isDeleted) return false; // Exclude deleted from normal tabs
    if (activeTab === 'all') return true;
    if (activeTab === 'drafts') return !e.isPublished;
    if (activeTab === 'published') {
      const hosting = getHostingStatus(e);
      return e.isPublished && !hosting.isExpired;
    }
    if (activeTab === 'expired') {
      const hosting = getHostingStatus(e);
      return e.isPublished && hosting.isExpired;
    }
    return true;
  });

  return (
    <div className="bg-stone-50/30 min-h-screen">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-brand-red/20 shadow-md shadow-brand-red/10 bg-white flex items-center justify-center p-0.5">
              <img 
                src={koreanHeartLogo} 
                alt="Yours Lovingly Logo" 
                className="w-full h-full object-cover rounded-lg" 
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xl font-serif font-bold text-stone-900 tracking-tight">
              Yours Lovingly
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onNew}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-brand-red/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Creation</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header & Section Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">Workspace</h2>
            <p className="text-stone-500 mt-1 text-xs sm:text-sm">
              Manage your drafts, live invites, expired hosting, and soft-deleted recovery trash.
            </p>
          </div>
          {draftCount > 0 && (
            <div className="text-xs text-stone-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl font-semibold">
              Draft Limit: <span className="text-amber-800 font-bold">{draftCount} / 3 Active Drafts</span>
            </div>
          )}
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-stone-100 rounded-2xl overflow-x-auto mb-8 border border-stone-200/80 no-scrollbar">
          {[
            { id: 'all', label: 'All Invites', count: allCount },
            { id: 'drafts', label: 'Working Drafts', count: draftCount },
            { id: 'published', label: 'Live Published', count: publishedCount },
            { id: 'expired', label: 'Expired Hosting', count: expiredCount },
            { id: 'trash', label: '30-Day Trash', count: trashCount },
            { id: 'account', label: 'Account Profile', count: null },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id as DashboardTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-xs ring-1 ring-stone-200'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'account' ? (
          /* Account Tab View */
          <div className="bg-white rounded-3xl border border-stone-200 p-8 max-w-2xl mx-auto space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-6">
              <div className="flex items-center gap-4">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-16 h-16 rounded-full border border-rose-200 object-cover shadow-xs" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold text-2xl font-serif">
                    {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-xl text-stone-900">{user?.displayName || 'Valued Creator'}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{user?.email || 'Authenticated User'}</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Workspace Overview</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button onClick={() => setTab('all')} className="bg-stone-50 hover:bg-stone-100 p-4 rounded-2xl border border-stone-200 text-left transition-colors cursor-pointer group">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Total Pages</span>
                  <span className="text-2xl font-serif font-bold text-stone-900 group-hover:text-primary transition-colors">{allCount}</span>
                </button>
                <button onClick={() => setTab('published')} className="bg-emerald-50/50 hover:bg-emerald-50 p-4 rounded-2xl border border-emerald-200/80 text-left transition-colors cursor-pointer group">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Live Invites</span>
                  <span className="text-2xl font-serif font-bold text-emerald-700">{publishedCount}</span>
                </button>
                <button onClick={() => setTab('drafts')} className="bg-amber-50/50 hover:bg-amber-50 p-4 rounded-2xl border border-amber-200/80 text-left transition-colors cursor-pointer group">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Drafts</span>
                  <span className="text-2xl font-serif font-bold text-amber-800">{draftCount}</span>
                </button>
                <button onClick={() => setTab('trash')} className="bg-rose-50/50 hover:bg-rose-50 p-4 rounded-2xl border border-rose-200/80 text-left transition-colors cursor-pointer group">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Trash</span>
                  <span className="text-2xl font-serif font-bold text-rose-800">{trashCount}</span>
                </button>
              </div>

              <div className="bg-rose-50/50 border border-rose-200/80 p-4 rounded-2xl space-y-1">
                <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>Transactional Account Model</span>
                </h4>
                <p className="text-xs text-rose-700 leading-relaxed">
                  Pay-As-You-Need model active. Zero recurring subscription commitments or hidden charges.
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                <button
                  onClick={onNew}
                  className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Page</span>
                </button>
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-stone-500" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-stone-200 shadow-xs max-w-2xl mx-auto px-6">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-primary flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-xs">
              {activeTab === 'trash' ? <Trash2 className="w-8 h-8" /> : activeTab === 'published' ? <Globe className="w-8 h-8" /> : activeTab === 'drafts' ? <FolderKanban className="w-8 h-8" /> : <Calendar className="w-8 h-8" />}
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
              {activeTab === 'trash' && 'Trash is empty'}
              {activeTab === 'drafts' && 'No working drafts found'}
              {activeTab === 'published' && 'No live published pages yet'}
              {activeTab === 'expired' && 'No expired hosting pages'}
              {activeTab === 'all' && 'Your workspace is empty'}
            </h3>
            <p className="text-stone-500 mb-8 text-sm max-w-md mx-auto leading-relaxed">
              {activeTab === 'trash' && 'Soft-deleted invites remain in trash for 30 days before automatic purge.'}
              {activeTab === 'drafts' && 'Start a new draft to customize digital invitations, flyers, or memory pages.'}
              {activeTab === 'published' && 'Complete your draft details and publish to launch your live invitation link.'}
              {activeTab === 'expired' && 'All your published invitations are active and hosted smoothly.'}
              {activeTab === 'all' && 'Create your first Yours Lovingly digital event page or invitation in minutes.'}
            </p>
            {activeTab !== 'trash' && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onNew}
                  className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start New Creation</span>
                </button>
                {activeTab !== 'all' && (
                  <button
                    onClick={() => setTab('all')}
                    className="w-full sm:w-auto px-6 py-3 bg-stone-100 text-stone-700 rounded-xl font-bold hover:bg-stone-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View All Invites</span>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
            {filteredEvents.map((event) => {
              const hostingInfo = getHostingStatus(event);
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md sm:max-w-none mx-auto bg-white rounded-2xl shadow-sm border border-stone-200/80 overflow-hidden hover:shadow-xl hover:border-brand-red/20 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video bg-stone-100 relative overflow-hidden flex items-center justify-center p-6">
                      {event.photos[0] ? (
                        <img src={event.photos[0]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                      ) : (
                        <div 
                          className="w-full h-full rounded-lg flex flex-col items-center justify-center gap-2"
                          style={{ backgroundColor: event.secondaryColor || '#fff7ed' }}
                        >
                          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-xs" style={{ backgroundColor: event.primaryColor || '#dc2626', color: '#fff' }}>
                            {event.eventType.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 px-2.5 py-1 bg-white/90 backdrop-blur-xs rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-800 border border-stone-200 shadow-xs">
                        {event.eventType}
                      </div>
                      {event.isPublished ? (
                        <div className="absolute top-4 left-4 px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs">
                          Live
                        </div>
                      ) : (
                        <div className="absolute top-4 left-4 px-2 py-0.5 bg-stone-700 text-white rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs">
                          Draft
                        </div>
                      )}
                    </div>

                    <div className="p-6 pb-2">
                      <h4 className="text-lg font-bold text-stone-900 mb-2 truncate">{event.title || 'Untitled Creation'}</h4>
                      
                      {/* Hosting Status Bar - Only for published events */}
                      {event.isPublished && (
                        <div className="mb-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 truncate">
                            <Clock className={`w-3.5 h-3.5 shrink-0 ${hostingInfo.isExpired ? 'text-primary' : 'text-stone-500'}`} />
                            <span className="text-stone-600 font-medium truncate">
                              {hostingInfo.isLifetime ? 'Lifetime' : `${hostingInfo.daysRemaining}d left`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider border ${hostingInfo.badgeBg} ${hostingInfo.badgeBorder}`}>
                              {hostingInfo.badgeText}
                            </span>
                            <button
                              onClick={() => setSelectedEventForHosting(event)}
                              className="text-[11px] font-bold text-primary hover:text-primary/90 underline underline-offset-2 ml-1 cursor-pointer"
                            >
                              {hostingInfo.isExpired ? 'Renew' : 'Extend'}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5 mb-3">
                        {event.eventDate && (
                          <div className="flex items-center gap-2 text-xs text-stone-500">
                            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{event.eventDate}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2 text-xs text-stone-500">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-3">
                    {event.isPublished ? (
                      <div className="grid grid-cols-2 gap-2">
                        {/* Insights Button */}
                        <button
                          onClick={() => setSelectedEventForInsights(event)}
                          className="py-2.5 px-3 bg-stone-50 hover:bg-brand-red/5 hover:text-primary text-stone-700 rounded-xl text-xs font-bold transition-all border border-stone-200 hover:border-brand-red/20 flex items-center justify-center gap-1.5 shadow-xs group/btn cursor-pointer"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-primary group-hover/btn:scale-110 transition-transform" />
                          Insights
                        </button>

                        {/* Export as PDF / Print */}
                        <button
                          onClick={() => handleExportPdf(event)}
                          className="py-2.5 px-3 bg-stone-50 hover:bg-brand-teal/5 hover:text-secondary text-stone-700 rounded-xl text-xs font-bold transition-all border border-stone-200 hover:border-brand-teal/20 flex items-center justify-center gap-1.5 shadow-xs group/btn cursor-pointer"
                          title={hasWatermark(event) ? "Premium Feature: Upgrade to Export PDF" : "Export as PDF to print physical cards, flyers, and pamphlets"}
                        >
                          <FileDown className="w-3.5 h-3.5 text-secondary group-hover/btn:scale-110 transition-transform" />
                          <span>Export PDF</span>
                          {hasWatermark(event) && <Lock className="w-3 h-3 text-stone-400 ml-0.5" />}
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {/* Publish Button for Drafts */}
                        <button
                          onClick={() => navigate(`/create/${event.id}/publish`)}
                          className="py-2.5 px-3 bg-primary text-white hover:bg-primary/90 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 group/btn cursor-pointer"
                        >
                          <Globe className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                          Publish
                        </button>
                      </div>
                    )}

                    {activeTab === 'trash' ? (
                      /* Trash Action Bar */
                      <div className="flex items-center justify-between pt-3 border-t border-stone-100 gap-2">
                        <button
                          onClick={() => onRestore && onRestore(event)}
                          className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore</span>
                        </button>
                        <button
                          onClick={() => onPermanentDelete && onPermanentDelete(event)}
                          className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Permanently</span>
                        </button>
                      </div>
                    ) : (
                      /* Normal Action Bar */
                      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onEdit(event)}
                            className="p-2 text-stone-500 hover:text-secondary hover:bg-brand-teal/5 rounded-lg transition-all cursor-pointer"
                            title="Edit Page"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCopyToNew(event)}
                            className="p-2 text-stone-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                            title="Copy to New Invite (Clone)"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(event)}
                            className="p-2 text-stone-500 hover:text-primary hover:bg-brand-red/5 rounded-lg transition-all cursor-pointer"
                            title="Move to Trash"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {event.isPublished && (
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(
                                `You're Invited! 🎊\n\n${event.title || 'Special Event'}\nJoin us on ${event.eventDate || 'the special day'}${event.location ? ` at ${event.location}` : ''}.\n\nTap the link below to view our official invitation and RSVP:\n${window.location.origin}/${getEventCreatorPath(event)}/${getEventTypePath(event)}/${event.slug}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-[#25D366] hover:text-[#1DA851] hover:bg-[#25D366]/10 rounded-lg transition-all cursor-pointer"
                              title="Share via WhatsApp"
                            >
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.8 5.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z"/>
                              </svg>
                            </a>
                          )}
                          {event.isPublished && (
                            <a
                              href={`/${getEventCreatorPath(event)}/${getEventTypePath(event)}/${event.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-stone-500 hover:text-secondary hover:bg-brand-teal/5 rounded-lg transition-all"
                              title="Open Live Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button 
                            onClick={() => handleShare(event)}
                            className="p-2 text-stone-500 hover:text-secondary hover:bg-brand-teal/5 rounded-lg transition-all relative cursor-pointer"
                            title="Copy Public Link"
                          >
                            {copiedSlug === event.slug ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Share2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Insights Modal */}
        {selectedEventForInsights && (
          <InsightsModal 
            event={selectedEventForInsights} 
            onClose={() => setSelectedEventForInsights(null)} 
          />
        )}

        {/* Hosting Renewal / Extension Modal */}
        {selectedEventForHosting && (
          <HostingRenewalModal
            event={selectedEventForHosting}
            onClose={() => setSelectedEventForHosting(null)}
            onConfirmExtension={handleConfirmExtension}
          />
        )}
      </div>
    </div>
  );
}

