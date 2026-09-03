import { Text } from 'react-native';

import { useAppTheme } from '@/providers/ThemeProvider';
import { Screen } from '@/shared/components/layout/Screen';

export default function PrivacySettingsScreen() {
  const { theme } = useAppTheme();

  return (
    <Screen>
      <Text style={{ color: theme.colors.text }}>Privacy settings coming soon.</Text>
    </Screen>
  );
}
