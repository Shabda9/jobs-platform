<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import {
  createEmployerSignupFormState,
  employerSignupSchema,
  type EmployerSignupSchema
} from '~/schemas/employer-signup.schema'
import { parseApiError } from '~/utils/api-error'
import { EMPLOYER_AUTH_MESSAGES } from '~/utils/employer-messages'

definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'Employer sign up'
})

const route = useRoute()
const { signUpEmployer, session, fetchSession } = useAuth()

const state = reactive(createEmployerSignupFormState())
const submitting = ref(false)
const errorTitle = ref<string>(EMPLOYER_AUTH_MESSAGES.signupErrorTitle)
const errors = ref<string[]>([])
const awaitingEmailConfirm = ref(false)

async function onSubmit(event: FormSubmitEvent<EmployerSignupSchema>) {
  submitting.value = true
  errors.value = []
  awaitingEmailConfirm.value = false

  try {
    const { data, error } = await signUpEmployer(event.data)

    if (error) {
      errorTitle.value = EMPLOYER_AUTH_MESSAGES.signupErrorTitle
      errors.value = [error.message]
      return
    }

    await fetchSession()

    if (session.value) {
      await bootstrapEmployerAccount()
      const redirect =
        typeof route.query.redirect === 'string'
          ? route.query.redirect
          : '/employer/dashboard'
      await navigateTo(redirect)
      return
    }

    awaitingEmailConfirm.value = true
  } catch (submitError: unknown) {
    const parsed = parseApiError(submitError)
    errorTitle.value = parsed.title
    errors.value = parsed.messages
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
          Create employer account
        </h1>
        <p class="text-muted text-sm">
          Already registered?
          <NuxtLink
            to="/employers/login"
            class="text-primary hover:underline"
          >
            Log in
          </NuxtLink>
        </p>
      </div>

      <UAlert
        v-if="awaitingEmailConfirm"
        color="success"
        variant="subtle"
        :title="EMPLOYER_AUTH_MESSAGES.signupConfirmTitle"
        :description="EMPLOYER_AUTH_MESSAGES.signupConfirmBody"
      />

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
        v-if="!awaitingEmailConfirm"
        :schema="employerSignupSchema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Contact name"
          name="contactName"
          required
        >
          <UInput
            v-model="state.contactName"
            autocomplete="name"
          />
        </UFormField>

        <UFormField
          label="Work email"
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
          help="At least 8 characters"
        >
          <UInput
            v-model="state.password"
            type="password"
            autocomplete="new-password"
          />
        </UFormField>

        <UFormField
          label="Confirm password"
          name="confirmPassword"
          required
        >
          <UInput
            v-model="state.confirmPassword"
            type="password"
            autocomplete="new-password"
          />
        </UFormField>

        <UButton
          type="submit"
          label="Create account"
          block
          :loading="submitting"
        />
      </UForm>
    </div>
  </UContainer>
</template>
