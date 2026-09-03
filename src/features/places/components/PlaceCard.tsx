import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAppTheme } from '@/providers/ThemeProvider';
import type { Place } from '@/features/places/types/place.types';
import { PlaceStatus } from './PlaceStatus';

export function PlaceCard({ place }: { place: Place }) {
  const { theme } = useAppTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.row, { marginBottom: theme.spacing.sm }]}
      onPress={() => router.push(`/places/${place.id}`)}>
      {place.coverImageUrl ? (
        <Image source={{ uri: place.coverImageUrl }} style={styles.thumb} contentFit="cover" />
      ) : (
        <View style={[styles.thumb, { backgroundColor: theme.colors.surface }]} />
      )}
      <View style={{ marginLeft: theme.spacing.sm, flex: 1 }}>
        <Text style={{ color: theme.colors.text, fontWeight: theme.fontWeight.semibold }}>{place.name}</Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>{place.address}</Text>
        <PlaceStatus isOpenNow={place.isOpenNow} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
});
