export const queryKeys = {
  feed: (params?: object) => ['feed', params] as const,
  post: (postId: string) => ['post', postId] as const,
  postComments: (postId: string) => ['post', postId, 'comments'] as const,
  place: (placeId: string) => ['place', placeId] as const,
  nearbyPlaces: (params?: object) => ['places', 'nearby', params] as const,
  profile: (userId: string) => ['profile', userId] as const,
  notifications: () => ['notifications'] as const,
}
