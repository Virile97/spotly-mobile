import { useState } from 'react'
import { RefreshControl, StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { mockPosts } from '@/features/feed/data/mock-posts'
import { useFeed } from '@/features/feed/hooks/useFeed'
import { useScrollCollapse } from '@/providers/ScrollCollapseProvider'
import { getTabBarOverlayHeight } from '@/shared/constants/tab-bar'
import { palette } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { FeedItem } from './FeedItem'
import { MomentsRow } from './MomentsRow'

interface FeedListProps {
  topInset?: number
}

export function FeedList({ topInset = 0 }: FeedListProps) {
  const insets = useSafeAreaInsets()
  const { onScroll } = useScrollCollapse()
  const { data, refetch } = useFeed()
  const [refreshing, setRefreshing] = useState(false)
  const apiPosts = data?.pages.flatMap((page) => page.items) ?? []
  const posts = apiPosts.length > 0 ? apiPosts : mockPosts

  return (
    <Animated.FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedItem post={item} />}
      ListHeaderComponent={MomentsRow}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={{
        paddingTop: topInset,
        paddingBottom: getTabBarOverlayHeight(insets.bottom) + spacing.md,
      }}
      onScroll={onScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true)
            void refetch().finally(() => setRefreshing(false))
          }}
          tintColor={palette.white}
          colors={[palette.pink500]}
          progressBackgroundColor="#17161A"
          progressViewOffset={topInset}
        />
      }
    />
  )
}

const styles = StyleSheet.create({
  separator: {
    height: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
})
