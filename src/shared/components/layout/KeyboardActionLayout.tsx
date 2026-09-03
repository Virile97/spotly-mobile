import type { ReactNode } from 'react'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'

import { useKeyboardActionLayout, type KeyboardActionLayoutOptions } from '@/shared/hooks/useKeyboardActionLayout'
import { spacing } from '@/theme/spacing'

import { DismissKeyboardView } from './DismissKeyboardView'

interface KeyboardActionLayoutProps extends KeyboardActionLayoutOptions {
  /** Vertically centered content, typically a hero plus the form fields. */
  children: ReactNode
  /** Primary action, pinned to the bottom and always kept clear of the keyboard. */
  action: ReactNode
  /** Rendered under the action; may sit behind the keyboard when it is open. */
  secondaryAction?: ReactNode
  style?: StyleProp<ViewStyle>
  /** Applied to the wrapper holding `children`, e.g. to set a `gap`. */
  contentContainerStyle?: StyleProp<ViewStyle>
  actionBarStyle?: StyleProp<ViewStyle>
}

/**
 * Form layout with centered content and a bottom-pinned action.
 *
 * At rest the action sits at the bottom of the screen and the content is
 * centered above it. When the keyboard opens, the content rises just enough to
 * stay uncovered and the action follows a fixed `gap` below it. Tapping outside
 * the action dismisses the keyboard.
 */
export function KeyboardActionLayout({
  children,
  action,
  secondaryAction,
  style,
  contentContainerStyle,
  actionBarStyle,
  gap,
  clearance,
}: KeyboardActionLayoutProps) {
  const {
    contentRef,
    actionBarRef,
    onContentLayout,
    onActionBarLayout,
    onActionLayout,
    contentStyle,
    actionBarStyle: keyboardActionBarStyle,
  } = useKeyboardActionLayout({ gap, clearance })

  return (
    <View style={[styles.root, style]}>
      <DismissKeyboardView style={styles.fill}>
        <Animated.View style={[styles.centered, contentStyle]}>
          <View ref={contentRef} style={contentContainerStyle} onLayout={onContentLayout}>
            {children}
          </View>
        </Animated.View>
      </DismissKeyboardView>

      <Animated.View
        ref={actionBarRef}
        style={[styles.actionBar, actionBarStyle, keyboardActionBarStyle]}
        onLayout={onActionBarLayout}>
        <View onLayout={onActionLayout}>{action}</View>
        {secondaryAction}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
  actionBar: {
    paddingBottom: spacing.lg,
  },
})
