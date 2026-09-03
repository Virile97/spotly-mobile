import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

import { useLogout } from "@/features/auth/hooks/useLogout";
import { FeedList } from "@/features/feed/components/FeedList";
import { useScrollCollapse } from "@/providers/ScrollCollapseProvider";
import { palette } from "@/theme/colors";
import { fontFamily } from "@/theme/fonts";
import { spacing } from "@/theme/spacing";
import { fontSize } from "@/theme/typography";

const hasUnreadNotifications = true;

export default function FeedScreen() {
  const router = useRouter();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
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
        <Text style={styles.brand}>Spotly</Text>

        <View style={styles.headerActions}>
          {/* TODO: temporary logout entry point for testing; move into settings/profile menu */}
          <Pressable
            accessibilityRole="button"
            style={styles.notificationButton}
            disabled={isLoggingOut}
            onPress={() => logout()}
          >
            <Ionicons name="log-out-outline" size={20} color={palette.white} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            style={styles.notificationButton}
            onPress={() => router.push("/(tabs)/notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={palette.white}
            />
            {hasUnreadNotifications ? (
              <View style={styles.notificationDot} />
            ) : null}
          </Pressable>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: "#0A090B"
  },
  brand: {
    color: palette.white,
    fontSize: fontSize.xl,
    fontFamily: fontFamily.headline
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)"
  },
  notificationDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.pink500,
    borderWidth: 1.5,
    borderColor: "#0A090B"
  }
});
