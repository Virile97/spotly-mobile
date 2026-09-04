export interface MapPoint {
  latitude: number
  longitude: number
}

export interface DrivingRoute {
  points: MapPoint[]
  distanceKm: number
}

interface OsrmRouteResponse {
  code?: string
  routes?: {
    distance: number
    geometry?: {
      coordinates?: [number, number][]
    }
  }[]
}

export async function fetchDrivingRoute(origin: MapPoint, destination: MapPoint): Promise<DrivingRoute | null> {
  const path = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`
  const url = `https://router.project-osrm.org/route/v1/driving/${path}?overview=full&geometries=geojson`

  try {
    const response = await fetch(url)
    if (!response.ok) return null

    const data = (await response.json()) as OsrmRouteResponse
    const route = data.routes?.[0]
    const coordinates = route?.geometry?.coordinates
    if (!coordinates || coordinates.length < 2) return null

    return {
      points: coordinates.map(([longitude, latitude]) => ({ latitude, longitude })),
      distanceKm: route.distance / 1000,
    }
  } catch {
    return null
  }
}

export function formatDistanceKm(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`
  }

  return `${distanceKm.toFixed(distanceKm >= 10 ? 0 : 1)} km away`
}
