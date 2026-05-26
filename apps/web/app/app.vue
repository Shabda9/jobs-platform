<script setup lang="ts">
const route = useRoute()
const { session, authReady, fetchSession } = useAuth()

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Browse jobs', to: '/jobs' }
]

const isEmployerSignedIn = computed(() => !!session.value)

if (import.meta.client) {
  onMounted(() => {
    if (!authReady.value) {
      void fetchSession()
    }
  })
}

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en-AU'
  }
})

const siteName = 'Jobs Platform'

useSeoMeta({
  titleTemplate: (title) => (title ? `${title} · ${siteName}` : siteName),
  description:
    'Find practical local jobs across Australia — trades, hospitality, cleaning, care, VET roles and more.',
  ogSiteName: siteName
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2 font-semibold text-highlighted hover:text-primary transition-colors"
        >
          <UIcon
            name="i-lucide-briefcase"
            class="size-6 text-primary"
          />
          <span class="hidden sm:inline">Jobs Platform</span>
          <span class="sm:hidden">Jobs</span>
        </NuxtLink>

        <nav
          class="hidden md:flex items-center gap-1 ms-4"
          aria-label="Main"
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
          v-if="isEmployerSignedIn"
          to="/employer/dashboard"
          label="Employer dashboard"
          icon="i-lucide-layout-dashboard"
          color="neutral"
          variant="ghost"
          size="sm"
          class="hidden sm:inline-flex"
        />
        <UButton
          v-else
          to="/employers"
          label="For employers"
          icon="i-lucide-building-2"
          color="neutral"
          variant="ghost"
          size="sm"
          class="hidden sm:inline-flex"
        />
        <UButton
          to="/jobs"
          label="Find jobs"
          icon="i-lucide-search"
          size="sm"
          class="md:hidden"
        />
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Australian job listings for practical local roles · © {{ new Date().getFullYear() }}
        </p>
      </template>
      <template #right>
        <UButton
          to="/jobs"
          label="Browse all jobs"
          color="neutral"
          variant="link"
          size="sm"
        />
      </template>
    </UFooter>
  </UApp>
</template>
