import { useRouter } from 'expo-router'

import { CreatePostForm } from '@/features/posts/components/CreatePostForm'

export default function CreateScreen() {
  const router = useRouter()

  return (
    <CreatePostForm
      onCancel={() => router.navigate('/(tabs)')}
      onSuccess={() => router.navigate('/(tabs)')}
    />
  )
}
