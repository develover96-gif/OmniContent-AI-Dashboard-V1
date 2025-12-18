
import React, { useState } from 'react';
import { User, Sliders, Type, Save, CheckCircle, Sparkles, AlertCircle, Plus } from 'lucide-react';
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
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave(activeProfile);
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const SliderGroup = ({ label, icon: Icon, field, left, right }: { label: string, icon: any, field: keyof VoiceProfile, left: string, right: string }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{label}</span>
        </div>
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
          {activeProfile[field as keyof VoiceProfile] as number}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={activeProfile[field as keyof VoiceProfile] as number}
        onChange={(e) => handleUpdate(field, parseInt(e.target.value))}
        className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
      <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <header>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Brand Voices</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">Fine-tune how Gemini interprets your team's unique persona.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Presets Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Profiles</h3>
            <button className="p-1 hover:bg-slate-100 rounded-md transition-colors">
              <Plus className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>
          <div className="space-y-2">
            {profiles.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveProfile(p)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  activeProfile.id === p.id 
                    ? 'bg-white border-indigo-600 ring-2 ring-indigo-50 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-slate-900">{p.name}</span>
                  {p.isDefault && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <p className="text-[10px] text-slate-500 truncate">Tone: {p.tone}% • Tech: {p.technicality}%</p>
              </button>
            ))}
          </div>
        </div>

        {/* Configuration Core */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <SliderGroup label="Tone" icon={Sliders} field="tone" left="Casual" right="Professional" />
              <SliderGroup label="Complexity" icon={Type} field="technicality" left="Beginner" right="Expert" />
              <SliderGroup label="Wit" icon={Sparkles} field="humor" left="Direct" right="Witty" />
              <SliderGroup label="Density" icon={Sliders} field="length" left="Concise" right="Detail" />
            </div>

            <div className="space-y-3 border-t border-slate-50 pt-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                <label className="text-xs font-bold text-slate-700 uppercase tracking-tight">Writing Samples</label>
              </div>
              <textarea
                value={activeProfile.examples}
                onChange={(e) => handleUpdate('examples', e.target.value)}
                placeholder="Paste past posts or specific phrases that define your brand voice..."
                className="w-full h-40 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white transition-all resize-none text-xs leading-relaxed"
              />
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-1">
                Tip: Higher sample volume increases AI stylistic fidelity.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
               <div className="flex items-center gap-3">
                 <input
                   type="checkbox"
                   id="default-profile"
                   checked={activeProfile.isDefault}
                   onChange={(e) => handleUpdate('isDefault', e.target.checked)}
                   className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                 />
                 <label htmlFor="default-profile" className="text-xs font-bold text-slate-500 uppercase tracking-tight cursor-pointer">Set as primary profile</label>
               </div>
               
               <button
                 onClick={handleSave}
                 disabled={isSaving}
                 className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-black transition-all shadow-sm disabled:opacity-50"
               >
                 {isSaving ? <Sliders className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                 {showSaved ? 'Saved' : 'Apply Changes'}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceProfileSettings;
