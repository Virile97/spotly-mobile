import { Text } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'

export function PlaceStatus({ isOpenNow }: { isOpenNow: boolean }) {
  const { theme } = useAppTheme()
  return (
    <Text style={{ color: isOpenNow ? theme.colors.success : theme.colors.error, fontWeight: theme.fontWeight.medium }}>
      {isOpenNow ? 'Open now' : 'Closed'}
    </Text>
  )
}
