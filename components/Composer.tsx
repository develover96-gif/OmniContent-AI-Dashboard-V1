
import React, { useState } from 'react';
import { Wand2, Image as ImageIcon, Loader2, Send, Save, Hash, UserCircle } from 'lucide-react';
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
    // Reset
    setTopic('');
    setGeneratedContent({ title: '', content: '', hashtags: [] });
    setGeneratedImage('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm overflow-hidden">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Content Composer</h2>
            <p className="text-slate-500">Let AI craft your next viral social media post.</p>
          </div>
          
          {defaultVoiceProfile && (
            <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <UserCircle className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none">Voice Active</p>
                <p className="text-sm font-bold text-indigo-700 leading-tight">{defaultVoiceProfile.name}</p>
              </div>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Inputs Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 ml-1">Social Platform</label>
              <div className="grid grid-cols-2 gap-3">
                {['Instagram', 'LinkedIn', 'Twitter', 'Facebook'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all border ${
                      platform === p 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 ml-1">What's the topic or hook?</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. New features launch for our SaaS product focusing on speed and simplicity. Mention the 40% performance boost."
                className="w-full h-40 px-6 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none text-slate-700 leading-relaxed"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleGenerateContent}
                disabled={loadingContent || !topic}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loadingContent ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                Draft Content
              </button>
              <button
                onClick={handleGenerateImage}
                disabled={loadingImage || (!topic && !generatedContent.title)}
                className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-4 px-6 rounded-2xl transition-all disabled:opacity-50"
                title="Generate AI Image"
              >
                {loadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-slate-50 rounded-[3rem] border border-slate-200 p-8 flex flex-col min-h-[500px] shadow-inner relative">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Live Preview • {platform}
            </div>

            <div className="flex-1 space-y-6">
              {generatedImage ? (
                <div className="group relative">
                  <img src={generatedImage} alt="Post Visual" className="w-full aspect-square object-cover rounded-[2rem] border border-slate-200 shadow-md group-hover:scale-[1.02] transition-transform duration-500" />
                  <button onClick={() => setGeneratedImage('')} className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className={`w-full aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 transition-colors ${loadingImage ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white/50'}`}>
                  {loadingImage ? (
                    <>
                      <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Generating Visual...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-xs text-slate-400 font-medium">Visual placeholder</p>
                    </>
                  )}
                </div>
              )}

              {generatedContent.content ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500 bg-white/50 p-6 rounded-[2rem] border border-white">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{generatedContent.title}</h3>
                  <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed italic border-l-2 border-indigo-100 pl-4">{generatedContent.content}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {generatedContent.hashtags.map((tag, idx) => (
                      <span key={idx} className="bg-white border border-slate-100 px-2 py-1 rounded-lg text-indigo-600 text-xs font-bold">#{tag}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-6 bg-white/30 rounded-[2rem]">
                  <div className="h-6 w-3/4 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-slate-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-5/6 bg-slate-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-4/6 bg-slate-200 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8 mt-8 border-t border-slate-200 flex gap-4">
              <button 
                onClick={handleSave}
                disabled={!generatedContent.content}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all disabled:opacity-30"
              >
                <Save className="w-4 h-4" />
                Draft
              </button>
              <button 
                disabled={!generatedContent.content}
                className="flex-[2] flex items-center justify-center gap-3 py-4 px-6 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-30 group"
              >
                Publish Ready
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Composer;
