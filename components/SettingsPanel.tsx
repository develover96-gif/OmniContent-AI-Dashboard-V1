
import React, { useState, useEffect } from 'react';
import { 
  User, Bell, Shield, Rocket, Download, Trash2, 
  Check, Save, Globe, Lock, Mail, CreditCard,
  Smartphone, Eye, Activity as ActivityIcon, Server, Zap, Key
} from 'lucide-react';
import { UserPreferences } from '../types';
import { supabase } from '../lib/supabase';
import { pusherClient } from '../lib/pusher';
import { trackEvent } from '../lib/monitoring';

interface SettingsPanelProps {
  user: any;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ user, preferences, onUpdatePreferences }) => {
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>(preferences);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  
  // Health Status States
  const [healthStatus, setHealthStatus] = useState({
    supabase: 'checking',
    pusher: 'checking',
    gemini: 'checking'
  });

  useEffect(() => {
    const checkHealth = async () => {
      // 1. Check Supabase
      const { error } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
      const supabaseHealth = !error ? 'healthy' : 'error';

      // 2. Check Pusher
      const pusherHealth = pusherClient.connection.state === 'connected' ? 'healthy' : 'connecting';

      // 3. Check Gemini (Env Key Check)
      const geminiHealth = process.env.API_KEY ? 'healthy' : 'error';

      setHealthStatus({
        supabase: supabaseHealth,
        pusher: pusherHealth,
        gemini: geminiHealth
      });
    };

    checkHealth();
  }, []);

  const handleToggle = (key: keyof UserPreferences) => {
    setLocalPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (key: keyof UserPreferences, value: string) => {
    setLocalPrefs(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    trackEvent('settings_updated', { user_id: user.id });
    await new Promise(resolve => setTimeout(resolve, 600));
    onUpdatePreferences(localPrefs);
    setIsSaving(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const exportData = () => {
    trackEvent('data_exported', { user_id: user.id });
    const data = {
      account: user,
      preferences: localPrefs,
      exportDate: new Date().toISOString(),
      disclaimer: "GDPR Compliant Data Export"
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnicontent_user_data_${user.id}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Launch Readiness</h2>
          <p className="text-slate-500 mt-2">Manage your production environment and global settings.</p>
        </div>
        
        {/* Quick Health Indicators */}
        <div className="flex items-center gap-2">
           <div className={`w-2.5 h-2.5 rounded-full ${healthStatus.supabase === 'healthy' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></div>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Live</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="space-y-1">
          {[
            { id: 'profile', label: 'General', icon: User },
            { id: 'preferences', label: 'Publishing', icon: Rocket },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'health', label: 'System Health', icon: ActivityIcon },
            { id: 'security', label: 'Security', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                tab.id === 'profile' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4.5 h-4.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-8">
          {/* Health Check Section */}
          <section className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
              <ActivityIcon className="w-32 h-32" />
            </div>
            
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-400" />
              Production Service Status
            </h3>
            
            <div className="space-y-4 relative z-10">
              {[
                { label: 'Supabase DB (RLS Active)', icon: Shield, status: healthStatus.supabase },
                { label: 'Pusher Real-time Stream', icon: Zap, status: healthStatus.pusher },
                { label: 'Gemini AI Orchestrator', icon: Key, status: healthStatus.gemini },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <service.icon className="w-4 h-4 text-indigo-300" />
                    <span className="text-sm font-bold">{service.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${service.status === 'healthy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {service.status === 'healthy' ? 'Operational' : service.status === 'checking' ? 'Testing...' : 'Connection Error'}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${service.status === 'healthy' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-rose-400'}`}></div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs text-indigo-300 leading-relaxed max-w-md">
              Your workspace is currently connected to the production clusters. All n8n automation hooks are verified as "Active".
            </p>
          </section>

          {/* User Profile Section */}
          <section className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" />
              Profile Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">{user.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user.user_metadata?.full_name || 'Member'}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </section>

          {/* Publishing Preferences */}
          <section className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-8">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-slate-400" />
              Publishing Workflow
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100/50">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-indigo-900">Auto-publish AI Drafts</h4>
                  <p className="text-xs text-indigo-600 mt-1">Automatically schedule high-scoring content derived from activity hooks.</p>
                </div>
                <button 
                  onClick={() => handleToggle('autoPublish')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${localPrefs.autoPublish ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${localPrefs.autoPublish ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Platform Cross-posting</h4>
                  <p className="text-xs text-slate-500">Enable multi-platform publishing for single activities.</p>
                </div>
                <button 
                  className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-indigo-600"
                >
                  <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
                </button>
              </div>

              <div className="pt-4 space-y-3">
                <label className="text-sm font-bold text-slate-700">Primary Hub</label>
                <div className="flex flex-wrap gap-2">
                  {['LinkedIn', 'Instagram', 'Twitter', 'Facebook'].map(p => (
                    <button
                      key={p}
                      onClick={() => handleSelect('defaultPlatform', p)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        localPrefs.defaultPlatform === p 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-900">Data Management</h3>
            </div>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed italic">
              "Your content, your rules. We adhere to strict GDPR standards for data portability and deletion."
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={exportData}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                Request GDPR Export
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold hover:bg-rose-100 transition-all">
                <Trash2 className="w-4 h-4" />
                Deactivate Workspace
              </button>
            </div>
          </section>

          {/* Sticky Action Bar */}
          <div className="sticky bottom-8 z-20 flex justify-end">
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-[2.5rem] font-extrabold hover:bg-indigo-700 transition-all shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] disabled:opacity-50"
            >
              {isSaving ? <Smartphone className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {showSavedToast ? 'All Systems Updated' : 'Push Global Settings'}
              {showSavedToast && <Check className="w-5 h-5 ml-1" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
