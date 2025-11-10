import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          display_name: string;
          photo_url: string;
          bio: string;
          followers: number;
          following: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          display_name: string;
          photo_url?: string;
          bio?: string;
          followers?: number;
          following?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          display_name?: string;
          photo_url?: string;
          bio?: string;
          followers?: number;
          following?: number;
          updated_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          user_id: string;
          video_url: string;
          thumbnail_url: string;
          description: string;
          hashtags: string[];
          likes: number;
          comments_count: number;
          shares: number;
          source: string;
          source_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_url: string;
          thumbnail_url: string;
          description?: string;
          hashtags?: string[];
          likes?: number;
          comments_count?: number;
          shares?: number;
          source?: string;
          source_url?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          video_url?: string;
          thumbnail_url?: string;
          description?: string;
          hashtags?: string[];
          likes?: number;
          comments_count?: number;
          shares?: number;
        };
      };
      comments: {
        Row: {
          id: string;
          video_id: string;
          user_id: string;
          text: string;
          likes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          video_id: string;
          user_id: string;
          text: string;
          likes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          text?: string;
          likes?: number;
        };
      };
      messages: {
        Row: {
          id: string;
          chat_id: string;
          sender_id: string;
          text: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          sender_id: string;
          text: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          text?: string;
          read?: boolean;
        };
      };
      chats: {
        Row: {
          id: string;
          last_message: string;
          last_message_time: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          last_message?: string;
          last_message_time?: string;
          created_at?: string;
        };
        Update: {
          last_message?: string;
          last_message_time?: string;
        };
      };
      chat_participants: {
        Row: {
          id: string;
          chat_id: string;
          user_id: string;
          unread_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          user_id: string;
          unread_count?: number;
          created_at?: string;
        };
        Update: {
          unread_count?: number;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          from_user_id: string;
          content_id: string | null;
          text: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          from_user_id: string;
          content_id?: string | null;
          text: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          read?: boolean;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          video_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_id: string;
          created_at?: string;
        };
      };
    };
  };
}
