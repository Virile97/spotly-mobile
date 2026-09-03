import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { formatCompactNumber } from '@/shared/utils/number'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface PostActionsProps {
  reactionCount: number
  commentCount: number
  onReactionPress: () => void
  onCommentPress: () => void
  onSharePress?: () => void
  onSavePress?: () => void
}

export function PostActions({
  reactionCount,
  commentCount,
  onReactionPress,
  onCommentPress,
  onSharePress,
  onSavePress,
}: PostActionsProps) {
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved((prev) => !prev)
    onSavePress?.()
  }

  return (
    <View style={styles.row}>
      <Pressable accessibilityRole="button" style={styles.action} onPress={onReactionPress}>
        <Ionicons name="heart-outline" size={22} color={palette.white} />
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
  count: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
  },
  spacer: {
    flex: 1,
  },
})
