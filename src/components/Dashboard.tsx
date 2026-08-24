import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Share2, Trash2, Edit3, ExternalLink, BarChart3, Check, FileDown, Clock, Plus, Copy, RotateCcw, ShieldCheck, User as UserIcon } from 'lucide-react';
import type { LovinglyEvent } from '../types';
import { getEventCreatorPath, getEventTypePath } from '../lib/utils';
import { getHostingStatus } from '../lib/hosting';
import { InsightsModal } from './InsightsModal';
import { HostingRenewalModal } from './HostingRenewalModal';
import koreanHeartLogo from '../assets/images/korean_heart_golden_logo_1786820911376.jpg';

export type DashboardTab = 'all' | 'drafts' | 'published' | 'expired' | 'trash' | 'account';

interface DashboardProps {
  events: LovinglyEvent[];
  onEdit: (event: LovinglyEvent) => void;
  onDelete: (event: LovinglyEvent) => void;
  onRestore?: (event: LovinglyEvent) => void;
  onPermanentDelete?: (event: LovinglyEvent) => void;
  onNew: () => void;
  onExtendHosting?: (updatedEvent: LovinglyEvent) => Promise<void>;
  activeTab?: DashboardTab;
  onTabChange?: (tab: DashboardTab) => void;
}

export function Dashboard({ 
  events, 
  onEdit, 
  onDelete, 
  onRestore, 
  onPermanentDelete, 
  onNew, 
  onExtendHosting,
  activeTab: externalTab = 'all',
  onTabChange
}: DashboardProps) {
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

  const draftCount = events.filter(e => !e.isPublished && !e.isDeleted).length;

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
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-brand-red/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Creation</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header & Section Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">Dashboard Workspace</h2>
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
            { id: 'all', label: 'All Invites' },
            { id: 'drafts', label: 'Working Drafts' },
            { id: 'published', label: 'Live Published' },
            { id: 'expired', label: 'Expired Hosting' },
            { id: 'trash', label: '30-Day Trash' },
            { id: 'account', label: 'Account Profile' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id as DashboardTab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-xs ring-1 ring-stone-200'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'account' ? (
          /* Account Tab View */
          <div className="bg-white rounded-3xl border border-stone-200 p-8 max-w-2xl mx-auto space-y-6 shadow-sm">
            <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold text-2xl font-serif">
                <UserIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-stone-900">Your Account Profile</h3>
                <p className="text-xs text-stone-500 mt-0.5">Logged in & protected via Google Security</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Total Creations</span>
                  <span className="text-2xl font-serif font-bold text-stone-900">{events.length}</span>
                </div>
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Active Live Invites</span>
                  <span className="text-2xl font-serif font-bold text-emerald-600">
                    {events.filter(e => e.isPublished && !getHostingStatus(e).isExpired && !e.isDeleted).length}
                  </span>
                </div>
              </div>

              <div className="bg-rose-50/50 border border-rose-200 p-4 rounded-2xl space-y-1">
                <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>Transactional Account Status</span>
                </h4>
                <p className="text-xs text-rose-700">
                  Pay-As-You-Need model active. Zero recurring monthly charges or hidden subscriptions.
                </p>
              </div>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-stone-200 shadow-xs">
            <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
              {activeTab === 'trash' ? 'Trash is empty' : 'No pages in this view'}
            </h3>
            <p className="text-stone-500 mb-8 text-sm">
              {activeTab === 'trash' 
                ? 'Soft-deleted invites remain in trash for 30 days before automatic purge.' 
                : 'Start by creating your first Yours Lovingly page.'}
            </p>
            {activeTab !== 'trash' && (
              <button
                onClick={onNew}
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
              >
                Create Page
              </button>
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
                      
                      {/* Hosting Status Bar */}
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
                        title="Export as PDF to print physical cards, flyers, and pamphlets"
                      >
                        <FileDown className="w-3.5 h-3.5 text-secondary group-hover/btn:scale-110 transition-transform" />
                        Export PDF
                      </button>
                    </div>

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

