import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { CalendarModal } from '@/shared/components/ui'
import { formatLongDate } from '@/shared/utils/date'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface DateFieldProps {
  label: string
  value: Date | null
  onChange: (date: Date) => void
  error?: string
  calendarTitle?: string
  placeholder?: string
}

export function DateField({
  label,
  value,
  onChange,
  error,
  calendarTitle = 'Select a date',
  placeholder = 'Select a date',
}: DateFieldProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable accessibilityRole="button" style={styles.fieldWrapper} onPress={() => setIsVisible(true)}>
        <Text style={value ? styles.value : styles.placeholder}>{value ? formatLongDate(value) : placeholder}</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <CalendarModal
        visible={isVisible}
        value={value}
        title={calendarTitle}
        onClose={() => setIsVisible(false)}
        onConfirm={(date) => {
          onChange(date)
          setIsVisible(false)
        }}
      />
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
  error: {
    color: palette.red500,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
  },
})
