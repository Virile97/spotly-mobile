export type ReactionKind = 'like' | 'love' | 'wow' | 'haha'

export interface Reaction {
  postId: string
  kind: ReactionKind
}
