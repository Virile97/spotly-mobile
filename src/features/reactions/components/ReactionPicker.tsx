import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { ReactionKind } from '@/features/reactions/types/reaction.types';

const REACTIONS: { kind: ReactionKind; emoji: string }[] = [
  { kind: 'like', emoji: '👍' },
  { kind: 'love', emoji: '❤️' },
  { kind: 'wow', emoji: '😮' },
  { kind: 'haha', emoji: '😂' },
];

export function ReactionPicker({ onSelect }: { onSelect: (kind: ReactionKind) => void }) {
  return (
    <View style={styles.row}>
      {REACTIONS.map((reaction) => (
        <TouchableOpacity key={reaction.kind} onPress={() => onSelect(reaction.kind)}>
          <Text style={styles.emoji}>{reaction.emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  emoji: {
    fontSize: 24,
  },
});
