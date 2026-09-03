import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'

import { ApiError } from '@/core/api/api-error'
import { AuthTextField } from '@/features/auth/components/AuthTextField'
import { DateField } from '@/features/auth/components/DateField'
import { DropdownField } from '@/features/auth/components/DropdownField'
import { FormError } from '@/features/auth/components/FormError'
import { PillSelect } from '@/features/auth/components/PillSelect'
import { useRegister } from '@/features/auth/hooks/useRegister'
import { genderOptions, maritalStatusOptions, registerSchema, type RegisterFormValues } from '@/features/auth/schemas/register.schema'
import { OnboardingButton } from '@/features/onboarding/components/OnboardingButton'
import { toISODateString } from '@/shared/utils/date'
import { spacing } from '@/theme/spacing'

const GENDER_LABELS: Record<(typeof genderOptions)[number], string> = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
  PREFER_NOT_TO_SAY: 'Prefer not to say',
}

const MARITAL_STATUS_LABELS: Record<(typeof maritalStatusOptions)[number], string> = {
  SINGLE: 'Single',
  MARRIED: 'Married',
}

const genderPillOptions = genderOptions.map((value) => ({ value, label: GENDER_LABELS[value] }))
const maritalStatusDropdownOptions = maritalStatusOptions.map((value) => ({
  value,
  label: MARITAL_STATUS_LABELS[value],
}))

export function RegisterForm() {
  const { mutate, isPending } = useRegister()
  const [submitError, setSubmitError] = useState<ApiError | Error | null>(null)

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
      nickname: '',
      firstName: '',
      middleName: '',
      lastName: '',
      birthdate: '',
      contactNo: '',
      address: '',
    },
  })

  const onSubmit = (values: RegisterFormValues) => {
    setSubmitError(null)
    const payload = {
      ...values,
      nickname: values.nickname || undefined,
      middleName: values.middleName || undefined,
      contactNo: values.contactNo || undefined,
      address: values.address || undefined,
    }
    mutate(payload, { onError: (err) => setSubmitError(err) })
  }

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="displayName"
        render={({ field, fieldState }) => (
          <AuthTextField
            label="Display name"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="nickname"
        render={({ field, fieldState }) => (
          <AuthTextField
            label="Nickname (optional)"
            autoCapitalize="none"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="firstName"
        render={({ field, fieldState }) => (
          <AuthTextField
            label="First name"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="middleName"
        render={({ field }) => (
          <AuthTextField label="Middle name (optional)" value={field.value} onChangeText={field.onChange} />
        )}
      />
      <Controller
        control={control}
        name="lastName"
        render={({ field, fieldState }) => (
          <AuthTextField
            label="Last name"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
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
        name="contactNo"
        render={({ field, fieldState }) => (
          <AuthTextField
            label="Contact number (optional)"
            keyboardType="phone-pad"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="birthdate"
        render={({ field, fieldState }) => (
          <DateField
            label="Birthdate"
            calendarTitle="Pick your birthdate"
            value={field.value ? new Date(field.value) : null}
            onChange={(date) => field.onChange(toISODateString(date))}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="gender"
        render={({ field, fieldState }) => (
          <PillSelect
            label="Gender"
            options={genderPillOptions}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="maritalStatus"
        render={({ field, fieldState }) => (
          <DropdownField
            label="Marital status (optional)"
            placeholder="Select marital status"
            options={maritalStatusDropdownOptions}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="address"
        render={({ field, fieldState }) => (
          <AuthTextField
            label="Address (optional)"
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

      {submitError ? (
        <FormError
          message={submitError.message}
          issues={submitError instanceof ApiError ? submitError.issues : undefined}
        />
      ) : null}

      <OnboardingButton
        label="Create account"
        variant="filled"
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  submitButton: {
    flex: 0,
    width: '100%',
  },
})
