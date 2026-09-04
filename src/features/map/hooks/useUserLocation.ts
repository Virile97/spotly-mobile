import { useEffect, useRef, useState } from 'react'

import { locationService, type Coordinates } from '@/features/map/services/location.service'

function bearingBetween(from: Coordinates, to: Coordinates): number | null {
  const latDelta = to.latitude - from.latitude
  const lngDelta = to.longitude - from.longitude
  if (Math.abs(latDelta) < 0.00002 && Math.abs(lngDelta) < 0.00002) return null

  const fromLat = (from.latitude * Math.PI) / 180
  const toLat = (to.latitude * Math.PI) / 180
  const dLng = ((to.longitude - from.longitude) * Math.PI) / 180
  const y = Math.sin(dLng) * Math.cos(toLat)
  const x = Math.cos(fromLat) * Math.sin(toLat) - Math.sin(fromLat) * Math.cos(toLat) * Math.cos(dLng)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

export function useUserLocation() {
  const [location, setLocation] = useState<Coordinates | null>(null)
  const [error, setError] = useState<string | null>(null)
  const previousRef = useRef<Coordinates | null>(null)

  useEffect(() => {
    let cancelled = false
    let positionSub: { remove: () => void } | null = null
    let headingSub: { remove: () => void } | null = null

    async function start() {
      const granted = await locationService.requestPermission()
      if (!granted) {
        if (!cancelled) setError('Location permission denied')
        return
      }

      const current = await locationService.getCurrentPosition()
      if (!cancelled) {
        previousRef.current = current
        setLocation(current)
      }

      const nextPosition = await locationService.watchPosition((coords) => {
        if (cancelled) return

        const previous = previousRef.current
        const movedHeading = previous ? bearingBetween(previous, coords) : null
        previousRef.current = coords
        setLocation({
          ...coords,
          heading: coords.heading ?? movedHeading ?? previous?.heading ?? null,
        })
      })

      if (cancelled) {
        nextPosition.remove()
        return
      }

      positionSub = nextPosition

      try {
        const nextHeading = await locationService.watchHeading((heading) => {
          if (cancelled) return
          setLocation((previous) => (previous ? { ...previous, heading } : previous))
        })

        if (cancelled) {
          nextHeading.remove()
          return
        }

        headingSub = nextHeading
      } catch {
        // Compass heading is optional; movement bearing still updates.
      }
    }

    start()

    return () => {
      cancelled = true
      positionSub?.remove()
      headingSub?.remove()
    }
  }, [])

  return { location, error }
}
