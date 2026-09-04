import { mockPosts } from '@/features/feed/data/mock-posts'

export interface PlaceExperience {
  id: string
  username: string
  body: string
  createdAt: string
  mediaUrl: string | null
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

const coffeeCover = mockPosts.find((post) => post.id === 'post-1')?.mediaUrls[0] ?? null

export const mockExperiencesByPlace: Record<string, PlaceExperience[]> = {
  'place-coffee-house': [
    {
      id: 'exp-1',
      username: 'Joshua',
      body: 'The Spanish Latte was amazing.',
      createdAt: hoursAgo(2),
      mediaUrl: coffeeCover,
    },
    {
      id: 'exp-2',
      username: 'Maria',
      body: 'Perfect place for studying.',
      createdAt: hoursAgo(24),
      mediaUrl: null,
    },
    {
      id: 'exp-3',
      username: 'John',
      body: 'Try the cheesecake!',
      createdAt: hoursAgo(72),
      mediaUrl: null,
    },
  ],
}

export function getPlaceExperiences(placeId: string): PlaceExperience[] {
  if (mockExperiencesByPlace[placeId]) return mockExperiencesByPlace[placeId]

  return mockPosts
    .filter((post) => post.placeId === placeId)
    .map((post) => ({
      id: `exp-${post.id}`,
      username: post.author.username,
      body: post.caption.split(/[.!]/)[0]?.trim() || post.caption,
      createdAt: post.createdAt,
      mediaUrl: post.mediaUrls[0] ?? null,
    }))
}
