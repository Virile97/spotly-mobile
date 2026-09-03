import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native'

import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

interface AuthTextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string
  error?: string
  isPassword?: boolean
}

export function AuthTextField({ label, error, isPassword, secureTextEntry, ...rest }: AuthTextFieldProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.fieldWrapper}>
        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(255,255,255,0.35)"
          secureTextEntry={isPassword ? !isRevealed : secureTextEntry}
          {...rest}
        />
        {isPassword ? (
          <Pressable accessibilityRole="button" onPress={() => setIsRevealed((prev) => !prev)}>
            <Text style={styles.toggle}>{isRevealed ? 'Hide' : 'Show'}</Text>
          </Pressable>
        ) : null}
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
  fieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.body,
  },
  toggle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  error: {
    color: palette.red500,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
  },
})
