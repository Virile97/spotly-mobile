import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { AuthTextField } from '@/features/auth/components/AuthTextField'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/login.schema'
import { OnboardingButton } from '@/features/onboarding/components/OnboardingButton'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

export function LoginForm() {
  const router = useRouter()
  const { mutate, isPending } = useLogin()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (values: LoginFormValues) => {
    setSubmitError(null)
    mutate(values, { onError: (err) => setSubmitError(err.message) })
  }

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <AuthTextField
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <AuthTextField
            label="Password"
            isPassword
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Pressable
        accessibilityRole="button"
        style={styles.forgotPassword}
        onPress={() => router.push('/(auth)/forgot-password')}>
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </Pressable>

      {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

      <OnboardingButton
        label="Log in"
        variant="filled"
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: palette.pink500,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  submitError: {
    color: palette.red500,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  submitButton: {
    flex: 0,
    width: '100%',
  },
})
