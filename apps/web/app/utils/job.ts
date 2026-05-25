import type { JobDetail } from '~/types/api'

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Casual',
  'Contract'
] as const

export function formatJobDate(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }

  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export function formatJobSalary(job: Pick<JobDetail, 'salaryText' | 'salaryMin' | 'salaryMax'>): string | null {
  if (job.salaryText?.trim()) {
    return job.salaryText
  }

  if (job.salaryMin != null && job.salaryMax != null) {
    return `$${job.salaryMin.toLocaleString('en-AU')} – $${job.salaryMax.toLocaleString('en-AU')}`
  }

  if (job.salaryMin != null) {
    return `From $${job.salaryMin.toLocaleString('en-AU')}`
  }

  if (job.salaryMax != null) {
    return `Up to $${job.salaryMax.toLocaleString('en-AU')}`
  }

  return null
}

export function jobSearchQueryFromRoute(
  query: Record<string, unknown>
): import('~/types/api').JobSearchQuery {
  const pick = (key: string): string | undefined => {
    const value = query[key]
    if (typeof value === 'string') {
      return value
    }
    if (Array.isArray(value) && typeof value[0] === 'string') {
      return value[0]
    }
    return undefined
  }

  return {
    keyword: pick('keyword'),
    location: pick('location'),
    category: pick('category'),
    employmentType: pick('employmentType')
  }
}
