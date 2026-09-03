import { useMutation } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

import { authApi } from '@/features/auth/api/auth.api';
import { useAppTheme } from '@/providers/ThemeProvider';
import { Screen } from '@/shared/components/layout/Screen';
import { Button, Input } from '@/shared/components/ui';

export default function ForgotPasswordScreen() {
  const { theme } = useAppTheme();
  const [email, setEmail] = useState('');
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: () => authApi.requestPasswordReset(email),
  });

  return (
    <Screen scroll>
      <Text
        style={{
          color: theme.colors.text,
          fontSize: theme.fontSize.xxl,
          fontWeight: theme.fontWeight.bold,
          marginBottom: theme.spacing.lg,
        }}>
        Reset password
      </Text>
      <Input label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Button
        label="Send reset link"
        onPress={() => mutate()}
        loading={isPending}
        style={{ marginTop: theme.spacing.md }}
      />
      {isSuccess ? (
        <Text style={{ color: theme.colors.success, marginTop: theme.spacing.sm }}>
          Check your email for a reset link.
        </Text>
      ) : null}
      <Link href="/(auth)/login" style={{ color: theme.colors.primary, marginTop: theme.spacing.md }}>
        Back to login
      </Link>
    </Screen>
  );
}
