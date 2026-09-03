import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
      refetchOnReconnect: true,
      // Window focus isn't a meaningful signal in React Native; set explicitly
      // rather than relying on it being a no-op by default.
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Mutations aren't safe to auto-retry by default (e.g. double-submitting
      // a create/update) — retry is opt-in per mutation where idempotent.
      retry: 0,
    },
  },
})
