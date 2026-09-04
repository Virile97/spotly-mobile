import { Asset } from 'expo-asset'

import { getMockProfile } from '@/features/profile/data/mock-profile'

function assetUri(module: number): string {
  return Asset.fromModule(module).uri
}

const thumbCafe = assetUri(require('../../../../assets/images/onboarding/slide-share.png'))
const thumbBeans = assetUri(require('../../../../assets/images/onboarding/slide-discover.png'))
const thumbCove = assetUri(require('../../../../assets/images/onboarding/slide-destination.png'))

export type ActivityKind = 'like' | 'comment' | 'save' | 'follow' | 'place_update' | 'mention'
export type ActivityGroup = 'today' | 'week'

export interface ActivityItem {
  id: string
  kind: ActivityKind
  group: ActivityGroup
  timeLabel: string
  actorName?: string
  actorId?: string
  actorAvatarUrl?: string | null
  placeName?: string
  placeId?: string
  quote?: string
  peopleCount?: number
  postId?: string
  thumbUrl?: string | null
}

function actor(userId: string): Pick<ActivityItem, 'actorName' | 'actorId' | 'actorAvatarUrl'> {
  const profile = getMockProfile(userId)
  return {
    actorId: profile?.id ?? userId,
    actorName: profile?.displayName.split(' ')[0] ?? userId,
    actorAvatarUrl: profile?.avatarUrl ?? null,
  }
}

export const mockActivity: ActivityItem[] = [
  {
    id: 'act-like-maria',
    kind: 'like',
    group: 'today',
    timeLabel: '12m',
    ...actor('user-maria'),
    actorName: 'Maria',
    postId: 'post-1',
    thumbUrl: thumbCafe,
  },
  {
    id: 'act-comment-john',
    kind: 'comment',
    group: 'today',
    timeLabel: '45m',
    ...actor('user-john'),
    actorName: 'John',
    quote: 'Try the cheesecake!',
    postId: 'post-1',
    thumbUrl: thumbBeans,
  },
  {
    id: 'act-save-coffee',
    kind: 'save',
    group: 'today',
    timeLabel: '2h',
    peopleCount: 3,
    placeName: 'Coffee House',
    placeId: 'place-coffee-house',
    postId: 'post-1',
  },
  {
    id: 'act-follow-andrea',
    kind: 'follow',
    group: 'week',
    timeLabel: '2d',
    actorId: 'user-andrea',
    actorName: 'Andrea',
    actorAvatarUrl: null,
  },
  {
    id: 'act-update-coffee',
    kind: 'place_update',
    group: 'week',
    timeLabel: '3d',
    placeName: 'Coffee House',
    placeId: 'place-coffee-house',
    quote: 'Buy 1 Get 1 Coffee until 5 PM!',
  },
  {
    id: 'act-mention-ken',
    kind: 'mention',
    group: 'week',
    timeLabel: '4d',
    ...actor('user-kenji'),
    actorName: 'Ken',
    placeName: 'Kinalas Corner',
    placeId: 'place-kinalas-corner',
    postId: 'post-3',
    thumbUrl: thumbCove,
  },
]
