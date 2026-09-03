import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context'

import { useAppTheme } from '@/providers/ThemeProvider'

export function SafeArea({ style, ...rest }: SafeAreaViewProps) {
  const { theme } = useAppTheme()
  return <SafeAreaView style={[{ flex: 1, backgroundColor: theme.colors.background }, style]} {...rest} />
}
