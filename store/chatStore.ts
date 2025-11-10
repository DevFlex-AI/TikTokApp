import { supabase } from '@/lib/supabase';
import { Chat, Message } from '@/types';
import { create } from 'zustand';

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  fetchChats: (userId: string) => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, senderId: string, receiverId: string, text: string) => Promise<void>;
  markChatAsRead: (chatId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  isLoading: false,
  error: null,

  fetchChats: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: participations, error } = await supabase
        .from('chat_participants')
        .select(`
          *,
          chats (
            id,
            last_message,
            last_message_time
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const chats: Chat[] = await Promise.all(
        (participations || []).map(async (p: any) => {
          const { data: allParticipants } = await supabase
            .from('chat_participants')
            .select('user_id')
            .eq('chat_id', p.chat_id);

          return {
            id: p.chat_id,
            participants: allParticipants?.map((ap: any) => ap.user_id) || [],
            lastMessage: p.chats.last_message,
            lastMessageTime: new Date(p.chats.last_message_time).getTime(),
            unreadCount: p.unread_count,
          };
        })
      );

      set({ chats, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      });
    }
  },

  fetchMessages: async (chatId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select(`
          *,
          chat_participants (
            user_id
          )
        `)
        .eq('id', chatId)
        .single();

      if (chatError) throw chatError;

      const messages: Message[] = (messagesData || []).map((msg: any) => ({
        id: msg.id,
        senderId: msg.sender_id,
        receiverId: '',
        text: msg.text,
        createdAt: new Date(msg.created_at).getTime(),
        read: msg.read,
      }));

      const chat: Chat = {
        id: chatData.id,
        participants: chatData.chat_participants.map((p: any) => p.user_id),
        lastMessage: chatData.last_message,
        lastMessageTime: new Date(chatData.last_message_time).getTime(),
        unreadCount: 0,
      };

      set({ messages, currentChat: chat, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      });
    }
  },

  sendMessage: async (chatId, senderId, receiverId, text) => {
    try {
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: senderId,
          text,
        })
        .select()
        .single();

      if (messageError) throw messageError;

      await supabase
        .from('chats')
        .update({
          last_message: text,
          last_message_time: new Date().toISOString(),
        })
        .eq('id', chatId);

      const newMessage: Message = {
        id: messageData.id,
        senderId,
        receiverId,
        text,
        createdAt: new Date(messageData.created_at).getTime(),
        read: false,
      };

      set(state => ({
        messages: [...state.messages, newMessage],
        chats: state.chats.map(chat =>
          chat.id === chatId
            ? {
                ...chat,
                lastMessage: text,
                lastMessageTime: Date.now(),
              }
            : chat
        ),
        currentChat: state.currentChat?.id === chatId
          ? {
              ...state.currentChat,
              lastMessage: text,
              lastMessageTime: Date.now()
            }
          : state.currentChat
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  },

  markChatAsRead: async (chatId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('chat_participants')
        .update({ unread_count: 0 })
        .eq('chat_id', chatId)
        .eq('user_id', user.id);

      await supabase
        .from('messages')
        .update({ read: true })
        .eq('chat_id', chatId);

      set(state => ({
        chats: state.chats.map(chat =>
          chat.id === chatId
            ? { ...chat, unreadCount: 0 }
            : chat
        ),
        messages: state.messages.map(message => ({ ...message, read: true }))
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  },
}));
