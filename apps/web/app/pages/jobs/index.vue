<script setup lang="ts">
import type { ApiListResponse, JobCategory, JobListItem, JobSearchQuery } from '~/types/api'
import { jobSearchQueryFromRoute } from '~/utils/job'

useSeoMeta({
  title: 'Browse jobs',
  description: 'Search and filter published job listings across Australia.'
})

const route = useRoute()

const searchQuery = computed(() => jobSearchQueryFromRoute(route.query))

const filterState = ref<JobSearchQuery>({ ...searchQuery.value })

watch(
  searchQuery,
  (query) => {
    filterState.value = { ...query }
  },
  { immediate: true }
)

const { data: categoriesData } = await useAsyncData(
  'categories',
  () => apiFetch<ApiListResponse<JobCategory>>('/categories')
)

const {
  data: jobsData,
  pending,
  error,
  refresh
} = await useAsyncData(
  'jobs-list',
  () => apiFetch<ApiListResponse<JobListItem>>('/jobs', searchQuery.value),
  { watch: [searchQuery] }
)

const jobs = computed(() => jobsData.value?.data ?? [])
const categories = computed(() => categoriesData.value?.data ?? [])

const activeFilterCount = computed(() => {
  let count = 0
  if (searchQuery.value.keyword) count++
  if (searchQuery.value.location) count++
  if (searchQuery.value.category) count++
  if (searchQuery.value.employmentType) count++
  return count
})

function navigateWithQuery(query: JobSearchQuery) {
  const next: Record<string, string> = {}

  for (const [key, value] of Object.entries(query)) {
    if (value?.trim()) {
      next[key] = value.trim()
    }
  }

  navigateTo({ path: '/jobs', query: next })
}

function applyFilters() {
  navigateWithQuery({
    keyword: searchQuery.value.keyword,
    location: searchQuery.value.location,
    category: filterState.value.category,
    employmentType: filterState.value.employmentType
  })
}

function clearAllFilters() {
  navigateTo({ path: '/jobs' })
}
</script>

<template>
  <UContainer class="py-8 sm:py-10">
    <div class="mb-8 space-y-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-highlighted">
          Browse jobs
        </h1>
        <p class="text-muted mt-1">
          Search published roles across Australia.
        </p>
      </div>

      <UCard>
        <JobSearchBar :initial="searchQuery" />
      </UCard>

      <div
        v-if="activeFilterCount > 0"
        class="flex flex-wrap items-center gap-2"
      >
        <span class="text-sm text-muted">Active filters:</span>
        <UBadge
          v-if="searchQuery.keyword"
          :label="`Keyword: ${searchQuery.keyword}`"
          color="neutral"
          variant="subtle"
        />
        <UBadge
          v-if="searchQuery.location"
          :label="`Location: ${searchQuery.location}`"
          color="neutral"
          variant="subtle"
        />
        <UBadge
          v-if="searchQuery.category"
          :label="`Category: ${searchQuery.category}`"
          color="neutral"
          variant="subtle"
        />
        <UBadge
          v-if="searchQuery.employmentType"
          :label="searchQuery.employmentType"
          color="neutral"
          variant="subtle"
        />
        <UButton
          label="Clear all"
          color="neutral"
          variant="link"
          size="xs"
          @click="clearAllFilters"
        />
      </div>
    </div>

    <div class="grid lg:grid-cols-[240px_1fr] gap-8 items-start">
      <aside class="lg:sticky lg:top-24">
        <JobFilters
          v-model="filterState"
          :categories="categories"
          @apply="applyFilters"
        />
      </aside>

      <div class="min-w-0">
        <LoadingState
          v-if="pending"
          message="Loading jobs…"
        />

        <UAlert
          v-else-if="error"
          color="error"
          variant="subtle"
          title="Could not load jobs"
          description="Check that the API is running and NUXT_PUBLIC_API_BASE_URL is set correctly."
        >
          <template #actions>
            <UButton
              label="Retry"
              color="neutral"
              variant="outline"
              size="sm"
              @click="refresh()"
            />
          </template>
        </UAlert>

        <template v-else>
          <p
            v-if="jobs.length"
            class="text-sm text-muted mb-4"
          >
            {{ jobs.length }} {{ jobs.length === 1 ? 'job' : 'jobs' }} found
          </p>

          <div
            v-if="jobs.length"
            class="grid gap-4 sm:grid-cols-2"
          >
            <JobCard
              v-for="job in jobs"
              :key="job.id"
              :job="job"
            />
          </div>

          <EmptyState
            v-else
            title="No jobs match your search"
            description="Try different keywords, a broader location, or fewer filters."
            icon="i-lucide-search-x"
            action-label="View all jobs"
            action-to="/jobs"
          />
        </template>
      </div>
    </div>
  </UContainer>
</template>
