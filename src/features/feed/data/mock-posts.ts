import { Asset } from 'expo-asset'

import type { Post } from '@/features/posts/types/post.types'

function assetUri(module: number): string {
  return Asset.fromModule(module).uri
}

const slideShare = assetUri(require('../../../../assets/images/onboarding/slide-share.png'))
const slideDiscover = assetUri(require('../../../../assets/images/onboarding/slide-discover.png'))
const slideDestination = assetUri(require('../../../../assets/images/onboarding/slide-destination.png'))

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    author: { id: 'user-joshua', username: 'Joshua', avatarUrl: null },
    caption:
      '"Had an amazing Spanish Latte today. Definitely coming back!" The beans are roasted in-house every morning and you can taste the difference — nutty, a little chocolatey, not bitter at all. Went with @maria and @kenji after work and we ended up staying until closing because the staff kept recommending things off menu. Ask for the honey cold brew if you go. #coffee #nagacity #spotlyfinds',
    mediaUrls: [slideShare, slideDiscover, slideDestination],
    placeId: 'place-coffee-house',
    placeName: 'Coffee House',
    location: 'Naga City',
    isOpen: true,
    distanceKm: 1.2,
    reactionCount: 128,
    commentCount: 24,
    createdAt: hoursAgo(2),
  },
  {
    id: 'post-2',
    author: { id: 'user-maria', username: 'Maria', avatarUrl: null },
    caption: 'Sunrise at the cove was worth the 4am call time. #caramoan #sunrise',
    mediaUrls: [slideDestination],
    placeId: 'place-caramoan-cove',
    placeName: 'Matukad Island',
    location: 'Caramoan',
    isOpen: true,
    distanceKm: 42.8,
    reactionCount: 96,
    commentCount: 11,
    createdAt: hoursAgo(5),
  },
  {
    id: 'post-3',
    author: { id: 'user-kenji', username: 'Kenji', avatarUrl: null },
    caption:
      'Two weeks of scouting ramen in the city and this is still the one I keep going back to. The broth simmers for eighteen hours, the noodles are made in the shop, and the chashu falls apart the second you touch it. It is a tiny place — six seats at the counter and two tables — so go early or expect to wait about half an hour on weekends. Thanks @joshua for dragging me here the first time, I owe you one. Bringing @aliyah and @maria next week so we can try the whole menu properly. #ramen #foodtrip #nagaeats #spotlyfinds',
    mediaUrls: [slideDiscover, slideShare],
    placeId: 'place-ramen-bar',
    placeName: 'Ramen Bar',
    location: 'Naga City',
    isOpen: false,
    distanceKm: 3.4,
    reactionCount: 412,
    commentCount: 63,
    createdAt: hoursAgo(9),
  },
  {
    id: 'post-4',
    author: { id: 'user-aliyah', username: 'Aliyah', avatarUrl: null },
    caption: 'Quiet corner, fast wifi, no one rushing you out. My new #workfromcafe spot.',
    mediaUrls: [],
    placeId: 'place-study-nook',
    placeName: 'The Study Nook',
    location: 'Naga City',
    isOpen: true,
    distanceKm: 0.6,
    reactionCount: 54,
    commentCount: 7,
    createdAt: hoursAgo(22),
  },
  {
    id: 'post-5',
    author: { id: 'user-diego', username: 'Diego', avatarUrl: null },
    caption:
      'Rode out to the falls before sunrise and had the whole trail to ourselves for almost an hour. The last stretch is steep and slippery after rain, so bring shoes with grip and do not attempt it in sandals like I did last year. There is a small stall near the entrance selling boiled corn and coffee for almost nothing, and the caretaker will watch your bike for you. If you want the water to yourself, get there before seven. Trip planned entirely off @maria recommendations. #hiking #waterfalls #bicol #weekendtrip',
    mediaUrls: [slideDestination, slideShare, slideDiscover],
    placeId: 'place-malabsay-falls',
    placeName: 'Malabsay Falls',
    location: 'Mt. Isarog',
    isOpen: true,
    distanceKm: 14.1,
    reactionCount: 233,
    commentCount: 38,
    createdAt: hoursAgo(30),
  },
  {
    id: 'post-6',
    author: { id: 'user-tala', username: 'Tala', avatarUrl: null },
    caption: 'Closed for renovation until next month, but the sign says the garden seating is staying. #nagacity',
    mediaUrls: [slideShare],
    placeId: 'place-garden-grill',
    placeName: 'Garden Grill',
    location: 'Naga City',
    isOpen: false,
    distanceKm: 2.3,
    reactionCount: 18,
    commentCount: 4,
    createdAt: hoursAgo(52),
  },
]
