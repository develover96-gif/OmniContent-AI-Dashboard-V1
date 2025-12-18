
import React, { useState } from 'react';
import { User, Sliders, Type, Save, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { VoiceProfile } from '../types';

interface VoiceProfileSettingsProps {
  profiles: VoiceProfile[];
  onSave: (profile: VoiceProfile) => void;
}

const VoiceProfileSettings: React.FC<VoiceProfileSettingsProps> = ({ profiles, onSave }) => {
  const defaultProfile = profiles.find(p => p.isDefault) || {
    id: 'new',
    name: 'New Profile',
    tone: 50,
    technicality: 50,
    humor: 50,
    length: 50,
    examples: '',
    isDefault: true
  };

  const [activeProfile, setActiveProfile] = useState<VoiceProfile>(defaultProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleUpdate = (field: keyof VoiceProfile, value: any) => {
    setActiveProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call to Supabase /api/voice-profile
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave(activeProfile);
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const SliderGroup = ({ label, icon: Icon, field, left, right }: { label: string, icon: any, field: keyof VoiceProfile, left: string, right: string }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">{label}</span>
        </div>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
          {activeProfile[field as keyof VoiceProfile] as number}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={activeProfile[field as keyof VoiceProfile] as number}
        onChange={(e) => handleUpdate(field, parseInt(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Voice Profiles</h2>
        <p className="text-slate-500 mt-2">Personalize how AI writes your content by defining your unique brand voice.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Presets / Selector */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Presets</h3>
          <div className="space-y-2">
            {profiles.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveProfile(p)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  activeProfile.id === p.id 
                    ? 'bg-white border-indigo-600 ring-4 ring-indigo-50 shadow-md' 
                    : 'bg-white border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{p.name}</span>
                  {p.isDefault && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">Tone: {p.tone}% • Tech: {p.technicality}%</p>
              </button>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <SliderGroup label="Tone" icon={Sliders} field="tone" left="Casual" right="Professional" />
              <SliderGroup label="Technicality" icon={Type} field="technicality" left="Beginner" right="Expert" />
              <SliderGroup label="Humor" icon={Sparkles} field="humor" left="Serious" right="Witty" />
              <SliderGroup label="Length" icon={Sliders} field="length" left="Concise" right="Elaborate" />
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                <label className="text-sm font-semibold text-slate-700">Style Examples & Sample Content</label>
              </div>
              <textarea
                value={activeProfile.examples}
                onChange={(e) => handleUpdate('examples', e.target.value)}
                placeholder="Paste examples of your previous posts or writing style here. The AI will analyze this to match your voice..."
                className="w-full h-48 px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none text-sm leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 px-4 italic">
                Tip: Provide at least 3-5 high-quality examples for the best results.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4">
               <div className="flex items-center gap-4">
                 <input
                   type="checkbox"
                   id="default-profile"
                   checked={activeProfile.isDefault}
                   onChange={(e) => handleUpdate('isDefault', e.target.checked)}
                   className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                 />
                 <label htmlFor="default-profile" className="text-sm font-medium text-slate-600 cursor-pointer">Set as default for auto-generated drafts</label>
               </div>
               
               <button
                 onClick={handleSave}
                 disabled={isSaving}
                 className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
               >
                 {isSaving ? <Sliders className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                 {showSaved ? 'Changes Saved!' : 'Save Profile'}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceProfileSettings;
