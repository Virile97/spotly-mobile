import { Asset } from 'expo-asset'

import type { Post } from '@/features/posts/types/post.types'

function assetUri(module: number): string {
  return Asset.fromModule(module).uri
}

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    author: { id: 'user-joshua', username: 'Joshua', avatarUrl: null },
    caption: '"Had an amazing Spanish Latte today. Definitely coming back!"',
    mediaUrls: [
      assetUri(require('../../../../assets/images/onboarding/slide-share.png')),
      assetUri(require('../../../../assets/images/onboarding/slide-discover.png')),
      assetUri(require('../../../../assets/images/onboarding/slide-destination.png')),
    ],
    placeId: 'place-coffee-house',
    placeName: 'Coffee House',
    location: 'Naga City',
    isOpen: true,
    distanceKm: 1.2,
    reactionCount: 128,
    commentCount: 24,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-2',
    author: { id: 'user-maria', username: 'Maria', avatarUrl: null },
    caption: '',
    mediaUrls: [],
    placeId: null,
    placeName: null,
    location: 'Caramoan',
    isOpen: null,
    distanceKm: null,
    reactionCount: 0,
    commentCount: 0,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
]
