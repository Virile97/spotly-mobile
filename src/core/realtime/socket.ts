import { io } from 'socket.io-client'

import { env } from '@/config/env'
import type { RealtimeSocket } from './socket.types'

let socket: RealtimeSocket | null = null

export function createSocket(token: string): RealtimeSocket {
  destroySocket()
  socket = io(env.socketUrl, {
    auth: { token },
    autoConnect: false,
    reconnection: false,
    transports: ['websocket'],
  })
  return socket
}

export function getSocket() {
  return socket
}

export function destroySocket() {
  socket?.removeAllListeners()
  socket?.disconnect()
  socket = null
}
