
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import { Auth } from './components/Auth';
import { Post, PostStatus, Activity, VoiceProfile, UserPreferences } from './types';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase';
import { generateDraftFromActivity } from './services/geminiService';
import { subscribeToUserUpdates } from './lib/pusher';
import { DashboardSkeleton, ComposerSkeleton } from './components/Skeleton';

// Lazy load heavy components for code-splitting
const Dashboard = lazy(() => import('./components/Dashboard'));
const Composer = lazy(() => import('./components/Composer'));
const ActivityFeed = lazy(() => import('./components/ActivityFeed'));
const ContentQueue = lazy(() => import('./components/ContentQueue'));
const VoiceProfileSettings = lazy(() => import('./components/VoiceProfileSettings'));
const AnalyticsView = lazy(() => import('./components/AnalyticsView'));
const SettingsPanel = lazy(() => import('./components/SettingsPanel'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      gcTime: 10 * 60 * 1000,
    },
  },
});

const AppContent: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [posts, setPosts] = useState<Post[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    autoPublish: false,
    useEmojis: true,
    defaultPlatform: 'LinkedIn',
    notificationsEnabled: true,
    theme: 'system'
  });
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([
    {
      id: 'p1',
      name: 'Professional Tech',
      tone: 85,
      technicality: 90,
      humor: 20,
      length: 60,
      examples: 'Our latest research into CRDTs shows a 40% reduction in sync latency.',
      isDefault: true
    }
  ]);

  const defaultVoiceProfile = voiceProfiles.find(p => p.isDefault);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    return subscribeToUserUpdates(session.user.id, {
      onDraftAdded: (data) => setPosts(prev => [data, ...prev]),
      onActivityAdded: (data) => setActivities(prev => [data, ...prev]),
      onStatusUpdated: (data) => setPosts(prev => prev.map(p => p.id === data.id ? { ...p, ...data } : p))
    });
  }, [session]);

  // Persistence logic
  useEffect(() => {
    if (!session) return;
    const savedPosts = localStorage.getItem(`posts_${session.user.id}`);
    const savedActs = localStorage.getItem(`acts_${session.user.id}`);
    const savedPrefs = localStorage.getItem(`prefs_${session.user.id}`);
    const savedVoices = localStorage.getItem(`voices_${session.user.id}`);
    
    if (savedPosts) setPosts(JSON.parse(savedPosts).map((p:any) => ({ ...p, createdAt: new Date(p.createdAt), scheduledFor: p.scheduledFor ? new Date(p.scheduledFor) : undefined })));
    if (savedActs) setActivities(JSON.parse(savedActs).map((a:any) => ({ ...a, timestamp: new Date(a.timestamp) })));
    if (savedPrefs) setPreferences(JSON.parse(savedPrefs));
    if (savedVoices) setVoiceProfiles(JSON.parse(savedVoices));
  }, [session]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(`posts_${session.user.id}`, JSON.stringify(posts));
      localStorage.setItem(`acts_${session.user.id}`, JSON.stringify(activities));
      localStorage.setItem(`prefs_${session.user.id}`, JSON.stringify(preferences));
      localStorage.setItem(`voices_${session.user.id}`, JSON.stringify(voiceProfiles));
    }
  }, [posts, activities, preferences, voiceProfiles, session]);

  // Optimistic UI Handlers
  const handleApproveDraft = (id: string) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, status: PostStatus.SCHEDULED, scheduledFor: new Date(Date.now() + 86400000) } : p
    ));
  };

  const handleRejectPost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const handlePublishPost = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: PostStatus.PUBLISHED } : p));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );

  if (!session) return <Auth />;

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={session.user}>
      <Suspense fallback={activeTab === 'dashboard' ? <DashboardSkeleton /> : <div className="p-8 text-center text-slate-400">Loading module...</div>}>
        {activeTab === 'dashboard' && <Dashboard posts={posts} />}
        {activeTab === 'composer' && <Composer onSave={(p) => { setPosts(prev => [p, ...prev]); setActiveTab('dashboard'); }} defaultVoiceProfile={defaultVoiceProfile} />}
        {activeTab === 'activities' && <ActivityFeed activities={activities} />}
        {activeTab === 'voices' && <VoiceProfileSettings profiles={voiceProfiles} onSave={(v) => setVoiceProfiles(prev => [...prev.filter(x => x.id !== v.id), v])} />}
        {activeTab === 'analytics' && <AnalyticsView posts={posts} />}
        {activeTab === 'settings' && <SettingsPanel user={session.user} preferences={preferences} onUpdatePreferences={setPreferences} />}
        {activeTab === 'queue' && (
          <ContentQueue 
            posts={posts} 
            onApprove={handleApproveDraft} 
            onReject={handleRejectPost}
            onEdit={(id) => alert('Edit ' + id)}
            onPublish={handlePublishPost}
          />
        )}
      </Suspense>
    </Layout>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;
