import { useQuery } from '@tanstack/react-query';

import { placesApi } from '@/features/places/api/places.api';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { APP_CONSTANTS } from '@/shared/constants/config';

export function useSearchPlaces(query: string) {
  const debouncedQuery = useDebounce(query, APP_CONSTANTS.DEBOUNCE_MS);

  return useQuery({
    queryKey: ['places', 'search', debouncedQuery],
    queryFn: () => placesApi.searchPlaces({ query: debouncedQuery }),
    enabled: debouncedQuery.trim().length > 0,
  });
}
