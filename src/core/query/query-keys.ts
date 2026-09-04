export const queryKeys = {
  feed: (params?: object) => ['feed', params] as const,
  post: (postId: string) => ['post', postId] as const,
  postComments: (postId: string) => ['post', postId, 'comments'] as const,
  place: (placeId: string) => ['place', placeId] as const,
  nearbyPlaces: (params?: object) => ['places', 'nearby', params] as const,
  profileMe: () => ['profile', 'me'] as const,
  profileUsername: (username: string) => ['profile', 'username', username] as const,
  notifications: () => ['notifications'] as const,
}
