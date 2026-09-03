import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { useRegister } from '@/features/auth/hooks/useRegister';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas/register.schema';
import { Button, Input } from '@/shared/components/ui';
import { useAppTheme } from '@/providers/ThemeProvider';

export function RegisterForm() {
  const { theme } = useAppTheme();
  const { mutate, isPending } = useRegister();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', username: '', password: '' },
  });

  const onSubmit = (values: RegisterFormValues) => {
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
        name="username"
        render={({ field, fieldState }) => (
          <Input
            label="Username"
            autoCapitalize="none"
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
      <Button label="Create account" onPress={handleSubmit(onSubmit)} loading={isPending} />
      {submitError ? <Text style={{ color: theme.colors.error }}>{submitError}</Text> : null}
    </View>
  );
}
