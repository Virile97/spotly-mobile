import type { ReactNode } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { AuthProvider } from './AuthProvider'
import { QueryProvider } from './QueryProvider'
import { SocketProvider } from './SocketProvider'
import { ThemeProvider } from './ThemeProvider'

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <ThemeProvider>
            <QueryProvider>
              <AuthProvider>
                <SocketProvider>{children}</SocketProvider>
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  )
}
