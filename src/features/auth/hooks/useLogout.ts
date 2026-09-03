import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { session } from '@/core/auth/session';

export function useLogout() {
  const clear = useAuthStore((state) => state.clear);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: async () => {
      await session.end();
      clear();
    },
  });
}
