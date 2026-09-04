import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View, type NativeSyntheticEvent, type TextLayoutEventData } from 'react-native'

import { parseCaption } from '@/features/posts/utils/caption'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { fontSize } from '@/theme/typography'

// Lines shown before the caption is clamped behind "See more".
const COLLAPSED_LINE_LIMIT = 3

interface PostCaptionProps {
  caption: string
  placeName?: string | null
  onMentionPress?: (username: string) => void
  onHashtagPress?: (tag: string) => void
  /** When false, the full caption is always shown. */
  truncate?: boolean
}

export function PostCaption({
  caption,
  placeName,
  onMentionPress,
  onHashtagPress,
  truncate = true,
}: PostCaptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  // Keyed by caption so a changed caption invalidates the measurement instead
  // of keeping a stale line count.
  const [measured, setMeasured] = useState<{ caption: string; lines: number } | null>(null)

  const segments = useMemo(() => parseCaption(caption), [caption])

  const lineCount = measured?.caption === caption ? measured.lines : null
  const isTruncatable = truncate && lineCount !== null && lineCount > COLLAPSED_LINE_LIMIT

  const onMeasureTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    setMeasured({ caption, lines: event.nativeEvent.lines.length })
  }

  const content = (
    <>
      {segments.map((segment, index) => {
        const key = `${segment.type}-${index}`

        if (segment.type === 'mention') {
          return (
            <Text key={key} style={styles.token} onPress={() => onMentionPress?.(segment.username)}>
              {segment.value}
            </Text>
          )
        }

        if (segment.type === 'hashtag') {
          return (
            <Text key={key} style={styles.token} onPress={() => onHashtagPress?.(segment.tag)}>
              {segment.value}
            </Text>
          )
        }

        return <Text key={key}>{segment.value}</Text>
      })}

      {placeName ? <Text style={styles.placeName}>{' '}📍 {placeName}</Text> : null}
    </>
  )

  return (
    <View>
      <Text style={styles.caption} numberOfLines={truncate && !isExpanded ? COLLAPSED_LINE_LIMIT : undefined}>
        {content}
      </Text>

      {truncate && lineCount === null ? (
        // Unclamped off-screen copy, measured once: onTextLayout on the visible
        // Text only reports the lines that survived numberOfLines.
        <Text
          style={[styles.caption, styles.measure]}
          onTextLayout={onMeasureTextLayout}
          accessible={false}
          pointerEvents="none">
          {content}
        </Text>
      ) : null}

      {isTruncatable ? (
        <Pressable
          accessibilityRole="button"
          hitSlop={6}
          style={styles.toggle}
          onPress={() => setIsExpanded((previous) => !previous)}>
          <Text style={styles.toggleText}>{isExpanded ? 'See less' : 'See more'}</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  caption: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    lineHeight: 20,
  },
  measure: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    opacity: 0,
  },
  token: {
    color: palette.pink500,
    fontFamily: fontFamily.bodySemiBold,
  },
  placeName: {
    color: palette.pink500,
    fontFamily: fontFamily.bodySemiBold,
  },
  toggle: {
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  toggleText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
})
