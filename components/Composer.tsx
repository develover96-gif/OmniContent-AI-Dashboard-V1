
import React, { useState } from 'react';
import { Wand2, Image as ImageIcon, Loader2, Send, Save, Hash, UserCircle, Layout, Monitor } from 'lucide-react';
import { generatePostContent, generatePostImage } from '../services/geminiService';
import { PostStatus, VoiceProfile } from '../types';

interface ComposerProps {
  onSave: (post: any) => void;
  defaultVoiceProfile?: VoiceProfile;
}

const Composer: React.FC<ComposerProps> = ({ onSave, defaultVoiceProfile }) => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({ title: '', content: '', hashtags: [] as string[] });
  const [generatedImage, setGeneratedImage] = useState('');

  const handleGenerateContent = async () => {
    if (!topic) return;
    setLoadingContent(true);
    try {
      const result = await generatePostContent(topic, platform, defaultVoiceProfile);
      setGeneratedContent(result);
    } catch (error) {
      console.error("Failed to generate content", error);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!topic && !generatedContent.title) return;
    setLoadingImage(true);
    try {
      const prompt = generatedContent.title || topic;
      const imageUrl = await generatePostImage(prompt);
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error("Failed to generate image", error);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent.content) return;
    onSave({
      id: Date.now().toString(),
      title: generatedContent.title,
      content: generatedContent.content,
      imageUrl: generatedImage,
      platform,
      status: PostStatus.DRAFT,
      createdAt: new Date(),
      source: 'Manual'
    });
    setTopic('');
    setGeneratedContent({ title: '', content: '', hashtags: [] });
    setGeneratedImage('');
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-full min-h-[700px]">
        {/* Workspace Panel */}
        <div className="flex-1 p-6 md:p-8 border-r border-slate-100 space-y-8 overflow-y-auto">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Post Builder</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Draft your narrative with AI assistance.</p>
            </div>
            {defaultVoiceProfile && (
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                <UserCircle className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{defaultVoiceProfile.name}</span>
              </div>
            )}
          </header>

          <div className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Target Channel</label>
              <div className="flex flex-wrap gap-2">
                {['LinkedIn', 'Instagram', 'Twitter', 'Facebook'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      platform === p 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Concept or Prompt</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Describe your content goals..."
                className="w-full h-48 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed focus:bg-white resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGenerateContent}
                disabled={loadingContent || !topic}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loadingContent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span className="text-xs">Generate Text</span>
              </button>
              <button
                onClick={handleGenerateImage}
                disabled={loadingImage || (!topic && !generatedContent.title)}
                className="flex items-center justify-center bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-4 rounded-lg transition-all disabled:opacity-50"
              >
                {loadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 bg-slate-50/50 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Monitor className="w-3.5 h-3.5" />
              Real-time Preview
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              <span className="text-[9px] font-bold text-slate-500 uppercase">Interactive</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
            {generatedImage ? (
              <img src={generatedImage} alt="Post Visual" className="w-full aspect-square object-cover" />
            ) : (
              <div className="aspect-square bg-slate-100 flex flex-col items-center justify-center gap-3">
                {loadingImage ? (
                   <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                ) : (
                   <ImageIcon className="w-8 h-8 text-slate-200" />
                )}
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  {loadingImage ? 'AI Rendering...' : 'No Visual Attached'}
                </span>
              </div>
            )}

            <div className="p-5 space-y-4">
              {generatedContent.content ? (
                <div className="animate-in fade-in duration-300">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">{generatedContent.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{generatedContent.content}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {generatedContent.hashtags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-bold text-indigo-600">#{tag}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-3 w-3/4 bg-slate-100 rounded-full animate-pulse"></div>
                  <div className="h-3 w-full bg-slate-100 rounded-full animate-pulse"></div>
                  <div className="h-3 w-5/6 bg-slate-100 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto pt-6 flex gap-3 border-t border-slate-200/60">
            <button 
              onClick={handleSave}
              disabled={!generatedContent.content}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-30"
            >
              <Save className="w-3.5 h-3.5" />
              Save Draft
            </button>
            <button 
              disabled={!generatedContent.content}
              className="flex-[2] flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 disabled:opacity-30"
            >
              <Send className="w-3.5 h-3.5" />
              Finalize & Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Composer;
