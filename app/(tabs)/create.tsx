import { useRouter } from 'expo-router'

import { CreatePostForm } from '@/features/posts/components/CreatePostForm'
import { Screen } from '@/shared/components/layout/Screen'

export default function CreateScreen() {
  const router = useRouter()

  return (
    <Screen scroll>
      <CreatePostForm onSuccess={() => router.push('/(tabs)')} />
    </Screen>
  )
}
