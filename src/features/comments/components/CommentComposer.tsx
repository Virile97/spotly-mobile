import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import { useAuthStore } from '@/features/auth/store/auth.store'
import type { Comment } from '@/features/comments/types/comment.types'
import { Avatar } from '@/shared/components/ui'
import { LIMITS } from '@/shared/constants/limits'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface CommentComposerProps {
  replyingTo: Comment | null
  onCancelReply: () => void
  onSubmit: (body: string) => void
}

export function CommentComposer({ replyingTo, onCancelReply, onSubmit }: CommentComposerProps) {
  const user = useAuthStore((state) => state.user)
  const inputRef = useRef<TextInput>(null)
  const [body, setBody] = useState('')

  const trimmed = body.trim()
  const canSubmit = trimmed.length > 0

  useEffect(() => {
    if (replyingTo) {
      inputRef.current?.focus()
    }
  }, [replyingTo])

  const handleSubmit = () => {
    if (!canSubmit) return

    onSubmit(trimmed)
    setBody('')
  }

  return (
    <View>
      {replyingTo ? (
        <View style={styles.replyBanner}>
          <Text style={styles.replyBannerText}>Replying to {replyingTo.authorUsername}</Text>
          <Pressable accessibilityRole="button" hitSlop={6} onPress={onCancelReply}>
            <Text style={styles.replyBannerCancel}>Cancel</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.row}>
        <Avatar
          uri={user?.avatarUrl}
          fallback={user?.displayName ?? 'You'}
          size={28}
          backgroundColor="rgba(255,255,255,0.12)"
          color="rgba(255,255,255,0.8)"
        />

        <View style={styles.field}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={body}
            onChangeText={setBody}
            placeholder="Add a comment..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            maxLength={LIMITS.COMMENT_MAX_LENGTH}
            multiline
            returnKeyType="send"
            submitBehavior="submit"
            onSubmitEditing={handleSubmit}
          />

          {canSubmit ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Post comment"
              hitSlop={6}
              onPress={handleSubmit}>
              <Ionicons name="arrow-up-circle" size={26} color={palette.pink500} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  replyBannerText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
  },
  replyBannerCancel: {
    color: palette.pink500,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bodySemiBold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.07)',
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
  },
  input: {
    flex: 1,
    maxHeight: 96,
    paddingVertical: spacing.sm,
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    textAlignVertical: 'center',
  },
})
