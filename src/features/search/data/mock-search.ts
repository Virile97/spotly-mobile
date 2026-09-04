export interface TrendingChip {
  id: string
  emoji: string
  label: string
}

export interface SearchPerson {
  id: string
  name: string
  experienceCount: number
  location: string
}

export const trendingNearYou: TrendingChip[] = [
  { id: 'trend-caramoan', emoji: '🔥', label: 'Caramoan' },
  { id: 'trend-coffee', emoji: '☕', label: 'third wave coffee' },
  { id: 'trend-kinalas', emoji: '🍜', label: 'kinalas' },
  { id: 'trend-isarog', emoji: '🌄', label: 'Mt. Isarog' },
]

export const featuredPlaceIds = [
  'place-coffee-house',
  'place-kinalas-corner',
  'place-caramoan-cove',
] as const

export const mockSuggestedPeople: SearchPerson[] = [
  { id: 'user-maria', name: 'Maria Reyes', experienceCount: 142, location: 'Bicol' },
  { id: 'user-john', name: 'John Alcala', experienceCount: 86, location: 'Naga' },
  { id: 'user-kenji', name: 'Kenji Santos', experienceCount: 64, location: 'Naga' },
]

export const mockFollowingPeople: SearchPerson[] = [
  { id: 'user-aliyah', name: 'Aliyah Cruz', experienceCount: 58, location: 'Naga' },
  { id: 'user-diego', name: 'Diego Ramos', experienceCount: 31, location: 'Bicol' },
]
