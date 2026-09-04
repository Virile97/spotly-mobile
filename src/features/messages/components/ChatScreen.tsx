import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { type Href, useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useRef, useState, type ComponentRef } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import Swipeable, { type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable'
import { KeyboardChatScrollView, KeyboardStickyView } from 'react-native-keyboard-controller'
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  getMessages,
  getThread,
  type ChatMessage,
} from '@/features/messages/data/mock-threads'
import { getMockPlace } from '@/features/places/data/mock-places'
import { ReactionPicker, type ReactionAnchor } from '@/features/reactions/components/ReactionPicker'
import type { ReactionSelection } from '@/features/reactions/types/reaction.types'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

function StripeAvatar({ emoji, size, rounded }: { emoji?: string; size: number; rounded: number }) {
  return (
    <View style={[styles.stripeMark, { width: size, height: size, borderRadius: rounded }]}>
      {Array.from({ length: 7 }, (_, index) => (
        <View key={index} style={[styles.stripe, { left: index * 10 - 18 }]} />
      ))}
      {emoji ? <Text style={{ fontSize: size * 0.4 }}>{emoji}</Text> : null}
    </View>
  )
}

function truncateQuote(text: string): string {
  if (text.length <= 34) return text
  return `${text.slice(0, 34).trimEnd()}...`
}

function QuoteCard({ text }: { text: string }) {
  return (
    <View style={styles.quote}>
      <View style={styles.quoteBar} />
      <Text style={styles.quoteText} numberOfLines={1}>
        Replying to "{truncateQuote(text)}"
      </Text>
    </View>
  )
}

function MessageRow({
  message,
  showSeen,
  onReply,
  onDelete,
  onReact,
}: {
  message: ChatMessage
  showSeen: boolean
  onReply: () => void
  onDelete: () => void
  onReact: (selection: ReactionSelection) => void
}) {
  const swipeRef = useRef<SwipeableMethods>(null)
  const bubbleRef = useRef<View>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [anchor, setAnchor] = useState<ReactionAnchor | null>(null)

  const openReactions = () => {
    bubbleRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height })
      setPickerOpen(true)
    })
  }

  return (
    <Swipeable
      ref={swipeRef}
      friction={2}
      overshootFriction={8}
      leftThreshold={48}
      rightThreshold={48}
      containerStyle={styles.swipeRow}
      childrenContainerStyle={styles.swipeChildren}
      renderLeftActions={() => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete message"
          style={styles.deleteAction}
          onPress={onDelete}>
          <Ionicons name="trash-outline" size={22} color={palette.white} />
        </Pressable>
      )}
      renderRightActions={() => (
        <View style={styles.replyAction}>
          <Ionicons name="arrow-undo-outline" size={22} color={palette.pink500} />
        </View>
      )}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') {
          onReply()
          swipeRef.current?.close()
        }
      }}>
      <Pressable
        ref={bubbleRef}
        accessibilityHint="Long press to react. Swipe left to reply, swipe right then tap delete"
        delayLongPress={320}
        onLongPress={openReactions}
        style={[styles.bubbleWrap, message.fromMe && styles.bubbleWrapMine]}>
        {message.replyToText ? <QuoteCard text={message.replyToText} /> : null}
        {message.mediaUrl ? (
          <Image source={{ uri: message.mediaUrl }} style={styles.media} contentFit="cover" />
        ) : null}
        {message.text ? (
          <View style={[styles.bubble, message.fromMe ? styles.bubbleMine : styles.bubbleTheirs]}>
            <Text style={[styles.bubbleText, message.fromMe && styles.bubbleTextMine]}>{message.text}</Text>
          </View>
        ) : null}
        {message.reactionEmoji ? (
          <View style={[styles.reactionBadge, message.fromMe && styles.reactionBadgeMine]}>
            <Text style={styles.reactionEmoji}>{message.reactionEmoji}</Text>
          </View>
        ) : null}
        {showSeen && message.seenLabel ? <Text style={styles.seen}>{message.seenLabel}</Text> : null}
      </Pressable>

      <ReactionPicker
        visible={pickerOpen}
        anchor={anchor}
        selectedEmoji={message.reactionEmoji ?? null}
        onSelect={onReact}
        onClose={() => setPickerOpen(false)}
      />
    </Swipeable>
  )
}

