import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'
import { useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { mockPlaces } from '@/features/places/data/mock-places'
import type { Place } from '@/features/places/types/place.types'
import { useCreatePost } from '@/features/posts/hooks/useCreatePost'
import { ErrorModal } from '@/shared/components/feedback/ErrorModal'
import { LIMITS } from '@/shared/constants/limits'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface MediaItem {
  uri: string
  durationSec?: number
}

interface CreatePostFormProps {
  onCancel: () => void
  onSuccess?: () => void
}

function streetLabel(place: Place): string {
  return place.address.split(',')[0] ?? place.address
}

export function CreatePostForm({ onCancel, onSuccess }: CreatePostFormProps) {
  const insets = useSafeAreaInsets()
  const { mutate, isPending } = useCreatePost()
  const [media, setMedia] = useState<MediaItem[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [caption, setCaption] = useState('')
  const [placeQuery, setPlaceQuery] = useState('')
  const [placeId, setPlaceId] = useState<string | null>(null)
  const [preciseLocation, setPreciseLocation] = useState(true)
  const [submitError, setSubmitError] = useState(false)

  const selected = media[activeIndex]
  const needle = placeQuery.trim().toLowerCase()
  const suggestions = (needle
    ? mockPlaces.filter((place) => place.name.toLowerCase().includes(needle))
    : [...mockPlaces].sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99))
  ).slice(0, 3)

  const appendMedia = (items: MediaItem[]) => {
    setMedia((current) => {
      const next = [...current, ...items].slice(0, LIMITS.MAX_MEDIA_PER_POST)
      if (current.length === 0 && next.length > 0) setActiveIndex(0)
      return next
    })
  }

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      quality: 0.85,
    })

    if (result.canceled) return

    appendMedia(
      result.assets.map((asset) => ({
        uri: asset.uri,
        durationSec: asset.duration != null ? Math.round(asset.duration / 1000) : undefined,
      }))
    )
  }

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) return

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    })

    if (result.canceled) return

    appendMedia(result.assets.map((asset) => ({ uri: asset.uri })))
  }

  const onPost = () => {
    if (media.length === 0) {
      setSubmitError(true)
      return
    }

    setSubmitError(false)
    mutate(
      {
        caption: caption.trim(),
        mediaUrls: media.map((item) => item.uri),
        placeId: placeId ?? undefined,
      },
      { onSuccess, onError: () => setSubmitError(true) }
    )
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={onCancel} hitSlop={8}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>New experience</Text>
        <Pressable accessibilityRole="button" onPress={onPost} disabled={isPending} hitSlop={8}>
          <Text style={[styles.post, isPending && styles.postDisabled]}>Post</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <Pressable onPress={media.length === 0 ? pickFromLibrary : undefined}>
          {selected ? (
            <View>
              <Image source={{ uri: selected.uri }} style={styles.preview} contentFit="cover" />
              <View style={styles.counter}>
                <Text style={styles.counterText}>
                  {activeIndex + 1}/{media.length}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.previewEmpty}>
              <Ionicons name="image-outline" size={28} color="rgba(255,255,255,0.35)" />
              <Text style={styles.previewHint}>Add photos</Text>
            </View>
          )}
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbs}>
          <Pressable accessibilityRole="button" style={styles.cameraTile} onPress={openCamera}>
            <Ionicons name="camera-outline" size={20} color="rgba(255,255,255,0.7)" />
            <Text style={styles.cameraLabel}>Camera</Text>
          </Pressable>

          {media.map((item, index) => {
            const isActive = index === activeIndex
            return (
              <Pressable
                key={`${item.uri}-${index}`}
                onPress={() => setActiveIndex(index)}
                style={[styles.thumb, isActive && styles.thumbActive]}>
                <Image source={{ uri: item.uri }} style={styles.thumbImage} contentFit="cover" />
                {item.durationSec != null ? (
                  <View style={styles.duration}>
                    <Text style={styles.durationText}>
                      0:{String(item.durationSec).padStart(2, '0')}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            )
          })}
        </ScrollView>

        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder="What was this place like?"
          placeholderTextColor="rgba(255,255,255,0.35)"
          multiline
          maxLength={LIMITS.POST_CAPTION_MAX_LENGTH}
          style={styles.caption}
        />
      </ScrollView>

      <View style={[styles.bottomBlock, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <View style={styles.placeCard}>
          <View style={styles.placeHeader}>
            <Ionicons name="location" size={16} color={palette.red500} />
            <Text style={styles.placeTitle}>Tag a Place</Text>
          </View>

          <View style={styles.placeSearch}>
            <View style={styles.radio} />
            <TextInput
              value={placeQuery}
              onChangeText={setPlaceQuery}
              placeholder="Search a place"
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={styles.placeInput}
            />
          </View>

          {suggestions.map((place) => {
            const isSelected = place.id === placeId
            return (
              <Pressable
                key={place.id}
                accessibilityRole="button"
                style={[styles.placeRow, isSelected && styles.placeRowActive]}
                onPress={() => setPlaceId(place.id)}>
                <Text style={styles.placeEmoji}>{place.emoji ?? '📍'}</Text>
                <View style={styles.placeInfo}>
                  <Text style={styles.placeName}>{place.name}</Text>
                  <Text style={styles.placeMeta}>
                    {streetLabel(place)}
                    {place.distanceKm != null ? ` · ${place.distanceKm} km` : ''}
                  </Text>
                </View>
                <Ionicons
                  name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={isSelected ? palette.pink500 : 'transparent'}
                />
              </Pressable>
            )
          })}
        </View>

        <View style={styles.preciseRow}>
          <Text style={styles.preciseLabel}>Add precise location</Text>
          <Switch
            value={preciseLocation}
            onValueChange={setPreciseLocation}
            trackColor={{ false: 'rgba(255,255,255,0.15)', true: palette.pink500 }}
            thumbColor={palette.white}
          />
        </View>
      </View>

      <ErrorModal visible={submitError} onClose={() => setSubmitError(false)} />
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  cancel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: fontSize.md,
    fontFamily: fontFamily.body,
  },
  title: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  post: {
    color: palette.pink500,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  postDisabled: {
    opacity: 0.45,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  preview: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: radius.md,
    backgroundColor: '#17161A',
  },
  previewEmpty: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: radius.md,
    backgroundColor: '#17161A',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  previewHint: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  counter: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  counterText: {
    color: palette.white,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bodySemiBold,
  },
  thumbs: {
    gap: spacing.sm,
  },
  cameraTile: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  cameraLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbActive: {
    borderColor: palette.pink500,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  duration: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  durationText: {
    color: palette.white,
    fontSize: 10,
    fontFamily: fontFamily.bodySemiBold,
  },
  caption: {
    minHeight: 72,
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.body,
    lineHeight: 22,
    includeFontPadding: false,
  },
  placeCard: {
    backgroundColor: '#17161A',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  placeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  placeTitle: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  placeSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    borderRadius: radius.full,
    backgroundColor: '#0A090B',
    paddingHorizontal: spacing.md,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  placeInput: {
    flex: 1,
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    includeFontPadding: false,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  placeRowActive: {
    backgroundColor: 'rgba(208,95,200,0.12)',
    borderColor: palette.pink500,
  },
  placeEmoji: {
    fontSize: 20,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  placeMeta: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
    marginTop: 2,
  },
  bottomBlock: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    backgroundColor: '#0A090B',
  },
  preciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preciseLabel: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
})
