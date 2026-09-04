import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { type Href, useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { KeyboardStickyView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  getMessages,
  getThread,
  type ChatMessage,
} from '@/features/messages/data/mock-threads'
import { getMockPlace } from '@/features/places/data/mock-places'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
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

export function ChatScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { threadId } = useLocalSearchParams<{ threadId: string }>()
  const id = Array.isArray(threadId) ? threadId[0] : threadId
  const thread = getThread(id)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(() => getMessages(id))

  const place = thread?.placeId ? getMockPlace(thread.placeId) : undefined
  const rounded = thread?.kind === 'place' ? 10 : 18

  const lastOutgoingIndex = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index]?.fromMe) return index
    }
    return -1
  }, [messages])

  if (!thread) return <ErrorState />

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setMessages((current) => [
      ...current.map((message) => ({ ...message, seenLabel: undefined })),
      { id: `m-${Date.now()}`, fromMe: true, text },
    ])
    setDraft('')
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

        <View style={styles.headerPerson}>
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
        </View>

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
        <Pressable accessibilityRole="button" accessibilityLabel="Location" style={styles.headerIcon}>
          <Ionicons name="compass-outline" size={20} color={palette.white} />
        </Pressable>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.thread}>
        <Text style={styles.stamp}>Today, 2:14 PM</Text>
        {messages.map((message, index) => (
          <View key={message.id} style={[styles.bubbleWrap, message.fromMe && styles.bubbleWrapMine]}>
            <View style={[styles.bubble, message.fromMe ? styles.bubbleMine : styles.bubbleTheirs]}>
              <Text style={[styles.bubbleText, message.fromMe && styles.bubbleTextMine]}>{message.text}</Text>
            </View>
            {index === lastOutgoingIndex && message.seenLabel ? (
              <Text style={styles.seen}>{message.seenLabel}</Text>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <KeyboardStickyView>
        <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Add attachment" style={styles.addButton}>
            <Ionicons name="add" size={22} color={palette.white} />
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={send}
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
  },
  bubbleWrapMine: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
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
  seen: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
    fontFamily: fontFamily.body,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: '#0A090B',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.full,
    backgroundColor: '#17161A',
    paddingHorizontal: 16,
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    includeFontPadding: false,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.pink500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.4,
  },
})
