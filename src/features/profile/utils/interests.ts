import type { Interest } from '@/features/profile/types/profile.types'

interface InterestInput {
  id?: string
  icon?: string
  emoji?: string
  name?: string
  label?: string
}

export function normalizeInterest(raw: InterestInput): Interest | null {
  if (!raw.id) return null
  return {
    id: raw.id,
    icon: raw.icon ?? raw.emoji ?? '',
    name: raw.name ?? raw.label ?? '',
  }
}

export function normalizeInterestList(list: InterestInput[] | undefined | null): Interest[] {
  if (!list) return []
  return list.map(normalizeInterest).filter((item): item is Interest => item != null)
}
