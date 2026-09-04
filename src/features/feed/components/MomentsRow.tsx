import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { mockMoments } from '@/features/feed/data/mock-moments'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'
import { MomentCard } from './MomentCard'

export function MomentsRow() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Moments near you</Text>

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
  title: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  row: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
})
