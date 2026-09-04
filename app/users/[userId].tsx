import { useLocalSearchParams } from 'expo-router'

import { ProfileScreen } from '@/features/profile/components/ProfileScreen'

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>()

  return <ProfileScreen userId={Array.isArray(userId) ? userId[0] : userId} />
}
