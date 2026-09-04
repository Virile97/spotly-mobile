import { Ionicons } from '@expo/vector-icons'
import { useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { ReactionPicker, type ReactionAnchor } from '@/features/reactions/components/ReactionPicker'
import type { ReactionSelection } from '@/features/reactions/types/reaction.types'
import { formatCompactNumber } from '@/shared/utils/number'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface PostActionsProps {
  reactionCount: number
  commentCount: number
  selectedEmoji: string | null
  onReactionPress: () => void
  onReactionSelect: (selection: ReactionSelection) => void
  onCommentPress: () => void
  onSharePress?: () => void
  onSavePress?: () => void
}

export function PostActions({
  reactionCount,
  commentCount,
  selectedEmoji,
  onReactionPress,
  onReactionSelect,
  onCommentPress,
  onSharePress,
  onSavePress,
}: PostActionsProps) {
  const reactionRef = useRef<View>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [anchor, setAnchor] = useState<ReactionAnchor | null>(null)

  const handleSave = () => {
    setIsSaved((prev) => !prev)
    onSavePress?.()
  }

  const handleReactionLongPress = () => {
    reactionRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height })
      setIsPickerOpen(true)
    })
  }

  return (
    <View style={styles.row}>
      <Pressable
        ref={reactionRef}
        accessibilityRole="button"
        accessibilityLabel="React"
        accessibilityHint="Long press to choose a reaction"
        style={styles.action}
        delayLongPress={250}
        onPress={onReactionPress}
        onLongPress={handleReactionLongPress}>
        {selectedEmoji ? (
          <Text style={styles.selectedEmoji}>{selectedEmoji}</Text>
        ) : (
          <Ionicons name="heart-outline" size={22} color={palette.white} />
        )}
        <Text style={styles.count}>{formatCompactNumber(reactionCount)}</Text>
      </Pressable>

      <Pressable accessibilityRole="button" style={styles.action} onPress={onCommentPress}>
        <Ionicons name="chatbubble-outline" size={20} color={palette.white} />
        <Text style={styles.count}>{formatCompactNumber(commentCount)}</Text>
      </Pressable>

      <Pressable accessibilityRole="button" style={styles.action} onPress={onSharePress}>
        <Ionicons name="paper-plane-outline" size={20} color={palette.white} />
      </Pressable>

      <View style={styles.spacer} />

      <Pressable accessibilityRole="button" onPress={handleSave}>
        <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={20} color={palette.white} />
      </Pressable>

      <ReactionPicker
        visible={isPickerOpen}
        anchor={anchor}
        selectedEmoji={selectedEmoji}
        onSelect={onReactionSelect}
        onClose={() => setIsPickerOpen(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectedEmoji: {
    fontSize: 20,
    lineHeight: 24,
  },
  count: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
  },
  spacer: {
    flex: 1,
  },
})
