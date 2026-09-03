import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/providers/ThemeProvider';
import { Button } from '@/shared/components/ui';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={{ color: theme.colors.error, fontSize: theme.fontSize.md, textAlign: 'center' }}>
        {message}
      </Text>
      {onRetry ? (
        <View style={{ marginTop: theme.spacing.md }}>
          <Button label="Retry" onPress={onRetry} />
        </View>
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
