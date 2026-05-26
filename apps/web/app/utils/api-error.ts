import type { ApiErrorBody } from '~/types/api'

export interface ParsedApiError {
  title: string
  messages: string[]
}

function normaliseMessage(message: string | string[] | undefined): string[] {
  if (!message) {
    return []
  }
  return Array.isArray(message) ? message : [message]
}

function extractBody(error: unknown): ApiErrorBody | null {
  if (!error || typeof error !== 'object') {
    return null
  }

  if ('data' in error && error.data && typeof error.data === 'object') {
    return error.data as ApiErrorBody
  }

  return null
}

/** Maps $fetch / ofetch errors from the NestJS API into user-facing messages. */
export function parseApiError(error: unknown): ParsedApiError {
  const body = extractBody(error)

  if (body) {
    const fromErrors = body.errors ?? []
    const fromMessage = normaliseMessage(body.message)
    const messages =
      fromErrors.length > 0 ? fromErrors : fromMessage.filter(Boolean)

    if (messages.length > 0) {
      const title =
        typeof body.message === 'string' && body.message !== 'Validation failed'
          ? body.message
          : 'Could not submit application'

      return { title, messages }
    }
  }

  if (error instanceof Error && error.message) {
    return {
      title: 'Request failed',
      messages: [error.message]
    }
  }

  return {
    title: 'Request failed',
    messages: ['Something went wrong. Please try again.']
  }
}
