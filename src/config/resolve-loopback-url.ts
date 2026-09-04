import Constants from 'expo-constants'
import { Platform } from 'react-native'

const LOOPBACK = /^(localhost|127\.0\.0\.1)$/i

function bundlerHost(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants.expoGoConfig as { debuggerHost?: string } | null)?.debuggerHost
  const host = hostUri?.split(':')[0]
  if (!host || LOOPBACK.test(host)) return null
  return host
}

/**
 * `localhost` in EXPO_PUBLIC_* URLs is the machine running Metro/Docker on a
 * simulator, but the phone itself on a physical device. Rewrite to the LAN
 * host Expo is already using so a device can reach Docker-published ports.
 */
export function resolveLoopbackUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (!LOOPBACK.test(parsed.hostname)) return url

    const host = bundlerHost() ?? (Platform.OS === 'android' ? '10.0.2.2' : null)
    if (!host) return url

    parsed.hostname = host
    return parsed.toString().replace(/\/$/, '')
  } catch {
    return url
  }
}
