import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X, CheckCircle2 } from 'lucide-react';
import type { LovinglyEvent } from '../types';
import { EventViewer } from './Viewer';

interface PdfExportModalProps {
  event: LovinglyEvent | null;
  onClose: () => void;
  autoTriggerPrint?: boolean;
}

export function PdfExportModal({ event, onClose, autoTriggerPrint = true }: PdfExportModalProps) {
  const portalEl = useMemo(() => {
    if (typeof document === 'undefined' || !event) return null;
    let el = document.getElementById('yl-pdf-print-portal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'yl-pdf-print-portal';
      document.body.appendChild(el);
    }
    return el;
  }, [event]);

  useEffect(() => {
    if (!event || !portalEl) return;

    document.body.classList.add('yl-printing-active');

    const timer = autoTriggerPrint
      ? setTimeout(() => {
          window.print();
        }, 600)
      : undefined;

    return () => {
      if (timer) clearTimeout(timer);
      document.body.classList.remove('yl-printing-active');
    };
  }, [event, portalEl, autoTriggerPrint]);

  if (!event || !portalEl) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-stone-900/90 overflow-y-auto print:static print:bg-transparent print:overflow-visible">
      {/* Top Action Bar (Hidden in actual PDF print output) */}
      <div className="yl-print-toolbar sticky top-0 inset-x-0 z-50 bg-stone-900/95 backdrop-blur-md border-b border-stone-700 text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xl print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shrink-0">
            <Printer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>Print-Ready Invitation PDF Preview</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Exact Website Layout Locked
              </span>
            </h3>
            <p className="text-[11px] text-stone-300">
              In the print dialog, choose <strong>"Save as PDF"</strong> as the Destination and keep <strong>Background graphics</strong> enabled.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Save as PDF / Print</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Exact Website Invitation View */}
      <div className="w-full min-h-screen print:min-h-0">
        <EventViewer event={event} disableAutoplay={true} />
      </div>
    </div>,
    portalEl
  );
}
