import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useScrollCollapse } from "@/providers/ScrollCollapseProvider";
import { TAB_BAR } from "@/shared/constants/tab-bar";
import { palette } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

type FloatingTabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>["tabBar"]>
>[0];

const ACTIVE_COLOR = palette.white;
const INACTIVE_COLOR = "rgba(255,255,255,0.4)";
const COLLAPSED_SCALE = 0.88;

export function FloatingTabBar({
  state,
  descriptors,
  navigation
}: FloatingTabBarProps) {
  const insets = useSafeAreaInsets();
  const { collapsed } = useScrollCollapse();
  const currentRoute = state.routes[state.index]?.name;
  const bottomGap = Math.max(insets.bottom, TAB_BAR.MIN_BOTTOM_GAP);

  const barStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          collapsed.value,
          [0, 1],
          [1, COLLAPSED_SCALE],
          Extrapolation.CLAMP
        )
      }
    ]
  }));

  if (currentRoute === "create") {
    return null;
  }

  const items = (
    <>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        if (StyleSheet.flatten(options.tabBarItemStyle)?.display === "none") {
          return null;
        }

        const isFocused = state.index === index;
        const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={
              options.tabBarAccessibilityLabel ?? options.title
            }
            android_ripple={{
              color: "rgba(255,255,255,0.16)",
              foreground: true,
            }}
            style={styles.item}
            onPress={onPress}
            onLongPress={() =>
              navigation.emit({ type: "tabLongPress", target: route.key })
            }
          >
            <View style={[styles.iconSlot, isFocused && styles.iconSlotActive]}>
              {options.tabBarIcon?.({ focused: isFocused, color, size: 22 })}
            </View>
          </Pressable>
        );
      })}
    </>
  );

  return (
    <Animated.View style={[styles.bar, { bottom: bottomGap }, barStyle]}>
      <BlurView
        intensity={40}
        tint="dark"
        blurMethod="dimezisBlurViewSdk31Plus"
        style={styles.blur}
      >
        {items}
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: TAB_BAR.SIDE_INSET,
    right: TAB_BAR.SIDE_INSET,
    height: TAB_BAR.PILL_HEIGHT,
    borderRadius: TAB_BAR.PILL_HEIGHT / 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden"
  },
  blur: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: "rgba(10,9,11,0.35)"
  },
  item: {
    width: 52,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    overflow: "hidden"
  },
  iconSlot: {
    width: 52,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    overflow: "hidden"
  },
  iconSlotActive: {
    backgroundColor: "rgba(255,255,255,0.12)"
  }
});
