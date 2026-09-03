import { FlatList, StyleSheet, View } from 'react-native'

import { mockPosts } from '@/features/feed/data/mock-posts'
import { FeedItem } from './FeedItem'

export function FeedList() {
  return (
    <FlatList
      data={mockPosts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedItem post={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
    />
  )
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    marginHorizontal: 16,
    borderStyle: 'dashed',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
})
