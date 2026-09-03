import { io, type Socket } from 'socket.io-client';

import { env } from '@/config/env';
import type { ClientToServerEvents, ServerToClientEvents } from './socket.types';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket(token: string): Socket<ServerToClientEvents, ClientToServerEvents> {
  if (!socket) {
    socket = io(env.socketUrl, {
      auth: { token },
      autoConnect: false,
      transports: ['websocket'],
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
