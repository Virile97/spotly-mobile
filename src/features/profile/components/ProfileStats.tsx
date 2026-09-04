import { StyleSheet, Text, View } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'
import { formatCompactNumber } from '@/shared/utils/number'
import type { ProfileStats as ProfileStatsType } from '@/features/profile/types/profile.types'

export function ProfileStats({ stats }: { stats: ProfileStatsType }) {
  const { theme } = useAppTheme()

  const items: [string, number][] = [
    ['Posts', stats.postCount],
    ['Followers', stats.followerCount],
    ['Following', stats.followingCount],
  ]

  return (
    <View style={styles.row}>
      {items.map(([label, value]) => (
        <View key={label} style={styles.item}>
          <Text style={{ color: theme.colors.text, fontWeight: theme.fontWeight.bold, fontSize: theme.fontSize.md }}>
            {formatCompactNumber(value)}
          </Text>
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.xs }}>{label}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    alignItems: 'center',
  },
})
