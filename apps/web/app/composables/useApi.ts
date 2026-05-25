import type { JobSearchQuery } from '~/types/api'

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
