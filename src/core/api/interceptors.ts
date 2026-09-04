import * as axios from 'axios'
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

import { apiConfig } from '@/config/api.config'
import { env } from '@/config/env'
import { authEvents } from '@/core/auth/auth-events'
import { tokenStorage } from '@/core/auth/token-storage'
import { ERROR_MESSAGES } from '@/shared/constants/error-messages'
import { ApiError, type ApiFieldIssue } from './api-error'
import { endpoints } from './endpoints'

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
}

interface ServerErrorBody {
  error?: {
    message?: string
    code?: string
    issues?: ApiFieldIssue[]
  }
}

interface RefreshResponseBody {
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

const NO_AUTH_HEADER_PATHS = [endpoints.auth.login, endpoints.auth.register, endpoints.auth.refresh]

function needsBearerToken(url?: string): boolean {
  return !NO_AUTH_HEADER_PATHS.some((path) => url?.startsWith(path))
}

// Refresh must bypass the interceptor stack entirely to avoid recursively
// triggering itself, so it gets a bare client with no interceptors attached.
const refreshClient = axios.default.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
    'x-spotly-api-key': env.spotlyApiKey,
  },
})

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await tokenStorage.getRefreshToken()
  if (!refreshToken) {
    throw new Error(ERROR_MESSAGES.NO_REFRESH_TOKEN)
  }

  const { data } = await refreshClient.post<RefreshResponseBody>(endpoints.auth.refresh, { refreshToken })

  await Promise.all([
    tokenStorage.setAccessToken(data.tokens.accessToken),
    tokenStorage.setRefreshToken(data.tokens.refreshToken),
  ])

  return data.tokens.accessToken
}

// Concurrent 401s should share a single in-flight refresh rather than each
// firing their own — the refresh token rotates on every use, so a second
// call made before the first resolves would invalidate the first's result.
function getOrCreateRefreshPromise(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

export function attachInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use(async (config) => {
    config.headers.set('x-spotly-api-key', env.spotlyApiKey)

    if (needsBearerToken(config.url)) {
      const token = await tokenStorage.getAccessToken()
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`)
      }
    }

    return config
  })

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ServerErrorBody>) => {
      const config = error.config as RetryableConfig | undefined
      const status = error.response?.status ?? 0
      const url = config?.url

      const canAttemptRefresh =
        status === 401 && config && !config._retried && needsBearerToken(url) && url !== endpoints.auth.refresh

      if (canAttemptRefresh) {
        config._retried = true
        try {
          const accessToken = await getOrCreateRefreshPromise()
          config.headers.set('Authorization', `Bearer ${accessToken}`)
          return client.request(config)
        } catch {
          await tokenStorage.clear()
          authEvents.emit('unauthorized')
          return Promise.reject(new ApiError(ERROR_MESSAGES.SESSION_EXPIRED, 401))
        }
      }

      if (!error.response) {
        return Promise.reject(new ApiError(ERROR_MESSAGES.GENERIC, 0, 'NETWORK_ERROR'))
      }

      const body = error.response.data?.error
      const message = body?.message?.trim() || ERROR_MESSAGES.GENERIC
      const code = body?.code
      const issues = body?.issues

      return Promise.reject(new ApiError(message, status, code, issues))
    }
  )
}
