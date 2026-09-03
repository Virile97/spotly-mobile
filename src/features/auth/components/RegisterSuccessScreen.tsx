import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface RegisterSuccessScreenProps {
  onBack: () => void
}

export function RegisterSuccessScreen({ onBack }: RegisterSuccessScreenProps) {
  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" style={styles.backButton} onPress={onBack}>
        <Ionicons name="chevron-back" size={22} color={palette.white} />
      </Pressable>

      <View style={styles.centered}>
        <View style={styles.badgeOuter}>
          <View style={styles.badgeInner}>
            <Ionicons name="checkmark" size={32} color={palette.gray900} />
          </View>
        </View>

        <Text style={styles.title}>Account created.</Text>
        <Text style={styles.description}>
          You can now log in with your email and password. Redirecting you to log in…
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  badgeOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(214,73,157,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  badgeInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.pink500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: palette.white,
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.headline,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: fontSize.md,
    fontFamily: fontFamily.body,
    lineHeight: 22,
    textAlign: 'center',
  },
})
