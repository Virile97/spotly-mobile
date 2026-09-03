import { ScrollView, View, type ViewProps } from 'react-native';

import { useAppTheme } from '@/providers/ThemeProvider';
import { SafeArea } from './SafeArea';

interface ScreenProps extends ViewProps {
  scroll?: boolean;
}

export function Screen({ scroll, style, children, ...rest }: ScreenProps) {
  const { theme } = useAppTheme();
  const Container = scroll ? ScrollView : View;

  return (
    <SafeArea>
      <Container
        style={[{ flex: 1, padding: theme.spacing.md }, style]}
        {...rest}>
        {children}
      </Container>
    </SafeArea>
  );
}
