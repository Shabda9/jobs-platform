<script setup lang="ts">
import type { JobListItem } from '~/types/api'
import { formatJobDate } from '~/utils/job'

defineProps<{
  job: JobListItem
}>()
</script>

<template>
  <UCard
    :ui="{ body: 'p-0 sm:p-0' }"
    class="h-full transition-shadow hover:shadow-md"
  >
    <NuxtLink
      :to="`/jobs/${job.slug}`"
      class="flex flex-col gap-3 p-4 sm:p-5 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
    >
      <div class="flex flex-wrap items-start justify-between gap-2">
        <h2 class="text-lg font-semibold text-highlighted leading-snug">
          {{ job.title }}
        </h2>
        <UBadge
          :label="job.employmentType"
          color="primary"
          variant="subtle"
          size="sm"
          class="shrink-0"
        />
      </div>

      <p class="text-sm font-medium text-default">
        {{ job.companyName }}
      </p>

      <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        <span class="inline-flex items-center gap-1">
          <UIcon
            name="i-lucide-map-pin"
            class="size-4 shrink-0"
          />
          {{ job.location }}
        </span>
        <span class="inline-flex items-center gap-1">
          <UIcon
            name="i-lucide-tag"
            class="size-4 shrink-0"
          />
          {{ job.category }}
        </span>
      </div>

      <p
        v-if="job.salaryText"
        class="text-sm font-medium text-primary"
      >
        {{ job.salaryText }}
      </p>

      <p
        v-if="formatJobDate(job.publishedAt)"
        class="text-xs text-muted mt-auto pt-1"
      >
        Posted {{ formatJobDate(job.publishedAt) }}
      </p>
    </NuxtLink>
  </UCard>
</template>
