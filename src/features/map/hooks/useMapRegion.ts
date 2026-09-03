import { useState } from 'react'
import type { Region } from 'react-native-maps'

const DEFAULT_DELTA = { latitudeDelta: 0.05, longitudeDelta: 0.05 }

export function useMapRegion(initial?: { latitude: number; longitude: number }) {
  const [region, setRegion] = useState<Region | undefined>(
    initial ? { ...initial, ...DEFAULT_DELTA } : undefined
  )

  return { region, setRegion }
}
