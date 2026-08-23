import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Share2, Trash2, Edit3, ExternalLink, BarChart3, Check, FileDown, Clock, Plus } from 'lucide-react';
import type { LovinglyEvent } from '../types';
import { getEventCreatorPath, getEventTypePath } from '../lib/utils';
import { getHostingStatus } from '../lib/hosting';
import { InsightsModal } from './InsightsModal';
import { HostingRenewalModal } from './HostingRenewalModal';
import koreanHeartLogo from '../assets/images/korean_heart_golden_logo_1786820911376.jpg';

interface DashboardProps {
  events: LovinglyEvent[];
  onEdit: (event: LovinglyEvent) => void;
  onDelete: (event: LovinglyEvent) => void;
  onNew: () => void;
  onExtendHosting?: (updatedEvent: LovinglyEvent) => Promise<void>;
}

export function Dashboard({ events, onEdit, onDelete, onNew, onExtendHosting }: DashboardProps) {
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

  const handleConfirmExtension = async (updatedEvent: LovinglyEvent) => {
    if (onExtendHosting) {
      await onExtendHosting(updatedEvent);
    }
    setSelectedEventForHosting(null);
  };

  return (
    <div className="bg-stone-50/30 min-h-screen">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-brand-red/20 shadow-md shadow-brand-red/10 bg-white flex items-center justify-center p-0.5">
              <img 
                src={koreanHeartLogo} 
                alt="Yours Lovingly Korean Finger Heart Logo" 
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
            className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-brand-red/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Creation</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">Your Events & Pages</h2>
            <p className="text-stone-500 mt-1 text-xs sm:text-sm">Manage, analyze, edit, track hosting validity, and export as PDF</p>
          </div>
        </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-stone-200 shadow-xs">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">No pages yet</h3>
          <p className="text-stone-500 mb-8 text-sm">Start by creating your first Yours Lovingly page.</p>
          <button
            onClick={onNew}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-sm"
          >
            Create Page
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const hostingInfo = getHostingStatus(event);
            return (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-stone-200/80 overflow-hidden hover:shadow-xl hover:border-brand-red/20 transition-all group flex flex-col justify-between"
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
                    {event.isPublished && (
                      <div className="absolute top-4 left-4 px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs">
                        Live
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
                          className="text-[11px] font-bold text-primary hover:text-primary/90 underline underline-offset-2 ml-1"
                        >
                          {hostingInfo.isExpired ? 'Renew' : 'Extend'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      {event.eventDate && (
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{new Date(event.eventDate).toLocaleDateString()}</span>
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
                      className="py-2.5 px-3 bg-stone-50 hover:bg-brand-red/5 hover:text-primary text-stone-700 rounded-xl text-xs font-bold transition-all border border-stone-200 hover:border-brand-red/20 flex items-center justify-center gap-1.5 shadow-xs group/btn"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-primary group-hover/btn:scale-110 transition-transform" />
                      Insights
                    </button>

                    {/* Export as PDF / Print */}
                    <button
                      onClick={() => handleExportPdf(event)}
                      className="py-2.5 px-3 bg-stone-50 hover:bg-brand-teal/5 hover:text-secondary text-stone-700 rounded-xl text-xs font-bold transition-all border border-stone-200 hover:border-brand-teal/20 flex items-center justify-center gap-1.5 shadow-xs group/btn"
                      title="Export as PDF to print physical cards, flyers, and pamphlets"
                    >
                      <FileDown className="w-3.5 h-3.5 text-secondary group-hover/btn:scale-110 transition-transform" />
                      Export PDF
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onEdit(event)}
                        className="p-2 text-stone-500 hover:text-secondary hover:bg-brand-teal/5 rounded-lg transition-all"
                        title="Edit Page"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(event)}
                        className="p-2 text-stone-500 hover:text-primary hover:bg-brand-red/5 rounded-lg transition-all"
                        title="Delete Page"
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
                        className="p-2 text-stone-500 hover:text-secondary hover:bg-brand-teal/5 rounded-lg transition-all relative"
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
