export const CREATE_ACTIVITY_TAGS = [
  { id: 'coffee', emoji: '☕', label: 'Coffee' },
  { id: 'food', emoji: '🍲', label: 'Food Trip' },
  { id: 'travel', emoji: '🏖️', label: 'Travel' },
  { id: 'hiking', emoji: '🥾', label: 'Hiking' },
  { id: 'photography', emoji: '📸', label: 'Photography' },
  { id: 'gaming', emoji: '🎮', label: 'Gaming' },
  { id: 'movies', emoji: '🎬', label: 'Movies' },
  { id: 'roadtrip', emoji: '🚗', label: 'Road Trip' },
] as const

export type CreateActivityTagId = (typeof CREATE_ACTIVITY_TAGS)[number]['id']

export const CREATE_ACTIVITY_STEPS = 4
