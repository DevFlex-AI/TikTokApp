import { supabase } from '@/lib/supabase';
import { Comment, Video } from '@/types';
import { create } from 'zustand';

interface VideoState {
  videos: Video[];
  currentVideo: Video | null;
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  fetchVideos: () => Promise<void>;
  likeVideo: (videoId: string) => Promise<void>;
  addComment: (videoId: string, userId: string, username: string, userPhotoURL: string, text: string) => Promise<void>;
  fetchComments: (videoId: string) => Promise<void>;
}

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: [],
  currentVideo: null,
  comments: [],
  isLoading: false,
  error: null,

  fetchVideos: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: videosData, error } = await supabase
        .from('videos')
        .select(`
          *,
          users (
            id,
            username,
            photo_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const videos: Video[] = videosData?.map((video: any) => ({
        id: video.id,
        userId: video.user_id,
        username: video.users.username,
        userPhotoURL: video.users.photo_url,
        videoURL: video.video_url,
        thumbnailURL: video.thumbnail_url,
        description: video.description,
        likes: video.likes,
        comments: video.comments_count,
        shares: video.shares,
        createdAt: new Date(video.created_at).getTime(),
        hashtags: video.hashtags || [],
      })) || [];

      set({ videos, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      });
    }
  },

  likeVideo: async (videoId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: likeError } = await supabase
        .from('likes')
        .insert({ user_id: user.id, video_id: videoId });

      if (likeError) {
        if (likeError.code === '23505') {
          return;
        }
        throw likeError;
      }

      const { error: updateError } = await supabase.rpc('increment_video_likes', {
        video_id: videoId
      });

      set(state => ({
        videos: state.videos.map(video =>
          video.id === videoId
            ? { ...video, likes: video.likes + 1 }
            : video
        ),
        currentVideo: state.currentVideo?.id === videoId
          ? { ...state.currentVideo, likes: state.currentVideo.likes + 1 }
          : state.currentVideo
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  },

  addComment: async (videoId, userId, username, userPhotoURL, text) => {
    try {
      const { data: commentData, error } = await supabase
        .from('comments')
        .insert({
          video_id: videoId,
          user_id: userId,
          text
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.rpc('increment_video_comments', {
        video_id: videoId
      });

      const newComment: Comment = {
        id: commentData.id,
        videoId,
        userId,
        username,
        userPhotoURL,
        text,
        likes: 0,
        createdAt: new Date(commentData.created_at).getTime(),
      };

      set(state => ({
        comments: [newComment, ...state.comments],
        videos: state.videos.map(video =>
          video.id === videoId
            ? { ...video, comments: video.comments + 1 }
            : video
        ),
        currentVideo: state.currentVideo?.id === videoId
          ? { ...state.currentVideo, comments: state.currentVideo.comments + 1 }
          : state.currentVideo
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  },

  fetchComments: async (videoId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select(`
          *,
          users (
            username,
            photo_url
          )
        `)
        .eq('video_id', videoId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const comments: Comment[] = commentsData?.map((comment: any) => ({
        id: comment.id,
        videoId: comment.video_id,
        userId: comment.user_id,
        username: comment.users.username,
        userPhotoURL: comment.users.photo_url,
        text: comment.text,
        likes: comment.likes,
        createdAt: new Date(comment.created_at).getTime(),
      })) || [];

      set({ comments, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      });
    }
  },
}));
