import { useState } from 'react'
import { FlatList } from 'react-native'

import { PlaceCard } from '@/features/places/components/PlaceCard'
import { useSearchPlaces } from '@/features/places/hooks/useSearchPlaces'
import { Screen } from '@/shared/components/layout/Screen'
import { Input } from '@/shared/components/ui'
import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { LoadingState } from '@/shared/components/feedback/LoadingState'

export default function ExploreScreen() {
  const [query, setQuery] = useState('')
  const { data, isLoading } = useSearchPlaces(query)

  return (
    <Screen>
      <Input placeholder="Search places…" value={query} onChangeText={setQuery} />
      {isLoading ? (
        <LoadingState />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PlaceCard place={item} />}
          ListEmptyComponent={<EmptyState title="Search for places" description="Find spots near you." />}
        />
      )}
    </Screen>
  )
}
