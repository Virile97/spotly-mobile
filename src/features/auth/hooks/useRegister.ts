import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { tokenStorage } from '@/core/auth/token-storage';
import type { RegisterPayload } from '@/features/auth/types/auth.types';

export function useRegister() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: async (session) => {
      await Promise.all([
        tokenStorage.setAccessToken(session.accessToken),
        tokenStorage.setRefreshToken(session.refreshToken),
      ]);
      setUser(session.user);
    },
  });
}
