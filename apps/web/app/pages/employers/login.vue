<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import {
  createEmployerLoginFormState,
  employerLoginSchema,
  type EmployerLoginSchema
} from '~/schemas/employer-login.schema'
import { parseApiError } from '~/utils/api-error'
import { formatSupabaseAuthError } from '~/utils/employer-auth'
import { EMPLOYER_AUTH_MESSAGES } from '~/utils/employer-messages'

definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'Employer log in'
})

const route = useRoute()
const { signInEmployer } = useAuth()

const state = reactive(createEmployerLoginFormState())
const submitting = ref(false)
const errorTitle = ref<string>(EMPLOYER_AUTH_MESSAGES.loginErrorTitle)
const errors = ref<string[]>([])

async function onSubmit(event: FormSubmitEvent<EmployerLoginSchema>) {
  submitting.value = true
  errors.value = []

  try {
    const { error } = await signInEmployer(event.data)

    if (error) {
      errorTitle.value = EMPLOYER_AUTH_MESSAGES.loginErrorTitle
      errors.value = [formatSupabaseAuthError(error.message)]
      return
    }

    await ensureEmployerProfile()

    const redirect =
      typeof route.query.redirect === 'string'
        ? route.query.redirect
        : '/employer/dashboard'
    await navigateTo(redirect)
  } catch (submitError: unknown) {
    const parsed = parseApiError(submitError)
    errorTitle.value = EMPLOYER_AUTH_MESSAGES.provisionErrorTitle
    errors.value =
      parsed.messages.length > 0
        ? parsed.messages
        : [EMPLOYER_AUTH_MESSAGES.networkError]
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <UContainer class="py-12 max-w-md mx-auto">
    <div class="space-y-6">
      <div class="text-center space-y-2">
        <h1 class="text-2xl font-bold text-highlighted">
          Employer log in
        </h1>
        <p class="text-muted text-sm">
          New here?
          <NuxtLink
            to="/employers/signup"
            class="text-primary hover:underline"
          >
            Create an account
          </NuxtLink>
        </p>
      </div>

      <UAlert
        v-if="errors.length > 0"
        color="error"
        variant="subtle"
        :title="errorTitle"
      >
        <ul class="list-disc ps-4 space-y-1">
          <li
            v-for="message in errors"
            :key="message"
          >
            {{ message }}
          </li>
        </ul>
      </UAlert>

      <UForm
        :schema="employerLoginSchema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Email"
          name="email"
          required
        >
          <UInput
            v-model="state.email"
            type="email"
            autocomplete="email"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
          required
        >
          <UInput
            v-model="state.password"
            type="password"
            autocomplete="current-password"
          />
        </UFormField>

        <UButton
          type="submit"
          label="Log in"
          block
          :loading="submitting"
        />
      </UForm>
    </div>
  </UContainer>
</template>
