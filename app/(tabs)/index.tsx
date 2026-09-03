import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FeedList } from '@/features/feed/components/FeedList'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const hasUnreadNotifications = true

export default function FeedScreen() {
  const router = useRouter()
  const { mutate: logout, isPending: isLoggingOut } = useLogout()

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.brand}>Spotly</Text>

          <View style={styles.headerActions}>
            {/* TODO: temporary logout entry point for testing; move into settings/profile menu */}
            <Pressable
              accessibilityRole="button"
              style={styles.notificationButton}
              disabled={isLoggingOut}
              onPress={() => logout()}>
              <Ionicons name="log-out-outline" size={20} color={palette.white} />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              style={styles.notificationButton}
              onPress={() => router.push('/(tabs)/notifications')}>
              <Ionicons name="notifications-outline" size={20} color={palette.white} />
              {hasUnreadNotifications ? <View style={styles.notificationDot} /> : null}
            </Pressable>
          </View>
        </View>

        <FeedList />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  brand: {
    color: palette.white,
    fontSize: fontSize.xl,
    fontFamily: fontFamily.headline,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.pink500,
    borderWidth: 1.5,
    borderColor: '#0A090B',
  },
})
