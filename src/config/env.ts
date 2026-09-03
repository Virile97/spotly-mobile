import { z } from 'zod';

/**
 * Only variables prefixed EXPO_PUBLIC_ are inlined into the client bundle by Expo.
 * Never read non-prefixed env vars here — those belong on the server only.
 */
const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_SOCKET_URL: z.string().url(),
  EXPO_PUBLIC_ENV: z.enum(['development', 'production']),
});

const parsed = envSchema.safeParse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL,
  EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV,
});

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

export const env = {
  apiUrl: parsed.data.EXPO_PUBLIC_API_URL,
  socketUrl: parsed.data.EXPO_PUBLIC_SOCKET_URL,
  environment: parsed.data.EXPO_PUBLIC_ENV,
  isProduction: parsed.data.EXPO_PUBLIC_ENV === 'production',
  isDevelopment: parsed.data.EXPO_PUBLIC_ENV === 'development',
};
