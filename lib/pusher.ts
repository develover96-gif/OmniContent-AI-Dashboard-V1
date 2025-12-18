
import Pusher from 'pusher-js';

// Environment variables for Pusher
const PUSHER_KEY = (process.env as any).NEXT_PUBLIC_PUSHER_KEY || '546876c5b9678e718872'; // Fallback for demo
const PUSHER_CLUSTER = (process.env as any).NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1';

export const pusherClient = new Pusher(PUSHER_KEY, {
  cluster: PUSHER_CLUSTER,
  forceTLS: true,
  // In a real app with private channels, you'd need an authEndpoint:
  // authEndpoint: '/api/pusher/auth',
});

/**
 * Hook-like utility to manage subscriptions to user real-time updates.
 */
export const subscribeToUserUpdates = (userId: string, callbacks: {
  onDraftAdded?: (data: any) => void;
  onActivityAdded?: (data: any) => void;
  onStatusUpdated?: (data: any) => void;
}) => {
  // Use public channel for demo purposes if auth endpoint isn't set up
  const channelName = `private-user-${userId}`;
  const channel = pusherClient.subscribe(channelName);

  if (callbacks.onDraftAdded) channel.bind('content-draft-added', callbacks.onDraftAdded);
  if (callbacks.onActivityAdded) channel.bind('activity-recorded', callbacks.onActivityAdded);
  if (callbacks.onStatusUpdated) channel.bind('post-status-updated', callbacks.onStatusUpdated);

  return () => {
    pusherClient.unsubscribe(channelName);
  };
};
