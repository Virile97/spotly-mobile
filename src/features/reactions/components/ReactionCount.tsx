import { Text } from 'react-native';

import { useAppTheme } from '@/providers/ThemeProvider';
import { formatCompactNumber } from '@/shared/utils/number';

export function ReactionCount({ count }: { count: number }) {
  const { theme } = useAppTheme();
  return <Text style={{ color: theme.colors.textSecondary }}>{formatCompactNumber(count)}</Text>;
}
