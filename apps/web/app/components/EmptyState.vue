<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    icon?: string
    actionLabel?: string
    actionTo?: string
  }>(),
  {
    title: 'Nothing here yet',
    description: 'Try adjusting your search or filters.',
    icon: 'i-lucide-inbox'
  }
)
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
    <div class="rounded-full bg-elevated p-4">
      <UIcon
        :name="icon"
        class="size-10 text-muted"
      />
    </div>
    <div class="max-w-md space-y-2">
      <h2 class="text-lg font-semibold text-highlighted">
        {{ title }}
      </h2>
      <p class="text-sm text-muted">
        {{ description }}
      </p>
    </div>
    <UButton
      v-if="actionLabel && actionTo"
      :to="actionTo"
      :label="actionLabel"
      color="primary"
      variant="soft"
    />
  </div>
</template>
