import Constants from 'expo-constants'
import { z } from 'zod'

/**
 * Only variables prefixed EXPO_PUBLIC_ are inlined into the client bundle by Expo.
 * Never read non-prefixed env vars here — those belong on the server only.
 *
 * spotlyApiKey is the exception: it's read from app.config.ts `extra`, which is
 * populated at build time from the non-prefixed SPOTLY_API_KEY env var and exposed
 * at runtime via expo-constants, rather than inlined as a literal bundle string.
 */
const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_SOCKET_URL: z.string().url(),
  EXPO_PUBLIC_ENV: z.enum(['development', 'production']),
  spotlyApiKey: z.string().min(1, 'SPOTLY_API_KEY is not configured'),
})

const parsed = envSchema.safeParse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL,
  EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV,
  spotlyApiKey: Constants.expoConfig?.extra?.spotlyApiKey,
})

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`)
}

export const env = {
  apiUrl: parsed.data.EXPO_PUBLIC_API_URL,
  socketUrl: parsed.data.EXPO_PUBLIC_SOCKET_URL,
  environment: parsed.data.EXPO_PUBLIC_ENV,
  isProduction: parsed.data.EXPO_PUBLIC_ENV === 'production',
  isDevelopment: parsed.data.EXPO_PUBLIC_ENV === 'development',
  spotlyApiKey: parsed.data.spotlyApiKey,
}
