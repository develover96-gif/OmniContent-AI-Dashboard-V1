
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
    <div className="flex min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      </div>

      <div className="flex-1 flex flex-col pb-24 md:pb-0 min-w-0">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-lg border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3 md:gap-4 flex-1">
            <div className="md:hidden w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
               <span className="text-white font-bold text-sm">OC</span>
            </div>
            <div className="flex items-center bg-slate-100/80 rounded-full px-4 py-2 w-full md:w-96 max-w-md focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all border border-transparent focus-within:border-indigo-200">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-transparent border-none text-sm focus:ring-0 w-full placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 ml-4">
            <div className="hidden lg:block scale-90">
              <ConnectionStatusBar />
            </div>
            
            <button 
              onClick={() => setActiveTab('composer')}
              className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden md:inline">Compose</span>
              <span className="md:hidden">New</span>
            </button>
            
            <div className="relative shrink-0">
              <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all active:scale-90">
                <Bell className="w-5 h-5" />
              </button>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 md:p-8 flex-1 overflow-x-hidden w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>

      {/* Bottom Nav - Mobile Only */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Layout;
