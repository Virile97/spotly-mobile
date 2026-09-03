import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, Text, View } from 'react-native'

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
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const GENDER_LABELS: Record<(typeof genderOptions)[number], string> = {
  MALE: 'Male',
  FEMALE: 'Female',
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

const INFO_STEP_FIELDS = [
  'firstName',
  'middleName',
  'lastName',
  'email',
  'contactNo',
  'birthdate',
  'gender',
  'maritalStatus',
  'address',
] as const satisfies readonly (keyof RegisterFormValues)[]

interface RegisterFormProps {
  onRegistered: () => void
}

export function RegisterForm({ onRegistered }: RegisterFormProps) {
  const { mutate, isPending } = useRegister()
  const [submitError, setSubmitError] = useState<ApiError | Error | null>(null)
  const [step, setStep] = useState<1 | 2>(1)

  const { control, handleSubmit, trigger } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      middleName: '',
      lastName: '',
      birthdate: '',
      contactNo: '',
      address: '',
    },
  })

  const goToPassword = async () => {
    const isStepValid = await trigger(INFO_STEP_FIELDS)
    if (isStepValid) setStep(2)
  }

  const onSubmit = (values: RegisterFormValues) => {
    setSubmitError(null)
    const { confirmPassword: _confirmPassword, ...rest } = values
    const payload = {
      ...rest,
      middleName: values.middleName || undefined,
      contactNo: values.contactNo || undefined,
      address: values.address || undefined,
    }
    mutate(payload, { onError: (err) => setSubmitError(err), onSuccess: onRegistered })
  }

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <View style={[styles.progressStep, styles.progressStepActive]} />
        <View style={[styles.progressStep, step === 2 && styles.progressStepActive]} />
      </View>
      <Text style={styles.stepLabel}>
        {step === 1 ? 'Step 1 of 2 — Your info' : 'Step 2 of 2 — Set a password'}
      </Text>

      {step === 1 ? (
        <View style={styles.fields}>
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

          <OnboardingButton label="Continue" variant="filled" style={styles.submitButton} onPress={goToPassword} />
        </View>
      ) : (
        <View style={styles.fields}>
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
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <AuthTextField
                label="Confirm password"
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
            loading={isPending}
          />
          <OnboardingButton
            label="Back"
            variant="outline"
            style={styles.submitButton}
            onPress={() => setStep(1)}
            disabled={isPending}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  progress: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  progressStep: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  progressStepActive: {
    backgroundColor: palette.pink500,
  },
  stepLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
  },
  fields: {
    gap: spacing.md,
  },
  submitButton: {
    flex: 0,
    width: '100%',
  },
})
