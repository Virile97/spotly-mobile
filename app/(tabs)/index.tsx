import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FeedList } from "@/features/feed/components/FeedList";
import { useScrollCollapse } from "@/providers/ScrollCollapseProvider";
import { palette } from "@/theme/colors";
import { fontFamily } from "@/theme/fonts";
import { spacing } from "@/theme/spacing";
import { fontSize } from "@/theme/typography";

const hasUnreadNotifications = true;

export default function FeedScreen() {
  const router = useRouter();
  const { collapsed } = useScrollCollapse();
  const insets = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(0);

  const onHeaderLayout = (event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height);
  };

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(collapsed.value, [0, 1], [1, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(
          collapsed.value,
          [0, 1],
          [0, -headerHeight],
          Extrapolation.CLAMP
        )
      }
    ]
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* No top safe-area inset: the list runs under the status bar so content
          stays visible up there once the header slides away. The notch spacing
          lives inside the header instead. */}
      <FeedList topInset={headerHeight} />

      <Animated.View
        style={[
          styles.header,
          { paddingTop: insets.top + spacing.sm },
          headerStyle
        ]}
        onLayout={onHeaderLayout}
      >
        <View style={styles.headerBar}>
          <Text style={styles.brand}>Spotly</Text>

          <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search"
            style={styles.iconButton}
            onPress={() => router.push("/search" as Href)}
          >
            <Ionicons name="search-outline" size={24} color={palette.white} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={styles.iconButton}
            onPress={() => router.push("/activity" as Href)}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={palette.white}
            />
            {hasUnreadNotifications ? (
              <View style={styles.notificationDot} />
            ) : null}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Messages"
            style={styles.iconButton}
            onPress={() => router.push("/messages" as Href)}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={palette.white} />
          </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A090B"
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: "transparent"
  },
  headerBar: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  brand: {
    color: palette.white,
    fontSize: fontSize.xl,
    lineHeight: 28,
    fontFamily: fontFamily.headline,
    includeFontPadding: false,
    textAlignVertical: "center"
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.pink500,
    borderWidth: 1.5,
    borderColor: "#0A090B"
  }
});
