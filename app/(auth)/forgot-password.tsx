import { zodResolver } from '@hookform/resolvers/zod'
import { Ionicons } from '@expo/vector-icons'
import { useMutation } from '@tanstack/react-query'
import { Link, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Controller, useForm } from 'react-hook-form'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { z } from 'zod'

import { ApiError } from '@/core/api/api-error'
import { authApi } from '@/features/auth/api/auth.api'
import { AuthTextField } from '@/features/auth/components/AuthTextField'
import { FormError } from '@/features/auth/components/FormError'
import { OnboardingButton } from '@/features/onboarding/components/OnboardingButton'
import { KeyboardActionLayout } from '@/shared/components/layout/KeyboardActionLayout'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordScreen() {
  const router = useRouter()

  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: (values: ForgotPasswordFormValues) => authApi.requestPasswordReset(values.email),
  })

  const onSubmit = (values: ForgotPasswordFormValues) => mutate(values)

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        <Pressable accessibilityRole="button" style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={Platform.select({ android: 18, default: 22 })} color={palette.white} />
        </Pressable>

        <KeyboardActionLayout
          contentContainerStyle={styles.fields}
          action={
            <OnboardingButton
              label="Send reset link"
              variant="filled"
              style={styles.submitButton}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
              loading={isPending}
            />
          }
          secondaryAction={
            <View style={styles.footer}>
              <Text style={styles.footerText}>Remembered it? </Text>
              <Link href="/(auth)/login" style={styles.footerLink}>
                Log in
              </Link>
            </View>
          }>
          <View style={styles.hero}>
            <Text style={styles.title}>Forgot your password?</Text>
            <Text style={styles.description}>Enter the email on your account and we&apos;ll send a reset link.</Text>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <AuthTextField
                label="Enter your email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          {isSuccess ? <Text style={styles.successText}>Check your email for a reset link.</Text> : null}
          {error ? (
            <FormError message={error.message} issues={error instanceof ApiError ? error.issues : undefined} />
          ) : null}
        </KeyboardActionLayout>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backButton: {
    width: Platform.select({ android: 32, default: 40 }),
    height: Platform.select({ android: 32, default: 40 }),
    borderRadius: Platform.select({ android: 16, default: 20 }),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: spacing.md,
  },
  fields: {
    gap: spacing.md,
  },
  hero: {
    marginBottom: spacing.sm,
  },
  title: {
    color: palette.white,
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.headline,
    lineHeight: 40,
    marginBottom: spacing.sm,
  },
  description: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: fontSize.md,
    fontFamily: fontFamily.body,
    lineHeight: 22,
  },
  successText: {
    color: palette.green500,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  submitButton: {
    flex: 0,
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  footerText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  footerLink: {
    color: palette.pink500,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
})
