import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'
import { Button, Input } from '@/shared/components/ui'
import { LIMITS } from '@/shared/constants/limits'
import { useCreateComment } from '@/features/comments/hooks/useCreateComment'

export function CommentInput({ postId }: { postId: string }) {
  const { theme } = useAppTheme()
  const [body, setBody] = useState('')
  const { mutate, isPending } = useCreateComment(postId)

  const onSubmit = () => {
    if (!body.trim()) return
    mutate({ postId, body }, { onSuccess: () => setBody('') })
  }

  return (
    <View style={[styles.row, { gap: theme.spacing.sm }]}>
      <View style={{ flex: 1 }}>
        <Input
          placeholder="Add a comment…"
          value={body}
          onChangeText={setBody}
          maxLength={LIMITS.COMMENT_MAX_LENGTH}
        />
      </View>
      <Button label="Send" onPress={onSubmit} loading={isPending} disabled={!body.trim()} />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
