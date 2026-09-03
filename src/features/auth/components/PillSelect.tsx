import { Pressable, StyleSheet, Text, View } from 'react-native'

import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface PillOption {
  label: string
  value: string
}

interface PillSelectProps {
  label: string
  options: PillOption[]
  value: string | undefined
  onChange: (value: string) => void
  error?: string
}

export function PillSelect({ label, options, value, onChange, error }: PillSelectProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const isActive = option.value === value
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => onChange(option.value)}>
              <Text style={[styles.pillLabel, isActive && styles.pillLabelActive]}>{option.label}</Text>
            </Pressable>
          )
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pillActive: {
    borderColor: palette.pink500,
    backgroundColor: 'rgba(214,73,157,0.15)',
  },
  pillLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
  },
  pillLabelActive: {
    color: palette.pink500,
    fontFamily: fontFamily.bodySemiBold,
  },
  error: {
    color: palette.red500,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
  },
})
