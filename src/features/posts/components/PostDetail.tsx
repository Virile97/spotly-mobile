import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { KeyboardStickyView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CommentComposer } from '@/features/comments/components/CommentComposer'
import { CommentThreadItem } from '@/features/comments/components/CommentThreadItem'
import { useCommentThreads } from '@/features/comments/hooks/useCommentThreads'
import type { Comment } from '@/features/comments/types/comment.types'
import { MediaLightbox } from '@/features/posts/components/MediaLightbox'
import { PostActions } from '@/features/posts/components/PostActions'
import { PostCaption } from '@/features/posts/components/PostCaption'
import { PostMedia } from '@/features/posts/components/PostMedia'
import { PostPlaceCard } from '@/features/posts/components/PostPlaceCard'
import type { Post } from '@/features/posts/types/post.types'
import { usePostReaction } from '@/features/reactions/hooks/usePostReaction'
import { Avatar } from '@/shared/components/ui'
import { formatRelativeTime } from '@/shared/utils/date'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface PostDetailProps {
  post: Post
}

export function PostDetail({ post }: PostDetailProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const scrollRef = useRef<ScrollView>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const { threads, commentCount, addComment } = useCommentThreads(post.id, post.commentCount)
  const { reaction, reactionCount, select, toggleDefault } = usePostReaction(post.id, post.reactionCount)

  const handleSubmit = (body: string) => {
    addComment(body, replyingTo?.id ?? null)
    setReplyingTo(null)
  }

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}>
        <View>
          {post.mediaUrls.length > 0 ? (
            <PostMedia uris={post.mediaUrls} aspectRatio={4 / 3} onPress={setLightboxIndex} />
          ) : (
            <View style={styles.heroFallback} />
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={6}
            style={[styles.heroButton, styles.backButton, { top: insets.top + spacing.sm }]}
            onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={palette.white} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="More options"
            hitSlop={6}
            style={[styles.heroButton, styles.moreButton, { top: insets.top + spacing.sm }]}>
            <Ionicons name="ellipsis-horizontal" size={20} color={palette.white} />
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.authorRow}>
            <Avatar
              uri={post.author.avatarUrl}
              fallback={post.author.username}
              size={40}
              backgroundColor="rgba(255,255,255,0.12)"
              color="rgba(255,255,255,0.8)"
            />

            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{post.author.username}</Text>
              <Text style={styles.timestamp}>{formatRelativeTime(post.createdAt)}</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              style={[styles.followButton, isFollowing && styles.followButtonActive]}
              onPress={() => setIsFollowing((current) => !current)}>
              <Text style={styles.followLabel}>{isFollowing ? 'Following' : 'Follow'}</Text>
            </Pressable>
          </View>

          {post.caption ? (
            <PostCaption
              caption={post.caption}
              truncate={false}
              onMentionPress={(username) => router.push(`/users/${username}`)}
            />
          ) : null}

          <PostPlaceCard post={post} />
        </View>

        <PostActions
          reactionCount={reactionCount}
          commentCount={commentCount}
          selectedEmoji={reaction?.emoji ?? null}
          onReactionPress={toggleDefault}
          onReactionSelect={select}
          onCommentPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.comments}>
          {threads.length === 0 ? (
            <Text style={styles.emptyComments}>No comments yet</Text>
          ) : (
            threads.map((thread) => (
              <CommentThreadItem key={thread.comment.id} thread={thread} onReplyPress={setReplyingTo} />
            ))
          )}
        </View>
      </ScrollView>

      <KeyboardStickyView>
        <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
          <CommentComposer
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
            onSubmit={handleSubmit}
          />
        </View>
      </KeyboardStickyView>

      <MediaLightbox
        uris={post.mediaUrls}
        initialIndex={lightboxIndex ?? 0}
        visible={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  heroFallback: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#17161A',
  },
  heroButton: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backButton: {
    left: spacing.md,
  },
  moreButton: {
    right: spacing.md,
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  timestamp: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
    marginTop: 2,
  },
  followButton: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  followButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  followLabel: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  comments: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
    marginTop: spacing.sm,
  },
  emptyComments: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    paddingVertical: spacing.lg,
    textAlign: 'center',
  },
  composer: {
    backgroundColor: '#0A090B',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
})
