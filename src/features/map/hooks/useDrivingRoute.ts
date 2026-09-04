import { useEffect, useState } from 'react'

import { fetchDrivingRoute, type DrivingRoute, type MapPoint } from '@/features/map/utils/route'

function pointKey(point: MapPoint | null): string {
  if (!point) return ''
  return `${point.latitude.toFixed(5)},${point.longitude.toFixed(5)}`
}

export function useDrivingRoute(origin: MapPoint | null, destination: MapPoint | null) {
  const destKey = pointKey(destination)
  const originKey = pointKey(origin)
  const [route, setRoute] = useState<(DrivingRoute & { key: string }) | null>(null)

  useEffect(() => {
    if (!origin || !destination) return

    const key = `${originKey}|${destKey}`
    let cancelled = false

    fetchDrivingRoute(origin, destination).then((next) => {
      if (!cancelled && next) setRoute({ ...next, key })
    })

    return () => {
      cancelled = true
    }
  }, [destKey, destination, origin, originKey])

  if (!route || route.key !== `${originKey}|${destKey}`) return null
  return route
}
