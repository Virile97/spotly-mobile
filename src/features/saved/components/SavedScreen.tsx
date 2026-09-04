import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useMemo, useRef, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import MapView from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AppMap } from '@/features/map/components/AppMap'
import { PlaceCalloutMarker } from '@/features/map/components/PlaceCalloutMarker'
import { getMockPlace, NAGA_CENTER } from '@/features/places/data/mock-places'
import type { Place } from '@/features/places/types/place.types'
import {
  addCollection,
  getCollections,
  type SavedCollection,
} from '@/features/saved/data/mock-collections'
import { Modal } from '@/shared/components/ui'
import { getTabBarOverlayHeight } from '@/shared/constants/tab-bar'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

type SavedView = 'list' | 'map'

interface SavedScreenProps {
  showBack?: boolean
}

function StripeMark({ emoji, size }: { emoji: string; size: number }) {
  return (
    <View style={[styles.stripeMark, { width: size, height: size, borderRadius: radius.md }]}>
      {Array.from({ length: 7 }, (_, index) => (
        <View key={index} style={[styles.stripe, { left: index * 10 - 18 }]} />
      ))}
      <Text style={{ fontSize: size * 0.42 }}>{emoji}</Text>
    </View>
  )
}

export function SavedScreen({ showBack = false }: SavedScreenProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const mapRef = useRef<MapView>(null)
  const [view, setView] = useState<SavedView>('list')
  const [collections, setCollections] = useState(getCollections)
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')

  const bottomPad = showBack
    ? insets.bottom + spacing.lg
    : getTabBarOverlayHeight(insets.bottom) + spacing.md

  const mapPlaces = useMemo(() => {
    const ids = [...new Set(collections.flatMap((collection) => collection.placeIds))]
    return ids
      .map((id) => getMockPlace(id))
      .filter((place): place is Place => place != null)
  }, [collections])

  const createCollection = () => {
    const name = newName.trim()
    if (!name) return

    const collection: SavedCollection = {
      id: `collection-${Date.now()}`,
      name,
      emoji: '📌',
      subtitle: '0 places',
      placeIds: [],
    }
    addCollection(collection)
    setCollections(getCollections())
    setNewName('')
    setIsCreating(false)
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
            onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={palette.white} />
          </Pressable>
        ) : null}
        <Text style={styles.title}>Saved</Text>
        <View style={styles.toggle}>
          {(['list', 'map'] as const).map((option) => {
            const isActive = option === view
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                style={[styles.toggleItem, isActive && styles.toggleItemActive]}
                onPress={() => setView(option)}>
                <Text style={[styles.toggleLabel, isActive && styles.toggleLabelActive]}>
                  {option === 'list' ? 'List' : 'Map'}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>

      {view === 'map' ? (
        <View style={styles.mapWrap}>
          <AppMap
            ref={mapRef}
            initialRegion={{
              ...NAGA_CENTER,
              latitudeDelta: 0.18,
              longitudeDelta: 0.18,
            }}
            onMapReady={() => {
              if (mapPlaces.length < 2) return
              mapRef.current?.fitToCoordinates(
                mapPlaces.map((place) => ({
                  latitude: place.latitude,
                  longitude: place.longitude,
                })),
                {
                  edgePadding: { top: 40, right: 40, bottom: 80, left: 40 },
                  animated: false,
                }
              )
            }}>
            {mapPlaces.map((place) => (
              <PlaceCalloutMarker key={place.id} place={place} />
            ))}
          </AppMap>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}>
          {collections.map((collection) => (
            <Pressable
              key={collection.id}
              accessibilityRole="button"
              style={styles.card}
              onPress={() => router.push(`/collections/${collection.id}`)}>
              <StripeMark emoji={collection.emoji} size={48} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{collection.name}</Text>
                <Text style={styles.cardMeta}>{collection.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.35)" />
            </Pressable>
          ))}

          <Pressable
            accessibilityRole="button"
            style={styles.newButton}
            onPress={() => setIsCreating(true)}>
            <Text style={styles.newLabel}>+ New collection</Text>
          </Pressable>
        </ScrollView>
      )}

      <Modal visible={isCreating} onClose={() => setIsCreating(false)}>
        <Text style={styles.modalTitle}>New collection</Text>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          placeholder="Collection name"
          placeholderTextColor="rgba(255,255,255,0.35)"
          autoFocus
          style={styles.modalInput}
        />
        <Pressable
          accessibilityRole="button"
          style={[styles.modalSave, !newName.trim() && styles.modalSaveDisabled]}
          disabled={!newName.trim()}
          onPress={createCollection}>
          <Text style={styles.modalSaveLabel}>Create</Text>
        </Pressable>
      </Modal>
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
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
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
  title: {
    flex: 1,
    color: palette.white,
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.headline,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#17161A',
    borderRadius: radius.full,
    padding: 3,
  },
  toggleItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  toggleItemActive: {
    backgroundColor: palette.pink500,
  },
  toggleLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
  },
  toggleLabelActive: {
    color: palette.black,
    fontFamily: fontFamily.bodySemiBold,
  },
  list: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#17161A',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  cardMeta: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
  },
  newButton: {
    minHeight: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  newLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodyMedium,
  },
  mapWrap: {
    flex: 1,
  },
  stripeMark: {
    overflow: 'hidden',
    backgroundColor: '#1C1B1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripe: {
    position: 'absolute',
    top: -20,
    width: 5,
    height: 90,
    backgroundColor: 'rgba(255,255,255,0.045)',
    transform: [{ rotate: '45deg' }],
  },
  modalTitle: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
    marginBottom: spacing.sm,
  },
  modalInput: {
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: '#17161A',
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    paddingHorizontal: spacing.md,
    includeFontPadding: false,
  },
  modalSave: {
    marginTop: spacing.md,
    minHeight: 40,
    borderRadius: radius.md,
    backgroundColor: palette.pink500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveDisabled: {
    opacity: 0.45,
  },
  modalSaveLabel: {
    color: palette.black,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
})
