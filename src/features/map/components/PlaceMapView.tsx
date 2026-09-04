import { Ionicons } from '@expo/vector-icons'
import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { PlaceCalloutMarker } from '@/features/map/components/PlaceCalloutMarker'
import { PlaceMapCard } from '@/features/map/components/PlaceMapCard'
import { UserLocationMarker } from '@/features/map/components/UserLocationMarker'
import { useDrivingRoute } from '@/features/map/hooks/useDrivingRoute'
import { useUserLocation } from '@/features/map/hooks/useUserLocation'
import { getMockPlace, mockPlaces, NAGA_CENTER } from '@/features/places/data/mock-places'
import type { Place } from '@/features/places/types/place.types'
import { getTabBarOverlayHeight } from '@/shared/constants/tab-bar'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const FILTERS = ['Nearby', 'Open Now', 'Trending', 'Food'] as const

interface PlaceMapViewProps {
  initialPlaceId?: string
}

export function PlaceMapView({ initialPlaceId }: PlaceMapViewProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const mapRef = useRef<MapView>(null)
  const { location } = useUserLocation()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Nearby')
  const [selectedId, setSelectedId] = useState<string | null>(initialPlaceId ?? null)

  const origin = location
  const selected = getMockPlace(selectedId) ?? null
  const destination = selected
    ? { latitude: selected.latitude, longitude: selected.longitude }
    : null
  const routeOrigin = origin
    ? {
        latitude: Number(origin.latitude.toFixed(3)),
        longitude: Number(origin.longitude.toFixed(3)),
      }
    : null
  const drivingRoute = useDrivingRoute(routeOrigin, destination)
  const fittedPlaceId = useRef<string | null>(null)

  const visiblePlaces = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return mockPlaces.filter((place) => {
      if (needle && !place.name.toLowerCase().includes(needle)) return false
      if (filter === 'Open Now') return place.isOpenNow
      if (filter === 'Trending') return Boolean(place.isTrending)
      if (filter === 'Food') return place.category === 'food' || place.category === 'cafe'
      return true
    })
  }, [filter, query])

  const routePoints = drivingRoute?.points

  useEffect(() => {
    if (!selected || !routePoints || routePoints.length < 2) return
    if (fittedPlaceId.current === selected.id) return

    fittedPlaceId.current = selected.id
    mapRef.current?.fitToCoordinates(routePoints, {
      edgePadding: { top: 180, right: 40, bottom: 280, left: 40 },
      animated: true,
    })
  }, [routePoints, selected])

  const openExternalDirections = (place: Place) => {
    const destination = encodeURIComponent(`${place.name}, ${place.address}`)
    void Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${destination}`)
  }

  return (
    <View style={styles.root}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          ...NAGA_CENTER,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
        showsBuildings
        showsTraffic
        showsCompass={false}
        toolbarEnabled={false}>
        {origin ? (
          <UserLocationMarker
            latitude={origin.latitude}
            longitude={origin.longitude}
            heading={origin.heading}
          />
        ) : null}

        {visiblePlaces.map((place) =>
          place.id === selected?.id ? (
            <PlaceCalloutMarker key={place.id} place={place} />
          ) : (
            <Marker
              key={place.id}
              coordinate={{ latitude: place.latitude, longitude: place.longitude }}
              onPress={() => setSelectedId(place.id)}>
              <View style={styles.marker}>
                <Text style={styles.markerEmoji}>{place.emoji ?? '📍'}</Text>
                {place.isTrending ? (
                  <View style={styles.trending}>
                    <Text style={styles.trendingText}>🔥 Trending</Text>
                  </View>
                ) : null}
              </View>
            </Marker>
          )
        )}

        {routePoints && routePoints.length > 1 ? (
          <Polyline coordinates={routePoints} strokeColor={palette.pink500} strokeWidth={4} />
        ) : null}
      </MapView>

      <View style={[styles.top, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color="rgba(255,255,255,0.55)" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search places"
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={styles.searchInput}
          />
          <Ionicons name="menu" size={20} color="rgba(255,255,255,0.7)" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {FILTERS.map((item) => {
            const isActive = item === filter
            return (
              <Pressable
                key={item}
                accessibilityRole="button"
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setFilter(item)}>
                <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>{item}</Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      {selected ? (
        <View style={[styles.sheet, { paddingBottom: getTabBarOverlayHeight(insets.bottom) + spacing.sm }]}>
          <PlaceMapCard
            place={{
              ...selected,
              distanceKm: drivingRoute?.distanceKm ?? selected.distanceKm,
            }}
            onViewPlace={() => router.push(`/places/${selected.id}`)}
            onGetDirections={() => openExternalDirections(selected)}
          />
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    borderRadius: radius.full,
    backgroundColor: '#17161A',
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
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  chip: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: '#17161A',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipActive: {
    backgroundColor: palette.pink500,
    borderColor: palette.pink500,
  },
  chipLabel: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  chipLabelActive: {
    color: palette.black,
  },
  marker: {
    alignItems: 'center',
  },
  markerEmoji: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 36,
    backgroundColor: '#2A292E',
    fontSize: 18,
  },
  trending: {
    marginTop: 4,
    backgroundColor: '#F97316',
    borderRadius: radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  trendingText: {
    color: palette.white,
    fontSize: 9,
    fontFamily: fontFamily.bodySemiBold,
  },
  sheet: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: 0,
  },
})
