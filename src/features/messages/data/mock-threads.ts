export type MessageThreadKind = 'direct' | 'place' | 'group'

export interface MessageThread {
  id: string
  name: string
  snippet: string
  timeLabel: string
  unreadCount: number
  kind: MessageThreadKind
  online?: boolean
  avatarUrl?: string | null
  emoji?: string
  placeId?: string
  userId?: string
}

export interface ChatMessage {
  id: string
  fromMe: boolean
  text: string
  seenLabel?: string
  replyToText?: string
  mediaUrl?: string
  reactionEmoji?: string
}

export const mockThreads: MessageThread[] = [
  {
    id: 'thread-maria',
    name: 'Maria Reyes',
    snippet: 'Are you still going to Coffee House this weekend?',
    timeLabel: '2m',
    unreadCount: 2,
    kind: 'direct',
    online: true,
    userId: 'user-maria',
  },
  {
    id: 'thread-coffee-house',
    name: 'Coffee House',
    snippet: 'Thanks for the shoutout! ☕',
    timeLabel: '1h',
    unreadCount: 0,
    kind: 'place',
    emoji: '☕',
    placeId: 'place-coffee-house',
  },
  {
    id: 'thread-john',
    name: 'John Alcala',
    snippet: "Let's do kinalas tomorrow",
    timeLabel: 'Yesterday',
    unreadCount: 0,
    kind: 'direct',
    userId: 'user-john',
  },
  {
    id: 'thread-kenji',
    name: 'Kenji Santos',
    snippet: 'The ramen place was packed',
    timeLabel: 'Mon',
    unreadCount: 0,
    kind: 'direct',
    userId: 'user-kenji',
  },
  {
    id: 'thread-weekend',
    name: 'Weekend hike crew',
    snippet: 'See you at 4:30 AM',
    timeLabel: 'Sat',
    unreadCount: 0,
    kind: 'group',
    emoji: '🥾',
  },
  {
    id: 'thread-aliyah',
    name: 'Aliyah Cruz',
    snippet: 'Cafe work session still on?',
    timeLabel: 'Sat',
    unreadCount: 0,
    kind: 'direct',
    userId: 'user-aliyah',
  },
]

const mockMessages: Record<string, ChatMessage[]> = {
  'thread-maria': [
    { id: 'm1', fromMe: false, text: 'Hey! Did you end up going to Coffee House?' },
    { id: 'm2', fromMe: true, text: 'Yes! The Spanish Latte was so good, I posted about it 😊' },
    { id: 'm3', fromMe: false, text: 'Saw it! Are you still going to Coffee House this weekend?' },
    {
      id: 'm4',
      fromMe: true,
      text: 'Yeah, thinking Saturday morning before it gets crowded',
      seenLabel: 'Seen 2:16 PM',
    },
    {
      id: 'm5',
      fromMe: false,
      text: "Perfect, I'll meet you there at 9!",
      replyToText: 'Yeah, thinking Saturday morning before it gets crowded',
    },
  ],
  'thread-coffee-house': [
    { id: 'm1', fromMe: true, text: 'Loved the Spanish Latte — posted it on Spotly.' },
    { id: 'm2', fromMe: false, text: 'Thanks for the shoutout! ☕', seenLabel: 'Seen 1:02 PM' },
  ],
  'thread-john': [
    { id: 'm1', fromMe: false, text: "Let's do kinalas tomorrow" },
    { id: 'm2', fromMe: true, text: 'Down. Panganiban after work?', seenLabel: 'Seen Yesterday' },
  ],
  'thread-kenji': [
    { id: 'm1', fromMe: false, text: 'The ramen place was packed' },
    { id: 'm2', fromMe: true, text: 'Weeknights are better. Thursday?', seenLabel: 'Seen Mon' },
  ],
  'thread-weekend': [
    { id: 'm1', fromMe: false, text: 'Sunrise hike still on?' },
    { id: 'm2', fromMe: true, text: 'Yes. Trailhead at 4:30 AM.' },
    { id: 'm3', fromMe: false, text: 'See you at 4:30 AM' },
  ],
  'thread-aliyah': [
    { id: 'm1', fromMe: false, text: 'Cafe work session still on?' },
    { id: 'm2', fromMe: true, text: 'Yes — The Study Nook at 1.', seenLabel: 'Seen Sat' },
  ],
}

export function getThread(threadId: string | null | undefined): MessageThread | undefined {
  if (!threadId) return undefined
  return mockThreads.find((thread) => thread.id === threadId)
}

export function getMessages(threadId: string | null | undefined): ChatMessage[] {
  if (!threadId) return []
  return mockMessages[threadId] ?? []
}
