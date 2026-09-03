import { disconnectSocket, getSocket } from './socket'

class SocketManager {
  connect(token: string): void {
    const socket = getSocket(token)
    if (!socket.connected) {
      socket.connect()
    }
  }

  disconnect(): void {
    disconnectSocket()
  }

  joinRoom(room: string): void {
    getSocket('').emit('room:join', room)
  }

  leaveRoom(room: string): void {
    getSocket('').emit('room:leave', room)
  }
}

export const socketManager = new SocketManager()
