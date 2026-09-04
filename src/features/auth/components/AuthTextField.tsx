import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, type TextInputProps } from 'react-native'

import { FloatingField } from '@/features/auth/components/FloatingField'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface AuthTextFieldProps extends Omit<TextInputProps, 'style' | 'placeholder'> {
  label: string
  error?: string
  isPassword?: boolean
}

export function AuthTextField({
  label,
  error,
  isPassword,
  secureTextEntry,
  value,
  onFocus,
  onBlur,
  ...rest
}: AuthTextFieldProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = typeof value === 'string' ? value.length > 0 : Boolean(value)

  return (
    <FloatingField
      label={label}
      active={isFocused || hasValue}
      error={error}
      accessory={
        isPassword ? (
          <Pressable accessibilityRole="button" hitSlop={6} onPress={() => setIsRevealed((prev) => !prev)}>
            <Text style={styles.toggle}>{isRevealed ? 'Hide' : 'Show'}</Text>
          </Pressable>
        ) : null
      }>
      <TextInput
        {...rest}
        style={[styles.input, isPassword ? styles.inputWithToggle : null]}
        placeholderTextColor="transparent"
        secureTextEntry={isPassword ? !isRevealed : secureTextEntry}
        value={value}
        onFocus={(event) => {
          setIsFocused(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setIsFocused(false)
          onBlur?.(event)
        }}
      />
    </FloatingField>
  )
}

const styles = StyleSheet.create({
  input: {
    paddingTop: 22,
    paddingBottom: 8,
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.body,
    includeFontPadding: false,
  },
  inputWithToggle: {
    paddingRight: spacing.xl,
  },
  toggle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
    includeFontPadding: false,
  },
})
