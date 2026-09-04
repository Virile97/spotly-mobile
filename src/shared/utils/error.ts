import { ApiError } from '@/core/api/api-error'
import { ERROR_MESSAGES } from '@/shared/constants/error-messages'

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.message.trim()) {
    return error.message
  }

  return ERROR_MESSAGES.GENERIC
}
