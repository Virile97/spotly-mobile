import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { palette } from '@/theme/colors';
import { fontFamily } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';
import { fontSize } from '@/theme/typography';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        <Pressable accessibilityRole="button" style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={palette.white} />
        </Pressable>

        <View style={styles.centered}>
          <View style={styles.hero}>
            <Text style={styles.title}>Welcome back.</Text>
            <Text style={styles.description}>Log in to keep tracking the places you love.</Text>
          </View>

          <LoginForm />

          <View style={styles.footer}>
            <Text style={styles.footerText}>New to Spotly? </Text>
            <Link href="/(auth)/register" style={styles.footerLink}>
              Create account
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
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
});
