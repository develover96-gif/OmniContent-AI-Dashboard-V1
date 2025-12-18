
import React from 'react';
import { LayoutDashboard, PenTool, BarChart3, Settings, Calendar, Share2, LogOut, Zap, ListTodo, UserCircle, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'composer', label: 'Composer', icon: PenTool },
    { id: 'queue', label: 'Queue', icon: ListTodo },
    { id: 'scheduler', label: 'Calendar', icon: Calendar },
    { id: 'voices', label: 'Brand Voice', icon: UserCircle },
    { id: 'activities', label: 'Integrations', icon: Zap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Member';
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=f1f5f9&color=475569`;

  return (
    <aside className="w-60 bg-white border-r border-slate-200 min-h-screen flex flex-col sticky top-0 z-50">
      <div className="p-5">
        <div className="flex items-center gap-2.5 mb-8 px-1">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <Share2 className="text-white w-4 h-4" />
          </div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight">
            OmniContent
          </h1>
        </div>

        <nav className="space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group relative flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all rounded-lg ${
                activeTab === item.id
                  ? 'bg-indigo-50/50 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {activeTab === item.id && <div className="active-nav-indicator" />}
              <item.icon className={`w-4.5 h-4.5 ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {activeTab === item.id && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-2">
          <img
            src={avatarUrl}
            alt="User"
            className="w-8 h-8 rounded-lg border border-slate-100 bg-slate-50"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate leading-none">{displayName}</p>
            <p className="text-[10px] text-slate-500 truncate mt-1 uppercase font-bold tracking-widest">Enterprise</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
