import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from "react-native";

import { palette } from "@/theme/colors";
import { fontFamily } from "@/theme/fonts";
import { radius, spacing } from "@/theme/spacing";
import { fontSize } from "@/theme/typography";

interface OnboardingButtonProps extends Omit<
  PressableProps,
  "children" | "style"
> {
  label: string;
  variant?: "filled" | "outline";
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
}

export function OnboardingButton({
  label,
  variant = "filled",
  style,
  loading = false,
  disabled,
  ...rest
}: OnboardingButtonProps) {
  const isFilled = variant === "filled";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={[styles.base, isFilled ? styles.filled : styles.outline, style]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.white} />
      ) : (
        <Text
          style={[
            styles.label,
            isFilled ? styles.labelFilled : styles.labelOutline
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Platform.select({ android: radius.md, default: radius.lg }),
    paddingVertical: Platform.select({
      android: spacing.sm + spacing.xs,
      default: spacing.md
    }),
    paddingHorizontal: Platform.select({
      android: spacing.md,
      default: spacing.lg
    })
  },
  filled: {
    flex: 1,
    backgroundColor: palette.pink500
  },
  outline: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)"
  },
  label: {
    fontSize: Platform.select({ android: 13, default: fontSize.md }),
    lineHeight: Platform.select({ android: 16, default: 20 }),
    fontFamily: fontFamily.bodySemiBold,
    includeFontPadding: false
  },
  labelFilled: {
    color: palette.white
  },
  labelOutline: {
    color: palette.white
  }
});
