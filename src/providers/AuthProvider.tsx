import { useRouter } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';

import { authEvents } from '@/core/auth/auth-events';
import { session } from '@/core/auth/session';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { LoadingState } from '@/shared/components/feedback/LoadingState';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const clear = useAuthStore((state) => state.clear);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    session.isAuthenticated().finally(() => setIsRestoring(false));

    return authEvents.on('unauthorized', () => {
      clear();
      router.replace('/(auth)/login');
    });
  }, [clear, router]);

  if (isRestoring) {
    return <LoadingState />;
  }

  return <>{children}</>;
}
