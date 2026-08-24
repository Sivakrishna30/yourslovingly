import { useState } from 'react';
import { LedgerService } from '../../domain/engage/ledgerService';
import { Check, Gift } from 'lucide-react';

interface LedgerBlockProps {
  slug: string;
  qrUrl?: string;
  upiId?: string;
}

export function LedgerBlock({ slug, qrUrl, upiId }: LedgerBlockProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [senderName, setSenderName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amount);
    if (!senderName.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    setLoading(true);
    try {
      await LedgerService.recordTransaction(slug, {
        senderName,
        amount: parsedAmount,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center space-y-2 h-full w-full">
        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <Check className="w-5 h-5" />
        </div>
        <p className="text-sm font-medium text-slate-800 text-center">Gift logged!</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center space-y-3 h-full w-full relative">
        <button 
          type="button" 
          onClick={() => setShowForm(false)}
          className="absolute top-2 left-2 text-xs text-slate-400 hover:text-slate-600"
        >
          Back
        </button>
        <p className="text-sm font-medium text-slate-800 pt-2">Log your gift</p>
        <input 
          type="text" 
          placeholder="Your Name" 
          required 
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
        />
        <input 
          type="number" 
          placeholder="Amount (₹)" 
          required 
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
        />
        <button 
          type="submit" 
          disabled={loading || !senderName.trim() || !amount}
          className="w-full bg-rose-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Logging...' : 'Confirm'}
        </button>
      </form>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center space-y-3 h-full w-full">
      <div className="w-full aspect-square bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center p-2">
        {qrUrl ? (
          <img src={qrUrl} alt="UPI QR" className="w-full h-full object-contain mix-blend-multiply" />
        ) : (
          <span className="text-xs text-slate-400">No QR Code</span>
        )}
      </div>
      <p className="text-xs font-mono text-slate-500 truncate w-full text-center">{upiId || 'upi@id'}</p>
      <button 
        type="button"
        onClick={() => setShowForm(true)}
        className="w-full flex items-center justify-center gap-1 bg-slate-100 text-slate-700 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors"
      >
        <Gift className="w-3 h-3" />
        Log Gift
      </button>
    </div>
  );
}
