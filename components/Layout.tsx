
import React from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { ConnectionStatusBar } from './ConnectionStatusBar';
import { Search, Bell, PlusCircle } from 'lucide-react';

interface LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, user, children }) => {
  return (
    <div className="flex min-h-screen bg-[#fcfcfd] text-slate-900 selection:bg-indigo-100">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      </div>

      <div className="flex-1 flex flex-col pb-24 md:pb-0 min-w-0">
        {/* Header */}
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center bg-slate-100/50 rounded-lg px-3 py-1.5 w-full md:w-80 max-w-sm border border-transparent focus-within:bg-white focus-within:border-slate-200 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none text-xs focus:ring-0 w-full placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <div className="hidden lg:block scale-90">
              <ConnectionStatusBar />
            </div>
            
            <button 
              onClick={() => setActiveTab('composer')}
              className="flex items-center gap-2 bg-indigo-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Post</span>
            </button>
            
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 md:p-6 lg:p-8 flex-1 overflow-x-hidden w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>

      {/* Bottom Nav - Mobile Only */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Layout;
