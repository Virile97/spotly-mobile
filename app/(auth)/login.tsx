import { zodResolver } from '@hookform/resolvers/zod'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AuthTextField } from '@/features/auth/components/AuthTextField'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/login.schema'
import { OnboardingButton } from '@/features/onboarding/components/OnboardingButton'
import { DismissKeyboardView } from '@/shared/components/layout/DismissKeyboardView'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

export default function LoginScreen() {
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
      <StatusBar style="light" />
      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        <DismissKeyboardView style={styles.flex}>
          <Pressable accessibilityRole="button" style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={palette.white} />
          </Pressable>

          <View style={styles.centered}>
            <View style={styles.hero}>
              <Text style={styles.title}>Welcome back.</Text>
              <Text style={styles.description}>Log in to keep tracking the places you love.</Text>
            </View>

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
          </View>

          <View style={styles.actions}>
            <OnboardingButton
              label="Log in"
              variant="filled"
              style={styles.submitButton}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>New to Spotly? </Text>
              <Link href="/(auth)/register" style={styles.footerLink}>
                Create account
              </Link>
            </View>
          </View>
        </DismissKeyboardView>
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
  flex: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
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
  actions: {
    paddingBottom: spacing.lg,
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
