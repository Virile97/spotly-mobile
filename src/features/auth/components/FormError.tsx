import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

export interface FormErrorIssue {
  path: (string | number)[]
  message: string
}

interface FormErrorProps {
  message: string
  issues?: FormErrorIssue[]
}

export function FormError({ message, issues }: FormErrorProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(120)}
      style={styles.container}
      accessibilityRole="alert">
      <Ionicons name="alert-circle" size={18} color={palette.red500} style={styles.icon} />
      <View style={styles.textColumn}>
        <Text style={styles.message}>{message}</Text>
        {issues && issues.length > 0 ? (
          <View style={styles.issueList}>
            {issues.map((issue, index) => (
              <Text key={`${issue.path.join('.')}-${index}`} style={styles.issue}>
                {'• '}
                {issue.message}
              </Text>
            ))}
          </View>
        ) : null}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  icon: {
    marginTop: 1,
  },
  textColumn: {
    flex: 1,
    gap: spacing.xs,
  },
  message: {
    color: palette.red500,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
    lineHeight: 18,
  },
  issueList: {
    gap: 2,
  },
  issue: {
    color: 'rgba(239,68,68,0.85)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
    lineHeight: 16,
  },
})
