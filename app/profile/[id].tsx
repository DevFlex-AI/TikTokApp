import ProfileHeader from '@/components/ProfileHeader';
import { colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { useVideoStore } from '@/store/videoStore';
import { User } from '@/types';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, Grid } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const { videos } = useVideoStore();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setUser({
            id: data.id,
            username: data.username,
            email: data.email,
            displayName: data.display_name,
            photoURL: data.photo_url,
            bio: data.bio,
            followers: data.followers,
            following: data.following,
            createdAt: new Date(data.created_at).getTime(),
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const userVideos = videos.filter(video => video.userId === id);

  const handleVideoPress = (videoId: string) => {
    router.push(`/video/${videoId}`);
  };

  const handleFollowPress = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessagePress = () => {
    // In a real app, we would create or navigate to an existing chat
    router.push('/chat/chat1');
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
          ? 'Videos will appear here'
          : 'Bookmarked videos will appear here'
        }
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isCurrentUser = currentUser?.id === user.id;

  return (
    <>
      <Stack.Screen
        options={{
          title: ' ' + user.username,
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <ScrollView>
          <ProfileHeader
            user={user}
            isCurrentUser={isCurrentUser}
            onEditProfile={() => router.push('/edit-profile')}
            onFollow={handleFollowPress}
            onMessage={handleMessagePress}
            isFollowing={isFollowing}
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
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  headerBackButton: {
    marginLeft: 10,
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