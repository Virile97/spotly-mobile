import { Link, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { SafeAreaView } from 'react-native-safe-area-context'

import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { RegisterSuccessScreen } from '@/features/auth/components/RegisterSuccessScreen'
import { DismissKeyboardView } from '@/shared/components/layout/DismissKeyboardView'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const REDIRECT_DELAY_MS = 1500

export default function RegisterScreen() {
  const router = useRouter()
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    if (!isRegistered) return
    const timer = setTimeout(() => router.replace('/(auth)/login'), REDIRECT_DELAY_MS)
    return () => clearTimeout(timer)
  }, [isRegistered, router])

  if (isRegistered) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
          <RegisterSuccessScreen onBack={() => router.replace('/(auth)/login')} />
        </SafeAreaView>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        <KeyboardAwareScrollView
          style={styles.flex}
          bottomOffset={spacing.lg}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag">
          <DismissKeyboardView>
            <View style={styles.hero}>
              <Text style={styles.title}>Create your account.</Text>
              <Text style={styles.description}>Start mapping the places worth going back to.</Text>
            </View>

            <RegisterForm onRegistered={() => setIsRegistered(true)} />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/(auth)/login" style={styles.footerLink}>
                Log in
              </Link>
            </View>
          </DismissKeyboardView>
        </KeyboardAwareScrollView>
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
    paddingTop: spacing.lg,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  hero: {
    marginBottom: spacing.xl,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
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
