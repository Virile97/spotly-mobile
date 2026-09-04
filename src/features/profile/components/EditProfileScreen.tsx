import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AuthTextField } from '@/features/auth/components/AuthTextField'
import { PillSelect } from '@/features/auth/components/PillSelect'
import { maritalStatusOptions } from '@/features/auth/schemas/register.schema'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { profileApi } from '@/features/profile/api/profile.api'
import { cacheProfile } from '@/features/profile/hooks/cache-profile'
import { useDisplayedProfileImages } from '@/features/profile/hooks/useDisplayedProfileImages'
import { useMyProfile } from '@/features/profile/hooks/useProfile'
import { useUploadProfileImage } from '@/features/profile/hooks/useUploadProfileImage'
import { updateProfileSchema, type UpdateProfileFormValues } from '@/features/profile/schemas/update-profile.schema'
import { useProfileImagePreviewStore } from '@/features/profile/store/profile-image-preview.store'
import type { Profile } from '@/features/profile/types/profile.types'
import { pickProfileImage } from '@/features/profile/utils/pick-profile-image'
import { buildProfileUpdatePayload, type ProfileFormValues } from '@/features/profile/utils/profile'
import { ErrorModal } from '@/shared/components/feedback/ErrorModal'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import { DismissKeyboardView } from '@/shared/components/layout/DismissKeyboardView'
import { getErrorMessage } from '@/shared/utils/error'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const MARITAL_STATUS_OPTIONS = maritalStatusOptions.map((value) => ({
  value,
  label: value === 'SINGLE' ? 'Single' : 'Married',
}))

// Keep marital status (below the last text field) above the keyboard.
const MARITAL_STATUS_KEYBOARD_OFFSET = 140

function StripeFill() {
  return (
    <View style={styles.stripeFill}>
      {Array.from({ length: 14 }, (_, index) => (
        <View key={index} style={[styles.stripe, { left: index * 18 - 40 }]} />
      ))}
    </View>
  )
}

function toFormValues(profile: Profile, maritalStatus: ProfileFormValues['maritalStatus']): ProfileFormValues {
  return {
    username: profile.username ?? '',
    firstName: profile.firstName,
    middleName: profile.middleName ?? '',
    lastName: profile.lastName,
    bio: profile.bio ?? '',
    address: '',
    maritalStatus,
  }
}

