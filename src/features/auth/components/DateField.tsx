import { useState } from 'react'
import { StyleSheet, Text } from 'react-native'

import { FloatingField } from '@/features/auth/components/FloatingField'
import { CalendarModal } from '@/shared/components/ui'
import { formatLongDate } from '@/shared/utils/date'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
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
}: DateFieldProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <>
      <FloatingField
        label={label}
        active={isVisible || Boolean(value)}
        error={error}
        onPress={() => setIsVisible(true)}>
        {value ? <Text style={styles.value}>{formatLongDate(value)}</Text> : null}
      </FloatingField>

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
    </>
  )
}

const styles = StyleSheet.create({
  value: {
    paddingTop: 22,
    paddingBottom: 8,
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.body,
    includeFontPadding: false,
  },
})
