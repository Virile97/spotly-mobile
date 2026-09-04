import { StyleSheet, Text, View } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'
import { Avatar } from '@/shared/components/ui'
import type { Profile } from '@/features/profile/types/profile.types'
import { profileDisplayName, profileStats } from '@/features/profile/utils/profile'
import { ProfileStats } from './ProfileStats'

export function ProfileHeader({ profile }: { profile: Profile }) {
  const { theme } = useAppTheme()
  const displayName = profileDisplayName(profile)

  return (
    <View style={{ padding: theme.spacing.md }}>
      <View style={styles.row}>
        <Avatar uri={profile.avatarUrl} fallback={displayName} size={72} />
        <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
          <ProfileStats stats={profileStats(profile)} />
        </View>
      </View>
      <Text style={{ color: theme.colors.text, fontWeight: theme.fontWeight.semibold, marginTop: theme.spacing.sm }}>
        {displayName}
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
