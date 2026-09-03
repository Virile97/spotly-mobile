import { StyleSheet, View } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'
import { EmptyState } from '@/shared/components/feedback/EmptyState'

export function AppMap() {
  const { theme } = useAppTheme()
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <EmptyState title="Map unavailable on web" description="Open the app on iOS or Android to view the map." />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
