import { Link } from 'expo-router';
import { Text } from 'react-native';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAppTheme } from '@/providers/ThemeProvider';
import { Screen } from '@/shared/components/layout/Screen';

export default function LoginScreen() {
  const { theme } = useAppTheme();

  return (
    <Screen scroll>
      <Text
        style={{
          color: theme.colors.text,
          fontSize: theme.fontSize.xxl,
          fontWeight: theme.fontWeight.bold,
          marginBottom: theme.spacing.lg,
        }}>
        Log in
      </Text>
      <LoginForm />
      <Link href="/(auth)/register" style={{ color: theme.colors.primary, marginTop: theme.spacing.md }}>
        Don&apos;t have an account? Sign up
      </Link>
      <Link href="/(auth)/forgot-password" style={{ color: theme.colors.primary, marginTop: theme.spacing.sm }}>
        Forgot password?
      </Link>
    </Screen>
  );
}
