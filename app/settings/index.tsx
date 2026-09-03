import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAppTheme } from '@/providers/ThemeProvider';
import { Screen } from '@/shared/components/layout/Screen';

const SETTINGS_LINKS = [
  { href: '/settings/account', label: 'Account' },
  { href: '/settings/privacy', label: 'Privacy' },
] as const;

export default function SettingsScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const { mutate: logout } = useLogout();

  return (
    <Screen>
      <View style={{ gap: theme.spacing.sm }}>
        {SETTINGS_LINKS.map((link) => (
          <TouchableOpacity
            key={link.href}
            style={[styles.row, { paddingVertical: theme.spacing.sm, borderBottomColor: theme.colors.border }]}
            onPress={() => router.push(link.href)}>
            <Text style={{ color: theme.colors.text }}>{link.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.row, { paddingVertical: theme.spacing.sm }]}
          onPress={() => logout()}>
          <Text style={{ color: theme.colors.error }}>Log out</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
