import type { Socket } from "socket.io-client"

import type { Interest, Profile } from "@/features/profile/types/profile.types"
import { SOCKET_EVENTS } from "./socket-events"

export interface ProfileUpdatedPayload {
  id: string
  username: string | null
  displayName: string | null
  firstName: string
  middleName: string | null
  lastName: string
  bio: string | null
  avatarUrl: string | null
  backgroundImageUrl: string | null
  followersCount: number
  followingCount: number
  postsCount: number
  isActive: boolean
  createdAt: string
  interests: Interest[]
}

export interface ServerToClientEvents {
  [SOCKET_EVENTS.PROFILE_UPDATED]: (profile: ProfileUpdatedPayload) => void
}

export type ClientToServerEvents = Record<string, never>

export type RealtimeSocket = Socket<ServerToClientEvents, ClientToServerEvents>
export type RealtimeEvent = keyof ServerToClientEvents
export type RealtimeHandler<E extends RealtimeEvent> = ServerToClientEvents[E]
