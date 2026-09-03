import { Link, Stack } from 'expo-router'

import { useAppTheme } from '@/providers/ThemeProvider'
import { Screen } from '@/shared/components/layout/Screen'
import { EmptyState } from '@/shared/components/feedback/EmptyState'

export default function NotFoundScreen() {
  const { theme } = useAppTheme()

  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <Screen>
        <EmptyState title="This screen doesn't exist" description="The link you followed may be broken." />
        <Link href="/(tabs)" style={{ color: theme.colors.primary, textAlign: 'center', marginTop: theme.spacing.md }}>
          Go to home screen
        </Link>
      </Screen>
    </>
  )
}
