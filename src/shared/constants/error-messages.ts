export const ERROR_MESSAGES = {
  NETWORK: "Can't reach the server. Check your internet connection and try again.",
  TIMEOUT: 'The request timed out. Check your connection and try again.',
  SESSION_EXPIRED: 'Session expired',
  NO_REFRESH_TOKEN: 'No refresh token available',
  GENERIC: 'Something went wrong',
} as const
