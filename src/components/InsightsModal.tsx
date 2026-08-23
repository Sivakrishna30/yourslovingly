import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Eye, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  ExternalLink,
  MessageCircle,
  HeartHandshake,
  IndianRupee,
  Gift
} from 'lucide-react';
import type { LovinglyEvent, EventInsights } from '../types';
import { firebaseService } from '../lib/firebase-service';
import { getEventCreatorPath, getEventTypePath } from '../lib/utils';

interface InsightsModalProps {
  event: LovinglyEvent;
  onClose: () => void;
}

export function InsightsModal({ event, onClose }: InsightsModalProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [insights, setInsights] = useState<EventInsights>({
    views: 0,
    rsvps: [],
    totalAttendingCount: 0,
    totalDeclinedCount: 0,
    totalGuestCount: 0
  });
  const [filter, setFilter] = useState<'all' | 'attending' | 'declined'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  const publicUrl = `${window.location.origin}/${getEventCreatorPath(event)}/${getEventTypePath(event)}/${event.slug}`;

  const loadData = useCallback(async () => {
    try {
      const data = await firebaseService.getEventInsights(event.slug);
      setInsights(data);
    } catch (err) {
      console.error('Failed to load event insights', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [event.slug]);

  useEffect(() => {
    let mounted = true;
    const fetchInsights = async () => {
      try {
        const data = await firebaseService.getEventInsights(event.slug);
        if (mounted) {
          setInsights(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load event insights', err);
        if (mounted) setLoading(false);
      }
    };
    fetchInsights();
    return () => {
      mounted = false;
    };
  }, [event.slug]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Generate Consolidated WhatsApp Report text
  const generateConsolidatedReport = () => {
    const totalResponses = insights.rsvps.length;
    const attendingRsvps = insights.rsvps.filter(r => r.attending);
    const declinedRsvps = insights.rsvps.filter(r => !r.attending);

    let report = `📊 *EVENT INSIGHTS REPORT*\n`;
    report += `🎉 *${event.title || 'Event'}*\n`;
    if (event.eventDate) {
      report += `📅 Date: ${new Date(event.eventDate).toLocaleDateString()}\n`;
    }
    if (event.location) {
      report += `📍 Location: ${event.location}\n`;
    }
    report += `🔗 Page: ${publicUrl}\n\n`;

    report += `📈 *SUMMARY STATS*\n`;
    report += `👀 Page Opens and Views: ${insights.views}\n`;
    report += `💌 Total RSVP Submissions: ${totalResponses}\n`;
    report += `✅ Attending: ${insights.totalAttendingCount} RSVPs (${insights.totalGuestCount} Total Headcount)\n`;
    report += `❌ Declined: ${insights.totalDeclinedCount} RSVPs\n`;
    if (insights.totalAmountCollected && insights.totalAmountCollected > 0) {
      report += `💰 Total Gifts Collected: ₹${insights.totalAmountCollected.toLocaleString()} (${insights.transactions?.length || 0} gifts)\n`;
    }
    report += `\n`;

    if (insights.transactions && insights.transactions.length > 0) {
      report += `🎁 *GIFT TRANSACTIONS RECORDED (${insights.transactions.length})*:\n`;
      insights.transactions.forEach((tx, idx) => {
        const refText = tx.transactionRef ? ` (Ref: ${tx.transactionRef})` : '';
        const noteText = tx.note ? ` - "${tx.note}"` : '';
        report += `${idx + 1}. ${tx.senderName}: ₹${tx.amount.toLocaleString()}${refText}${noteText}\n`;
      });
      report += `\n`;
    }

    if (attendingRsvps.length > 0) {
      report += `✨ *ATTENDING GUESTS (${attendingRsvps.length})*:\n`;
      attendingRsvps.forEach((r, idx) => {
        const countText = r.guestCount > 1 ? ` (${r.guestCount} guests)` : ` (1 guest)`;
        const noteText = r.note ? ` - "${r.note}"` : '';
        report += `${idx + 1}. ${r.guestName}${countText}${noteText}\n`;
      });
      report += `\n`;
    }

    if (declinedRsvps.length > 0) {
      report += `🕊️ *REGRETFULLY DECLINED (${declinedRsvps.length})*:\n`;
      declinedRsvps.forEach((r, idx) => {
        const noteText = r.note ? ` - "${r.note}"` : '';
        report += `${idx + 1}. ${r.guestName}${noteText}\n`;
      });
      report += `\n`;
    }

    report += `Generated with Yours Lovingly (yourslovingly.in)`;
    return report;
  };

  const handleSendToWhatsApp = () => {
    const report = generateConsolidatedReport();
    const encoded = encodeURIComponent(report);
    // If event has whatsappNumber, use wa.me/number, otherwise open share WhatsApp
    const targetUrl = event.whatsappNumber 
      ? `https://wa.me/${event.whatsappNumber.replace(/\D/g, '')}?text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(targetUrl, '_blank');
  };

  const handleCopyReport = () => {
    const report = generateConsolidatedReport();
    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const handleDownloadCSV = () => {
    if (insights.rsvps.length === 0) return;
    
    const headers = ['Guest Name', 'Status', 'Headcount', 'Phone', 'Wishes and Note', 'Submitted At'];
    const rows = insights.rsvps.map(r => [
      `"${(r.guestName || '').replace(/"/g, '""')}"`,
      r.attending ? 'Attending' : 'Declined',
      r.attending ? r.guestCount : 0,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.note || '').replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${(event.slug || 'event')}-rsvp-insights.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered RSVPs
  const filteredRsvps = insights.rsvps.filter(r => {
    if (filter === 'attending' && !r.attending) return false;
    if (filter === 'declined' && r.attending) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.guestName.toLowerCase().includes(q) ||
        (r.note && r.note.toLowerCase().includes(q)) ||
        (r.phone && r.phone.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 bg-brand-red/10 text-primary text-xs font-bold rounded-md uppercase tracking-wider">
                  Page Insights
                </span>
                <span className="text-xs text-stone-500 font-mono">/{event.slug}</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-stone-900">{event.title || 'Untitled Event'}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-all"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-primary' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Quick Links & Context */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Live Page Link</p>
                <a 
                  href={publicUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-medium text-secondary hover:text-secondary/90 flex items-center gap-1.5 break-all"
                >
                  {publicUrl}
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                </a>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white text-stone-700 border border-stone-200 rounded-xl text-xs font-bold hover:bg-stone-100 transition-all shadow-xs"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Copied Link' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Metric KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Opens / Views */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Page Opens</span>
                  <div className="w-7 h-7 rounded-lg bg-brand-teal/5 text-secondary flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-stone-900">
                    {loading ? '...' : insights.views}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-0.5">Impressions</p>
                </div>
              </div>

              {/* Total Responses */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Responses</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-stone-900">
                    {loading ? '...' : insights.rsvps.length}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-0.5">Submitted RSVPs</p>
                </div>
              </div>

              {/* Attending (Headcount) */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-emerald-800 mb-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Attending</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-950">
                    {loading ? '...' : insights.totalGuestCount} <span className="text-xs font-medium text-emerald-700">Guests</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 mt-0.5">
                    {insights.totalAttendingCount} confirmations
                  </p>
                </div>
              </div>

              {/* Declined */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Declined</span>
                  <div className="w-7 h-7 rounded-lg bg-stone-200/70 text-stone-600 flex items-center justify-center">
                    <XCircle className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-stone-800">
                    {loading ? '...' : insights.totalDeclinedCount}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-0.5">Cannot attend</p>
                </div>
              </div>

              {/* Total Gifts Collected */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-purple-800 mb-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Gifts (₹)</span>
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-purple-950">
                    {loading ? '...' : `₹${(insights.totalAmountCollected || 0).toLocaleString()}`}
                  </div>
                  <p className="text-[10px] text-purple-700 mt-0.5">
                    {insights.transactions?.length || 0} transactions
                  </p>
                </div>
              </div>
            </div>

            {/* Consolidated WhatsApp Reporting Action Bar */}
            <div className="p-5 bg-gradient-to-r from-brand-red/5 via-stone-50 to-brand-teal/5 rounded-2xl border border-brand-red/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <h3 className="font-serif font-bold text-stone-900 text-base">Consolidated WhatsApp Report</h3>
                </div>
                <p className="text-xs text-stone-600 max-w-lg">
                  Send a single, formatted summary message to your WhatsApp or planning group with full guest headcounts, response list, and attendance metrics without individual spam.
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <button
                  onClick={handleSendToWhatsApp}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send Report to WhatsApp
                </button>
                <button
                  onClick={handleCopyReport}
                  className="p-2.5 bg-white text-stone-700 border border-stone-200 rounded-xl hover:bg-stone-100 transition-all shadow-xs"
                  title="Copy Report Text"
                >
                  {copiedReport ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Guest Submissions Table Section */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-stone-900 text-lg">Guest Responses</h3>
                  <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-xs font-bold rounded-full">
                    {insights.rsvps.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Filter Pills */}
                  <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        filter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      All ({insights.rsvps.length})
                    </button>
                    <button
                      onClick={() => setFilter('attending')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        filter === 'attending' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      Attending ({insights.totalAttendingCount})
                    </button>
                    <button
                      onClick={() => setFilter('declined')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        filter === 'declined' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      Declined ({insights.totalDeclinedCount})
                    </button>
                  </div>

                  {/* CSV Export */}
                  {insights.rsvps.length > 0 && (
                    <button
                      onClick={handleDownloadCSV}
                      className="p-2 text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-all shadow-xs"
                      title="Download CSV"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search Bar if multiple records */}
              {insights.rsvps.length > 3 && (
                <input
                  type="text"
                  placeholder="Search guest by name or wish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-primary focus:bg-white"
                />
              )}

              {/* Table / List */}
              {filteredRsvps.length === 0 ? (
                <div className="py-12 px-4 text-center bg-stone-50/60 rounded-2xl border border-stone-200/80">
                  <HeartHandshake className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-stone-700">No RSVP responses yet</p>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                    When guests open your live page and submit their RSVP, their confirmation details and headcounts will appear here.
                  </p>
                </div>
              ) : (
                <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Guest</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Guests Count</th>
                          <th className="py-3 px-4">Wishes and Note</th>
                          <th className="py-3 px-4">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredRsvps.map((rsvp) => (
                          <tr key={rsvp.id} className="hover:bg-stone-50/50 transition-colors">
                            <td className="py-3 px-4 font-bold text-stone-900">
                              {rsvp.guestName}
                              {rsvp.phone && (
                                <span className="block text-[11px] font-mono text-stone-400 font-normal">
                                  {rsvp.phone}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {rsvp.attending ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-bold">
                                  <Check className="w-3 h-3" /> Attending
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-600 border border-stone-200 rounded-md text-xs font-bold">
                                  <X className="w-3 h-3" /> Declined
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-stone-700 font-medium">
                              {rsvp.attending ? `${rsvp.guestCount} ${rsvp.guestCount > 1 ? 'people' : 'person'}` : 'None'}
                            </td>
                            <td className="py-3 px-4 text-stone-600 max-w-xs truncate italic">
                              {rsvp.note || 'None'}
                            </td>
                            <td className="py-3 px-4 text-stone-400 text-[11px] whitespace-nowrap">
                              {new Date(rsvp.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Gift Transactions Section */}
            <div className="space-y-3 pt-4 border-t border-stone-200/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-lg">Recorded Gift Transactions</h3>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
                    {insights.transactions?.length || 0}
                  </span>
                </div>
                {insights.totalAmountCollected && insights.totalAmountCollected > 0 ? (
                  <span className="px-3 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold">
                    Total: ₹{insights.totalAmountCollected.toLocaleString()}
                  </span>
                ) : null}
              </div>

              {(!insights.transactions || insights.transactions.length === 0) ? (
                <div className="py-8 px-4 text-center bg-stone-50/60 rounded-2xl border border-stone-200/80">
                  <IndianRupee className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-bold text-stone-700">No gift transactions logged yet</p>
                  <p className="text-[11px] text-stone-500 max-w-sm mx-auto mt-1">
                    When guests send UPI payments and confirm on your page, transaction records will appear here.
                  </p>
                </div>
              ) : (
                <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-purple-50/50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Sender</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">UPI Ref / UTR</th>
                          <th className="py-3 px-4">Wish / Note</th>
                          <th className="py-3 px-4">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {insights.transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-purple-50/20 transition-colors">
                            <td className="py-3 px-4 font-bold text-stone-900">
                              {tx.senderName}
                            </td>
                            <td className="py-3 px-4 font-bold text-purple-900">
                              ₹{tx.amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 font-mono text-stone-600 text-xs">
                              {tx.transactionRef || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-stone-600 italic max-w-xs truncate">
                              {tx.note || 'None'}
                            </td>
                            <td className="py-3 px-4 text-stone-400 text-[11px] whitespace-nowrap">
                              {new Date(tx.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
            <p className="text-xs text-stone-500">
              Updated automatically in real time
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-all shadow-xs"
            >
              Close Insights
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
