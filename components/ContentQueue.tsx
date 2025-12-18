
import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, Trash2, CheckCircle2, 
  Calendar, Send, Filter, MoreVertical, 
  Github, Target, Edit3, Check, X,
  ChevronRight, Smartphone, ExternalLink as ExternalIcon
} from 'lucide-react';
import { Post, PostStatus } from '../types';

interface ContentQueueProps {
  posts: Post[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (id: string) => void;
  onPublish: (id: string) => void;
}

type TabType = 'drafts' | 'scheduled' | 'published';

const ContentQueue: React.FC<ContentQueueProps> = ({ posts, onApprove, onReject, onEdit, onPublish }) => {
  const [activeTab, setActiveTab] = useState<TabType>('drafts');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredPosts = posts.filter(p => {
    if (activeTab === 'drafts') return p.status === PostStatus.AI_DRAFT || p.status === PostStatus.DRAFT;
    if (activeTab === 'scheduled') return p.status === PostStatus.SCHEDULED;
    if (activeTab === 'published') return p.status === PostStatus.PUBLISHED;
    return false;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'GitHub': return <Github className="w-3.5 h-3.5" />;
      case 'Linear': return <Target className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-slate-400 bg-slate-100';
    if (score >= 0.8) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 0.6) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  const DraftCard = ({ post }: { post: Post }) => (
    <div className={`relative group bg-white border rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl ${selectedIds.includes(post.id) ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-slate-200'}`}>
      <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10">
        <input 
          type="checkbox" 
          checked={selectedIds.includes(post.id)}
          onChange={() => toggleSelect(post.id)}
          className="w-5 h-5 md:w-4 md:h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
      </div>

      <div className="p-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-3 md:px-4 py-2 md:py-2.5">
        <div className="flex items-center gap-2 md:gap-3 ml-8 md:ml-6">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-sm text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {getSourceIcon(post.source)}
            <span className="hidden xs:inline">{post.source || 'Manual'}</span>
          </div>
          {post.qualityScore && (
            <div className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${getScoreColor(post.qualityScore)}`}>
              Score: {Math.round(post.qualityScore * 100)}%
            </div>
          )}
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.platform}</span>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-bold text-slate-900 leading-tight flex-1 text-sm md:text-base">{post.title}</h3>
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs md:text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {post.content}
        </p>

        {post.imageUrl && (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-100 group-hover:border-indigo-100 transition-colors">
            <img src={post.imageUrl} className="w-full h-full object-cover" alt="Preview" />
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-1 md:gap-2">
            <button 
              onClick={() => onReject(post.id)}
              className="p-3 md:p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Reject & Delete"
            >
              <X className="w-5 h-5 md:w-4.5 md:h-4.5" />
            </button>
            <button 
              onClick={() => onEdit(post.id)}
              className="p-3 md:p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              title="Edit Content"
            >
              <Edit3 className="w-5 h-5 md:w-4.5 md:h-4.5" />
            </button>
          </div>
          
          <button 
            onClick={() => onApprove(post.id)}
            className="flex items-center gap-2 bg-indigo-600 text-white pl-4 pr-3 md:pl-5 md:pr-4 py-2.5 md:py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Approve
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const ScheduledCard = ({ post }: { post: Post }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:shadow-md transition-shadow">
      <div className="w-full sm:w-20 h-32 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100">
        <img src={post.imageUrl || `https://picsum.photos/seed/${post.id}/200/200`} className="w-full h-full object-cover" alt="" />
      </div>
      <div className="flex-1 min-w-0 w-full">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-md">{post.platform}</span>
          <div className="flex items-center gap-1 text-[10px] md:text-xs text-slate-400 font-medium">
            <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
            {post.scheduledFor ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(post.scheduledFor) : 'Time not set'}
          </div>
        </div>
        <h3 className="font-bold text-slate-900 truncate text-sm md:text-base">{post.title}</h3>
        <p className="text-xs md:text-sm text-slate-500 truncate mt-1">{post.content}</p>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-none border-slate-50">
        <button className="p-3 sm:p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
          <Edit3 className="w-5 h-5 sm:w-4.5 sm:h-4.5" />
        </button>
        <button 
          onClick={() => onPublish(post.id)}
          className="flex-1 sm:flex-none bg-slate-900 text-white px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg text-sm font-bold hover:bg-black transition-colors"
        >
          Publish Now
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Content Queue</h2>
          <p className="text-slate-500 mt-1 md:mt-2 text-sm">Manage your cross-platform content pipeline.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {(['drafts', 'scheduled', 'published'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedIds([]); }}
              className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold transition-all capitalize whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab ? 'bg-indigo-400 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {posts.filter(p => {
                  if (tab === 'drafts') return p.status === PostStatus.AI_DRAFT || p.status === PostStatus.DRAFT;
                  if (tab === 'scheduled') return p.status === PostStatus.SCHEDULED;
                  if (tab === 'published') return p.status === PostStatus.PUBLISHED;
                  return false;
                }).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="sticky top-20 z-30 bg-indigo-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-300 mx-1">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-xs md:text-sm">
              {selectedIds.length}
            </div>
            <span className="font-bold text-xs md:text-sm">Selected</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => {
                selectedIds.forEach(onApprove);
                setSelectedIds([]);
              }}
              className="px-3 md:px-4 py-1.5 md:py-2 bg-white text-indigo-600 rounded-xl text-[10px] md:text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Approve
            </button>
            <button 
              onClick={() => {
                selectedIds.forEach(onReject);
                setSelectedIds([]);
              }}
              className="px-3 md:px-4 py-1.5 md:py-2 bg-rose-500 text-white rounded-xl text-[10px] md:text-sm font-bold"
            >
              Delete
            </button>
            <button 
              onClick={() => setSelectedIds([])}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {activeTab === 'drafts' && filteredPosts.map(post => (
          <DraftCard key={post.id} post={post} />
        ))}
        
        {activeTab === 'scheduled' && (
          <div className="col-span-full space-y-4">
            {filteredPosts.map(post => (
              <ScheduledCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {activeTab === 'published' && (
          <div className="col-span-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
             {filteredPosts.map(post => (
               <div key={post.id} className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 space-y-3 hover:shadow-md transition-all group">
                 <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    <span>{post.platform}</span>
                    <span className="text-emerald-500 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      Live
                    </span>
                 </div>
                 <h4 className="font-bold text-slate-900 line-clamp-1 text-sm">{post.title}</h4>
                 <div className="aspect-square rounded-lg bg-slate-50 overflow-hidden border border-slate-100">
                    <img src={post.imageUrl || `https://picsum.photos/seed/${post.id}/200/200`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                 </div>
                 <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] text-slate-400">{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(post.createdAt)}</span>
                    <button className="text-indigo-600 hover:text-indigo-700">
                      <ExternalIcon className="w-4 h-4" />
                    </button>
                 </div>
               </div>
             ))}
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="col-span-full py-20 md:py-32 text-center bg-white border-2 border-dashed border-slate-100 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 md:space-y-6 mx-1">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl md:rounded-3xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-slate-200" />
            </div>
            <div className="px-4">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">Queue is clear</h3>
              <p className="text-slate-500 text-xs md:text-sm mt-1 max-w-sm mx-auto">
                {activeTab === 'drafts' 
                  ? "Incoming activity will appear here automatically for your review." 
                  : `You don't have any ${activeTab} content right now.`}
              </p>
            </div>
            {activeTab === 'drafts' && (
              <button 
                className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl text-xs md:text-sm font-bold transition-all active:scale-95"
                onClick={() => window.dispatchEvent(new CustomEvent('simulate_webhook'))}
              >
                <Smartphone className="w-4 h-4" />
                Simulate Activity
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentQueue;
