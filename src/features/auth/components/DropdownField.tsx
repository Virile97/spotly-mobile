import { useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

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

export function DropdownField({ label, placeholder = 'Select', options, value, onChange, error }: DropdownFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable accessibilityRole="button" style={styles.fieldWrapper} onPress={() => setIsOpen(true)}>
        <Text style={selected ? styles.value : styles.placeholder}>{selected ? selected.label : placeholder}</Text>
        <Text style={styles.caret}>▾</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

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
  container: {
    gap: spacing.xs,
  },
  label: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
  },
  fieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  value: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.body,
  },
  placeholder: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: fontSize.md,
    fontFamily: fontFamily.body,
  },
  caret: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.sm,
  },
  error: {
    color: palette.red500,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
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
