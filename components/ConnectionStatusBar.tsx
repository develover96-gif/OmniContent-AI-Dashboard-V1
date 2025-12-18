
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Zap, ZapOff } from 'lucide-react';
import { pusherClient } from '../lib/pusher';

export const ConnectionStatusBar: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pusherStatus, setPusherStatus] = useState(pusherClient.connection.state);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handlePusherState = (state: any) => {
      setPusherStatus(state.current);
    };

    pusherClient.connection.bind('state_change', handlePusherState);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      pusherClient.connection.unbind('state_change', handlePusherState);
    };
  }, []);

  const getPusherColor = () => {
    switch (pusherStatus) {
      case 'connected': return 'text-amber-500';
      case 'connecting': return 'text-slate-400 animate-pulse';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3">
        {isOnline ? (
          <Wifi className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <WifiOff className="w-3.5 h-3.5 text-rose-400" />
        )}
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
          {isOnline ? 'Network' : 'Offline'}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {pusherStatus === 'connected' ? (
          <Zap className={`w-3.5 h-3.5 ${getPusherColor()} fill-amber-500`} />
        ) : (
          <ZapOff className="w-3.5 h-3.5 text-slate-300" />
        )}
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
          {pusherStatus === 'connected' ? 'Stream' : 'Stopped'}
        </span>
      </div>
    </div>
  );
};
