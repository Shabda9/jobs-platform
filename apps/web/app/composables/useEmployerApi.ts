import type {
  EmployerBootstrapResponse,
  EmployerMeResponse
} from '~/types/employer'
import { buildApiUrl } from '~/composables/useApi'

async function employerApiFetch<T>(
  path: string,
  options: Parameters<typeof $fetch<T>>[1] = {}
): Promise<T> {
  const { getAccessToken } = useAuth()
  const token = await getAccessToken()

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  return $fetch<T>(buildApiUrl(path), {
    ...options,
    headers: {
      ...(options.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${token}`
    }
  })
}

/** Ensure AppUser exists in NestJS; safe to call after signup or login. */
export async function bootstrapEmployerAccount(): Promise<EmployerBootstrapResponse> {
  return employerApiFetch<EmployerBootstrapResponse>('/employers/bootstrap', {
    method: 'POST'
  })
}

export async function fetchEmployerMe(): Promise<EmployerMeResponse> {
  return employerApiFetch<EmployerMeResponse>('/employer/me')
}

/**
 * Load employer profile from API, provisioning AppUser on first access if needed.
 */
export async function ensureEmployerProfile(): Promise<EmployerMeResponse> {
  try {
    return await fetchEmployerMe()
  } catch (error: unknown) {
    const status = getFetchErrorStatus(error)
    if (status === 404) {
      const bootstrapped = await bootstrapEmployerAccount()
      return bootstrapped
    }
    throw error
  }
}

function getFetchErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') {
    return undefined
  }

  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode
  }

  if ('status' in error && typeof error.status === 'number') {
    return error.status
  }

  return undefined
}
