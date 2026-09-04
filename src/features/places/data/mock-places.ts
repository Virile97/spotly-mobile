import { Asset } from 'expo-asset'

import type { Place } from '@/features/places/types/place.types'

function assetUri(module: number): string {
  return Asset.fromModule(module).uri
}

const coverCafe = assetUri(require('../../../../assets/images/onboarding/slide-share.png'))
const coverFood = assetUri(require('../../../../assets/images/onboarding/slide-discover.png'))
const coverNature = assetUri(require('../../../../assets/images/onboarding/slide-destination.png'))

export const NAGA_CENTER = {
  latitude: 13.6215,
  longitude: 123.181,
}

export const mockPlaces: Place[] = [
  {
    id: 'place-coffee-house',
    name: 'Coffee House',
    address: 'Magsaysay Avenue, Naga City',
    latitude: 13.6288,
    longitude: 123.1912,
    isOpenNow: true,
    coverImageUrl: coverCafe,
    emoji: '☕',
    category: 'cafe',
    postCount: 248,
    saveCount: 1204,
    communityScore: 4.8,
    distanceKm: 1.2,
    city: 'Naga City',
    closesAt: '10:00 PM',
    verified: true,
  },
  {
    id: 'place-ramen-bar',
    name: 'Ramen Bar',
    address: 'Panganiban Drive, Naga City',
    latitude: 13.624,
    longitude: 123.1945,
    isOpenNow: false,
    coverImageUrl: coverFood,
    emoji: '🍜',
    category: 'food',
    postCount: 186,
    saveCount: 742,
    communityScore: 4.6,
    distanceKm: 3.4,
    city: 'Naga City',
    closesAt: null,
    verified: true,
  },
  {
    id: 'place-study-nook',
    name: 'The Study Nook',
    address: 'Centro, Naga City',
    latitude: 13.6202,
    longitude: 123.186,
    isOpenNow: true,
    coverImageUrl: coverCafe,
    emoji: '📚',
    category: 'cafe',
    postCount: 64,
    saveCount: 211,
    communityScore: 4.5,
    distanceKm: 0.6,
    city: 'Naga City',
    closesAt: '9:00 PM',
    verified: false,
  },
  {
    id: 'place-garden-grill',
    name: 'Garden Grill',
    address: 'Diversion Road, Naga City',
    latitude: 13.615,
    longitude: 123.198,
    isOpenNow: false,
    coverImageUrl: coverFood,
    emoji: '🍽️',
    category: 'food',
    postCount: 91,
    saveCount: 308,
    communityScore: 4.2,
    distanceKm: 2.3,
    city: 'Naga City',
    closesAt: null,
    verified: false,
  },
  {
    id: 'place-malabsay-falls',
    name: 'Malabsay Falls',
    address: 'Mt. Isarog, Naga City',
    latitude: 13.658,
    longitude: 123.352,
    isOpenNow: true,
    coverImageUrl: coverNature,
    emoji: '💧',
    category: 'nature',
    isTrending: true,
    postCount: 312,
    saveCount: 980,
    communityScore: 4.9,
    distanceKm: 14.1,
    city: 'Naga City',
    closesAt: null,
    verified: true,
  },
  {
    id: 'place-caramoan-cove',
    name: 'Matukad Island',
    address: 'Caramoan, Camarines Sur',
    latitude: 13.77,
    longitude: 123.87,
    isOpenNow: true,
    coverImageUrl: coverNature,
    emoji: '🌴',
    category: 'nature',
    isTrending: true,
    postCount: 154,
    saveCount: 640,
    communityScore: 4.7,
    distanceKm: 42.8,
    city: 'Caramoan',
    closesAt: null,
    verified: true,
  },
]

export function getMockPlace(placeId: string | null | undefined): Place | undefined {
  if (!placeId) return undefined
  return mockPlaces.find((place) => place.id === placeId)
}
