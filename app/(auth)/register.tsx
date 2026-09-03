import { Link } from 'expo-router';
import { Text } from 'react-native';

import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useAppTheme } from '@/providers/ThemeProvider';
import { Screen } from '@/shared/components/layout/Screen';

export default function RegisterScreen() {
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
        Create account
      </Text>
      <RegisterForm />
      <Link href="/(auth)/login" style={{ color: theme.colors.primary, marginTop: theme.spacing.md }}>
        Already have an account? Log in
      </Link>
    </Screen>
  );
}
