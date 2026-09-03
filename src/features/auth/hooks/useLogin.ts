import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { tokenStorage } from '@/core/auth/token-storage';
import type { LoginPayload } from '@/features/auth/types/auth.types';

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: async (session) => {
      await Promise.all([
        tokenStorage.setAccessToken(session.accessToken),
        tokenStorage.setRefreshToken(session.refreshToken),
      ]);
      setUser(session.user);
    },
  });
}
