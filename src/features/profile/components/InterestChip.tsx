import { Ionicons } from '@expo/vector-icons'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'

import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface InterestChipProps {
  icon?: string
  name?: string
  plus?: boolean
  selected?: boolean
  disabled?: boolean
  onPress?: () => void
}

export function InterestChip({ icon, name, plus, selected, disabled, onPress }: InterestChipProps) {
  const content = (
    <>
      {plus ? (
        <Ionicons name="add" size={Platform.OS === 'android' ? 12 : 14} color={palette.white} />
      ) : (
        <Text style={styles.icon}>{icon}</Text>
      )}
      {name ? <Text style={[styles.label, selected && styles.labelSelected]}>{name}</Text> : null}
      {selected ? <Ionicons name="checkmark" size={Platform.OS === 'android' ? 12 : 14} color={palette.pink500} /> : null}
    </>
  )

  const chipStyle = [styles.chip, selected && styles.chipSelected, disabled && styles.chipDisabled]

  if (!onPress) {
    return <View style={chipStyle}>{content}</View>
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={plus ? 'Add interests' : name}
      accessibilityState={{ selected: selected ?? false, disabled: disabled ?? false }}
      disabled={disabled}
      onPress={onPress}
      style={chipStyle}>
      {content}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Platform.OS === 'android' ? 4 : 6,
    paddingHorizontal: Platform.OS === 'android' ? 8 : 12,
    paddingVertical: Platform.OS === 'android' ? 4 : 8,
    borderRadius: radius.md,
    backgroundColor: '#17161A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  chipSelected: {
    borderColor: palette.pink500,
    backgroundColor: 'rgba(214,73,157,0.15)',
  },
  chipDisabled: {
    opacity: 0.35,
  },
  icon: {
    fontSize: Platform.OS === 'android' ? fontSize.xs : fontSize.sm,
    includeFontPadding: false,
  },
  label: {
    color: palette.white,
    fontSize: Platform.OS === 'android' ? fontSize.xs : fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
    includeFontPadding: false,
  },
  labelSelected: {
    color: palette.pink400,
  },
})
