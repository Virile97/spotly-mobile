import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/core/query/query-keys';
import { placesApi } from '@/features/places/api/places.api';

export function usePlace(placeId: string) {
  return useQuery({
    queryKey: queryKeys.place(placeId),
    queryFn: () => placesApi.getPlace(placeId),
    enabled: Boolean(placeId),
  });
}
