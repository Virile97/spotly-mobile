import { Stack } from 'expo-router'

export default function TogetherLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A090B' } }}>
      <Stack.Screen name="search" />
      <Stack.Screen name="create" />
      <Stack.Screen name="[activityId]" />
    </Stack>
  )
}

