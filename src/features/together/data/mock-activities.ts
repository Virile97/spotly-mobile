import { Asset } from 'expo-asset'

import { getMockProfile } from '@/features/profile/data/mock-profile'

function assetUri(module: number): string {
  return Asset.fromModule(module).uri
}

const coffeePhoto = assetUri(require('../../../../assets/images/onboarding/slide-discover.png'))
const hikePhoto = assetUri(require('../../../../assets/images/onboarding/slide-share.png'))
const foodPhoto = assetUri(require('../../../../assets/images/onboarding/slide-destination.png'))

export const ACTIVITY_CATEGORIES = [
  { id: 'coffee', emoji: '☕', label: 'Coffee' },
  { id: 'food', emoji: '🍜', label: 'Food Trips' },
  { id: 'travel', emoji: '🏝️', label: 'Travel' },
] as const

export type ActivityCategoryId = (typeof ACTIVITY_CATEGORIES)[number]['id']

export interface ActivityJoiner {
  id: string
  name: string
  avatarUrl: string | null
}

export interface ActivityItem {
  id: string
  emoji: string
  title: string
  imageUrl: string | null
  placeName: string
  distanceKm: number
  spotsFilled: number
  spotsTotal: number
  whenDay: string
  whenTime: string
  whenShort: string
  sortDate: string
  category: ActivityCategoryId
  about: string
  joiners: ActivityJoiner[]
}

function joiner(userId: string): ActivityJoiner {
  const profile = getMockProfile(userId)
  return {
    id: profile?.id ?? userId,
    name: profile?.displayName.split(' ')[0] ?? userId,
    avatarUrl: profile?.avatarUrl ?? null,
  }
}

export const mockActivities: ActivityItem[] = [
  {
    id: 'act-coffee-hop',
    emoji: '☕',
    title: 'Coffee Hopping This Saturday',
    imageUrl: coffeePhoto,
    placeName: 'Coffee Shop XYZ',
    distanceKm: 2.3,
    spotsFilled: 3,
    spotsTotal: 5,
    whenDay: 'Saturday',
    whenTime: '3:00 PM',
    whenShort: 'Sat · 3:00 PM',
    sortDate: '2026-09-05T15:00:00',
    category: 'coffee',
    about:
      'Planning to visit three local coffee shops this Saturday. Looking for people who enjoy trying new cafés and meeting fellow coffee lovers.',
    joiners: [
      joiner('user-joshua'),
      { id: 'user-andrea', name: 'Andrea', avatarUrl: null },
      { ...joiner('user-kenji'), name: 'Ken' },
    ],
  },
  {
    id: 'act-study',
    emoji: '📚',
    title: 'Cafe Work Session',
    imageUrl: coffeePhoto,
    placeName: 'The Study Nook',
    distanceKm: 0.6,
    spotsFilled: 2,
    spotsTotal: 6,
    whenDay: 'Friday',
    whenTime: '1:00 PM',
    whenShort: 'Fri · 1:00 PM',
    sortDate: '2026-09-04T13:00:00',
    category: 'coffee',
    about: 'Quiet laptops-welcome session. Bring a drink, stay as long as you like.',
    joiners: [joiner('user-aliyah'), joiner('user-maria')],
  },
  {
    id: 'act-kinalas',
    emoji: '🍜',
    title: 'Kinalas Crawl',
    imageUrl: foodPhoto,
    placeName: 'Kinalas Corner',
    distanceKm: 3.1,
    spotsFilled: 4,
    spotsTotal: 8,
    whenDay: 'Sep 6',
    whenTime: '6:00 PM',
    whenShort: 'Sep 6 · 6:00 PM',
    sortDate: '2026-09-06T18:00:00',
    category: 'food',
    about: 'A casual crawl through Naga’s best bowls. Hungry people only.',
    joiners: [joiner('user-john'), joiner('user-kenji'), joiner('user-joshua'), joiner('user-diego')],
  },
  {
    id: 'act-isarog',
    emoji: '🥾',
    title: 'Sunrise Hike at Mt. Isarog',
    imageUrl: hikePhoto,
    placeName: 'Mt. Isarog',
    distanceKm: 14,
    spotsFilled: 6,
    spotsTotal: 10,
    whenDay: 'Sunday',
    whenTime: '4:30 AM',
    whenShort: 'Sun · 4:30 AM',
    sortDate: '2026-09-06T04:30:00',
    category: 'travel',
    about: 'Early start for the peak. Bring water, a light jacket, and shoes with grip.',
    joiners: [joiner('user-diego'), joiner('user-maria'), joiner('user-joshua')],
  },
  {
    id: 'act-caramoan',
    emoji: '🏝️',
    title: 'Caramoan Weekend Swim',
    imageUrl: foodPhoto,
    placeName: 'Matukad Island',
    distanceKm: 42.8,
    spotsFilled: 8,
    spotsTotal: 8,
    whenDay: 'Sep 12',
    whenTime: '7:00 AM',
    whenShort: 'Sep 12 · 7:00 AM',
    sortDate: '2026-09-12T07:00:00',
    category: 'travel',
    about: 'Island hop and swim. Spots are full — request to join the waitlist.',
    joiners: [joiner('user-maria'), joiner('user-diego')],
  },
]

const extraActivities: ActivityItem[] = []

export function getActivities(): ActivityItem[] {
  return [...extraActivities, ...mockActivities]
}

export function addActivity(activity: ActivityItem): void {
  extraActivities.unshift(activity)
}

export function getActivity(activityId: string | null | undefined): ActivityItem | undefined {
  if (!activityId) return undefined
  return getActivities().find((activity) => activity.id === activityId)
}

export function categoryMeta(id: ActivityCategoryId) {
  return ACTIVITY_CATEGORIES.find((category) => category.id === id) ?? ACTIVITY_CATEGORIES[0]
}
