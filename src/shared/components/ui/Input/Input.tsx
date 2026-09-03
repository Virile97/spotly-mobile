import { StyleSheet, TextInput, View, Text, type TextInputProps } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
}

export function Input({ label, error, style, ...rest }: InputProps) {
  const { theme } = useAppTheme()

  return (
    <View>
      {label ? (
        <Text style={{ color: theme.colors.text, marginBottom: theme.spacing.xs }}>{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor={theme.colors.textSecondary}
        style={[
          styles.base,
          {
            borderColor: error ? theme.colors.error : theme.colors.border,
            color: theme.colors.text,
            borderRadius: theme.radius.md,
            padding: theme.spacing.sm,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text style={{ color: theme.colors.error, marginTop: theme.spacing.xs }}>{error}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
  },
})
