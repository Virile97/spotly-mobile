import { Ionicons } from '@expo/vector-icons'
import { useQueryClient } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { profileApi } from '@/features/profile/api/profile.api'
import { mockOwnProfile, mockProfiles, type ProfileView } from '@/features/profile/data/mock-profile'
import { cacheProfile } from '@/features/profile/hooks/cache-profile'
import { useDisplayedProfileImages } from '@/features/profile/hooks/useDisplayedProfileImages'
import { useMyProfile } from '@/features/profile/hooks/useProfile'
import { useProfileImagePreviewStore } from '@/features/profile/store/profile-image-preview.store'
import { pickProfileImage, pickProfileImageFromSource } from '@/features/profile/utils/pick-profile-image'
import { ErrorModal } from '@/shared/components/feedback/ErrorModal'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { LoadingState } from '@/shared/components/feedback/LoadingState'
import { LIMITS } from '@/shared/constants/limits'
import { getErrorMessage } from '@/shared/utils/error'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

function StripeFill() {
  return (
    <View style={styles.stripeFill}>
      {Array.from({ length: 14 }, (_, index) => (
        <View key={index} style={[styles.stripe, { left: index * 18 - 40 }]} />
      ))}
    </View>
  )
}

export function UpdateAvatarScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()
  const { data: profile, isLoading, isError, error, refetch } = useMyProfile()
  const setImagePreview = useProfileImagePreviewStore((state) => state.setImage)
  const pending = useProfileImagePreviewStore((state) => state.pendingAvatar)
  const setPendingAvatar = useProfileImagePreviewStore((state) => state.setPendingAvatar)
  const { avatarUrl: displayedAvatarUrl } = useDisplayedProfileImages(profile)
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [shareToPublic, setShareToPublic] = useState(false)
  const [location, setLocation] = useState('')
  const [peopleQuery, setPeopleQuery] = useState('')
  const [peopleSearchOpen, setPeopleSearchOpen] = useState(false)
  const [taggedIds, setTaggedIds] = useState<string[]>([])
  const [caption, setCaption] = useState('')

  const previewUri = pending?.uri ?? displayedAvatarUrl
  const isConfirm = pending != null
  const ownId = profile?.id ?? mockOwnProfile.id

  const taggedPeople = useMemo(
    () =>
      taggedIds
        .map((id) => mockProfiles.find((person) => person.id === id))
        .filter((person): person is ProfileView => person != null),
    [taggedIds]
  )

  const peopleResults = useMemo(() => {
    const needle = peopleQuery.trim().toLowerCase()
    return mockProfiles.filter((person) => {
      if (person.id === ownId) return false
      if (!needle) return true
      return (
        person.displayName.toLowerCase().includes(needle) ||
        person.username.toLowerCase().includes(needle)
      )
    })
  }, [ownId, peopleQuery])

  const toggleTagged = (personId: string) => {
    setTaggedIds((current) =>
      current.includes(personId) ? current.filter((id) => id !== personId) : [...current, personId]
    )
  }

  const closePeopleSearch = () => {
    setPeopleSearchOpen(false)
    setPeopleQuery('')
  }

  const onPick = async (source: 'camera' | 'library') => {
    const picked = await pickProfileImageFromSource('avatar', source)
    if (!picked) return
    setPendingAvatar(picked)
  }

  const onChangePhoto = async () => {
    const picked = await pickProfileImage('avatar')
    if (!picked) return
    setPendingAvatar(picked)
  }

  const onLeave = () => {
    setPendingAvatar(null)
    router.back()
  }

  const onSave = async () => {
    if (!pending) return

    setSubmitError(null)
    setIsSaving(true)
    try {
      const updated = await profileApi.uploadProfileImage('avatar', pending.uri, pending.contentType)
      setImagePreview('avatar', pending.uri)
      setPendingAvatar(null)
      cacheProfile(queryClient, updated)
      router.back()
    } catch (err) {
      setSubmitError(getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <LoadingState />
  if (isError || !profile) return <ErrorState onRetry={() => refetch()} message={getErrorMessage(error)} />

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          style={styles.headerSide}
          onPress={onLeave}>
          <View style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color={palette.white} />
          </View>
        </Pressable>
        <Text style={styles.title}>{isConfirm ? 'Update photo' : 'Profile photo'}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save profile photo"
          hitSlop={8}
          disabled={!isConfirm || isSaving}
          style={styles.headerSide}
          onPress={() => void onSave()}>
          {isConfirm ? (
            <Text style={[styles.saveLabel, isSaving && styles.saveDisabled]}>{isSaving ? 'Saving…' : 'Save'}</Text>
          ) : null}
        </Pressable>
      </View>

      {isConfirm ? (
        <KeyboardAwareScrollView
          style={styles.flex}
          bottomOffset={spacing.xl}
          extraKeyboardSpace={spacing.xl}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xl }]}>
          <View style={styles.previewCard}>
            {previewUri ? (
              <Image
                source={{ uri: previewUri }}
                style={styles.previewImage}
                contentFit="contain"
                recyclingKey={previewUri}
              />
            ) : (
              <StripeFill />
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleCopy}>
                <Text style={styles.toggleLabel}>Share to public</Text>
                <Text style={styles.toggleHint}>Also post this to your feed</Text>
              </View>
              <View style={styles.switchWrap} pointerEvents="box-none">
                <Switch
                  accessibilityLabel="Share to public"
                  value={shareToPublic}
                  onValueChange={setShareToPublic}
                  style={styles.switch}
                  trackColor={{ false: '#3A393E', true: palette.pink500 }}
                  thumbColor={palette.white}
                  ios_backgroundColor="#3A393E"
                />
              </View>
            </View>

            {shareToPublic ? (
              <>
                <View style={styles.cardDivider} />
                <View style={styles.tagRow}>
                  <Text style={styles.toggleLabel}>Tag people</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Tag people"
                    disabled={isSaving}
                    hitSlop={8}
                    style={styles.addButton}
                    onPress={() => setPeopleSearchOpen(true)}>
                    <Ionicons name="add" size={18} color={palette.white} />
                  </Pressable>
                </View>
                {taggedPeople.length > 0 ? (
                  <View style={styles.chips}>
                    {taggedPeople.map((person) => (
                      <Pressable
                        key={person.id}
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${person.displayName}`}
                        disabled={isSaving}
                        style={styles.chip}
                        onPress={() => toggleTagged(person.id)}>
                        <Text style={styles.chipLabel}>@{person.username}</Text>
                        <Ionicons name="close" size={12} color={palette.black} />
                      </Pressable>
                    ))}
                  </View>
                ) : null}
                <View style={styles.cardDivider} />
                <View style={styles.fieldBlock}>
                  <View style={styles.searchPill}>
                    <Ionicons name="location" size={16} color={palette.red500} />
                    <TextInput
                      value={location}
                      onChangeText={setLocation}
                      editable={!isSaving}
                      placeholder="Add a location"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      autoCapitalize="words"
                      style={styles.searchInput}
                    />
                  </View>
                </View>
                <View style={styles.cardDivider} />
                <TextInput
                  value={caption}
                  onChangeText={setCaption}
                  editable={!isSaving}
                  placeholder="Write a caption"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  multiline
                  textAlignVertical="top"
                  maxLength={LIMITS.POST_CAPTION_MAX_LENGTH}
                  style={styles.caption}
                />
              </>
            ) : null}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change photo"
            disabled={isSaving}
            style={styles.outlineButton}
            onPress={() => void onChangePhoto()}>
            <Text style={styles.outlineLabel}>Change photo</Text>
          </Pressable>
        </KeyboardAwareScrollView>
      ) : (
        <>
          <View style={styles.stage}>
            <View style={styles.stageFrame}>
              {previewUri ? (
                <Image
                  source={{ uri: previewUri }}
                  style={styles.previewImage}
                  contentFit="contain"
                  recyclingKey={previewUri}
                />
              ) : (
                <StripeFill />
              )}
            </View>
          </View>

          <View style={[styles.dock, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Take photo"
              style={styles.iconButtonPrimary}
              onPress={() => void onPick('camera')}>
              <Ionicons name="camera" size={22} color={palette.black} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Choose from gallery"
              style={styles.iconButton}
              onPress={() => void onPick('library')}>
              <Ionicons name="images" size={22} color={palette.white} />
            </Pressable>
          </View>
        </>
      )}

      <Modal
        visible={peopleSearchOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closePeopleSearch}>
        <View style={[styles.searchRoot, { paddingTop: insets.top + spacing.sm }]}>
          <View style={styles.searchHeader}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close people search"
              hitSlop={8}
              onPress={closePeopleSearch}>
              <Ionicons name="chevron-back" size={22} color={palette.white} />
            </Pressable>
            <View style={styles.searchField}>
              <Ionicons name="search" size={16} color="rgba(255,255,255,0.4)" />
              <TextInput
                value={peopleQuery}
                onChangeText={setPeopleQuery}
                placeholder="Search people"
                placeholderTextColor="rgba(255,255,255,0.35)"
                autoFocus
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                style={styles.searchFieldInput}
              />
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Done tagging people" hitSlop={8} onPress={closePeopleSearch}>
              <Text style={styles.saveLabel}>Done</Text>
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.searchContent, { paddingBottom: insets.bottom + spacing.xl }]}>
            {peopleResults.length === 0 ? (
              <Text style={styles.empty}>No people match that search</Text>
            ) : (
              peopleResults.map((person) => {
                const isTagged = taggedIds.includes(person.id)
                return (
                  <Pressable
                    key={person.id}
                    accessibilityRole="button"
                    accessibilityLabel={isTagged ? `Remove ${person.displayName}` : `Tag ${person.displayName}`}
                    style={styles.personRow}
                    onPress={() => toggleTagged(person.id)}>
                    <View style={styles.personAvatar}>
                      <Text style={styles.personInitial}>{person.displayName.charAt(0)}</Text>
                    </View>
                    <View style={styles.personInfo}>
                      <Text style={styles.personName}>{person.displayName}</Text>
                      <Text style={styles.personMeta}>@{person.username}</Text>
                    </View>
                    <Ionicons
                      name={isTagged ? 'checkmark-circle' : 'add-circle-outline'}
                      size={22}
                      color={isTagged ? palette.pink500 : 'rgba(255,255,255,0.35)'}
                    />
                  </Pressable>
                )
              })
            )}
          </ScrollView>
        </View>
      </Modal>

      <ErrorModal visible={submitError != null} message={submitError ?? undefined} onClose={() => setSubmitError(null)} />
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSide: {
    width: 64,
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
  stage: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  stageFrame: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#17161A',
  },
  dock: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  iconButtonPrimary: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.pink500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#17161A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  previewCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#17161A',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: '#17161A',
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  toggleRow: {
    minHeight: 64,
    paddingHorizontal: spacing.md,
    paddingRight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  toggleCopy: {
    flex: 1,
    gap: 2,
  },
  toggleLabel: {
    color: palette.white,
    fontSize: fontSize.md,
    lineHeight: 20,
    fontFamily: fontFamily.body,
    includeFontPadding: false,
  },
  toggleHint: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.sm,
    lineHeight: 18,
    fontFamily: fontFamily.body,
    includeFontPadding: false,
  },
  switchWrap: {
    width: 51,
    height: 31,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 2,
  },
  switch: {
    transform: [{ scale: 0.75 }],
    ...(Platform.OS === 'ios' ? { marginVertical: -8 } : null),
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: spacing.md,
  },
  tagRow: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldBlock: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchPill: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: '#0A090B',
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    includeFontPadding: false,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  searchRoot: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: '#17161A',
    paddingHorizontal: spacing.md,
  },
  searchFieldInput: {
    flex: 1,
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    includeFontPadding: false,
    paddingVertical: spacing.sm,
  },
  searchContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  empty: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    paddingVertical: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: palette.pink500,
    borderRadius: radius.full,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
  },
  chipLabel: {
    color: palette.black,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  personAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1C1B1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personInitial: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  personMeta: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
    marginTop: 2,
  },
  caption: {
    minHeight: 88,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.body,
    lineHeight: 22,
    includeFontPadding: false,
  },
  outlineButton: {
    minHeight: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: '#17161A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineLabel: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
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
