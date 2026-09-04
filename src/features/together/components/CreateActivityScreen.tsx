import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter, type Href } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { mockPlaces } from '@/features/places/data/mock-places'
import type { Place } from '@/features/places/types/place.types'
import { mockOwnProfile } from '@/features/profile/data/mock-profile'
import {
  CREATE_ACTIVITY_STEPS,
  CREATE_ACTIVITY_TAGS,
  type CreateActivityTagId,
} from '@/features/together/data/create-activity-tags'
import {
  addActivity,
  type ActivityCategoryId,
} from '@/features/together/data/mock-activities'
import { CalendarModal } from '@/shared/components/ui'
import { toISODateString } from '@/shared/utils/date'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const TAG_ROWS = [
  CREATE_ACTIVITY_TAGS.slice(0, 2),
  CREATE_ACTIVITY_TAGS.slice(2, 4),
  CREATE_ACTIVITY_TAGS.slice(4, 6),
  CREATE_ACTIVITY_TAGS.slice(6, 8),
]

const FEATURED_NEARBY_IDS = ['place-kinalas-corner', 'place-villa-caceres']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DEFAULT_TITLES: Record<CreateActivityTagId, string> = {
  coffee: 'Coffee Hopping This Saturday',
  food: 'Food Trip This Saturday',
  travel: 'Travel This Saturday',
  hiking: 'Sunrise Hike This Saturday',
  photography: 'Photo Walk This Saturday',
  gaming: 'Game Night This Saturday',
  movies: 'Movie Night This Saturday',
  roadtrip: 'Road Trip This Saturday',
}
const VISIBILITY_OPTIONS = [
  {
    id: 'public',
    title: 'Public activity',
    subtitle: 'Anyone can see and join instantly.',
  },
  {
    id: 'request',
    title: 'Request to join',
    subtitle: 'You approve each participant before they join.',
  },
] as const
type VisibilityId = (typeof VISIBILITY_OPTIONS)[number]['id']

function mapCategory(id: CreateActivityTagId): ActivityCategoryId {
  if (id === 'food') return 'food'
  if (id === 'travel' || id === 'hiking' || id === 'roadtrip') return 'travel'
  return 'coffee'
}

function formatActivityDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`
}

function matches(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle)
}

function streetLabel(address: string): string {
  const street = address.split(',')[0]?.trim() ?? address
  return street.replace(/\bDrive\b/g, 'Dr').replace(/\bAvenue\b/g, 'Ave').replace(/\bStreet\b/g, 'St')
}

function formatDistance(km: number | undefined): string {
  if (km == null) return ''
  const value = Number.isInteger(km) ? String(km) : km.toFixed(1)
  return `${value} km`
}

export function CreateActivityScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [step, setStep] = useState(1)
  const [selectedId, setSelectedId] = useState<CreateActivityTagId>('coffee')
  const [placeId, setPlaceId] = useState('place-coffee-house')
  const [placeQuery, setPlaceQuery] = useState('Coffee House')
  const [title, setTitle] = useState(DEFAULT_TITLES.coffee)
  const [description, setDescription] = useState(
    'Planning to visit three local coffee shops this Saturday. Looking for people who enjoy trying new cafés.'
  )
  const [date, setDate] = useState(() => new Date(2026, 8, 6))
  const [timeLabel, setTimeLabel] = useState('3:00 PM')
  const [maxPeople, setMaxPeople] = useState(5)
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [visibility, setVisibility] = useState<VisibilityId>('public')

  const selectedPlace = mockPlaces.find((place) => place.id === placeId) ?? mockPlaces[0]

  const nearbyPlaces = useMemo(() => {
    const others = mockPlaces.filter((place) => place.id !== placeId)
    const needle = placeQuery.trim().toLowerCase()
    const selectedName = selectedPlace?.name.toLowerCase() ?? ''

    if (!needle || needle === selectedName) {
      const featured = FEATURED_NEARBY_IDS.map((id) => others.find((place) => place.id === id)).filter(
        (place): place is Place => place != null
      )
      if (featured.length > 0) return featured
    }

    return others.filter(
      (place) => matches(place.name, needle) || matches(place.address, needle) || matches(place.city ?? '', needle)
    )
  }, [placeId, placeQuery, selectedPlace?.name])

  const canContinue =
    step === 1 ? Boolean(selectedId) : step === 2 ? Boolean(placeId) : step === 3 ? title.trim().length > 0 : true

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1)
      return
    }
    router.back()
  }

  const publish = () => {
    const tag = CREATE_ACTIVITY_TAGS.find((item) => item.id === selectedId) ?? CREATE_ACTIVITY_TAGS[0]
    const id = `act-new-${Date.now()}`
    addActivity({
      id,
      emoji: tag.emoji,
      title: title.trim(),
      imageUrl: selectedPlace?.coverImageUrl ?? null,
      placeName: selectedPlace?.name ?? 'Nearby',
      distanceKm: selectedPlace?.distanceKm ?? 0.2,
      spotsFilled: 1,
      spotsTotal: maxPeople,
      whenDay: WEEKDAYS_LONG[date.getDay()] ?? 'Saturday',
      whenTime: timeLabel,
      whenShort: `${WEEKDAYS[date.getDay()]} · ${timeLabel}`,
      sortDate: `${toISODateString(date)}T12:00:00`,
      category: mapCategory(selectedId),
      about: description.trim() || 'Newly created activity.',
      joiners: [
        {
          id: mockOwnProfile.id,
          name: mockOwnProfile.displayName.split(' ')[0] ?? 'You',
          avatarUrl: mockOwnProfile.avatarUrl,
        },
      ],
    })
    router.back()
  }

  const goNext = () => {
    if (step === 1) {
      setTitle(DEFAULT_TITLES[selectedId])
      setStep(2)
      return
    }
    if (step === 2) {
      setStep(3)
      return
    }
    if (step === 3) {
      setStep(4)
      return
    }
    publish()
  }

  const selectPlace = (place: Place) => {
    setPlaceId(place.id)
    setPlaceQuery(place.name)
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton} onPress={goBack}>
          <Ionicons name="chevron-back" size={22} color={palette.white} />
        </Pressable>
        <View style={styles.progress}>
          {Array.from({ length: CREATE_ACTIVITY_STEPS }, (_, index) => (
            <View
              key={index}
              style={[styles.progressSegment, index === step - 1 && styles.progressSegmentActive]}
            />
          ))}
        </View>
      </View>

      {step === 1 ? (
        <View style={styles.body}>
          <Text style={styles.stepLabel}>STEP 1 OF 4</Text>
          <Text style={styles.heading}>What do you want to do?</Text>
          <View style={styles.grid}>
            {TAG_ROWS.map((row) => (
              <View key={row[0]?.id} style={styles.row}>
                {row.map((tag) => {
                  const isActive = tag.id === selectedId
                  return (
                    <Pressable
                      key={tag.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isActive }}
                      style={[styles.tag, isActive && styles.tagActive]}
                      onPress={() => setSelectedId(tag.id)}>
                      <Text style={styles.tagEmoji}>{tag.emoji}</Text>
                      <Text style={[styles.tagLabel, isActive && styles.tagLabelActive]} numberOfLines={1}>
                        {tag.label}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            ))}
          </View>
        </View>
      ) : step === 2 ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.bodyScroll}
          contentContainerStyle={styles.placeBody}>
          <Text style={styles.stepLabel}>STEP 2 OF 4</Text>
          <Text style={styles.heading}>Choose a place.</Text>

          <View style={styles.searchField}>
            <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.45)" />
            <TextInput
              value={placeQuery}
              onChangeText={setPlaceQuery}
              placeholder="Search a place"
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={styles.searchInput}
              returnKeyType="search"
              autoCorrect={false}
            />
          </View>

          {selectedPlace ? (
            <Pressable accessibilityRole="button" style={styles.selectedCard}>
              {selectedPlace.coverImageUrl ? (
                <Image source={{ uri: selectedPlace.coverImageUrl }} style={styles.placeThumb} contentFit="cover" />
              ) : (
                <View style={styles.placeThumb} />
              )}
              <View style={styles.placeCopy}>
                <Text style={styles.placeName}>{selectedPlace.name}</Text>
                <Text style={styles.placeMeta} numberOfLines={1}>
                  {selectedPlace.address}
                </Text>
              </View>
              <View style={styles.check}>
                <Ionicons name="checkmark" size={14} color={palette.white} />
              </View>
            </Pressable>
          ) : null}

          <Text style={styles.nearbyLabel}>NEARBY PLACES</Text>
          {nearbyPlaces.map((place) => (
            <Pressable
              key={place.id}
              accessibilityRole="button"
              style={styles.nearbyRow}
              onPress={() => selectPlace(place)}>
              {place.coverImageUrl ? (
                <Image source={{ uri: place.coverImageUrl }} style={styles.placeThumb} contentFit="cover" />
              ) : (
                <View style={styles.placeThumb} />
              )}
              <View style={styles.placeCopy}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeMeta} numberOfLines={1}>
                  {streetLabel(place.address)}
                  {place.distanceKm != null ? ` · ${formatDistance(place.distanceKm)}` : ''}
                </Text>
              </View>
            </Pressable>
          ))}

          <Pressable
            accessibilityRole="button"
            style={styles.mapLink}
            onPress={() => router.push('/(tabs)/explore' as Href)}>
            <Text style={styles.mapLinkLabel}>📍 Choose from map instead</Text>
          </Pressable>
        </ScrollView>
      ) : step === 3 ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.bodyScroll}
          contentContainerStyle={styles.placeBody}>
          <Text style={styles.stepLabel}>STEP 3 OF 4</Text>
          <Text style={styles.heading}>Activity details.</Text>

          <Text style={styles.fieldLabel}>Activity title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Activity title"
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.fieldInput}
          />

          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What is this activity about?"
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={[styles.fieldInput, styles.fieldMultiline]}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeCol}>
              <Text style={styles.fieldLabel}>Date</Text>
              <Pressable accessibilityRole="button" style={styles.fieldInput} onPress={() => setIsDateOpen(true)}>
                <Text style={styles.fieldValue}>{formatActivityDate(date)}</Text>
              </Pressable>
            </View>
            <View style={styles.dateTimeCol}>
              <Text style={styles.fieldLabel}>Time</Text>
              <TextInput
                value={timeLabel}
                onChangeText={setTimeLabel}
                placeholder="3:00 PM"
                placeholderTextColor="rgba(255,255,255,0.35)"
                style={styles.fieldInput}
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>Maximum participants</Text>
          <View style={styles.peopleField}>
            <Text style={styles.fieldValue}>{maxPeople} people</Text>
            <View style={styles.stepper}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Decrease participants"
                style={styles.stepperButton}
                onPress={() => setMaxPeople((value) => Math.max(2, value - 1))}>
                <Ionicons name="remove" size={18} color="rgba(255,255,255,0.7)" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Increase participants"
                style={styles.stepperButton}
                onPress={() => setMaxPeople((value) => Math.min(20, value + 1))}>
                <Ionicons name="add" size={18} color="rgba(255,255,255,0.7)" />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.body}>
          <Text style={styles.stepLabel}>STEP 4 OF 4</Text>
          <Text style={styles.heading}>Visibility & safety.</Text>

          <View style={styles.visibilityList}>
            {VISIBILITY_OPTIONS.map((option) => {
              const isActive = option.id === visibility
              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isActive }}
                  style={[styles.visibilityCard, isActive && styles.visibilityCardActive]}
                  onPress={() => setVisibility(option.id)}>
                  <View style={[styles.radio, isActive && styles.radioActive]} />
                  <View style={styles.visibilityCopy}>
                    <Text style={styles.visibilityTitle}>{option.title}</Text>
                    <Text style={styles.visibilitySubtitle}>{option.subtitle}</Text>
                  </View>
                </Pressable>
              )
            })}
          </View>

          <View style={styles.safetyCard}>
            <Text style={styles.safetyIcon}>🛟</Text>
            <Text style={styles.safetyText}>Meet in public places and follow community safety guidelines.</Text>
          </View>
        </View>
      )}

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canContinue }}
          style={[styles.continueButton, !canContinue && styles.continueDisabled]}
          disabled={!canContinue}
          onPress={goNext}>
          <Text style={styles.continueLabel}>{step === 4 ? 'Publish Activity' : 'Continue'}</Text>
        </Pressable>
      </View>

      <CalendarModal
        visible={isDateOpen}
        value={date}
        title="Select a date"
        onClose={() => setIsDateOpen(false)}
        onConfirm={(next) => {
          setDate(next)
          setIsDateOpen(false)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
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
  progress: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressSegment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2A292E',
  },
  progressSegmentActive: {
    backgroundColor: palette.pink500,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  bodyScroll: {
    flex: 1,
  },
  placeBody: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  stepLabel: {
    color: palette.pink500,
    fontSize: 12,
    letterSpacing: 0.8,
    fontFamily: fontFamily.bodySemiBold,
  },
  heading: {
    marginTop: spacing.sm,
    color: palette.white,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: fontFamily.headline,
  },
  grid: {
    marginTop: spacing.xl,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  tag: {
    flex: 1,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  tagActive: {
    backgroundColor: palette.pink500,
  },
  tagEmoji: {
    fontSize: 18,
    lineHeight: 22,
  },
  tagLabel: {
    color: palette.white,
    fontSize: fontSize.md,
    lineHeight: 20,
    fontFamily: fontFamily.bodyMedium,
    flexShrink: 0,
  },
  tagLabelActive: {
    color: palette.black,
    fontFamily: fontFamily.bodySemiBold,
  },
  searchField: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#17161A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    includeFontPadding: false,
  },
  selectedCard: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: palette.pink500,
    backgroundColor: '#0A090B',
  },
  nearbyLabel: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    letterSpacing: 0.8,
    fontFamily: fontFamily.bodySemiBold,
  },
  nearbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  placeThumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#17161A',
  },
  placeCopy: {
    flex: 1,
    gap: 2,
  },
  placeName: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  placeMeta: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: palette.pink500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLink: {
    marginTop: spacing.lg,
  },
  mapLinkLabel: {
    color: palette.pink500,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
  },
  fieldLabel: {
    marginTop: spacing.lg,
    marginBottom: 8,
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  fieldInput: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: '#17161A',
    paddingHorizontal: 14,
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    justifyContent: 'center',
    includeFontPadding: false,
  },
  fieldMultiline: {
    minHeight: 108,
    paddingTop: 14,
    paddingBottom: 14,
  },
  fieldValue: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeCol: {
    flex: 1,
  },
  peopleField: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: '#17161A',
    paddingLeft: 14,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepperButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visibilityList: {
    marginTop: spacing.xl,
    gap: 12,
  },
  visibilityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: '#0A090B',
  },
  visibilityCardActive: {
    borderColor: palette.pink500,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.28)',
    marginTop: 2,
  },
  radioActive: {
    borderWidth: 3,
    borderColor: palette.pink500,
  },
  visibilityCopy: {
    flex: 1,
    gap: 4,
  },
  visibilityTitle: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  visibilitySubtitle: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.sm,
    lineHeight: 20,
    fontFamily: fontFamily.body,
  },
  safetyCard: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#17161A',
  },
  safetyIcon: {
    fontSize: 18,
    lineHeight: 22,
  },
  safetyText: {
    flex: 1,
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSize.sm,
    lineHeight: 20,
    fontFamily: fontFamily.body,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  continueButton: {
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: palette.pink500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueDisabled: {
    opacity: 0.45,
  },
  continueLabel: {
    color: palette.black,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
})
