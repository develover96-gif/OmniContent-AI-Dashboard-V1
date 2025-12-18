
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, MessageSquare, MousePointer2, ExternalLink } from 'lucide-react';
import { Post } from '../types';
import { SmartImage } from './SmartImage';

const data = [
  { name: 'Mon', engagements: 400 }, { name: 'Tue', engagements: 300 },
  { name: 'Wed', engagements: 200 }, { name: 'Thu', engagements: 278 },
  { name: 'Fri', engagements: 189 }, { name: 'Sat', engagements: 239 },
  { name: 'Sun', engagements: 349 },
];

interface DashboardProps {
  posts: Post[];
}

const Dashboard: React.FC<DashboardProps> = ({ posts }) => {
  const stats = [
    { label: 'Total Reach', value: '45.2K', change: '+12.5%', icon: Users, up: true },
    { label: 'Engagements', value: '8.4K', change: '+18.2%', icon: MessageSquare, up: true },
    { label: 'Click Rate', value: '3.2%', change: '-2.1%', icon: MousePointer2, up: false },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-indigo-100">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-500 border border-slate-100">
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[380px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-900">Weekly Engagement</h3>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
               Last 7 Days
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="engagements" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEng)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-900">Latest Activity</h3>
            <button className="text-indigo-600 hover:text-indigo-700 transition-colors">
               <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3 flex-1">
            {posts.slice(0, 5).map(post => (
              <div key={post.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                <SmartImage src={post.imageUrl} className="w-10 h-10 rounded-lg shrink-0 border border-slate-100" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{post.title || post.content}</p>
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tight mt-0.5">{post.platform} • {post.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
