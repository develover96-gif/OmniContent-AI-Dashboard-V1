
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

    // Padding for previous month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({ day: null, date: null });
    }

    // Days of current month
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
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Calendar Column */}
        <div className="flex-1 space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Editorial Plan</h2>
              <p className="text-slate-500 mt-1">Strategic overview of your upcoming publication cycle.</p>
            </div>
            <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              <span className="px-4 font-bold text-slate-700 text-sm min-w-[120px] text-center">{monthName} {year}</span>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </header>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-100">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-[120px] md:auto-rows-[140px]">
              {days.map((item, idx) => {
                const isToday = item.date?.toDateString() === new Date().toDateString();
                const isSelected = item.date?.toDateString() === selectedDate.toDateString();

                return (
                  <div 
                    key={idx} 
                    onClick={() => item.date && setSelectedDate(item.date)}
                    className={`border-r border-b border-slate-50 p-2 md:p-3 transition-all cursor-pointer relative group ${
                      !item.day ? 'bg-slate-50/50' : 'hover:bg-indigo-50/30'
                    } ${isSelected ? 'bg-indigo-50/50 ring-2 ring-inset ring-indigo-500/20' : ''}`}
                  >
                    {item.day && (
                      <>
                        <div className="flex justify-between items-start">
                          <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-lg ${
                            isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-400 group-hover:text-slate-600'
                          }`}>
                            {item.day}
                          </span>
                          {item.posts && item.posts.length > 0 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                          )}
                        </div>
                        
                        <div className="mt-2 space-y-1">
                          {item.posts?.slice(0, 3).map(post => (
                            <div key={post.id} className="flex items-center gap-1 bg-white border border-slate-100 rounded-md px-1.5 py-0.5 shadow-sm overflow-hidden">
                              {getPlatformIcon(post.platform)}
                              <span className="text-[9px] font-bold text-slate-600 truncate">{post.title || post.content}</span>
                            </div>
                          ))}
                          {item.posts && item.posts.length > 3 && (
                            <div className="text-[9px] font-bold text-slate-400 pl-1">+{item.posts.length - 3} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Details Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl">
             <div className="flex items-center justify-between mb-6">
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedDate.toLocaleDateString('default', { weekday: 'long' })}</p>
                   <h3 className="text-xl font-bold">{selectedDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })}</h3>
                </div>
                <button 
                  onClick={() => onAddPost?.(selectedDate)}
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                </button>
             </div>

             <div className="space-y-4">
                {selectedDatePosts.length > 0 ? (
                  selectedDatePosts.map(post => (
                    <div key={post.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                           <div className="p-1.5 bg-white/10 rounded-lg">
                             {getPlatformIcon(post.platform)}
                           </div>
                           <span className="text-[10px] font-bold uppercase tracking-tight text-slate-300">{post.platform}</span>
                        </div>
                        <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="text-sm font-bold truncate mb-1">{post.title || 'Untitled Post'}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                        <Clock className="w-3 h-3" />
                        {post.scheduledFor ? new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(post.scheduledFor) : 'Time unset'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
                      <CalendarIcon className="w-6 h-6 text-slate-600" />
                    </div>
                    <p className="text-xs text-slate-400 px-4">No content scheduled for this date.</p>
                  </div>
                )}
             </div>

             {selectedDatePosts.length > 0 && (
               <button className="w-full mt-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95">
                 Optimize Schedule
               </button>
             )}
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Upcoming Milestone</h4>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-emerald-600 font-bold">24</span>
               </div>
               <div>
                  <p className="text-sm font-bold text-slate-900 leading-tight">V2 Feature Launch</p>
                  <p className="text-[10px] text-slate-500 mt-1">Scheduled for next Thursday</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerView;
