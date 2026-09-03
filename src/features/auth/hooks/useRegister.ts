import { useMutation } from '@tanstack/react-query'

import { authApi } from '@/features/auth/api/auth.api'
import type { RegisterPayload } from '@/features/auth/types/auth.types'

// Registration intentionally does not store tokens or set the auth store —
// the user is sent to the login screen to sign in explicitly rather than
// being auto-authenticated straight into the app.
export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
  })
}
