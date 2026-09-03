import { StyleSheet, Text, View } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'
import { Avatar } from '@/shared/components/ui'
import type { UserProfile } from '@/features/profile/api/profile.api'
import { ProfileStats } from './ProfileStats'

export function ProfileHeader({ profile }: { profile: UserProfile }) {
  const { theme } = useAppTheme()

  return (
    <View style={{ padding: theme.spacing.md }}>
      <View style={styles.row}>
        <Avatar uri={profile.avatarUrl} fallback={profile.displayName} size={72} />
        <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
          <ProfileStats stats={profile.stats} />
        </View>
      </View>
      <Text style={{ color: theme.colors.text, fontWeight: theme.fontWeight.semibold, marginTop: theme.spacing.sm }}>
        {profile.displayName}
      </Text>
      {profile.bio ? (
        <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.xs }}>{profile.bio}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
