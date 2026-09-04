export interface SavedCollection {
  id: string
  name: string
  emoji: string
  subtitle: string
  placeIds: string[]
}

export const mockCollections: SavedCollection[] = [
  {
    id: 'collection-coffee',
    name: 'Coffee Places',
    emoji: '☕',
    subtitle: '12 places · 3 open now',
    placeIds: ['place-coffee-house', 'place-study-nook'],
  },
  {
    id: 'collection-restaurants',
    name: 'Restaurants to Try',
    emoji: '🍜',
    subtitle: '8 places · 5 open now',
    placeIds: ['place-ramen-bar', 'place-kinalas-corner', 'place-garden-grill'],
  },
  {
    id: 'collection-weekend',
    name: 'Weekend Trips',
    emoji: '🏝️',
    subtitle: '6 places · Caramoan, Isarog',
    placeIds: ['place-malabsay-falls', 'place-caramoan-cove'],
  },
  {
    id: 'collection-favorites',
    name: 'Favorite Places',
    emoji: '❤️',
    subtitle: '21 places',
    placeIds: [
      'place-coffee-house',
      'place-ramen-bar',
      'place-study-nook',
      'place-malabsay-falls',
      'place-caramoan-cove',
      'place-kinalas-corner',
      'place-villa-caceres',
    ],
  },
]

const extraCollections: SavedCollection[] = []

export function getCollections(): SavedCollection[] {
  return [...mockCollections, ...extraCollections]
}

export function addCollection(collection: SavedCollection): void {
  extraCollections.push(collection)
}

export function getMockCollection(collectionId: string | null | undefined): SavedCollection | undefined {
  if (!collectionId) return undefined
  return getCollections().find((collection) => collection.id === collectionId)
}
