<script setup lang="ts">
import type { JobCategory, JobSearchQuery } from '~/types/api'
import { EMPLOYMENT_TYPES } from '~/utils/job'

const props = defineProps<{
  modelValue: JobSearchQuery
  categories: JobCategory[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: JobSearchQuery]
  apply: []
}>()

const local = reactive({
  category: props.modelValue.category,
  employmentType: props.modelValue.employmentType
})

watch(
  () => props.modelValue,
  (value) => {
    local.category = value.category
    local.employmentType = value.employmentType
  },
  { deep: true }
)

const categoryItems = computed(() =>
  props.categories.map((c) => ({ label: c.name, value: c.slug }))
)

const employmentTypeItems = computed(() =>
  EMPLOYMENT_TYPES.map((type) => ({ label: type, value: type }))
)

function apply() {
  emit('update:modelValue', {
    ...props.modelValue,
    category: local.category,
    employmentType: local.employmentType
  })
  emit('apply')
}

function clearFilters() {
  local.category = undefined
  local.employmentType = undefined
  emit('update:modelValue', {
    keyword: props.modelValue.keyword,
    location: props.modelValue.location
  })
  emit('apply')
}

const hasActiveFilters = computed(
  () => Boolean(local.category || local.employmentType)
)
</script>

<template>
  <UCard>
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between gap-2">
        <h2 class="text-sm font-semibold text-highlighted">
          Filters
        </h2>
        <UButton
          v-if="hasActiveFilters"
          label="Clear"
          color="neutral"
          variant="link"
          size="xs"
          @click="clearFilters"
        />
      </div>

      <UFormField label="Category">
        <USelect
          v-model="local.category"
          :items="categoryItems"
          value-key="value"
          label-key="label"
          placeholder="All categories"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Employment type">
        <USelect
          v-model="local.employmentType"
          :items="employmentTypeItems"
          value-key="value"
          label-key="label"
          placeholder="All types"
          class="w-full"
        />
      </UFormField>

      <UButton
        label="Apply filters"
        icon="i-lucide-filter"
        color="primary"
        block
        @click="apply"
      />
    </div>
  </UCard>
</template>
