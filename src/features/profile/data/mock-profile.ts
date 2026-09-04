import { Asset } from 'expo-asset'

import type { ProfileStats } from '@/features/profile/api/profile.api'

function assetUri(module: number): string {
  return Asset.fromModule(module).uri
}

const avatarJoshua = assetUri(require('../../../../assets/images/profile/avatar.jpg'))
const coverJoshua = assetUri(require('../../../../assets/images/profile/cover.jpg'))
const coverCafe = assetUri(require('../../../../assets/images/onboarding/slide-discover.png'))
const coverShare = assetUri(require('../../../../assets/images/onboarding/slide-share.png'))
const coverDestination = assetUri(require('../../../../assets/images/onboarding/slide-destination.png'))

export interface ProfileInterest {
  emoji: string
  label: string
}

export interface ProfileView {
  id: string
  displayName: string
  username: string
  location: string | null
  bio: string | null
  avatarUrl: string | null
  coverImageUrl: string | null
  interests: ProfileInterest[]
  stats: ProfileStats
}

export const mockOwnProfile: ProfileView = {
  id: 'user-joshua',
  displayName: 'Joshua Bautista',
  username: 'joshua',
  location: 'Naga City',
  bio: 'Coffee first, mountains after. Mapping the good spots around Bicol.',
  avatarUrl: avatarJoshua,
  coverImageUrl: coverJoshua,
  interests: [
    { emoji: '☕', label: 'Coffee' },
    { emoji: '📸', label: 'Photography' },
    { emoji: '🏖️', label: 'Travel' },
  ],
  stats: {
    postCount: 86,
    followerCount: 1204,
    followingCount: 312,
  },
}

export const mockProfiles: ProfileView[] = [
  mockOwnProfile,
  {
    id: 'user-maria',
    displayName: 'Maria Reyes',
    username: 'maria',
    location: 'Bicol',
    bio: 'Chasing sunrises and hidden coves.',
    avatarUrl: coverCafe,
    coverImageUrl: coverDestination,
    stats: { postCount: 142, followerCount: 890, followingCount: 210 },
  },
  {
    id: 'user-john',
    displayName: 'John Alcala',
    username: 'john',
    location: 'Naga',
    bio: 'Always down for a food trip.',
    avatarUrl: coverShare,
    coverImageUrl: coverCafe,
    stats: { postCount: 86, followerCount: 420, followingCount: 180 },
  },
  {
    id: 'user-kenji',
    displayName: 'Kenji Santos',
    username: 'kenji',
    location: 'Naga',
    bio: 'Ramen first, everything else later.',
    avatarUrl: coverCafe,
    coverImageUrl: coverShare,
    stats: { postCount: 64, followerCount: 310, followingCount: 95 },
  },
  {
    id: 'user-aliyah',
    displayName: 'Aliyah Cruz',
    username: 'aliyah',
    location: 'Naga',
    bio: 'Quiet cafes and long walks.',
    avatarUrl: coverShare,
    coverImageUrl: coverCafe,
    stats: { postCount: 58, followerCount: 240, followingCount: 120 },
  },
  {
    id: 'user-diego',
    displayName: 'Diego Ramos',
    username: 'diego',
    location: 'Bicol',
    bio: 'Trails, falls, and weekend rides.',
    avatarUrl: coverDestination,
    coverImageUrl: coverDestination,
    stats: { postCount: 31, followerCount: 156, followingCount: 88 },
  },
]

export function getMockProfile(userId?: string | null): ProfileView | undefined {
  if (!userId) return mockOwnProfile
  return mockProfiles.find((profile) => profile.id === userId || profile.username === userId)
}
