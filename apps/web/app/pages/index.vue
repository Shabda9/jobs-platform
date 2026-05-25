<script setup lang="ts">
import type { ApiListResponse, JobCategory } from '~/types/api'

useSeoMeta({
  title: 'Find practical jobs across Australia',
  description:
    'Search trades, hospitality, cleaning, care, VET and local roles on Jobs Platform.'
})

const { data: categoriesData } = await useAsyncData(
  'home-categories',
  () => apiFetch<ApiListResponse<JobCategory>>('/categories')
)

const featuredCategories = computed(
  () => categoriesData.value?.data?.slice(0, 8) ?? []
)
</script>

<template>
  <div>
    <section class="border-b border-default bg-elevated/50">
      <UContainer class="py-12 sm:py-16 lg:py-20">
        <div class="max-w-3xl mx-auto text-center space-y-4 mb-8">
          <UBadge
            label="Australian job board"
            color="primary"
            variant="subtle"
          />
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-highlighted tracking-tight">
            Find your next practical role
          </h1>
          <p class="text-base sm:text-lg text-muted max-w-2xl mx-auto">
            Trades, hospitality, cleaning, aged care, transport, apprenticeships and more —
            real local jobs for job seekers across Australia.
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <UCard class="shadow-lg">
            <JobSearchBar />
          </UCard>
        </div>
      </UContainer>
    </section>

    <UContainer class="py-12 sm:py-16 space-y-12">
      <section class="grid sm:grid-cols-3 gap-6">
        <UCard
          v-for="item in [
            { icon: 'i-lucide-wrench', title: 'Trades & construction', text: 'Electricians, builders, labourers and skilled trades.' },
            { icon: 'i-lucide-utensils', title: 'Hospitality', text: 'Chefs, kitchen hands, baristas and venue staff.' },
            { icon: 'i-lucide-heart-handshake', title: 'Care & community', text: 'Aged care, childcare and support services roles.' }
          ]"
          :key="item.title"
          variant="subtle"
        >
          <div class="flex flex-col gap-3">
            <UIcon
              :name="item.icon"
              class="size-8 text-primary"
            />
            <h2 class="font-semibold text-highlighted">
              {{ item.title }}
            </h2>
            <p class="text-sm text-muted">
              {{ item.text }}
            </p>
          </div>
        </UCard>
      </section>

      <section
        v-if="featuredCategories.length"
        class="space-y-6"
      >
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-highlighted">
              Browse by category
            </h2>
            <p class="text-muted mt-1">
              Jump straight into roles that match your experience.
            </p>
          </div>
          <UButton
            to="/jobs"
            label="View all jobs"
            trailing-icon="i-lucide-arrow-right"
            color="primary"
            variant="soft"
          />
        </div>

        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="category in featuredCategories"
            :key="category.slug"
            :to="{ path: '/jobs', query: { category: category.slug } }"
            :label="category.name"
            color="neutral"
            variant="outline"
            size="sm"
          />
        </div>
      </section>

      <UPageCTA
        title="Ready to start looking?"
        description="Browse published roles from employers across Australia. No account needed to search."
        :links="[{
          label: 'Browse all jobs',
          to: '/jobs',
          trailingIcon: 'i-lucide-arrow-right',
          color: 'primary',
          size: 'lg'
        }]"
        variant="subtle"
      />
    </UContainer>
  </div>
</template>
