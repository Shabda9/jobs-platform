<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: 'Dashboard', to: '/employer/dashboard' },
  { label: 'Company profile', to: '/employer/company' }
]
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink
        to="/employer/dashboard"
        class="flex items-center gap-2 font-semibold text-highlighted hover:text-primary transition-colors"
      >
        <UIcon
          name="i-lucide-building-2"
          class="size-6 text-primary"
        />
        <span>Employer area</span>
      </NuxtLink>

      <nav
        class="hidden md:flex items-center gap-1 ms-4"
        aria-label="Employer"
      >
        <UButton
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :label="item.label"
          color="neutral"
          :variant="route.path === item.to ? 'soft' : 'ghost'"
          size="sm"
        />
      </nav>
    </template>

    <template #right>
      <UButton
        to="/jobs"
        label="Browse jobs"
        color="neutral"
        variant="ghost"
        size="sm"
      />
      <EmployerSignOutButton />
      <UColorModeButton />
    </template>
  </UHeader>

  <UMain>
    <UContainer class="py-8">
      <slot />
    </UContainer>
  </UMain>
</template>
