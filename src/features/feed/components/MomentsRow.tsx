import { ScrollView, StyleSheet, View } from 'react-native'

import { mockMoments } from '@/features/feed/data/mock-moments'
import { spacing } from '@/theme/spacing'
import { MomentCard } from './MomentCard'

export function MomentsRow() {
  return (
    <View style={styles.section}>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {mockMoments.map((moment) => (
          <MomentCard key={moment.id} moment={moment} />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: '#0A090B',
  },
  row: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
})
