
import React from 'react';
import { Github, Target, Zap, Clock, ShieldCheck, AlertCircle, ChevronRight } from 'lucide-react';
import { Activity } from '../types';

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (score >= 0.4) return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-slate-50 text-slate-700 border-slate-100';
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'GitHub': return <Github className="w-4 h-4" />;
      case 'Linear': return <Target className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <header className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Signal Feed</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Monitoring incoming triggers from your development stack.</p>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Active Monitoring</span>
        </div>
      </header>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-200 transition-all group cursor-pointer shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-2.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors shrink-0`}>
                  {getSourceIcon(activity.source)}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.source} • {activity.type}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-tight ${getScoreColor(activity.significanceScore)}`}>
                      Significance: {activity.significanceScore.toFixed(2)}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{activity.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{activity.description}</p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                      <Clock className="w-3.5 h-3.5" />
                      {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(activity.timestamp)}
                    </div>
                    {activity.significanceScore >= 0.7 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-tight">
                        <Zap className="w-3 h-3 fill-indigo-600" />
                        AI Draft Auto-Generated
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                 <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                   <ShieldCheck className="w-4 h-4" />
                 </button>
                 <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">No Signals Detected</h3>
              <p className="text-[11px] text-slate-500 mt-1 uppercase font-bold tracking-tight">Connect webhooks to see development signals</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
