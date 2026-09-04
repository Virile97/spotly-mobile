import Constants from 'expo-constants'
import { z } from 'zod'

import { resolveLoopbackUrl } from './resolve-loopback-url'

/**
 * Only variables prefixed EXPO_PUBLIC_ are inlined into the client bundle by Expo.
 * Never read non-prefixed env vars here — those belong on the server only.
 *
 * spotlyApiKey and mediaPublicBaseUrl are the exceptions: they're read from
 * app.config.ts `extra`, which is populated at build time from the non-prefixed
 * SPOTLY_API_KEY and MEDIA_PUBLIC_BASE_URL env vars and exposed at runtime via
 * expo-constants, rather than inlined as literal bundle strings.
 */
const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_SOCKET_URL: z.string().url(),
  EXPO_PUBLIC_ENV: z.enum(['development', 'production']),
  spotlyApiKey: z.string().min(1, 'SPOTLY_API_KEY is not configured'),
  mediaPublicBaseUrl: z.string().url().optional(),
})

const parsed = envSchema.safeParse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL,
  EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV,
  spotlyApiKey: Constants.expoConfig?.extra?.spotlyApiKey,
  mediaPublicBaseUrl: Constants.expoConfig?.extra?.mediaPublicBaseUrl || undefined,
})

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`)
}

const isDevelopment = parsed.data.EXPO_PUBLIC_ENV === 'development'

export const env = {
  apiUrl: isDevelopment ? resolveLoopbackUrl(parsed.data.EXPO_PUBLIC_API_URL) : parsed.data.EXPO_PUBLIC_API_URL,
  socketUrl: isDevelopment ? resolveLoopbackUrl(parsed.data.EXPO_PUBLIC_SOCKET_URL) : parsed.data.EXPO_PUBLIC_SOCKET_URL,
  environment: parsed.data.EXPO_PUBLIC_ENV,
  isProduction: parsed.data.EXPO_PUBLIC_ENV === 'production',
  isDevelopment,
  spotlyApiKey: parsed.data.spotlyApiKey,
  mediaPublicBaseUrl: parsed.data.mediaPublicBaseUrl,
}
