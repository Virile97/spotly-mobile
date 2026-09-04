import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { CommentsSheet } from '@/features/comments/components/CommentsSheet'
import { useCommentThreads } from '@/features/comments/hooks/useCommentThreads'
import type { Post } from '@/features/posts/types/post.types'
import { usePostReaction } from '@/features/reactions/hooks/usePostReaction'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'
import { PostActions } from './PostActions'
import { PostCaption } from './PostCaption'
import { PostHeader } from './PostHeader'
import { PostMedia } from './PostMedia'

export function PostCard({ post, onPress }: { post: Post; onPress?: () => void }) {
  const router = useRouter()
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const { threads, commentCount, addComment } = useCommentThreads(post.id, post.commentCount)
  const { reaction, reactionCount, select, toggleDefault } = usePostReaction(post.id, post.reactionCount)

  return (
    <View style={styles.container}>
      <PostHeader post={post} />

      <PostMedia uris={post.mediaUrls} onPress={onPress ? () => onPress() : undefined} />

      <Pressable disabled={!onPress} onPress={onPress}>
        <View style={styles.body}>
          {post.caption ? (
            <PostCaption
              caption={post.caption}
              placeName={post.placeName}
              onMentionPress={(username) => router.push(`/users/${username}`)}
              onPlacePress={() => {
                if (post.placeId) router.push(`/places/${post.placeId}`)
              }}
            />
          ) : null}

          {post.isOpen !== null ? (
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, post.isOpen ? styles.statusDotOpen : styles.statusDotClosed]} />
              <Text style={styles.statusText}>{post.isOpen ? 'Open' : 'Closed'}</Text>
              {post.distanceKm !== null ? (
                <Text style={styles.statusText}> · {post.distanceKm} km away</Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </Pressable>

      <PostActions
        reactionCount={reactionCount}
        commentCount={commentCount}
        selectedEmoji={reaction?.emoji ?? null}
        onReactionPress={toggleDefault}
        onReactionSelect={select}
        onCommentPress={() => setIsCommentsOpen(true)}
      />

      <CommentsSheet
        visible={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        threads={threads}
        commentCount={commentCount}
        onSubmit={addComment}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: spacing.lg,
    backgroundColor: '#0A090B',
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  statusDotOpen: {
    backgroundColor: palette.green500,
  },
  statusDotClosed: {
    backgroundColor: palette.red500,
  },
  statusText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
  },
})
