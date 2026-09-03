import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/providers/ThemeProvider';

interface HeaderProps {
  title: string;
  right?: React.ReactNode;
}

export function Header({ title, right }: HeaderProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.row,
        { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderBottomColor: theme.colors.border },
      ]}>
      <Text style={{ color: theme.colors.text, fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold }}>
        {title}
      </Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
