import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text, View } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'
import { useCreatePost } from '@/features/posts/hooks/useCreatePost'
import { createPostSchema, type CreatePostFormValues } from '@/features/posts/schemas/post.schema'
import { Button, Input } from '@/shared/components/ui'

export function CreatePostForm({ onSuccess }: { onSuccess?: () => void }) {
  const { theme } = useAppTheme()
  const { mutate, isPending } = useCreatePost()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { control, handleSubmit } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { caption: '', mediaUrls: [] },
  })

  const onSubmit = (values: CreatePostFormValues) => {
    setSubmitError(null)
    mutate(values, { onSuccess, onError: (err) => setSubmitError(err.message) })
  }

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Controller
        control={control}
        name="caption"
        render={({ field, fieldState }) => (
          <Input
            label="Caption"
            multiline
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Button label="Post" onPress={handleSubmit(onSubmit)} loading={isPending} />
      {submitError ? <Text style={{ color: theme.colors.error }}>{submitError}</Text> : null}
    </View>
  )
}
