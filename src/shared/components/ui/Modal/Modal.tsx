import { Modal as RNModal, Pressable, StyleSheet, View, type ModalProps as RNModalProps } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'

interface ModalProps extends Pick<RNModalProps, 'visible' | 'children'> {
  onClose: () => void
}

export function Modal({ visible, onClose, children }: ModalProps) {
  const { theme } = useAppTheme()

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View
          style={[
            styles.content,
            { backgroundColor: theme.colors.background, borderRadius: theme.radius.lg, padding: theme.spacing.md },
          ]}
          onStartShouldSetResponder={() => true}>
          {children}
        </View>
      </Pressable>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    minWidth: '80%',
  },
})