export function EditProfileScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const { data: profile, isLoading, isError, error, refetch } = useMyProfile()
  const avatarUpload = useUploadProfileImage()
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const setImagePreview = useProfileImagePreviewStore((state) => state.setImage)
  const clearImagePreview = useProfileImagePreviewStore((state) => state.clearImage)
  const { avatarUrl: avatarUri } = useDisplayedProfileImages(profile)
  const initialValues = useMemo(
    () => (profile ? toFormValues(profile, user?.maritalStatus || undefined) : null),
    [profile, user?.maritalStatus]
  )

  const { control, handleSubmit, reset, setError } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: '',
      firstName: '',
      middleName: '',
      lastName: '',
      bio: '',
      address: '',
    },
  })

  const hydrated = useRef(false)

  useEffect(() => {
    if (!initialValues || hydrated.current) return
    reset(initialValues)
    hydrated.current = true
  }, [initialValues, reset])

  const onChangePhoto = async () => {
    const picked = await pickProfileImage('avatar')
    if (!picked) return

    setImagePreview('avatar', picked.uri)
    setImageError(null)

    try {
      await avatarUpload.mutateAsync({
        type: 'avatar',
        fileUri: picked.uri,
        contentType: picked.contentType,
      })
    } catch (err) {
      clearImagePreview('avatar')
      setImageError(getErrorMessage(err))
    }
  }

  const onSave = async (values: UpdateProfileFormValues) => {
    if (!initialValues) return

    if (initialValues.username && !values.username.trim()) {
      setError('username', { message: 'Use 3–30 letters, numbers, or underscores' })
      return
    }

    const payload = buildProfileUpdatePayload(initialValues, values)
    if (!payload) {
      router.back()
      return
    }

    setSubmitError(null)
    setIsSaving(true)

    try {
      cacheProfile(queryClient, await profileApi.updateMe(payload))
      router.back()
    } catch (err) {
      setSubmitError(getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <LoadingState />
  if (isError || !profile) return <ErrorState onRetry={() => refetch()} message={getErrorMessage(error)} />

  const isUploadingAvatar = avatarUpload.isPending

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          style={styles.headerSide}
          onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={palette.white} />
        </Pressable>
        <Text style={styles.title}>Update profile</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save profile"
          hitSlop={8}
          disabled={isSaving || isUploadingAvatar}
          style={styles.headerSide}
          onPress={handleSubmit(onSave)}>
          <Text style={[styles.saveLabel, isSaving && styles.saveDisabled]}>{isSaving ? 'Saving…' : 'Save'}</Text>
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        style={styles.flex}
        bottomOffset={MARITAL_STATUS_KEYBOARD_OFFSET}
        extraKeyboardSpace={MARITAL_STATUS_KEYBOARD_OFFSET}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
        <DismissKeyboardView>
        <View style={styles.photoBlock}>
          <View style={styles.avatarWrap}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
              disabled={isUploadingAvatar}
              onPress={() => void onChangePhoto()}
              style={styles.avatar}>
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  recyclingKey={avatarUri}
                />
              ) : (
                <StripeFill />
              )}
              {isUploadingAvatar ? (
                <View style={styles.imageOverlay}>
                  <ActivityIndicator color={palette.white} size="small" />
                </View>
              ) : null}
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
              disabled={isUploadingAvatar}
              onPress={() => void onChangePhoto()}
              style={styles.cameraBadge}>
              <Ionicons name="camera" size={14} color={palette.white} />
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change photo"
            disabled={isUploadingAvatar}
            onPress={() => void onChangePhoto()}>
            <Text style={styles.changePhoto}>Change photo</Text>
          </Pressable>
        </View>

        <View style={styles.fields}>
          <Controller
            control={control}
            name="username"
            render={({ field, fieldState }) => (
              <AuthTextField
                label="Username"
                autoCapitalize="none"
                autoCorrect={false}
                value={field.value ? `@${field.value}` : field.value}
                onChangeText={(text) => field.onChange(text.replace(/^@/, ''))}
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
            render={({ field, fieldState }) => (
              <AuthTextField
                label="Middle name"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              />
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
            name="bio"
            render={({ field, fieldState }) => (
              <AuthTextField
                label="Bio"
                multiline
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="maritalStatus"
            render={({ field, fieldState }) => (
              <PillSelect
                label="Marital status"
                options={MARITAL_STATUS_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </View>
        </DismissKeyboardView>
      </KeyboardAwareScrollView>

      <ErrorModal visible={submitError != null} message={submitError ?? undefined} onClose={() => setSubmitError(null)} />
      <ErrorModal visible={imageError != null} message={imageError ?? undefined} onClose={() => setImageError(null)} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerSide: {
    width: 72,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    color: palette.white,
    fontSize: fontSize.lg,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: fontFamily.headlineSemiBold,
  },
  saveLabel: {
    color: palette.pink500,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
    textAlign: 'right',
  },
  saveDisabled: {
    opacity: 0.5,
  },
  content: {
    paddingHorizontal: spacing.md,
  },
  photoBlock: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  avatarWrap: {
    width: 120,
    height: 120,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#1C1B1F',
  },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.pink500,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  changePhoto: {
    color: palette.pink500,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  fields: {
    gap: spacing.md,
  },
  stripeFill: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#1C1B1F',
    overflow: 'hidden',
  },
  stripe: {
    position: 'absolute',
    top: -40,
    width: 10,
    height: 360,
    backgroundColor: 'rgba(255,255,255,0.04)',
    transform: [{ rotate: '45deg' }],
  },
})
