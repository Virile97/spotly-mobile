import { FlatList } from 'react-native';

import { useUserLocation } from '@/features/map/hooks/useUserLocation';
import { PlaceCard } from '@/features/places/components/PlaceCard';
import { useNearbyPlaces } from '@/features/places/hooks/useNearbyPlaces';
import { Screen } from '@/shared/components/layout/Screen';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { LoadingState } from '@/shared/components/feedback/LoadingState';

export default function PlacesScreen() {
  const { location, error: locationError } = useUserLocation();
  const { data, isLoading, isError, refetch } = useNearbyPlaces(location);

  if (locationError) return <ErrorState message={locationError} />;

  return (
    <Screen>
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PlaceCard place={item} />}
          ListEmptyComponent={<EmptyState title="No places nearby" />}
        />
      )}
    </Screen>
  );
}
