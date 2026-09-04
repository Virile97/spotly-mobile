import { AppState, type AppStateStatus, type NativeEventSubscription } from 'react-native'

import { refreshSession } from '@/core/api/interceptors'
import { authEvents } from '@/core/auth/auth-events'
import { tokenStorage } from '@/core/auth/token-storage'
import { createSocket, destroySocket, getSocket } from './socket'
import type { RealtimeEvent, RealtimeHandler, RealtimeSocket } from './socket.types'

const BACKGROUND_MS = 30_000
const RECONNECT_MS = 1_000
const AUTH_ERROR = 'invalid or expired access token'

type StoredHandler = (...args: never[]) => void

let enabled = false
let connectId = 0
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let backgroundTimer: ReturnType<typeof setTimeout> | null = null
let appStateSub: NativeEventSubscription | null = null

const listeners = new Map<RealtimeEvent, Set<StoredHandler>>()

function clearTimer(timer: ReturnType<typeof setTimeout> | null) {
  if (timer) clearTimeout(timer)
}

function events(target: RealtimeSocket | null) {
  return target as unknown as {
    on: (event: string, handler: StoredHandler) => void
    off: (event: string, handler: StoredHandler) => void
  } | null
}

function attachListeners(next: RealtimeSocket) {
  listeners.forEach((handlers, event) => {
    handlers.forEach((handler) => events(next)?.on(event, handler))
  })
}

async function connect() {
  const id = ++connectId
  clearTimer(reconnectTimer)
  reconnectTimer = null

  const token = await tokenStorage.getAccessToken()
  if (!enabled || id !== connectId || !token) return

  const socket = createSocket(token)
  socket.on('connect_error', (error) => {
    void onConnectError(error)
  })
  socket.on('disconnect', (reason) => {
    if (!enabled || reason === 'io client disconnect') return
    scheduleReconnect()
  })
  attachListeners(socket)
  socket.connect()
}

function scheduleReconnect() {
  if (reconnectTimer || !enabled) return
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    void connect()
  }, RECONNECT_MS)
}

async function onConnectError(error: Error) {
  if (!enabled) return

  if (!error.message.toLowerCase().includes(AUTH_ERROR)) {
    scheduleReconnect()
    return
  }

  try {
    await refreshSession()
    if (enabled) await connect()
  } catch {
    await tokenStorage.clear()
    authEvents.emit('unauthorized')
  }
}

function onAppState(state: AppStateStatus) {
  if (!enabled) return

  if (state === 'active') {
    clearTimer(backgroundTimer)
    backgroundTimer = null
    if (!getSocket()?.connected) void connect()
    return
  }

  if (state !== 'background') return

  clearTimer(backgroundTimer)
  backgroundTimer = setTimeout(() => {
    backgroundTimer = null
    connectId += 1
    destroySocket()
  }, BACKGROUND_MS)
}

function start() {
  if (enabled) return
  enabled = true
  appStateSub = AppState.addEventListener('change', onAppState)
  void connect()
}

function stop() {
  enabled = false
  connectId += 1
  clearTimer(reconnectTimer)
  clearTimer(backgroundTimer)
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
  events(getSocket())?.on(event, stored)

  return () => {
    handlers.delete(stored)
    events(getSocket())?.off(event, stored)
  }
}

export const socketManager = {
  start,
  stop,
  on,
  getSocket,
}
