import { colors } from '@/constants/colors';
import { useVideoStore } from '@/store/videoStore';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Search, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const categories = [
  'For You', 'Trending', 'Comedy', 'Dance', 'Sports', 'Food', 'Beauty', 'Animals', 'DIY'
];

export default function DiscoverScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('For You');
  const { videos, fetchVideos } = useVideoStore();

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleVideoPress = (videoId: string) => {
    router.push(`/video/${videoId}`);
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
      <Text style={styles.videoDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.videoMeta}>
        <Image
          source={{ uri: item.userPhotoURL }}
          style={styles.userAvatar}
        />
        <Text style={styles.username}>@{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search videos, users, or hashtags"
          placeholderTextColor={colors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryItem,
              activeCategory === category && styles.activeCategoryItem
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === category && styles.activeCategoryText
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {activeCategory === 'Trending' && (
        <View style={styles.trendingHeader}>
          <TrendingUp size={20} color={colors.primary} />
          <Text style={styles.trendingText}>Trending Now</Text>
        </View>
      )}

      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.videoGrid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.black,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesContent: {
    paddingHorizontal: 8,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
  },
  activeCategoryItem: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    color: colors.black,
    fontWeight: '500',
    lineHeight: 20,
  },
  activeCategoryText: {
    color: colors.white,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  trendingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginLeft: 8,
  },
  videoGrid: {
    padding: 8,
  },
  videoItem: {
    flex: 1,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  videoDescription: {
    fontSize: 14,
    color: colors.black,
    padding: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingTop: 0,
  },
  userAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  username: {
    fontSize: 12,
    color: colors.gray,
  },
});