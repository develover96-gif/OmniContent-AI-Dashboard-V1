
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, 
  Calendar as CalendarIcon, 
  Instagram, Linkedin, Twitter, Facebook,
  Clock, MoreVertical
} from 'lucide-react';
import { Post, PostStatus } from '../types';

interface SchedulerViewProps {
  posts: Post[];
  onAddPost?: (date: Date) => void;
}

const SchedulerView: React.FC<SchedulerViewProps> = ({ posts, onAddPost }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const scheduledPosts = useMemo(() => 
    posts.filter(p => p.status === PostStatus.SCHEDULED && p.scheduledFor),
  [posts]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram': return <Instagram className="w-3 h-3 text-pink-500" />;
      case 'LinkedIn': return <Linkedin className="w-3 h-3 text-blue-600" />;
      case 'Twitter': return <Twitter className="w-3 h-3 text-sky-400" />;
      case 'Facebook': return <Facebook className="w-3 h-3 text-blue-700" />;
      default: return null;
    }
  };

  const days = useMemo(() => {
    const totalDays = daysInMonth(year, currentDate.getMonth());
    const firstDay = firstDayOfMonth(year, currentDate.getMonth());
    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push({ day: null, date: null });
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, currentDate.getMonth(), d);
      const postsForDay = scheduledPosts.filter(p => 
        p.scheduledFor?.getDate() === d && 
        p.scheduledFor?.getMonth() === currentDate.getMonth() &&
        p.scheduledFor?.getFullYear() === year
      );
      calendarDays.push({ day: d, date, posts: postsForDay });
    }
    return calendarDays;
  }, [currentDate, scheduledPosts, year]);

  const selectedDatePosts = useMemo(() => {
    return scheduledPosts.filter(p => 
      p.scheduledFor?.getDate() === selectedDate.getDate() && 
      p.scheduledFor?.getMonth() === selectedDate.getMonth() &&
      p.scheduledFor?.getFullYear() === selectedDate.getFullYear()
    );
  }, [selectedDate, scheduledPosts]);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Editorial Plan</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Monthly publication oversight and strategy.</p>
            </div>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 shadow-sm">
              <button onClick={prevMonth} className="p-1.5 hover:bg-slate-50 rounded-md transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <span className="px-3 font-bold text-slate-700 text-[11px] min-w-[100px] text-center uppercase tracking-widest">{monthName} {year}</span>
              <button onClick={nextMonth} className="p-1.5 hover:bg-slate-50 rounded-md transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </header>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-2.5 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-[100px] md:auto-rows-[120px]">
              {days.map((item, idx) => {
                const isToday = item.date?.toDateString() === new Date().toDateString();
                const isSelected = item.date?.toDateString() === selectedDate.toDateString();
                return (
                  <div 
                    key={idx} 
                    onClick={() => item.date && setSelectedDate(item.date)}
                    className={`border-r border-b border-slate-50 p-2 transition-all cursor-pointer relative ${
                      !item.day ? 'bg-slate-50/30' : 'hover:bg-indigo-50/30'
                    } ${isSelected ? 'bg-indigo-50/50 ring-2 ring-inset ring-indigo-500/10' : ''}`}
                  >
                    {item.day && (
                      <>
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-md ${
                            isToday ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400'
                          }`}>
                            {item.day}
                          </span>
                          {item.posts && item.posts.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                        </div>
                        <div className="mt-1.5 space-y-1">
                          {item.posts?.slice(0, 3).map(post => (
                            <div key={post.id} className="flex items-center gap-1 bg-white border border-slate-100 rounded-md px-1 py-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
                              {getPlatformIcon(post.platform)}
                              <span className="text-[8px] font-bold text-slate-600 truncate">{post.title || post.content}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-72 space-y-4">
          <div className="bg-slate-900 rounded-xl p-5 text-white shadow-lg flex flex-col min-h-[400px]">
             <div className="flex items-center justify-between mb-6">
                <div>
                   <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{selectedDate.toLocaleDateString('default', { weekday: 'long' })}</p>
                   <h3 className="text-lg font-bold">{selectedDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })}</h3>
                </div>
                <button onClick={() => onAddPost?.(selectedDate)} className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                  <Plus className="w-4 h-4" />
                </button>
             </div>

             <div className="space-y-3 flex-1 overflow-y-auto">
                {selectedDatePosts.length > 0 ? (
                  selectedDatePosts.map(post => (
                    <div key={post.id} className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors group">
                      <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-1.5">
                           <div className="p-1 bg-white/10 rounded">{getPlatformIcon(post.platform)}</div>
                           <span className="text-[8px] font-bold uppercase tracking-tight text-slate-400">{post.platform}</span>
                         </div>
                         <button className="text-slate-500 opacity-0 group-hover:opacity-100"><MoreVertical className="w-3 h-3" /></button>
                      </div>
                      <h4 className="text-xs font-bold truncate mb-1">{post.title || 'Untitled Post'}</h4>
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase">
                        <Clock className="w-3 h-3" />
                        {post.scheduledFor ? new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(post.scheduledFor) : 'Time unset'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center space-y-2 opacity-30">
                    <CalendarIcon className="w-6 h-6 mx-auto" />
                    <p className="text-[10px] uppercase font-bold tracking-widest">No slots filled</p>
                  </div>
                )}
             </div>

             {selectedDatePosts.length > 0 && (
               <button className="w-full mt-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95">
                 Optimize Mix
               </button>
             )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Priority Events</h4>
            <div className="flex items-center gap-3">
               <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 border border-emerald-100">
                  <span className="text-emerald-600 font-bold text-xs">24</span>
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">Feature Launch</p>
                  <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-tighter">Scheduled: Oct 24</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerView;
