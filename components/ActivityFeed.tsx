
import React from 'react';
import { Github, Target, Zap, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { Activity } from '../types';

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (score >= 0.4) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'GitHub': return <Github className="w-4 h-4" />;
      case 'Linear': return <Target className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Activity Feed</h2>
          <p className="text-slate-500 text-sm">Real-time integration monitor for GitHub & Linear.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-600 uppercase">Live monitoring</span>
        </div>
      </div>

      <div className="grid gap-3">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 transition-all group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors`}>
                  {getSourceIcon(activity.source)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{activity.source} • {activity.type}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getScoreColor(activity.significanceScore)}`}>
                      Score: {activity.significanceScore.toFixed(2)}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{activity.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{activity.description}</p>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(activity.timestamp)}
                    </div>
                    {activity.significanceScore >= 0.7 && (
                      <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                        <Zap className="w-3.5 h-3.5 fill-indigo-600" />
                        Draft Auto-Generated
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                   <ShieldCheck className="w-5 h-5" />
                 </button>
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="py-20 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No activities recorded</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">Connect your webhooks to start seeing real-time development updates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
