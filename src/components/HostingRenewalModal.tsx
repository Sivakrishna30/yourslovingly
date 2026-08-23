import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  Check, 
  X, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Infinity as InfinityIcon
} from 'lucide-react';
import type { LovinglyEvent, HostingExtensionType } from '../types';
import { getHostingStatus, applyHostingExtension, EXTENSION_PRICING } from '../lib/hosting';

interface HostingRenewalModalProps {
  event: LovinglyEvent;
  onClose: () => void;
  onConfirmExtension: (updatedEvent: LovinglyEvent) => Promise<void>;
}

export function HostingRenewalModal({
  event,
  onClose,
  onConfirmExtension
}: HostingRenewalModalProps) {
  const [selectedOption, setSelectedOption] = useState<HostingExtensionType>('extension_30_days');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const hostingInfo = getHostingStatus(event);

  // Compute what the new expiry will look like based on selected option
  const previewUpdatedEvent = applyHostingExtension(event, selectedOption);
  const previewHostingInfo = getHostingStatus(previewUpdatedEvent);

  const handlePayAndExtend = async () => {
    setIsProcessing(true);
    try {
      const updated = applyHostingExtension(
        event,
        selectedOption,
        new Date(),
        'UPI_PAY_' + Math.random().toString(36).substring(2, 9).toUpperCase()
      );
      await onConfirmExtension(updated);
      setSuccessMessage(
        selectedOption === 'lifetime_single'
          ? 'Lifelong permanent hosting activated successfully!'
          : '30 days live hosting extension added successfully!'
      );
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err) {
      console.error('Failed to extend hosting:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/65 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-stone-100 max-h-[92vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-accent flex items-center justify-center shrink-0 border border-brand-orange/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Hosting Validity and Extension
            </h3>
            <p className="text-xs text-stone-500 truncate max-w-[280px] sm:max-w-xs">
              Page: <strong className="text-stone-800">{event.title || 'Untitled Page'}</strong>
            </p>
          </div>
        </div>

        {/* Current Status Box */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">Current Hosting Status:</span>
            <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] border ${hostingInfo.badgeBg} ${hostingInfo.badgeBorder}`}>
              {hostingInfo.badgeText}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-200/60">
            <span className="text-stone-500">Plan Tier / Expiry:</span>
            <span className="font-bold text-stone-800">
              {hostingInfo.isLifetime ? 'Permanent (Never Expires)' : hostingInfo.formattedExpiry}
            </span>
          </div>
        </div>

        {successMessage ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-stone-900">{successMessage}</h4>
            <p className="text-xs text-stone-500">Updating your page status across all servers...</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                Choose Extension Option for this Page Alone
              </label>

              {/* Option 1: +30 Days Extension (₹49) */}
              <div
                onClick={() => setSelectedOption('extension_30_days')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedOption === 'extension_30_days'
                    ? 'border-primary bg-brand-red/5 shadow-sm ring-2 ring-brand-red/10'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === 'extension_30_days' ? 'border-primary bg-primary' : 'border-stone-300'
                    }`}>
                      {selectedOption === 'extension_30_days' && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">
                          {EXTENSION_PRICING.extend_30_days.label}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-600">
                          +30 Days
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {hostingInfo.isExpired
                          ? 'Re-activates page for 30 days starting today'
                          : 'Adds +30 days on top of current expiry'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-stone-900">₹49</div>
                    <div className="text-[10px] text-stone-400">One-time</div>
                  </div>
                </div>
              </div>

              {/* Option 2: Life Long Permanent Hosting (₹299) */}
              <div
                onClick={() => setSelectedOption('lifetime_single')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedOption === 'lifetime_single'
                    ? 'border-secondary bg-brand-teal/5 shadow-sm ring-2 ring-brand-teal/10'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === 'lifetime_single' ? 'border-secondary bg-secondary' : 'border-stone-300'
                    }`}>
                      {selectedOption === 'lifetime_single' && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">
                          {EXTENSION_PRICING.lifetime_single.label}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-teal/10 text-secondary flex items-center gap-1">
                          <InfinityIcon className="w-3 h-3" />
                          Forever
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Permanent lifetime hosting for this page alone, never expires
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-secondary">₹299</div>
                    <div className="text-[10px] text-stone-400">Lifetime</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Box */}
            <div className="p-3.5 bg-stone-100 rounded-xl mb-6 text-xs flex items-center justify-between text-stone-700">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                New Expiry After Renewal:
              </span>
              <strong className="text-stone-900 font-bold">
                {previewHostingInfo.isLifetime ? 'Permanent (Never Expires)' : previewHostingInfo.formattedExpiry}
              </strong>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                disabled={isProcessing}
                onClick={handlePayAndExtend}
                className="w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-md"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      Pay {selectedOption === 'extension_30_days' ? '₹49' : '₹299'} & Extend Page
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant activation & live URL preservation</span>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
