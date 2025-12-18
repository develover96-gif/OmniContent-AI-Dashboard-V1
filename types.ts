
export enum PostStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  AI_DRAFT = 'AI_DRAFT'
}

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  platform: 'Instagram' | 'LinkedIn' | 'Twitter' | 'Facebook';
  status: PostStatus;
  createdAt: Date;
  scheduledFor?: Date;
  activityId?: string;
  qualityScore?: number;
  source?: 'GitHub' | 'Linear' | 'Jira' | 'Manual';
  metrics?: PostMetrics;
}

export interface PostMetrics {
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  engagements: number;
}

export interface Activity {
  id: string;
  source: 'GitHub' | 'Linear' | 'Jira' | 'Manual';
  type: string;
  title: string;
  description: string;
  significanceScore: number;
  timestamp: Date;
  status: 'PROCESSED' | 'PENDING' | 'IGNORED';
}

export interface VoiceProfile {
  id: string;
  name: string;
  tone: number; // 0 (Casual) - 100 (Professional)
  technicality: number; // 0 (Simple) - 100 (Expert)
  humor: number; // 0 (Dry) - 100 (Witty)
  length: number; // 0 (Concise) - 100 (Elaborate)
  examples: string;
  isDefault: boolean;
}

export interface UserPreferences {
  autoPublish: boolean;
  useEmojis: boolean;
  defaultPlatform: 'LinkedIn' | 'Instagram' | 'Twitter' | 'Facebook';
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface AnalyticsData {
  name: string;
  engagements: number;
  reach: number;
  clicks: number;
}

export interface DailyPerformance {
  date: string;
  likes: number;
  reach: number;
  engagements: number;
}

export interface HeatmapData {
  day: string;
  hour: number;
  count: number;
}
