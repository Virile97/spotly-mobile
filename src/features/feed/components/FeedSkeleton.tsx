import { View } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'
import { Skeleton } from '@/shared/components/ui'

export function FeedSkeleton() {
  const { theme } = useAppTheme()

  return (
    <View style={{ gap: theme.spacing.md }}>
      {[1, 2, 3].map((key) => (
        <View key={key} style={{ gap: theme.spacing.sm }}>
          <Skeleton height={36} width={36} style={{ borderRadius: 18 }} />
          <Skeleton height={300} />
        </View>
      ))}
    </View>
  )
}
