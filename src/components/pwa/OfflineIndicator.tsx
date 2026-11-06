import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-stone-900/95 text-white px-3.5 py-2 text-xs font-semibold shadow-xl border border-stone-700 backdrop-blur-md animate-in slide-in-from-bottom-2 duration-300">
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
      <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span>Offline Mode — Cached invitation data available</span>
    </div>
  );
};
