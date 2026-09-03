import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfilePostGrid } from '@/features/profile/components/ProfilePostGrid';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Screen } from '@/shared/components/layout/Screen';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';

export default function ProfileScreen() {
  const currentUser = useAuthStore((state) => state.user);
  const { data, isLoading, isError, refetch } = useProfile(currentUser?.id ?? '');

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
