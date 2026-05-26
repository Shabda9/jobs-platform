import type { ApiErrorBody } from '~/types/api'
import { APPLICATION_FORM_MESSAGES } from '~/utils/application-messages'

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

function dedupeMessages(messages: string[]): string[] {
  return [...new Set(messages.filter(Boolean))]
}

/** Maps $fetch / ofetch errors from the NestJS API into user-facing messages. */
export function parseApiError(error: unknown): ParsedApiError {
  const body = extractBody(error)

  if (body) {
    const fromErrors = body.errors ?? []
    const fromMessage = normaliseMessage(body.message)
    const messages = dedupeMessages(
      fromErrors.length > 0 ? fromErrors : fromMessage
    )

    if (messages.length > 0) {
      return {
        title: APPLICATION_FORM_MESSAGES.submitErrorTitle,
        messages
      }
    }
  }

  if (error instanceof Error && error.message) {
    return {
      title: APPLICATION_FORM_MESSAGES.submitErrorTitle,
      messages: [error.message]
    }
  }

  return {
    title: APPLICATION_FORM_MESSAGES.submitErrorTitle,
    messages: [APPLICATION_FORM_MESSAGES.networkError]
  }
}
