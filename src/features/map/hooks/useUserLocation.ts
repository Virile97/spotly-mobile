import { useEffect, useState } from 'react';

import { locationService } from '@/features/map/services/location.service';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export function useUserLocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchLocation() {
      const granted = await locationService.requestPermission();
      if (!granted) {
        if (!cancelled) setError('Location permission denied');
        return;
      }
      const coords = await locationService.getCurrentPosition();
      if (!cancelled) setLocation(coords);
    }

    fetchLocation();
    return () => {
      cancelled = true;
    };
  }, []);

  return { location, error };
}
