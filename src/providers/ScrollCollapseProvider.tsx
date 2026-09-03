import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
  type SharedValue
} from "react-native-reanimated";

const DIRECTION_THRESHOLD = 6;
const TOP_THRESHOLD = 24;
const TIMING = { duration: 200 };

interface ScrollCollapseContextValue {
  collapsed: SharedValue<number>;
  onScroll: ReturnType<typeof useAnimatedScrollHandler>;
}

const ScrollCollapseContext = createContext<ScrollCollapseContextValue | null>(
  null
);

export function ScrollCollapseProvider({ children }: { children: ReactNode }) {
  const collapsed = useSharedValue(0);
  const target = useSharedValue(0);
  const lastOffset = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offset = event.contentOffset.y;
      const delta = offset - lastOffset.value;
      lastOffset.value = offset;

      let next = target.value;

      if (offset <= TOP_THRESHOLD) {
        next = 0;
      } else if (delta > DIRECTION_THRESHOLD) {
        next = 1;
      } else if (delta < -DIRECTION_THRESHOLD) {
        next = 0;
      }

      if (next !== target.value) {
        target.value = next;
        collapsed.value = withTiming(next, TIMING);
      }
    }
  });

  const value = useMemo<ScrollCollapseContextValue>(
    () => ({ collapsed, onScroll }),
    [collapsed, onScroll]
  );

  return (
    <ScrollCollapseContext.Provider value={value}>
      {children}
    </ScrollCollapseContext.Provider>
  );
}

export function useScrollCollapse(): ScrollCollapseContextValue {
  const context = useContext(ScrollCollapseContext);
  if (!context) {
    throw new Error(
      "useScrollCollapse must be used within a ScrollCollapseProvider"
    );
  }
  return context;
}
