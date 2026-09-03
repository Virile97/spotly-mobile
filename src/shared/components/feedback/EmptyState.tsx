import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/providers/ThemeProvider';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={{ color: theme.colors.text, fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold }}>
        {title}
      </Text>
      {description ? (
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.fontSize.sm,
            marginTop: theme.spacing.xs,
            textAlign: 'center',
          }}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
