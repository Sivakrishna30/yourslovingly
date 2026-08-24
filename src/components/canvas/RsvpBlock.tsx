import { useState } from 'react';
import { RsvpService } from '../../domain/engage/rsvpService';
import { Check } from 'lucide-react';

interface RsvpBlockProps {
  slug: string;
}

export function RsvpBlock({ slug }: RsvpBlockProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attending === null || !guestName.trim()) return;

    setLoading(true);
    try {
      await RsvpService.submitRsvp(slug, {
        guestName,
        attending,
        guestCount,
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
      <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center space-y-3 h-full w-full">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <Check className="w-6 h-6" />
        </div>
        <p className="font-serif text-lg text-slate-800">Thank you!</p>
        <p className="text-sm text-slate-500 text-center">Your RSVP has been recorded.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center space-y-4 h-full w-full">
      <h3 className="font-serif text-xl">RSVP</h3>
      <p className="text-sm text-slate-500 text-center">Will you be attending?</p>
      
      <div className="w-full space-y-3">
        <input 
          type="text" 
          placeholder="Your Name" 
          required 
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
        />
        
        {attending !== false && (
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-slate-600">Guests:</span>
            <input 
              type="number" 
              min="1" 
              max="10" 
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-sm text-center"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 w-full mt-2">
        <button 
          type="button"
          onClick={() => setAttending(true)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${attending === true ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Yes
        </button>
        <button 
          type="button"
          onClick={() => setAttending(false)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${attending === false ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          No
        </button>
      </div>
      
      {attending !== null && (
        <button 
          type="submit" 
          disabled={loading || !guestName.trim()}
          className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 mt-2"
        >
          {loading ? 'Submitting...' : 'Confirm RSVP'}
        </button>
      )}
    </form>
  );
}
