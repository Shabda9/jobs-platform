export interface JobListItem {
  id: string
  title: string
  slug: string
  companyName: string
  location: string
  employmentType: string
  salaryText: string | null
  category: string
  publishedAt: string | null
}

export interface JobDetail {
  id: string
  title: string
  slug: string
  companyName: string
  location: string
  employmentType: string
  salaryMin: number | null
  salaryMax: number | null
  salaryText: string | null
  category: string
  categorySlug: string
  description: string
  responsibilities: string | null
  requirements: string | null
  benefits: string | null
  requiredLicenceOrCertificate: string | null
  workRightsRequirement: string | null
  applicationDeadline: string | null
  publishedAt: string | null
  expiresAt: string | null
}

export interface JobCategory {
  id: string
  name: string
  slug: string
}

export interface ApiListResponse<T> {
  data: T[]
}

export interface JobSearchQuery {
  keyword?: string
  location?: string
  category?: string
  employmentType?: string
}
