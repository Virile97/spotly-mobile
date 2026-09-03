export interface ServerToClientEvents {
  'comment:created': (payload: { postId: string; commentId: string }) => void;
  'notification:received': (payload: { id: string; type: string }) => void;
}

export interface ClientToServerEvents {
  'room:join': (room: string) => void;
  'room:leave': (room: string) => void;
}
