import { spacing } from "@/theme/spacing";

export const TAB_BAR = {
  PILL_HEIGHT: 64,
  SIDE_INSET: spacing.lg,
  MIN_BOTTOM_GAP: spacing.md
} as const;

export function getTabBarOverlayHeight(bottomSafeAreaInset: number): number {
  return (
    TAB_BAR.PILL_HEIGHT + Math.max(bottomSafeAreaInset, TAB_BAR.MIN_BOTTOM_GAP)
  );
}
