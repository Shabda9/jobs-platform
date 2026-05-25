<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: 'Loading…'
  }
)
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-4 py-16 text-center"
    role="status"
    aria-live="polite"
  >
    <UIcon
      name="i-lucide-loader-circle"
      class="size-10 text-primary animate-spin"
    />
    <p class="text-muted">
      {{ message }}
    </p>
  </div>
</template>
