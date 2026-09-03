import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import type { ComponentProps } from 'react'
import { type ColorValue } from 'react-native'

import { ScrollCollapseProvider } from '@/providers/ScrollCollapseProvider'
import { FloatingTabBar } from '@/shared/components/layout/FloatingTabBar'

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
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <TabIcon name="bookmark-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon name="person-outline" color={color} />,
        }}
      />
      <Tabs.Screen name="notifications" options={{ href: null }} />
    </Tabs>
  )
}

function TabIcon({ name, color, size = 22 }: { name: IoniconName; color: ColorValue; size?: number }) {
  return <Ionicons name={name} size={size} color={color} />
}
