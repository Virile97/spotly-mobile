import { AntDesign, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { SocialButton } from '@/features/auth/components/SocialButton'
import { OnboardingButton } from '@/features/onboarding/components/OnboardingButton'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

export function WelcomeScreen() {
  const router = useRouter()

  const continueWithGoogle = () => {
    // TODO: wire up Google OAuth
  }

  const continueWithApple = () => {
    // TODO: wire up Apple OAuth
  }

  const continueWithEmail = () => {
    router.push('/(auth)/login')
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        <Text style={styles.brand}>SPOTLY</Text>

        <View style={styles.hero}>
          <Text style={styles.title}>Find what&apos;s worth the trip.</Text>
          <Text style={styles.description}>Join people mapping the places they actually love.</Text>
        </View>

        <View style={styles.actions}>
          <SocialButton
            label="Continue with Google"
            variant="solid"
            icon={<AntDesign name="google" size={18} color={palette.gray900} />}
            onPress={continueWithGoogle}
          />
          <SocialButton
            label="Continue with Apple"
            variant="outline"
            icon={<Ionicons name="logo-apple" size={20} color={palette.white} />}
            onPress={continueWithApple}
          />
          <SocialButton label="Continue with Email" variant="outline" onPress={continueWithEmail} />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.authRow}>
            <OnboardingButton
              label="Log in"
              variant="outline"
              style={styles.authButton}
              onPress={() => router.push('/(auth)/login')}
            />
            <OnboardingButton
              label="Create account"
              variant="filled"
              style={[styles.authButton, styles.createAccountButton]}
              onPress={() => router.push('/(auth)/register')}
            />
          </View>

          <Text style={styles.terms}>By continuing you agree to the Terms and Privacy Policy.</Text>
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  brand: {
    color: palette.pink500,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
    letterSpacing: 4,
  },
  hero: {
    marginTop: spacing.xxl,
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
  actions: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  authRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  authButton: {
    flex: 1,
  },
  createAccountButton: {
    backgroundColor: 'rgba(214,73,157,0.2)',
  },
  terms: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
})
