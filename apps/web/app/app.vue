<script setup lang="ts">
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
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
