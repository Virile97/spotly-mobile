import { useState } from 'react'
import { Text } from 'react-native'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile'
import { useAppTheme } from '@/providers/ThemeProvider'
import { Screen } from '@/shared/components/layout/Screen'
import { Button, Input } from '@/shared/components/ui'

export default function AccountSettingsScreen() {
  const { theme } = useAppTheme()
  const user = useAuthStore((state) => state.user)
  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const { mutate, isPending, isSuccess } = useUpdateProfile()

  return (
    <Screen scroll>
      <Input label="Display name" value={displayName} onChangeText={setDisplayName} />
      <Button
        label="Save"
        onPress={() => mutate({ displayName })}
        loading={isPending}
        style={{ marginTop: theme.spacing.md }}
      />
      {isSuccess ? (
        <Text style={{ color: theme.colors.success, marginTop: theme.spacing.sm }}>Saved.</Text>
      ) : null}
    </Screen>
  )
}
