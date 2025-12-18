
import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, Trash2, CheckCircle2, 
  Calendar, Send, Filter, MoreVertical, 
  Github, Target, Edit3, Check, X,
  ChevronRight, Smartphone, ExternalLink as ExternalIcon, Clock
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

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'GitHub': return <Github className="w-3.5 h-3.5" />;
      case 'Linear': return <Target className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const DraftCard = ({ post }: { post: Post }) => (
    <div className={`relative group bg-white border rounded-xl overflow-hidden transition-all hover:border-indigo-300 ${selectedIds.includes(post.id) ? 'border-indigo-600 ring-2 ring-indigo-50 shadow-sm' : 'border-slate-200 shadow-sm'}`}>
      <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={selectedIds.includes(post.id)}
            onChange={() => setSelectedIds(prev => prev.includes(post.id) ? prev.filter(i => i !== post.id) : [...prev, post.id])}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer"
          />
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white border border-slate-200 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
            {getSourceIcon(post.source)}
            {post.source || 'Manual'}
          </div>
        </div>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{post.platform}</span>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-bold text-slate-900 leading-tight text-sm truncate">{post.title}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed h-8">
          {post.content}
        </p>

        {post.imageUrl && (
          <div className="aspect-video rounded-lg overflow-hidden border border-slate-100">
            <img src={post.imageUrl} className="w-full h-full object-cover" alt="Preview" />
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-2">
          <div className="flex gap-1">
            <button onClick={() => onReject(post.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><X className="w-3.5 h-3.5" /></button>
            <button onClick={() => onEdit(post.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
          </div>
          <button 
            onClick={() => onApprove(post.id)}
            className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-black transition-all"
          >
            <span>Approve</span>
            <Check className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );

  const ListItem = ({ post }: { post: Post }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-4 hover:border-slate-300 transition-all shadow-sm">
      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
        <img src={post.imageUrl || `https://picsum.photos/seed/${post.id}/100/100`} className="w-full h-full object-cover" alt="" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[9px] font-bold text-indigo-600 uppercase bg-indigo-50 px-1.5 py-0.5 rounded">{post.platform}</span>
          <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-tight">
            <Clock className="w-3 h-3" />
            {post.scheduledFor ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(post.scheduledFor) : 'Published'}
          </div>
        </div>
        <h3 className="font-bold text-slate-900 truncate text-xs">{post.title}</h3>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg"><Edit3 className="w-4 h-4" /></button>
        {activeTab === 'scheduled' && (
          <button 
            onClick={() => onPublish(post.id)}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-sm"
          >
            Publish
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Content Pipeline</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Coordinate your upcoming brand presence across all channels.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {(['drafts', 'scheduled', 'published'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedIds([]); }}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all capitalize ${
                activeTab === tab 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
              <span className={`ml-2 px-1.5 py-0.5 rounded-md ${
                activeTab === tab ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'
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
      </header>

      {selectedIds.length > 0 && (
        <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-2">
          <span className="text-xs font-bold uppercase tracking-wider">{selectedIds.length} Posts Selected</span>
          <div className="flex gap-2">
            <button 
               onClick={() => { selectedIds.forEach(onApprove); setSelectedIds([]); }}
               className="px-3 py-1 bg-white text-indigo-600 rounded-lg text-[11px] font-bold"
            >
              Approve All
            </button>
            <button 
               onClick={() => setSelectedIds([])}
               className="text-white/80 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeTab === 'drafts' && filteredPosts.map(post => <DraftCard key={post.id} post={post} />)}
        
        {(activeTab === 'scheduled' || activeTab === 'published') && (
          <div className="col-span-full space-y-2.5">
            {filteredPosts.map(post => <ListItem key={post.id} post={post} />)}
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-slate-200" />
            </div>
            <div className="px-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Inbox Zero</h3>
              <p className="text-[11px] text-slate-500 mt-1 uppercase font-bold tracking-tight">No content pending review</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentQueue;
