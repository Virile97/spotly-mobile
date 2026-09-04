import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { InterestChip } from '@/features/profile/components/InterestChip'
import { useInterests } from '@/features/profile/hooks/useInterests'
import { useMyProfile } from '@/features/profile/hooks/useProfile'
import { useUpdateMyInterests } from '@/features/profile/hooks/useUpdateMyInterests'
import { ErrorModal } from '@/shared/components/feedback/ErrorModal'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import { LIMITS } from '@/shared/constants/limits'
import { getErrorMessage } from '@/shared/utils/error'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const MAX = LIMITS.MAX_PROFILE_INTERESTS

export function SelectInterestsScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError, error: profileError, refetch: refetchProfile } =
    useMyProfile()
  const { data: catalog, isLoading: isCatalogLoading, isError: isCatalogError, error: catalogError, refetch: refetchCatalog } =
    useInterests()
  const updateInterests = useUpdateMyInterests()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (hydrated || !profile) return
    setSelectedIds((profile.interests ?? []).map((interest) => interest.id).slice(0, MAX))
    setHydrated(true)
  }, [hydrated, profile])

  const isLoading = isProfileLoading || isCatalogLoading
  const isSaving = updateInterests.isPending
  const atMax = selectedIds.length >= MAX

  const toggle = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= MAX) return current
      return [...current, id]
    })
  }

  const onSave = async () => {
    setSubmitError(null)
    try {
      await updateInterests.mutateAsync({ interestIds: selectedIds })
      router.back()
    } catch (err) {
      setSubmitError(getErrorMessage(err))
    }
  }

  if (isLoading) return <LoadingState />
  if (isProfileError || !profile) {
    return <ErrorState onRetry={() => refetchProfile()} message={getErrorMessage(profileError)} />
  }
  if (isCatalogError || !catalog) {
    return <ErrorState onRetry={() => refetchCatalog()} message={getErrorMessage(catalogError)} />
  }

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
        <Text style={styles.title}>Interests</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save interests"
          hitSlop={8}
          disabled={isSaving}
          style={styles.headerSide}
          onPress={() => void onSave()}>
          <Text style={[styles.saveLabel, isSaving && styles.saveDisabled]}>{isSaving ? 'Saving…' : 'Save'}</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
        <Text style={styles.hint}>
          Pick up to {MAX} · {selectedIds.length}/{MAX} selected
        </Text>
        <View style={styles.list}>
          {catalog.map((interest) => {
            const selected = selectedIds.includes(interest.id)
            return (
              <InterestChip
                key={interest.id}
                icon={interest.icon}
                name={interest.name}
                selected={selected}
                disabled={!selected && atMax}
                onPress={() => toggle(interest.id)}
              />
            )
          })}
        </View>
      </ScrollView>

      <ErrorModal visible={submitError != null} message={submitError ?? undefined} onClose={() => setSubmitError(null)} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A090B',
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
  hint: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    marginBottom: spacing.md,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
})
