import { StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'

import { ErrorModal } from '@/shared/components/feedback/ErrorModal'

interface ErrorStateProps {
  onRetry?: () => void
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  const router = useRouter()

  const handleClose = () => {
    if (router.canGoBack()) router.back()
  }

  return (
    <View style={styles.container}>
      <ErrorModal visible onClose={handleClose} onRetry={onRetry} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
})
