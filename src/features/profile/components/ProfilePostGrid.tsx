import { Image } from 'expo-image';
import { Dimensions, FlatList, StyleSheet } from 'react-native';

import type { Post } from '@/features/posts/types/post.types';

const { width } = Dimensions.get('window');
const TILE_SIZE = width / 3;

export function ProfilePostGrid({ posts }: { posts: Post[] }) {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      numColumns={3}
      renderItem={({ item }) =>
        item.mediaUrls[0] ? (
          <Image source={{ uri: item.mediaUrls[0] }} style={styles.tile} contentFit="cover" />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
});
