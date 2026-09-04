import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

import { ERROR_MESSAGES } from '@/shared/constants/error-messages'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface ErrorModalProps {
  visible: boolean
  onClose: () => void
  onRetry?: () => void
  title?: string
  message?: string
}

export function ErrorModal({
  visible,
  onClose,
  onRetry,
  title = 'Something went wrong',
  message = ERROR_MESSAGES.GENERIC,
}: ErrorModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Dismiss">
        <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{message}</Text>

          <View style={styles.actions}>
            {onRetry ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Try again"
                style={styles.primaryButton}
                onPress={onRetry}>
                <Text style={styles.primaryLabel}>Try again</Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="OK"
              style={onRetry ? styles.secondaryButton : styles.primaryButton}
              onPress={onClose}>
              <Text style={onRetry ? styles.secondaryLabel : styles.primaryLabel}>OK</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#17161A',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    color: palette.white,
    fontSize: fontSize.lg,
    fontFamily: fontFamily.headline,
    marginBottom: spacing.sm,
  },
  body: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  actions: {
    gap: spacing.sm,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: palette.pink500,
    paddingHorizontal: spacing.md,
  },
  primaryLabel: {
    color: palette.black,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.md,
  },
  secondaryLabel: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
})
