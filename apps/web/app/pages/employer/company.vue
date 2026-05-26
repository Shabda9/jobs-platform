<script setup lang="ts">
definePageMeta({
  layout: 'employer',
  middleware: 'employer'
})

useSeoMeta({
  title: 'Company profile'
})
</script>

<template>
  <div class="max-w-2xl space-y-4">
    <h1 class="text-2xl font-bold text-highlighted">
      Company profile
    </h1>
    <UAlert
      color="neutral"
      variant="subtle"
      title="Coming in the next release"
      description="Company profile create and edit will be added in Slice 2. Your contact name from sign-up is stored securely until then."
    />
    <UButton
      to="/employer/dashboard"
      label="Back to dashboard"
      color="neutral"
      variant="outline"
    />
  </div>
</template>
