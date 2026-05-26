<script setup lang="ts">
import { getEmployerContactNameFromMetadata } from '~/utils/employer-auth'
import { EMPLOYER_DASHBOARD_MESSAGES } from '~/utils/employer-messages'

definePageMeta({
  layout: 'employer',
  middleware: 'employer'
})

useSeoMeta({
  title: EMPLOYER_DASHBOARD_MESSAGES.title
})

const { user } = useAuth()

const profile = ref<Awaited<ReturnType<typeof ensureEmployerProfile>> | null>(
  null
)
const loadError = ref<string | null>(null)
const loading = ref(true)

const contactName = computed(() =>
  getEmployerContactNameFromMetadata(user.value?.user_metadata)
)

onMounted(async () => {
  try {
    profile.value = await ensureEmployerProfile()
  } catch (error: unknown) {
    if (error instanceof Error) {
      loadError.value = error.message
    } else {
      loadError.value = 'Could not load your employer profile.'
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-3xl space-y-8">
    <div>
      <h1 class="text-2xl md:text-3xl font-bold text-highlighted">
        {{ EMPLOYER_DASHBOARD_MESSAGES.title }}
      </h1>
      <p class="text-muted mt-2">
        {{ EMPLOYER_DASHBOARD_MESSAGES.signedInHint }}
      </p>
    </div>

    <LoadingState v-if="loading" />

    <UAlert
      v-else-if="loadError"
      color="error"
      variant="subtle"
      title="Could not load dashboard"
      :description="loadError"
    />

    <template v-else-if="profile">
      <UCard>
        <template #header>
          <h2 class="font-semibold text-highlighted">
            {{ EMPLOYER_DASHBOARD_MESSAGES.welcome }}
          </h2>
        </template>

        <dl class="space-y-3 text-sm">
          <div class="flex flex-col sm:flex-row sm:gap-4">
            <dt class="text-muted min-w-40">
              {{ EMPLOYER_DASHBOARD_MESSAGES.emailLabel }}
            </dt>
            <dd class="font-medium text-highlighted">
              {{ profile.email }}
            </dd>
          </div>
          <div
            v-if="contactName"
            class="flex flex-col sm:flex-row sm:gap-4"
          >
            <dt class="text-muted min-w-40">
              {{ EMPLOYER_DASHBOARD_MESSAGES.contactNameLabel }}
            </dt>
            <dd class="font-medium text-highlighted">
              {{ contactName }}
            </dd>
          </div>
        </dl>
      </UCard>

      <UAlert
        v-if="!profile.hasCompanyProfile"
        color="warning"
        variant="subtle"
        :title="EMPLOYER_DASHBOARD_MESSAGES.companyIncompleteTitle"
        :description="EMPLOYER_DASHBOARD_MESSAGES.companyIncompleteBody"
      >
        <template #actions>
          <UButton
            to="/employer/company"
            label="Company profile"
            color="warning"
            variant="soft"
            size="sm"
          />
        </template>
      </UAlert>

      <UCard v-else>
        <p class="text-sm text-muted">
          Your company profile is set up. Job posting will be available in a
          later release.
        </p>
      </UCard>
    </template>
  </div>
</template>