export function ChatScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { threadId } = useLocalSearchParams<{ threadId: string }>()
  const id = Array.isArray(threadId) ? threadId[0] : threadId
  const thread = getThread(id)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(() => getMessages(id))
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)
  const [toolsOpen, setToolsOpen] = useState(true)
  const keepToolsOpen = useRef(false)

  const place = thread?.placeId ? getMockPlace(thread.placeId) : undefined
  const rounded = thread?.kind === 'place' ? 10 : 18
  const scrollRef = useRef<ComponentRef<typeof KeyboardChatScrollView>>(null)
  const inputRef = useRef<TextInput>(null)

  const lastOutgoingIndex = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index]?.fromMe) return index
    }
    return -1
  }, [messages])

  if (!thread) return <ErrorState />

  const appendMessage = (message: Omit<ChatMessage, 'id' | 'fromMe' | 'seenLabel'>) => {
    setMessages((current) => [
      ...current.map((item) => ({ ...item, seenLabel: undefined })),
      {
        id: `m-${Date.now()}`,
        fromMe: true,
        replyToText: replyingTo ? replyingTo.text || 'Photo' : undefined,
        ...message,
      },
    ])
    setReplyingTo(null)
    setDraft('')
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true })
    })
  }

  const send = () => {
    const text = draft.trim()
    if (!text) return
    appendMessage({ text })
  }

  const startReply = (message: ChatMessage) => {
    setReplyingTo(message)
    inputRef.current?.focus()
  }

  const deleteMessage = (message: ChatMessage) => {
    setMessages((current) => current.filter((item) => item.id !== message.id))
    setReplyingTo((current) => (current?.id === message.id ? null : current))
  }

  const reactToMessage = (messageId: string, selection: ReactionSelection) => {
    setMessages((current) =>
      current.map((item) => {
        if (item.id !== messageId) return item
        if (item.reactionEmoji === selection.emoji) return { ...item, reactionEmoji: undefined }
        return { ...item, reactionEmoji: selection.emoji }
      })
    )
  }

  const pickImage = async (source: 'camera' | 'library') => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) return

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.85 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 })

    if (result.canceled || !result.assets[0]?.uri) return
    appendMessage({ text: '', mediaUrl: result.assets[0].uri })
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.headerButton}
          onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={palette.white} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ${thread.name}'s profile`}
          disabled={!thread.userId}
          style={styles.headerPerson}
          onPress={() => {
            if (thread.userId) router.push(`/users/${thread.userId}` as Href)
          }}>
          {place?.coverImageUrl ? (
            <Image
              source={{ uri: place.coverImageUrl }}
              style={[styles.headerAvatar, { borderRadius: rounded }]}
              contentFit="cover"
            />
          ) : (
            <StripeAvatar emoji={thread.emoji} size={36} rounded={rounded} />
          )}
          {thread.online ? <View style={styles.onlineDot} /> : null}
        </Pressable>

        <View style={styles.headerCopy}>
          <Text style={styles.headerName} numberOfLines={1}>
            {thread.name}
          </Text>
          <Text style={[styles.headerStatus, thread.online && styles.headerStatusOnline]}>
            {thread.online ? 'Active now' : thread.timeLabel}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Call"
          style={styles.headerIcon}
          onPress={() => router.push(`/messages/${thread.id}/call` as Href)}>
          <Ionicons name="call-outline" size={20} color={palette.white} />
        </Pressable>
      </View>

      <KeyboardChatScrollView
        ref={scrollRef}
        style={styles.threadScroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        keyboardLiftBehavior="always"
        offset={Math.max(0, insets.bottom - spacing.sm)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.thread}>
        <Text style={styles.stamp}>Today, 2:14 PM</Text>
        {messages.map((message, index) => (
          <MessageRow
            key={message.id}
            message={message}
            showSeen={index === lastOutgoingIndex}
            onReply={() => startReply(message)}
            onDelete={() => deleteMessage(message)}
            onReact={(selection) => reactToMessage(message.id, selection)}
          />
        ))}
      </KeyboardChatScrollView>

      <KeyboardStickyView offset={{ closed: 0, opened: Math.max(0, insets.bottom - spacing.sm) }}>
        {replyingTo ? (
          <View style={styles.composerReply}>
            <View style={styles.composerReplyCard}>
              <QuoteCard text={replyingTo.text || 'Photo'} />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel reply"
              hitSlop={8}
              onPress={() => setReplyingTo(null)}>
              <Ionicons name="close" size={18} color="rgba(255,255,255,0.55)" />
            </Pressable>
          </View>
        ) : null}

        <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
          {toolsOpen ? (
            <Animated.View
              key="tools"
              entering={FadeIn.duration(160)}
              exiting={FadeOut.duration(120)}
              layout={LinearTransition.duration(200)}
              style={styles.tools}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Camera"
                style={styles.toolButton}
                onPress={() => void pickImage('camera')}>
                <Ionicons name="camera-outline" size={20} color={palette.white} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Photo library"
                style={styles.toolButton}
                onPress={() => void pickImage('library')}>
                <Ionicons name="image-outline" size={20} color={palette.white} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="GIF"
                style={styles.gifButton}
                onPress={() => void pickImage('library')}>
                <Text style={styles.gifLabel}>GIF</Text>
              </Pressable>
            </Animated.View>
          ) : (
            <Animated.View
              key="tools-toggle"
              entering={FadeIn.duration(160)}
              exiting={FadeOut.duration(120)}
              layout={LinearTransition.duration(200)}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Show media tools"
                style={styles.toolButton}
                onPress={() => {
                  keepToolsOpen.current = true
                  setToolsOpen(true)
                  inputRef.current?.focus()
                }}>
                <Ionicons name="chevron-forward" size={20} color={palette.white} />
              </Pressable>
            </Animated.View>
          )}

          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            placeholder="Message..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
            multiline
            blurOnSubmit={false}
            textAlignVertical="center"
            onFocus={() => {
              if (keepToolsOpen.current) {
                keepToolsOpen.current = false
                return
              }
              setToolsOpen(false)
            }}
            onPressIn={() => {
              keepToolsOpen.current = false
              setToolsOpen(false)
            }}
            onBlur={() => {
              if (keepToolsOpen.current) return
              setToolsOpen(true)
            }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send"
            style={[styles.sendButton, !draft.trim() && styles.sendDisabled]}
            disabled={!draft.trim()}
            onPress={send}>
            <Ionicons name="send" size={16} color={palette.black} />
          </Pressable>
        </View>
      </KeyboardStickyView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPerson: {
    width: 36,
    height: 36,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    backgroundColor: '#17161A',
  },
  onlineDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.green500,
    borderWidth: 2,
    borderColor: '#0A090B',
  },
  headerCopy: {
    flex: 1,
  },
  headerName: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  headerStatus: {
    marginTop: 1,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontFamily: fontFamily.body,
  },
  headerStatusOnline: {
    color: palette.green500,
  },
  headerIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripeMark: {
    overflow: 'hidden',
    backgroundColor: '#2A292E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripe: {
    position: 'absolute',
    top: -10,
    width: 5,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '28deg' }],
  },
  threadScroll: {
    flex: 1,
  },
  swipeRow: {
    overflow: 'hidden',
  },
  swipeChildren: {
    backgroundColor: '#0A090B',
  },
  deleteAction: {
    width: 72,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.red500,
  },
  replyAction: {
    width: 72,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thread: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: 8,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  stamp: {
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    fontFamily: fontFamily.body,
    marginBottom: spacing.sm,
  },
  bubbleWrap: {
    alignItems: 'flex-start',
    maxWidth: '80%',
    gap: 6,
  },
  bubbleWrapMine: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  quote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '100%',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingVertical: 8,
    paddingRight: 12,
    paddingLeft: 10,
  },
  quoteBar: {
    width: 3,
    alignSelf: 'stretch',
    minHeight: 16,
    borderRadius: 2,
    backgroundColor: palette.pink500,
  },
  quoteText: {
    flexShrink: 1,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontFamily: fontFamily.body,
  },
  media: {
    width: 180,
    height: 180,
    borderRadius: 16,
    backgroundColor: '#1C1C1E',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleTheirs: {
    backgroundColor: '#1C1C1E',
  },
  bubbleMine: {
    backgroundColor: palette.pink500,
  },
  bubbleText: {
    color: palette.white,
    fontSize: fontSize.sm,
    lineHeight: 20,
    fontFamily: fontFamily.body,
  },
  bubbleTextMine: {
    color: palette.black,
  },
  reactionBadge: {
    marginTop: -6,
    alignSelf: 'flex-start',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#0A090B',
  },
  reactionBadgeMine: {
    alignSelf: 'flex-end',
  },
  reactionEmoji: {
    fontSize: 14,
    lineHeight: 18,
  },
  seen: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
    fontFamily: fontFamily.body,
  },
  composerReply: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: '#0A090B',
  },
  composerReplyCard: {
    flex: 1,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: '#0A090B',
  },
  tools: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  toolButton: {
    width: 36,
    height: 36,
    marginBottom: 4,
    borderRadius: 18,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gifButton: {
    height: 36,
    marginBottom: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gifLabel: {
    color: palette.white,
    fontSize: 11,
    letterSpacing: 0.4,
    fontFamily: fontFamily.bodySemiBold,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    backgroundColor: '#17161A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: palette.white,
    fontSize: fontSize.sm,
    lineHeight: 20,
    fontFamily: fontFamily.body,
    includeFontPadding: false,
  },
  sendButton: {
    width: 40,
    height: 40,
    marginBottom: 2,
    borderRadius: 20,
    backgroundColor: palette.pink500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.4,
  },
})
