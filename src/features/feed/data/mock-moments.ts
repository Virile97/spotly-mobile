import { Asset } from 'expo-asset'

import type { Moment } from '@/features/feed/types/moment.types'

function assetUri(module: number): string {
  return Asset.fromModule(module).uri
}

const coffee = assetUri(require('../../../../assets/images/onboarding/slide-discover.png'))
const collage = assetUri(require('../../../../assets/images/onboarding/slide-share.png'))
const skyline = assetUri(require('../../../../assets/images/onboarding/slide-destination.png'))

export const mockMoments: Moment[] = [
  {
    id: 'moment-joshua',
    authorName: 'Joshua',
    authorAvatarUrl: null,
    imageUrl: coffee,
    emoji: '☕',
    isUnseen: true,
  },
  {
    id: 'moment-maria',
    authorName: 'Maria',
    authorAvatarUrl: null,
    imageUrl: skyline,
    emoji: '🏝️',
    isUnseen: true,
  },
  {
    id: 'moment-john',
    authorName: 'John',
    authorAvatarUrl: null,
    imageUrl: collage,
    emoji: '📸',
    isUnseen: true,
  },
  {
    id: 'moment-kenji',
    authorName: 'Kenji',
    authorAvatarUrl: null,
    imageUrl: coffee,
    emoji: '🍜',
    isUnseen: true,
  },
  {
    id: 'moment-aliyah',
    authorName: 'Aliyah',
    authorAvatarUrl: null,
    imageUrl: collage,
    emoji: '💻',
    isUnseen: false,
  },
]
