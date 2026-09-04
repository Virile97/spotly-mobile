import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { mockPosts } from "@/features/feed/data/mock-posts";
import { useScrollCollapse } from "@/providers/ScrollCollapseProvider";
import { getTabBarOverlayHeight } from "@/shared/constants/tab-bar";
import { spacing } from "@/theme/spacing";
import { FeedItem } from "./FeedItem";
import { MomentsRow } from "./MomentsRow";

interface FeedListProps {
  topInset?: number;
}

export function FeedList({ topInset = 0 }: FeedListProps) {
  const insets = useSafeAreaInsets();
  const { onScroll } = useScrollCollapse();

  return (
    <Animated.FlatList
      data={mockPosts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedItem post={item} />}
      ListHeaderComponent={MomentsRow}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={{
        paddingTop: topInset,
        paddingBottom: getTabBarOverlayHeight(insets.bottom) + spacing.md
      }}
      onScroll={onScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    height: spacing.xs,
    backgroundColor: "rgba(255,255,255,0.05)"
  }
});
