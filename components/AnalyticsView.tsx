
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
} from 'recharts';
import { 
  Download, Users, TrendingUp, MessageSquare, MousePointer2,
  FileText, ArrowUpRight, ArrowDownRight, ExternalLink
} from 'lucide-react';
import { Post, DailyPerformance } from '../types';

interface AnalyticsViewProps {
  posts: Post[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ posts }) => {
  const [dateRange, setDateRange] = useState('7d');

  const performanceData: DailyPerformance[] = useMemo(() => [
    { date: '2024-05-15', likes: 120, reach: 1200, engagements: 150 },
    { date: '2024-05-16', likes: 145, reach: 1500, engagements: 190 },
    { date: '2024-05-17', likes: 180, reach: 2400, engagements: 240 },
    { date: '2024-05-18', likes: 90, reach: 1100, engagements: 110 },
    { date: '2024-05-19', likes: 210, reach: 3500, engagements: 310 },
    { date: '2024-05-20', likes: 170, reach: 2800, engagements: 220 },
    { date: '2024-05-21', likes: 250, reach: 4200, engagements: 380 },
  ], []);

  const topPosts = useMemo(() => {
    return posts
      .filter(p => p.status === 'PUBLISHED')
      .map(p => ({
        ...p,
        metrics: p.metrics || {
          likes: Math.floor(Math.random() * 500) + 50,
          shares: Math.floor(Math.random() * 100) + 10,
          comments: Math.floor(Math.random() * 50) + 5,
          reach: Math.floor(Math.random() * 10000) + 1000,
          engagements: 0
        }
      }))
      .map(p => ({
        ...p,
        metrics: {
          ...p.metrics,
          engagements: (p.metrics?.likes || 0) + (p.metrics?.shares || 0) + (p.metrics?.comments || 0)
        }
      }))
      .sort((a, b) => (b.metrics?.engagements || 0) - (a.metrics?.engagements || 0))
      .slice(0, 5);
  }, [posts]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Intelligence Hub</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Tracking conversion and engagement across your network.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-white border border-slate-200 rounded-lg p-0.5 flex shadow-sm">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                  dateRange === range 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all border border-slate-200 bg-white">
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Cumulative Reach', value: '82.4K', change: '+14%', icon: Users, up: true },
          { label: 'Growth Velocity', value: '4.8%', change: '+0.5%', icon: TrendingUp, up: true },
          { label: 'Avg. Reaction', value: '342', change: '-2%', icon: MessageSquare, up: false },
          { label: 'Link CTR', value: '1.2K', change: '+9%', icon: MousePointer2, up: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-bold text-slate-900">{stat.value}</h3>
              <span className={`text-[9px] font-bold ${stat.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-slate-900">Reach Distribution</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Organic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Viral</span>
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorReachAn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 9}} 
                  dy={10} 
                  tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="reach" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorReachAn)" />
                <Area type="monotone" dataKey="engagements" stroke="#10b981" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Posting Heatmap</h3>
          <div className="flex-1 flex flex-col justify-between py-2">
             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
               <div key={day} className="flex items-center gap-2">
                 <span className="text-[9px] font-bold text-slate-400 w-6 uppercase">{day}</span>
                 <div className="flex-1 flex gap-0.5">
                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => {
                     const intensity = Math.random();
                     return (
                       <div 
                         key={i} 
                         className="flex-1 aspect-square rounded-[2px] transition-colors"
                         style={{ 
                           backgroundColor: intensity > 0.8 ? '#4f46e5' : intensity > 0.5 ? '#818cf8' : intensity > 0.2 ? '#e2e8f0' : '#f8fafc'
                         }}
                       />
                     );
                   })}
                 </div>
               </div>
             ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-4">
             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Quiet</span>
             <div className="flex gap-0.5">
                <div className="w-2 h-2 rounded-sm bg-slate-100"></div>
                <div className="w-2 h-2 rounded-sm bg-indigo-200"></div>
                <div className="w-2 h-2 rounded-sm bg-indigo-400"></div>
                <div className="w-2 h-2 rounded-sm bg-indigo-600"></div>
             </div>
             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Peak</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Leaderboard</h3>
          <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700">View All Content</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                <th className="px-5 py-3">Content</th>
                <th className="px-5 py-3">Channel</th>
                <th className="px-5 py-3">Reach</th>
                <th className="px-5 py-3">Impact</th>
                <th className="px-5 py-3 text-right">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 text-xs font-bold text-slate-700 truncate max-w-[200px]">{post.title}</td>
                  <td className="px-5 py-3"><span className="text-[9px] font-bold text-slate-500 uppercase px-1.5 py-0.5 bg-slate-100 rounded">{post.platform}</span></td>
                  <td className="px-5 py-3 text-xs font-medium">{(post.metrics?.reach || 0).toLocaleString()}</td>
                  <td className="px-5 py-3 text-xs text-emerald-600 font-bold">
                    {(((post.metrics?.engagements || 0) / (post.metrics?.reach || 1)) * 100).toFixed(1)}%
                  </td>
                  <td className="px-5 py-3 text-right text-xs font-bold text-slate-900">{post.metrics?.engagements}</td>
                </tr>
              ))}
              {topPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">No benchmark data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
