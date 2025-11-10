import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { Chat } from '@/types';
import { supabase } from '@/lib/supabase';

interface ChatItemProps {
  chat: Chat;
  currentUserId: string;
  onPress: (chatId: string) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, currentUserId, onPress }) => {
  const [otherUser, setOtherUser] = useState<any>(null);

  useEffect(() => {
    const fetchOtherUser = async () => {
      const otherUserId = chat.participants.find(id => id !== currentUserId);
      if (!otherUserId) return;

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', otherUserId)
        .maybeSingle();

      if (data) {
        setOtherUser({
          id: data.id,
          username: data.username,
          photoURL: data.photo_url,
        });
      }
    };

    fetchOtherUser();
  }, [chat.participants, currentUserId]);

  if (!otherUser) return null;

  const timeAgo = getTimeAgo(chat.lastMessageTime);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(chat.id)}
    >
      <Image source={{ uri: otherUser.photoURL }} style={styles.avatar} />
      {chat.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{chat.unreadCount}</Text>
        </View>
      )}
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.username}>{otherUser.username}</Text>
          <Text style={styles.timeText}>{timeAgo}</Text>
        </View>
        <Text
          style={[styles.messageText, chat.unreadCount > 0 && styles.unreadMessage]}
          numberOfLines={1}
        >
          {chat.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Helper function to format time ago
const getTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'mo';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm';

  return Math.floor(seconds) + 's';
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  unreadBadge: {
    position: 'absolute',
    left: 50,
    top: 12,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  unreadText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.black,
  },
  timeText: {
    fontSize: 12,
    color: colors.gray,
  },
  messageText: {
    fontSize: 14,
    color: colors.gray,
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: colors.black,
  },
});

export default ChatItem;