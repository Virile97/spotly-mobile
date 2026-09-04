import { Stack } from 'expo-router'

export default function ThreadLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A090B' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="call" />
    </Stack>
  )
}
