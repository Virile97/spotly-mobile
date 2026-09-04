export interface Place {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  isOpenNow: boolean
  coverImageUrl: string | null
  emoji?: string
  category?: 'food' | 'cafe' | 'nature' | 'other'
  isTrending?: boolean
  postCount?: number
  saveCount?: number
  communityScore?: number
  distanceKm?: number
  city?: string
  closesAt?: string | null
  verified?: boolean
}

export interface NearbyPlacesParams {
  latitude: number
  longitude: number
  radiusMeters?: number
}

export interface SearchPlacesParams {
  query: string
}
