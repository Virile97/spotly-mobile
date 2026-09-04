export interface EmojiCategory {
  id: string
  label: string
  emojis: string[]
}

/** Extra reactions offered after the plus on the long-press strip. */
export const CUSTOM_REACTION_CATEGORIES: EmojiCategory[] = [
  {
    id: 'smileys',
    label: 'Smileys',
    emojis: ['😀', '😁', '🥰', '😍', '🤩', '😎', '🤗', '🤔', '😴', '😭', '😤', '🤯'],
  },
  {
    id: 'gestures',
    label: 'Gestures',
    emojis: ['👏', '🙌', '🙏', '💪', '✌️', '🤝', '👊', '👎', '🫶', '👀', '✨', '💯'],
  },
  {
    id: 'hearts',
    label: 'Hearts',
    emojis: ['🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💕', '💖', '💗', '💘', '💝'],
  },
  {
    id: 'places',
    label: 'Places',
    emojis: ['🔥', '⭐', '🌙', '☕', '🍕', '🍰', '🍻', '✈️', '🏖️', '🗺️', '📸', '🎵'],
  },
]
