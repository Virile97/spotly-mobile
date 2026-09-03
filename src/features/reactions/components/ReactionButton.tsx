import { Text, TouchableOpacity } from 'react-native';

import { useAppTheme } from '@/providers/ThemeProvider';

interface ReactionButtonProps {
  isActive: boolean;
  onPress: () => void;
}

export function ReactionButton({ isActive, onPress }: ReactionButtonProps) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity onPress={onPress} accessibilityRole="button">
      <Text style={{ color: isActive ? theme.colors.primary : theme.colors.textSecondary }}>
        {isActive ? 'Reacted' : 'React'}
      </Text>
    </TouchableOpacity>
  );
}
