import { Redirect } from 'expo-router';

import { useAppStore, useAppStoreHasHydrated } from '@/store/app.store';
import { LoadingState } from '@/shared/components/feedback/LoadingState';

export default function RootIndex() {
  const hasHydrated = useAppStoreHasHydrated();
  const isOnboarded = useAppStore((state) => state.isOnboarded);

  if (!hasHydrated) {
    return <LoadingState />;
  }

  return <Redirect href={isOnboarded ? '/(auth)/welcome' : '/onboarding'} />;
}
