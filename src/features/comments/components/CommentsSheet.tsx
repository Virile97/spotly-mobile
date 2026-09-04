import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { useState } from 'react'
import { FlatList, Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import type { Comment, CommentThread } from '@/features/comments/types/comment.types'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'
import { CommentComposer } from './CommentComposer'
import { CommentThreadItem } from './CommentThreadItem'

const SHEET_HEIGHT_RATIO = 0.66
const SHEET_BACKGROUND = '#17161A'
const CLOSE_DISTANCE = 120
const CLOSE_VELOCITY = 800
const OPEN_TIMING = { duration: 280, easing: Easing.out(Easing.cubic) }
const CLOSE_TIMING = { duration: 220, easing: Easing.in(Easing.cubic) }

interface CommentsSheetProps {
  visible: boolean
  onClose: () => void
  threads: CommentThread[]
  commentCount: number
  onSubmit: (body: string, parentId: string | null) => void
}

export function CommentsSheet({ visible, onClose, threads, commentCount, onSubmit }: CommentsSheetProps) {
  const insets = useSafeAreaInsets()
  const { height: screenHeight } = useWindowDimensions()
  const { height: keyboardHeight, progress: keyboardProgress } = useReanimatedKeyboardAnimation()
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null)
  const [composerKey, setComposerKey] = useState(0)
  const [mounted, setMounted] = useState(visible)
  const progress = useSharedValue(visible ? 1 : 0)
  const dragOffset = useSharedValue(0)
  const isVisible = useSharedValue(visible ? 1 : 0)

  const sheetHeight = screenHeight * SHEET_HEIGHT_RATIO

  if (visible && !mounted) {
    setMounted(true)
    dragOffset.value = 0
  }

  isVisible.value = visible ? 1 : 0

  useAnimatedReaction(
    () => isVisible.value,
    (current, previous) => {
      if (previous === null) {
        progress.value = current
        return
      }

      if (current === previous) return

      progress.value = withTiming(current, current === 1 ? OPEN_TIMING : CLOSE_TIMING, (finished) => {
        if (finished && current === 0) runOnJS(setMounted)(false)
      })
    }
  )

  const handleClose = () => {
    setReplyingTo(null)
    setComposerKey((current) => current + 1)
    onClose()
  }

  const handleSubmit = (body: string) => {
    onSubmit(body, replyingTo?.id ?? null)
    setReplyingTo(null)
  }

  // Drag on the handle area only, so the comment list keeps its own scrolling.
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      dragOffset.value = Math.max(0, event.translationY)
    })
    .onEnd((event) => {
      if (event.translationY > CLOSE_DISTANCE || event.velocityY > CLOSE_VELOCITY) {
        runOnJS(handleClose)()
        return
      }

      dragOffset.value = withSpring(0, { damping: 20, stiffness: 240 })
    })

  const backdropStyle = useAnimatedStyle(() => ({
    opacity:
      progress.value *
      interpolate(dragOffset.value, [0, sheetHeight], [1, 0], Extrapolation.CLAMP),
  }))

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      {
        // `keyboardHeight` is 0 when closed and negative when open, so the
        // sheet sits flush on the keyboard instead of padding above it.
        translateY:
          interpolate(progress.value, [0, 1], [sheetHeight, 0]) +
          dragOffset.value +
          keyboardHeight.value,
      },
    ],
  }))

  const footerStyle = useAnimatedStyle(() => ({
    paddingBottom: interpolate(
      keyboardProgress.value,
      [0, 1],
      [Math.max(insets.bottom, spacing.sm), 0],
      Extrapolation.CLAMP
    ),
  }))

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}>
      {/* Modal hosts a new native window, so it needs its own keyboard and
          gesture roots even though the app already wraps the main tree. */}
      <KeyboardProvider statusBarTranslucent preserveEdgeToEdge>
        <GestureHandlerRootView style={styles.root}>
          {/* Backdrop stays pinned to the screen and only fades. The sheet
              is the only layer that translates on open, close, and drag. */}
          <Animated.View style={[styles.backdrop, backdropStyle]} pointerEvents="none">
            <BlurView
              intensity={40}
              tint="dark"
              blurMethod="dimezisBlurViewSdk31Plus"
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close comments"
            style={styles.backdropHit}
            onPress={handleClose}
          />

          <View style={styles.avoider} pointerEvents="box-none">
            <Animated.View style={sheetStyle}>
              <View style={[styles.sheet, { height: sheetHeight }]}>
                <GestureDetector gesture={panGesture}>
                  <View style={styles.handleArea}>
                    <View style={styles.handle} />
                  </View>
                </GestureDetector>

                <View style={styles.header}>
                  <Text style={styles.title}>Comments • {commentCount}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Close comments"
                    hitSlop={6}
                    style={styles.closeButton}
                    onPress={handleClose}>
                    <Ionicons name="close" size={18} color={palette.white} />
                  </Pressable>
                </View>

                <FlatList
                  data={threads}
                  keyExtractor={(thread) => thread.comment.id}
                  renderItem={({ item }) => (
                    <CommentThreadItem thread={item} onReplyPress={setReplyingTo} />
                  )}
                  style={styles.list}
                  contentContainerStyle={styles.listContent}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                    <View style={styles.empty}>
                      <Text style={styles.emptyTitle}>No comments yet</Text>
                      <Text style={styles.emptyText}>Be the first to say something.</Text>
                    </View>
                  }
                />

                <Animated.View style={[styles.footer, footerStyle]}>
                  <CommentComposer
                    key={composerKey}
                    replyingTo={replyingTo}
                    onCancelReply={() => setReplyingTo(null)}
                    onSubmit={handleSubmit}
                  />
                </Animated.View>
              </View>

              {/* Fills the strip between the sheet and the keyboard with the
                  same opaque color so the blur does not show through. */}
              <View style={[styles.sheetExtension, { height: screenHeight }]} pointerEvents="none" />
            </Animated.View>
          </View>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </Modal>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  backdropHit: {
    ...StyleSheet.absoluteFill,
  },
  avoider: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '100%',
    backgroundColor: SHEET_BACKGROUND,
    borderTopLeftRadius: radius.lg + spacing.sm,
    borderTopRightRadius: radius.lg + spacing.sm,
    overflow: 'hidden',
  },
  sheetExtension: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: SHEET_BACKGROUND,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  emptyTitle: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  footer: {
    backgroundColor: SHEET_BACKGROUND,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
})
