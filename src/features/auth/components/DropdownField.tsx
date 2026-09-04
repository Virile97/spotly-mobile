import { useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

import { FloatingField } from '@/features/auth/components/FloatingField'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface DropdownOption {
  label: string
  value: string
}

interface DropdownFieldProps {
  label: string
  placeholder?: string
  options: DropdownOption[]
  value: string | undefined
  onChange: (value: string) => void
  error?: string
}

export function DropdownField({ label, options, value, onChange, error }: DropdownFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    <View>
      <FloatingField
        label={label}
        active={isOpen || Boolean(selected)}
        error={error}
        onPress={() => setIsOpen(true)}
        accessory={<Text style={styles.caret}>▾</Text>}>
        {selected ? <Text style={styles.value}>{selected.label}</Text> : null}
      </FloatingField>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>{label}</Text>
            {options.map((option) => {
              const isActive = option.value === value
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  style={styles.option}
                  onPress={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}>
                  <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>{option.label}</Text>
                </Pressable>
              )
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  value: {
    paddingTop: 22,
    paddingBottom: 8,
    paddingRight: spacing.lg,
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.body,
    includeFontPadding: false,
  },
  caret: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.sm,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#161418',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  sheetTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
    marginBottom: spacing.xs,
  },
  option: {
    paddingVertical: spacing.sm,
  },
  optionLabel: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.body,
  },
  optionLabelActive: {
    color: palette.pink500,
    fontFamily: fontFamily.bodySemiBold,
  },
})
