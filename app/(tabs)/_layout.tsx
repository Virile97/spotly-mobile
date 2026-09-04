import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { Tabs } from 'expo-router'
import type { ComponentProps } from 'react'
import { StyleSheet, View, type ColorValue } from 'react-native'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { useDisplayedProfileImages } from '@/features/profile/hooks/useDisplayedProfileImages'
import { ScrollCollapseProvider } from '@/providers/ScrollCollapseProvider'
import { FloatingTabBar } from '@/shared/components/layout/FloatingTabBar'
import { palette } from '@/theme/colors'

type IoniconName = ComponentProps<typeof Ionicons>['name']

export default function TabsLayout() {
  return (
    <ScrollCollapseProvider>
      <TabsNavigator />
    </ScrollCollapseProvider>
  )
}

function TabsNavigator() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: '#0A090B' } }}
      tabBar={(props) => <FloatingTabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <TabIcon name="compass-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <TabIcon name="add" color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: 'Activities',
          tabBarIcon: ({ color }) => <TabIcon name="people-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <ProfileTabIcon />,
        }}
      />
      <Tabs.Screen name="notifications" options={{ href: null }} />
    </Tabs>
  )
}

function TabIcon({ name, color, size = 22 }: { name: IoniconName; color: ColorValue; size?: number }) {
  return <Ionicons name={name} size={size} color={color} />
}

function ProfileTabIcon() {
  const userAvatarUrl = useAuthStore((state) => state.user?.avatarUrl)
  const { avatarUrl } = useDisplayedProfileImages({
    avatarUrl: userAvatarUrl ?? null,
    backgroundImageUrl: null,
  })

  return (
    <View style={styles.avatarRing}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
          contentFit="cover"
          recyclingKey={avatarUrl}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  avatarRing: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: palette.white,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#17161A',
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
})
