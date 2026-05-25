<script setup lang="ts">
import type { JobSearchQuery } from '~/types/api'

const props = withDefaults(
  defineProps<{
    initial?: JobSearchQuery
    compact?: boolean
  }>(),
  {
    initial: () => ({}),
    compact: false
  }
)

const keyword = ref(props.initial.keyword ?? '')
const location = ref(props.initial.location ?? '')

function submit() {
  const query: Record<string, string> = {}

  if (keyword.value.trim()) {
    query.keyword = keyword.value.trim()
  }
  if (location.value.trim()) {
    query.location = location.value.trim()
  }

  if (props.initial.category?.trim()) {
    query.category = props.initial.category.trim()
  }
  if (props.initial.employmentType?.trim()) {
    query.employmentType = props.initial.employmentType.trim()
  }

  navigateTo({ path: '/jobs', query })
}
</script>

<template>
  <form
    class="w-full"
    @submit.prevent="submit"
  >
    <div
      class="grid gap-3"
      :class="compact ? 'sm:grid-cols-[1fr_1fr_auto]' : 'sm:grid-cols-[1fr_1fr_auto]'"
    >
      <UInput
        v-model="keyword"
        icon="i-lucide-search"
        placeholder="Job title, company or keyword"
        size="lg"
        aria-label="Search keywords"
      />
      <UInput
        v-model="location"
        icon="i-lucide-map-pin"
        placeholder="City or suburb (e.g. Sydney)"
        size="lg"
        aria-label="Location"
      />
      <UButton
        type="submit"
        label="Search jobs"
        icon="i-lucide-arrow-right"
        size="lg"
        color="primary"
        class="w-full sm:w-auto"
      />
    </div>
  </form>
</template>
