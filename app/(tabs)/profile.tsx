import ProfileHeader from '@/components/ProfileHeader';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { useVideoStore } from '@/store/videoStore';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Bookmark, Grid, Lock, LogOut } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { videos } = useVideoStore();
  const [activeTab, setActiveTab] = useState('videos');

  if (!user) return null;

  const userVideos = videos.filter(video => video.userId === user.id);

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleVideoPress = (videoId: string) => {
    router.push(`/video/${videoId}`);
  };

  const handleLogout = () => {
    logout();
  };

  const renderVideoItem = ({ item }: { item: typeof videos[0] }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => handleVideoPress(item.id)}
    >
      <Image
        source={{ uri: item.thumbnailURL }}
        style={styles.thumbnail}
        contentFit="cover"
      />
      <View style={styles.videoStats}>
        <Text style={styles.statsText}>{item.likes}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyContent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
        {activeTab === 'videos' ? 'No videos yet' : 'No favorites yet'}
      </Text>
      <Text style={styles.emptyText}>
        {activeTab === 'videos'
          ? 'Videos you create will appear here'
          : 'Videos you bookmark will appear here'
        }
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>{user.username}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <LogOut size={24} color={colors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <ProfileHeader
          user={user}
          isCurrentUser={true}
          onEditProfile={handleEditProfile}
        />

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
            onPress={() => setActiveTab('videos')}
          >
            <Grid
              size={20}
              color={activeTab === 'videos' ? colors.primary : colors.gray}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
            onPress={() => setActiveTab('favorites')}
          >
            <Bookmark
              size={20}
              color={activeTab === 'favorites' ? colors.primary : colors.gray}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'private' && styles.activeTab]}
            onPress={() => setActiveTab('private')}
          >
            <Lock
              size={20}
              color={activeTab === 'private' ? colors.primary : colors.gray}
            />
          </TouchableOpacity>
        </View>

        {activeTab === 'videos' && (
          userVideos.length > 0 ? (
            <FlatList
              data={userVideos}
              renderItem={renderVideoItem}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.videoGrid}
            />
          ) : renderEmptyContent()
        )}

        {activeTab === 'favorites' && renderEmptyContent()}

        {activeTab === 'private' && renderEmptyContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  videoGrid: {
    padding: 1,
  },
  videoItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 1,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  videoStats: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
});