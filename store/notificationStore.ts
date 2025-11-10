import { supabase } from '@/lib/supabase';
import { Notification } from '@/types';
import { create } from 'zustand';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: notificationsData, error } = await supabase
        .from('notifications')
        .select(`
          *,
          from_user:users!notifications_from_user_id_fkey (
            username,
            photo_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const notifications: Notification[] = (notificationsData || []).map((notif: any) => ({
        id: notif.id,
        userId: notif.user_id,
        type: notif.type as 'like' | 'comment' | 'follow' | 'message',
        fromUserId: notif.from_user_id,
        fromUsername: notif.from_user.username,
        fromUserPhotoURL: notif.from_user.photo_url,
        contentId: notif.content_id,
        text: notif.text,
        read: notif.read,
        createdAt: new Date(notif.created_at).getTime(),
      }));

      const unreadCount = notifications.filter(notif => !notif.read).length;

      set({ notifications, unreadCount, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      set(state => {
        const updatedNotifications = state.notifications.map(notif =>
          notif.id === notificationId
            ? { ...notif, read: true }
            : notif
        );

        const unreadCount = updatedNotifications.filter(notif => !notif.read).length;

        return {
          notifications: updatedNotifications,
          unreadCount
        };
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  },

  markAllAsRead: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      set(state => ({
        notifications: state.notifications.map(notif => ({ ...notif, read: true })),
        unreadCount: 0
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  },
}));
