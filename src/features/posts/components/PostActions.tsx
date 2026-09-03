import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'
import { formatCompactNumber } from '@/shared/utils/number'

interface PostActionsProps {
  reactionCount: number
  commentCount: number
  onReactionPress: () => void
  onCommentPress: () => void
}

export function PostActions({ reactionCount, commentCount, onReactionPress, onCommentPress }: PostActionsProps) {
  const { theme } = useAppTheme()

  return (
    <View style={[styles.row, { marginTop: theme.spacing.sm }]}>
      <TouchableOpacity style={styles.action} onPress={onReactionPress}>
        <Text style={{ color: theme.colors.text }}>{formatCompactNumber(reactionCount)} reactions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.action} onPress={onCommentPress}>
        <Text style={{ color: theme.colors.text }}>{formatCompactNumber(commentCount)} comments</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  action: {
    paddingVertical: 4,
  },
})
