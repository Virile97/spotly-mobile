import { useRouter } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

import type { Post } from '@/features/posts/types/post.types'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'
import { PostActions } from './PostActions'
import { PostCaption } from './PostCaption'
import { PostHeader } from './PostHeader'
import { PostMedia } from './PostMedia'

export function PostCard({ post }: { post: Post }) {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <PostHeader post={post} />

      <PostMedia uris={post.mediaUrls} />

      <View style={styles.body}>
        {post.caption ? (
          <PostCaption
            caption={post.caption}
            placeName={post.placeName}
            onMentionPress={(username) => router.push(`/users/${username}`)}
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

      <PostActions
        reactionCount={post.reactionCount}
        commentCount={post.commentCount}
        onReactionPress={() => {}}
        onCommentPress={() => router.push(`/comments/${post.id}`)}
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
