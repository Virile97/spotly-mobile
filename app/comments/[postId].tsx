import { useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { CommentInput } from '@/features/comments/components/CommentInput';
import { CommentList } from '@/features/comments/components/CommentList';
import { Screen } from '@/shared/components/layout/Screen';

export default function CommentsScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <CommentList postId={postId} />
        <CommentInput postId={postId} />
      </KeyboardAvoidingView>
    </Screen>
  );
}
