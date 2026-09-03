import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { useLogin } from '@/features/auth/hooks/useLogin';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/login.schema';
import { Button, Input } from '@/shared/components/ui';
import { useAppTheme } from '@/providers/ThemeProvider';

export function LoginForm() {
  const { theme } = useAppTheme();
  const { mutate, isPending } = useLogin();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    setSubmitError(null);
    mutate(values, { onError: (err) => setSubmitError(err.message) });
  };

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <Input
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
          <Input
            label="Password"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Button label="Log in" onPress={handleSubmit(onSubmit)} loading={isPending} />
      {submitError ? <Text style={{ color: theme.colors.error }}>{submitError}</Text> : null}
    </View>
  );
}
