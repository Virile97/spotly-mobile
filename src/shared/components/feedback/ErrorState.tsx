import { StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'

import { ErrorModal } from '@/shared/components/feedback/ErrorModal'

interface ErrorStateProps {
  onRetry?: () => void
  message?: string
}

export function ErrorState({ onRetry, message }: ErrorStateProps) {
  const router = useRouter()

  const handleClose = () => {
    if (router.canGoBack()) router.back()
  }

  return (
    <View style={styles.container}>
      <ErrorModal visible message={message} onClose={handleClose} onRetry={onRetry} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
})
