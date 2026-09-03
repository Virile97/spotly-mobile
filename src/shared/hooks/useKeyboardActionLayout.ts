import { useRef, useState } from "react";
import {
  useWindowDimensions,
  type LayoutChangeEvent,
  type View
} from "react-native";
import {
  useKeyboardHandler,
  useReanimatedKeyboardAnimation
} from "react-native-keyboard-controller";
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue
} from "react-native-reanimated";

import { spacing } from "@/theme/spacing";

export interface KeyboardActionLayoutOptions {
  gap?: number;
  clearance?: number;
}

export function useKeyboardActionLayout({
  gap = spacing.lg,
  clearance = spacing.sm
}: KeyboardActionLayoutOptions = {}) {
  const { height: screenHeight } = useWindowDimensions();
  const { progress: keyboardProgress } = useReanimatedKeyboardAnimation();

  const contentRef = useRef<View>(null);
  const actionBarRef = useRef<View>(null);

  const [contentBottomAtRest, setContentBottomAtRest] = useState(0);
  const [actionBarRestingY, setActionBarRestingY] = useState(0);
  const [actionHeight, setActionHeight] = useState(0);

  const keyboardHeight = useSharedValue(0);

  useKeyboardHandler(
    {
      onStart: (event) => {
        "worklet";

        if (event.height > 0) {
          keyboardHeight.value = event.height;
        }
      }
    },
    []
  );

  const isAtRest = () => keyboardProgress.value === 0;

  const onContentLayout = () => {
    if (!isAtRest()) return;

    contentRef.current?.measureInWindow((_x, y, _width, height) => {
      setContentBottomAtRest(y + height);
    });
  };

  const onActionBarLayout = () => {
    if (!isAtRest()) return;

    actionBarRef.current?.measureInWindow((_x, y) => {
      setActionBarRestingY(y);
    });
  };

  const onActionLayout = (event: LayoutChangeEvent) => {
    setActionHeight(event.nativeEvent.layout.height);
  };

  const hasMetrics =
    contentBottomAtRest > 0 && actionBarRestingY > 0 && actionHeight > 0;

  const shift = useDerivedValue(() => {
    if (!hasMetrics || keyboardHeight.value <= 0) {
      return { content: 0, action: 0 };
    }

    const keyboardTopEdge = screenHeight - keyboardHeight.value;

    const safeZoneTop = keyboardTopEdge - actionHeight - gap - clearance;

    const content = Math.min(0, safeZoneTop - contentBottomAtRest);
    const action = Math.min(
      0,
      contentBottomAtRest + content + gap - actionBarRestingY
    );

    return { content, action };
  });

  const contentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          keyboardProgress.value,
          [0, 1],
          [0, shift.value.content],
          Extrapolation.CLAMP
        )
      }
    ]
  }));

  const actionBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          keyboardProgress.value,
          [0, 1],
          [0, shift.value.action],
          Extrapolation.CLAMP
        )
      }
    ]
  }));

  return {
    contentRef,
    actionBarRef,
    onContentLayout,
    onActionBarLayout,
    onActionLayout,
    contentStyle,
    actionBarStyle
  };
}
