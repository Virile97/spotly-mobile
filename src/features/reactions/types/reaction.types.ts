export const PRESET_REACTIONS = [
  { kind: 'like', emoji: '👍' },
  { kind: 'love', emoji: '❤️' },
  { kind: 'wow', emoji: '😮' },
  { kind: 'haha', emoji: '😂' },
] as const

export type PresetReactionKind = (typeof PRESET_REACTIONS)[number]['kind']

export type ReactionKind = PresetReactionKind | 'custom'

export interface ReactionSelection {
  kind: ReactionKind
  emoji: string
}

export interface Reaction extends ReactionSelection {
  postId: string
}

export function reactionFromEmoji(emoji: string): ReactionSelection {
  const preset = PRESET_REACTIONS.find((reaction) => reaction.emoji === emoji)

  return preset ?? { kind: 'custom', emoji }
}
