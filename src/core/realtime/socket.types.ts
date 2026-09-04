import type { Socket } from "socket.io-client"

import type { Profile } from "@/features/profile/types/profile.types"
import { SOCKET_EVENTS } from "./socket-events"

export type ProfileUpdatedPayload = Profile

export interface ServerToClientEvents {
  [SOCKET_EVENTS.PROFILE_UPDATED]: (profile: ProfileUpdatedPayload) => void
}

export type ClientToServerEvents = Record<string, never>

export type RealtimeSocket = Socket<ServerToClientEvents, ClientToServerEvents>
export type RealtimeEvent = keyof ServerToClientEvents
export type RealtimeHandler<E extends RealtimeEvent> = ServerToClientEvents[E]
