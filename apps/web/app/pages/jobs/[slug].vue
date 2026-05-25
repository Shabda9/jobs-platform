<script setup lang="ts">
import type { JobDetail } from '~/types/api'
import { formatJobDate, formatJobSalary } from '~/utils/job'

const route = useRoute()
const toast = useToast()

const slug = computed(() => String(route.params.slug))

const { data: job, pending, error } = await useAsyncData(
  () => `job-${slug.value}`,
  () => apiFetch<JobDetail>(`/jobs/${slug.value}`),
  { watch: [slug] }
)

const salaryDisplay = computed(() =>
  job.value ? formatJobSalary(job.value) : null
)

const publishedLabel = computed(() =>
  job.value ? formatJobDate(job.value.publishedAt) : null
)

const expiresLabel = computed(() =>
  job.value ? formatJobDate(job.value.expiresAt) : null
)

watchEffect(() => {
  if (job.value) {
    useSeoMeta({
      title: job.value.title,
      description: `${job.value.title} at ${job.value.companyName} — ${job.value.location}`
    })
  }
})

function onApplyClick() {
  toast.add({
    title: 'Applications coming soon',
    description: 'Online applications will be available in a future update.',
    color: 'primary',
    icon: 'i-lucide-info'
  })
}

const detailSections = computed(() => {
  if (!job.value) {
    return []
  }

  return [
    { key: 'description', label: 'About the role', content: job.value.description },
    { key: 'responsibilities', label: 'Responsibilities', content: job.value.responsibilities },
    { key: 'requirements', label: 'Requirements', content: job.value.requirements },
    { key: 'benefits', label: 'Benefits', content: job.value.benefits }
  ].filter((section) => section.content?.trim())
})
</script>

<template>
  <UContainer class="py-8 sm:py-10">
    <UButton
      to="/jobs"
      label="Back to jobs"
      icon="i-lucide-arrow-left"
      color="neutral"
      variant="ghost"
      class="mb-6"
    />

    <LoadingState
      v-if="pending"
      message="Loading job details…"
    />

    <template v-else-if="job">
      <div class="grid lg:grid-cols-[1fr_280px] gap-8 items-start">
        <article class="min-w-0 space-y-8">
          <header class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <UBadge
                :label="job.employmentType"
                color="primary"
                variant="subtle"
              />
              <UBadge
                :label="job.category"
                color="neutral"
                variant="outline"
              />
            </div>

            <h1 class="text-2xl sm:text-3xl font-bold text-highlighted">
              {{ job.title }}
            </h1>

            <p class="text-lg font-medium text-default">
              {{ job.companyName }}
            </p>

            <div class="flex flex-wrap gap-x-5 gap-y-2 text-muted">
              <span class="inline-flex items-center gap-1.5">
                <UIcon
                  name="i-lucide-map-pin"
                  class="size-4"
                />
                {{ job.location }}
              </span>
              <span
                v-if="salaryDisplay"
                class="inline-flex items-center gap-1.5 font-medium text-primary"
              >
                <UIcon
                  name="i-lucide-banknote"
                  class="size-4"
                />
                {{ salaryDisplay }}
              </span>
            </div>

            <p
              v-if="publishedLabel"
              class="text-sm text-muted"
            >
              Posted {{ publishedLabel }}
              <span v-if="expiresLabel"> · Closes {{ expiresLabel }}</span>
            </p>
          </header>

          <section
            v-for="section in detailSections"
            :key="section.key"
            class="space-y-3"
          >
            <h2 class="text-lg font-semibold text-highlighted">
              {{ section.label }}
            </h2>
            <div class="prose prose-neutral dark:prose-invert max-w-none text-default whitespace-pre-wrap">
              {{ section.content }}
            </div>
          </section>

          <section
            v-if="job.requiredLicenceOrCertificate || job.workRightsRequirement"
            class="space-y-4"
          >
            <h2 class="text-lg font-semibold text-highlighted">
              Additional requirements
            </h2>
            <ul class="space-y-3 text-default">
              <li
                v-if="job.requiredLicenceOrCertificate"
                class="flex gap-2"
              >
                <UIcon
                  name="i-lucide-badge-check"
                  class="size-5 text-primary shrink-0 mt-0.5"
                />
                <span>{{ job.requiredLicenceOrCertificate }}</span>
              </li>
              <li
                v-if="job.workRightsRequirement"
                class="flex gap-2"
              >
                <UIcon
                  name="i-lucide-shield"
                  class="size-5 text-primary shrink-0 mt-0.5"
                />
                <span>{{ job.workRightsRequirement }}</span>
              </li>
            </ul>
          </section>
        </article>

        <aside class="lg:sticky lg:top-24">
          <UCard class="space-y-4">
            <div class="space-y-2 text-sm">
              <div class="flex justify-between gap-2">
                <span class="text-muted">Company</span>
                <span class="font-medium text-end">{{ job.companyName }}</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted">Location</span>
                <span class="font-medium text-end">{{ job.location }}</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted">Type</span>
                <span class="font-medium text-end">{{ job.employmentType }}</span>
              </div>
              <div
                v-if="salaryDisplay"
                class="flex justify-between gap-2"
              >
                <span class="text-muted">Salary</span>
                <span class="font-medium text-end text-primary">{{ salaryDisplay }}</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-muted">Category</span>
                <span class="font-medium text-end">{{ job.category }}</span>
              </div>
            </div>

            <USeparator />

            <UButton
              label="Apply for this job"
              icon="i-lucide-send"
              color="primary"
              size="lg"
              block
              @click="onApplyClick"
            />
            <p class="text-xs text-center text-muted">
              Online applications are not open yet in this MVP slice.
            </p>
          </UCard>
        </aside>
      </div>
    </template>

    <EmptyState
      v-else
      title="Job not found"
      :description="error ? 'This job may have expired or is no longer published.' : 'We could not find that job listing.'"
      icon="i-lucide-file-question"
      action-label="Browse jobs"
      action-to="/jobs"
    />
  </UContainer>
</template>
