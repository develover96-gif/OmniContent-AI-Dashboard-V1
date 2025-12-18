
import React, { useState, useEffect } from 'react';
import { 
  User, Bell, Shield, Rocket, Download, Trash2, 
  Check, Save, Zap, Key, Server, Mail, Smartphone
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
  const [healthStatus, setHealthStatus] = useState({
    supabase: 'checking',
    pusher: 'checking',
    gemini: 'checking'
  });

  useEffect(() => {
    const checkHealth = async () => {
      const { error } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
      const pusherHealth = pusherClient.connection.state === 'connected' ? 'healthy' : 'connecting';
      const geminiHealth = process.env.API_KEY ? 'healthy' : 'error';
      setHealthStatus({
        supabase: !error ? 'healthy' : 'error',
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
    setLocalPrefs(prev => ({ ...prev, [key]: value as any }));
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Environment</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Global configuration and production health monitoring.</p>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
           <div className={`w-1.5 h-1.5 rounded-full ${healthStatus.supabase === 'healthy' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Cloud Verified</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <nav className="space-y-1">
          {[
            { id: 'profile', label: 'Identity', icon: User },
            { id: 'preferences', label: 'Engine', icon: Rocket },
            { id: 'notifications', label: 'Alerts', icon: Bell },
            { id: 'health', label: 'Integrations', icon: Server },
            { id: 'security', label: 'Security', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                tab.id === 'profile' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="md:col-span-3 space-y-6">
          <section className="bg-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden group">
            <h3 className="text-sm font-bold mb-5 flex items-center gap-2 uppercase tracking-widest">
              <Server className="w-4 h-4 text-indigo-400" />
              Service Status
            </h3>
            <div className="space-y-2.5 relative z-10">
              {[
                { label: 'Cloud Storage Cluster', status: healthStatus.supabase },
                { label: 'Real-time Event Bridge', status: healthStatus.pusher },
                { label: 'Gemini Logic Engine', status: healthStatus.gemini },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-xs font-bold text-slate-300">{service.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold uppercase ${service.status === 'healthy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {service.status === 'healthy' ? 'Operational' : 'Issue'}
                    </span>
                    <div className={`w-1.5 h-1.5 rounded-full ${service.status === 'healthy' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6">
            <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
                <Rocket className="w-4 h-4 text-slate-400" />
                Workflow Rules
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50/50 border border-indigo-100/50">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-900">Immediate Auto-Scheduling</h4>
                    <p className="text-[10px] text-indigo-600 mt-0.5 font-medium uppercase tracking-tight">Schedule drafts automatically on high significance scores.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('autoPublish')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${localPrefs.autoPublish ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${localPrefs.autoPublish ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Primary Publication Channel</label>
                  <div className="flex flex-wrap gap-2">
                    {['LinkedIn', 'Instagram', 'Twitter', 'Facebook'].map(p => (
                      <button
                        key={p}
                        onClick={() => handleSelect('defaultPlatform', p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          localPrefs.defaultPlatform === p 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
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

            <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
                <Shield className="w-4 h-4 text-slate-400" />
                Data Portability
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all">
                  <Download className="w-3.5 h-3.5" />
                  Export Workspace Data
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                  Wipe Repository
                </button>
              </div>
            </section>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-2.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50"
            >
              {isSaving ? <Smartphone className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {showSavedToast ? 'All Systems Synced' : 'Save Environment Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
