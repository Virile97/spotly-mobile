export interface ApiResponse<T> {
  data: T
  message?: string
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'
