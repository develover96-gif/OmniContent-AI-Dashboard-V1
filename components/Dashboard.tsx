
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MoreHorizontal, ArrowUpRight, ArrowDownRight, Users, MessageSquare, MousePointer2 } from 'lucide-react';
import { Post, PostStatus } from '../types';
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><stat.icon className="w-6 h-6" /></div>
              <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change} {stat.up ? <ArrowUpRight className="w-3 h-3 inline" /> : <ArrowDownRight className="w-3 h-3 inline" />}
              </div>
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-96">
          <h3 className="font-bold text-slate-900 mb-6">Engagement Overview</h3>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={data}>
              <defs><linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="engagements" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorEng)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Recent Content</h3>
          <div className="space-y-4">
            {posts.slice(0, 4).map(post => (
              <div key={post.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <SmartImage src={post.imageUrl} className="w-12 h-12 rounded-lg shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 truncate">{post.title || post.content}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{post.platform} • {post.status}</p>
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
