import { View } from 'react-native'

import { Spinner } from '@/shared/components/ui'

export function LoadingState() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size="large" />
    </View>
  )
}
