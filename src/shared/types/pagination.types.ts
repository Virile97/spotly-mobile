export interface PaginatedResponse<T> {
  items: T[]
  nextCursor: string | null
  hasMore: boolean
}

export interface PaginationParams {
  cursor?: string
  limit?: number
}
