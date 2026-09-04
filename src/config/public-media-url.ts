import { env } from './env'

const LOCAL_URI_PREFIXES = ['file:', 'content:', 'ph://', 'assets-library:', 'data:']

export function toPublicMediaUrl(uri: string | null | undefined): string | null {
  if (!uri) return null
  if (LOCAL_URI_PREFIXES.some((prefix) => uri.startsWith(prefix))) return uri

  const base = env.mediaPublicBaseUrl
  if (!base) return uri

  try {
    const parsed = new URL(uri)
    const publicBase = new URL(base)
    if (parsed.origin === publicBase.origin) return uri

    const isPrivateR2Host = parsed.hostname.endsWith('.r2.cloudflarestorage.com')
    if (!isPrivateR2Host) return uri

    return `${base.replace(/\/$/, '')}${parsed.pathname}${parsed.search}`
  } catch {
    return uri
  }
}
