import { useCallback, useState } from 'react'

import type { Reaction, ReactionSelection } from '@/features/reactions/types/reaction.types'

interface UsePostReactionResult {
  reaction: Reaction | null
  reactionCount: number
  select: (selection: ReactionSelection) => void
  toggleDefault: () => void
}

const DEFAULT_REACTION: ReactionSelection = { kind: 'love', emoji: '❤️' }

/**
 * Viewer reaction for a post, kept locally while the feed still runs on mock
 * posts.
 *
 * TODO: swap for `useReaction` once the reactions endpoint is live.
 */
export function usePostReaction(postId: string, initialCount: number): UsePostReactionResult {
  const [reaction, setReaction] = useState<Reaction | null>(null)
  const [count, setCount] = useState(initialCount)

  const select = useCallback(
    (selection: ReactionSelection) => {
      if (reaction?.emoji === selection.emoji) {
        setReaction(null)
        setCount((value) => Math.max(0, value - 1))
        return
      }

      if (!reaction) {
        setCount((value) => value + 1)
      }

      setReaction({ postId, ...selection })
    },
    [postId, reaction]
  )

  const toggleDefault = useCallback(() => {
    if (reaction) {
      setReaction(null)
      setCount((value) => Math.max(0, value - 1))
      return
    }

    select(DEFAULT_REACTION)
  }, [reaction, select])

  return { reaction, reactionCount: count, select, toggleDefault }
}
