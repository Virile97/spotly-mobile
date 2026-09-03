import { useLocalSearchParams } from 'expo-router';

import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfilePostGrid } from '@/features/profile/components/ProfilePostGrid';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { Screen } from '@/shared/components/layout/Screen';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { data, isLoading, isError, refetch } = useProfile(userId);

  return (
    <Screen>
      {isLoading ? (
        <LoadingState />
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <>
          <ProfileHeader profile={data} />
          <ProfilePostGrid posts={[]} />
        </>
      )}
    </Screen>
  );
}
