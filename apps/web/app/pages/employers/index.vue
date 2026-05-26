<script setup lang="ts">
useSeoMeta({
  title: 'For employers',
  description:
    'Create an employer account to list jobs on Jobs Platform when posting goes live.'
})
</script>

<template>
  <UContainer class="py-12 md:py-16">
    <div class="max-w-2xl mx-auto text-center space-y-6">
      <UBadge
        color="primary"
        variant="subtle"
        label="Employers"
      />
      <h1 class="text-3xl md:text-4xl font-bold text-highlighted">
        Hire for practical local roles
      </h1>
      <p class="text-lg text-muted">
        Create a free employer account to manage your business profile and get
        ready to post jobs across Australia.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <UButton
          to="/employers/signup"
          label="Create employer account"
          size="lg"
          icon="i-lucide-user-plus"
        />
        <UButton
          to="/employers/login"
          label="Employer log in"
          size="lg"
          color="neutral"
          variant="outline"
          icon="i-lucide-log-in"
        />
      </div>

      <p class="text-sm text-muted pt-4">
        Looking for work?
        <NuxtLink
          to="/jobs"
          class="text-primary hover:underline"
        >
          Browse jobs
        </NuxtLink>
        — no account needed to apply.
      </p>
    </div>
  </UContainer>
</template>
