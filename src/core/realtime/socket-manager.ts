import {
  AppState,
  type AppStateStatus,
  type NativeEventSubscription
} from "react-native"

import { refreshSession } from "@/core/api/interceptors"
import { authEvents } from "@/core/auth/auth-events"
import { tokenStorage } from "@/core/auth/token-storage"

import { createSocket, destroySocket, getSocket } from "./socket"
import type {
  RealtimeEvent,
  RealtimeHandler,
  RealtimeSocket
} from "./socket.types"

const RECONNECT_MS = 1_000
const BACKGROUND_MS = 30_000
const AUTH_ERROR = "invalid or expired access token"

type StoredHandler = (...args: never[]) => void
type Timer = ReturnType<typeof setTimeout>

let enabled = false
let connectionId = 0
let reconnectTimer: Timer | null = null
let backgroundTimer: Timer | null = null
let appStateSub: NativeEventSubscription | null = null

const listeners = new Map<RealtimeEvent, Set<StoredHandler>>()

const clear = (timer: Timer | null) => {
  if (timer) clearTimeout(timer)
}

const socketEvents = (socket: RealtimeSocket | null) =>
  socket as unknown as {
    on(event: string, handler: StoredHandler): void
    off(event: string, handler: StoredHandler): void
  } | null

function attachListeners(socket: RealtimeSocket) {
  listeners.forEach((handlers, event) => {
    handlers.forEach((handler) => socketEvents(socket)?.on(event, handler))
  })
}

async function connect() {
  const id = ++connectionId

  clear(reconnectTimer)
  reconnectTimer = null

  const token = await tokenStorage.getAccessToken()

  if (!enabled || id !== connectionId || !token) return

  const socket = createSocket(token)

  socket.on("connect_error", (error) => void handleConnectError(error))

  socket.on("disconnect", (reason) => {
    if (enabled && reason !== "io client disconnect") {
      scheduleReconnect()
    }
  })

  attachListeners(socket)
  socket.connect()
}

function scheduleReconnect() {
  if (!enabled || reconnectTimer) return

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    void connect()
  }, RECONNECT_MS)
}

async function handleConnectError(error: Error) {
  if (!enabled) return

  const isAuthError = error.message.toLowerCase().includes(AUTH_ERROR)

  if (!isAuthError) {
    scheduleReconnect()
    return
  }

  try {
    await refreshSession()

    if (enabled) await connect()
  } catch {
    await tokenStorage.clear()
    authEvents.emit("unauthorized")
  }
}

function handleAppState(state: AppStateStatus) {
  if (!enabled) return

  if (state === "active") {
    clear(backgroundTimer)
    backgroundTimer = null

    if (!getSocket()?.connected) void connect()
    return
  }

  if (state !== "background") return

  clear(backgroundTimer)

  backgroundTimer = setTimeout(() => {
    backgroundTimer = null
    connectionId++
    destroySocket()
  }, BACKGROUND_MS)
}

function start() {
  if (enabled) return

  enabled = true
  appStateSub = AppState.addEventListener("change", handleAppState)

  void connect()
}

function stop() {
  enabled = false
  connectionId++

  clear(reconnectTimer)
  clear(backgroundTimer)

  reconnectTimer = null
  backgroundTimer = null

  appStateSub?.remove()
  appStateSub = null

  destroySocket()
}

function on<E extends RealtimeEvent>(event: E, handler: RealtimeHandler<E>) {
  const stored = handler as StoredHandler
  const handlers = listeners.get(event) ?? new Set<StoredHandler>()

  handlers.add(stored)
  listeners.set(event, handlers)

  socketEvents(getSocket())?.on(event, stored)

  return () => {
    handlers.delete(stored)

    if (!handlers.size) {
      listeners.delete(event)
    }

    socketEvents(getSocket())?.off(event, stored)
  }
}

export const socketManager = {
  start,
  stop,
  on,
  getSocket
}
