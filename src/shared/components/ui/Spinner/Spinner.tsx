import { ActivityIndicator, View, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/providers/ThemeProvider';

interface SpinnerProps {
  size?: 'small' | 'large';
  style?: ViewStyle;
}

export function Spinner({ size = 'small', style }: SpinnerProps) {
  const { theme } = useAppTheme();
  return (
    <View style={style}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
    </View>
  );
}
