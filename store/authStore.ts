import { supabase } from '@/lib/supabase';
import { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initialize: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (userData) {
            const user: User = {
              id: userData.id,
              username: userData.username,
              email: userData.email,
              displayName: userData.display_name,
              photoURL: userData.photo_url,
              bio: userData.bio,
              followers: userData.followers,
              following: userData.following,
              createdAt: new Date(userData.created_at).getTime(),
            };
            set({ user, isAuthenticated: true });
          }
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (authError) throw authError;

          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();

          if (userData) {
            const user: User = {
              id: userData.id,
              username: userData.username,
              email: userData.email,
              displayName: userData.display_name,
              photoURL: userData.photo_url,
              bio: userData.bio,
              followers: userData.followers,
              following: userData.following,
              createdAt: new Date(userData.created_at).getTime(),
            };
            set({ user, isAuthenticated: true, isLoading: false });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
        }
      },

      register: async (email, password, username) => {
        set({ isLoading: true, error: null });
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (authError) throw authError;
          if (!authData.user) throw new Error('Registration failed');

          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              username,
              email,
              display_name: username,
              photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
            });

          if (insertError) throw insertError;

          const newUser: User = {
            id: authData.user.id,
            username,
            email,
            displayName: username,
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
            bio: '',
            followers: 0,
            following: 0,
            createdAt: Date.now(),
          };

          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const currentUser = get().user;
          if (!currentUser) throw new Error('No user logged in');

          const updateData: any = {};
          if (data.username) updateData.username = data.username;
          if (data.displayName) updateData.display_name = data.displayName;
          if (data.bio !== undefined) updateData.bio = data.bio;
          if (data.photoURL) updateData.photo_url = data.photoURL;

          const { error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', currentUser.id);

          if (error) throw error;

          set(state => ({
            user: state.user ? { ...state.user, ...data } : null,
            isLoading: false
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
