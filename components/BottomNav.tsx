
import React from 'react';
import { LayoutDashboard, PenTool, Calendar, BarChart3, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'composer', icon: PenTool, label: 'Compose' },
    { id: 'scheduler', icon: Calendar, label: 'Plan' },
    { id: 'analytics', icon: BarChart3, label: 'Stats' },
    { id: 'settings', icon: Settings, label: 'Menu' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-2 py-3 flex items-center justify-around shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center gap-1 min-w-[64px] transition-all ${
            activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-indigo-50' : ''}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          {activeTab === item.id && (
            <span className="w-1 h-1 bg-indigo-600 rounded-full"></span>
          )}
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
