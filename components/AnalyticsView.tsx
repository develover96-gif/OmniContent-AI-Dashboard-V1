
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { 
  Download, Filter, Calendar, ArrowUpRight, ArrowDownRight, 
  TrendingUp, Users, MessageSquare, Share2, MousePointer2,
  FileText, ExternalLink
} from 'lucide-react';
import { Post, DailyPerformance, HeatmapData } from '../types';

interface AnalyticsViewProps {
  posts: Post[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ posts }) => {
  const [dateRange, setDateRange] = useState('7d');

  // Simulated daily performance data
  const performanceData: DailyPerformance[] = useMemo(() => [
    { date: '2024-05-15', likes: 120, reach: 1200, engagements: 150 },
    { date: '2024-05-16', likes: 145, reach: 1500, engagements: 190 },
    { date: '2024-05-17', likes: 180, reach: 2400, engagements: 240 },
    { date: '2024-05-18', likes: 90, reach: 1100, engagements: 110 },
    { date: '2024-05-19', likes: 210, reach: 3500, engagements: 310 },
    { date: '2024-05-20', likes: 170, reach: 2800, engagements: 220 },
    { date: '2024-05-21', likes: 250, reach: 4200, engagements: 380 },
  ], []);

  // Simulated heatmap data (Posting frequency)
  const heatmapData: HeatmapData[] = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = [9, 12, 15, 18, 21];
    return days.flatMap(day => 
      hours.map(hour => ({
        day,
        hour,
        count: Math.floor(Math.random() * 10)
      }))
    );
  }, []);

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
          engagements: 0 // calculated below
        }
      }))
      .map(p => ({
        ...p,
        metrics: {
          ...p.metrics,
          engagements: p.metrics.likes + p.metrics.shares + p.metrics.comments
        }
      }))
      .sort((a, b) => (b.metrics?.engagements || 0) - (a.metrics?.engagements || 0))
      .slice(0, 5);
  }, [posts]);

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Platform', 'Status', 'Created At', 'Likes', 'Reach', 'Engagements'];
    const csvRows = [
      headers.join(','),
      ...posts.map(p => [
        p.id,
        `"${p.title.replace(/"/g, '""')}"`,
        p.platform,
        p.status,
        p.createdAt.toISOString(),
        p.metrics?.likes || 0,
        p.metrics?.reach || 0,
        p.metrics?.engagements || 0
      ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `omnicontent_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Performance Insights</h2>
          <p className="text-slate-500 mt-2">Detailed analytics of your cross-platform content strategy.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex shadow-sm">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  dateRange === range 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </header>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Reach', value: '82.4K', change: '+14.2%', icon: Users, up: true },
          { label: 'Engagement Rate', value: '4.8%', change: '+0.5%', icon: TrendingUp, up: true },
          { label: 'Avg. Interactions', value: '342', change: '-2.1%', icon: MessageSquare, up: false },
          { label: 'Link Clicks', value: '1.2K', change: '+8.9%', icon: MousePointer2, up: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <stat.icon className="w-16 h-16 text-slate-900" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-extrabold text-slate-900">{stat.value}</h3>
              <div className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change}
                {stat.up ? <ArrowUpRight className="w-3 h-3 ml-0.5" /> : <ArrowDownRight className="w-3 h-3 ml-0.5" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Reach & Engagement</h3>
              <p className="text-sm text-slate-400">Comparing content impressions with active participation.</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10}} 
                  dy={10} 
                  tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Area type="monotone" dataKey="reach" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorReach)" />
                <Area type="monotone" dataKey="engagements" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEngage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reach</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Engagements</span>
            </div>
          </div>
        </div>

        {/* Channel Heatmap */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Posting Heatmap</h3>
          <p className="text-sm text-slate-400 mb-8">Optimal times for high engagement.</p>
          
          <div className="flex-1 flex flex-col justify-between pb-4">
             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
               <div key={day} className="flex items-center gap-3">
                 <span className="text-[10px] font-bold text-slate-400 w-8">{day}</span>
                 <div className="flex-1 flex gap-1">
                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => {
                     const intensity = Math.random();
                     return (
                       <div 
                         key={i} 
                         className="flex-1 aspect-square rounded-sm transition-transform hover:scale-125 cursor-pointer"
                         style={{ 
                           backgroundColor: intensity > 0.8 ? '#4f46e5' : intensity > 0.5 ? '#818cf8' : intensity > 0.2 ? '#c7d2fe' : '#f1f5f9'
                         }}
                         title={`${day} - Time Slot ${i}: High engagement probability`}
                       />
                     );
                   })}
                 </div>
               </div>
             ))}
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Low Volume</span>
             <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-slate-100"></div>
                <div className="w-3 h-3 rounded-sm bg-indigo-200"></div>
                <div className="w-3 h-3 rounded-sm bg-indigo-400"></div>
                <div className="w-3 h-3 rounded-sm bg-indigo-600"></div>
             </div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High Volume</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Posts Table */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Top Performing Content</h3>
              <p className="text-sm text-slate-400">Based on cumulative interaction metrics.</p>
            </div>
            <button className="text-indigo-600 text-sm font-bold hover:text-indigo-700 flex items-center gap-1">
              Deep Dive
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  <th className="px-8 py-4">Post Detail</th>
                  <th className="px-6 py-4">Platform</th>
                  <th className="px-6 py-4">Reach</th>
                  <th className="px-6 py-4">ER%</th>
                  <th className="px-8 py-4 text-right">Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topPosts.length > 0 ? (
                  topPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                            <img src={post.imageUrl || `https://picsum.photos/seed/${post.id}/200/200`} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{post.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(post.createdAt)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-600 px-2 py-1 bg-slate-100 rounded-md">{post.platform}</span>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-900">{(post.metrics?.reach || 0).toLocaleString()}</td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2">
                           <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500" 
                                style={{ width: `${Math.min(((post.metrics?.engagements || 0) / (post.metrics?.reach || 1)) * 100 * 5, 100)}%` }}
                              ></div>
                           </div>
                           <span className="text-xs font-bold text-emerald-600">
                             {(((post.metrics?.engagements || 0) / (post.metrics?.reach || 1)) * 100).toFixed(1)}%
                           </span>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-extrabold text-slate-900">{post.metrics?.engagements}</span>
                          <div className="flex gap-2 text-[10px] text-slate-400">
                             <span className="flex items-center gap-0.5"><Users className="w-2.5 h-2.5" />{post.metrics?.likes}</span>
                             <span className="flex items-center gap-0.5"><Share2 className="w-2.5 h-2.5" />{post.metrics?.shares}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-slate-200 mb-4" />
                        <h4 className="text-lg font-bold text-slate-900">No content data available</h4>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto">Publish some content to start tracking detailed performance metrics.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audience Sentiment / Channel Mix */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
           <h3 className="text-xl font-bold text-slate-900 mb-2">Audience Sentiment</h3>
           <p className="text-sm text-slate-400 mb-8">AI-powered mood analysis of comments.</p>
           
           <div className="flex-1 flex flex-col justify-center space-y-10">
              {[
                { label: 'Positive', value: 72, color: 'bg-emerald-500' },
                { label: 'Neutral', value: 18, color: 'bg-slate-300' },
                { label: 'Critical', value: 10, color: 'bg-rose-500' },
              ].map((sentiment) => (
                <div key={sentiment.label} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                    <span className="text-slate-500">{sentiment.label}</span>
                    <span className="text-slate-900">{sentiment.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${sentiment.color}`} style={{ width: `${sentiment.value}%` }}></div>
                  </div>
                </div>
              ))}
           </div>

           <div className="mt-12 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Growth Forecast</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Based on current velocity, you're on track to hit <span className="font-bold">100K total reach</span> by next month. Keep focusing on LinkedIn video content.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
