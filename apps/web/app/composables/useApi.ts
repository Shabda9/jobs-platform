import type {
  ApplicationSubmitResponse,
  JobSearchQuery
} from '~/types/api'
import type { ApplicationFormSchema } from '~/schemas/application-form.schema'
import { buildApplicationFormData } from '~/utils/application-form-data'

export function useApiBaseUrl(): string {
  const config = useRuntimeConfig()
  return String(config.public.apiBaseUrl).replace(/\/$/, '')
}

export function buildApiUrl(path: string): string {
  const base = useApiBaseUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

export function toApiQuery(
  query: JobSearchQuery
): Record<string, string> | undefined {
  const params = Object.fromEntries(
    Object.entries(query).filter(
      ([, value]) => value != null && String(value).trim() !== ''
    )
  ) as Record<string, string>

  return Object.keys(params).length > 0 ? params : undefined
}

export async function apiFetch<T>(
  path: string,
  query?: JobSearchQuery
): Promise<T> {
  return $fetch<T>(buildApiUrl(path), {
    query: toApiQuery(query ?? {})
  })
}

/** Submit candidate application with resume (multipart/form-data). */
export async function submitJobApplication(
  jobId: string,
  data: ApplicationFormSchema
): Promise<ApplicationSubmitResponse> {
  return $fetch<ApplicationSubmitResponse>(
    buildApiUrl(`/jobs/${jobId}/applications`),
    {
      method: 'POST',
      body: buildApplicationFormData(data)
    }
  )
}
