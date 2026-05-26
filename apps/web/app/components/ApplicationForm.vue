<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import {
  applicationFormSchema,
  createApplicationFormState,
  type ApplicationFormSchema,
  type ApplicationFormState
} from '~/schemas/application-form.schema'
import { parseApiError } from '~/utils/api-error'
import { formatResumeSize, RESUME_ACCEPT } from '~/utils/application'

const props = defineProps<{
  jobId: string
  jobTitle?: string
  /** When false, form state resets (e.g. modal closed). */
  open?: boolean
}>()

const emit = defineEmits<{
  submitted: [applicationId: string]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

const state = reactive(createApplicationFormState())
const submitting = ref(false)
const submitSuccess = ref(false)
const submitErrors = ref<string[]>([])

const selectedResumeName = computed(() => state.resume?.name ?? null)

const selectedResumeSize = computed(() =>
  state.resume ? formatResumeSize(state.resume.size) : null
)

const formDisabled = computed(() => submitting.value || submitSuccess.value)

function resetForm() {
  Object.assign(state, createApplicationFormState())
  submitSuccess.value = false
  submitErrors.value = []
  clearResume()
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen === false) {
      resetForm()
    }
  }
)

function onResumeChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  state.resume = file
  submitErrors.value = []
}

function clearResume() {
  state.resume = undefined
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

async function onSubmit(event: FormSubmitEvent<ApplicationFormSchema>) {
  if (submitting.value || submitSuccess.value) {
    return
  }

  submitting.value = true
  submitErrors.value = []

  try {
    const response = await submitJobApplication(props.jobId, event.data)
    submitSuccess.value = true
    emit('submitted', response.applicationId)
  } catch (error) {
    const parsed = parseApiError(error)
    submitErrors.value = parsed.messages
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="jobTitle && !submitSuccess">
      <p class="text-sm text-muted">
        Applying for
      </p>
      <p class="font-semibold text-highlighted">
        {{ jobTitle }}
      </p>
    </div>

    <UAlert
      v-if="submitSuccess"
      color="success"
      variant="subtle"
      title="Application submitted successfully."
      description="The employer will review your application. You can close this window."
      icon="i-lucide-circle-check"
    />

    <UAlert
      v-if="submitErrors.length && !submitSuccess"
      color="error"
      variant="subtle"
      title="Could not submit application"
      icon="i-lucide-circle-alert"
    >
      <template #description>
        <ul class="list-disc ps-4 space-y-1 text-sm">
          <li
            v-for="(message, index) in submitErrors"
            :key="index"
          >
            {{ message }}
          </li>
        </ul>
      </template>
    </UAlert>

    <UForm
      v-if="!submitSuccess"
      :schema="applicationFormSchema"
      :state="state as ApplicationFormState"
      :disabled="formDisabled"
      class="space-y-6"
      @submit="onSubmit"
    >
      <div class="grid gap-5 sm:grid-cols-2">
        <UFormField
          label="Full name"
          name="fullName"
          required
          class="sm:col-span-2"
        >
          <UInput
            v-model="state.fullName"
            placeholder="Your full name"
            autocomplete="name"
            class="w-full"
            :disabled="formDisabled"
          />
        </UFormField>

        <UFormField
          label="Email"
          name="email"
          required
        >
          <UInput
            v-model="state.email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            class="w-full"
            :disabled="formDisabled"
          />
        </UFormField>

        <UFormField
          label="Phone"
          name="phone"
          hint="Optional"
        >
          <UInput
            v-model="state.phone"
            type="tel"
            placeholder="04XX XXX XXX"
            autocomplete="tel"
            class="w-full"
            :disabled="formDisabled"
          />
        </UFormField>

        <UFormField
          label="Cover message"
          name="coverMessage"
          hint="Optional"
          class="sm:col-span-2"
        >
          <UTextarea
            v-model="state.coverMessage"
            placeholder="Why are you interested in this role?"
            :rows="4"
            class="w-full"
            :disabled="formDisabled"
          />
        </UFormField>

        <UFormField
          label="Availability"
          name="availability"
          hint="Optional"
        >
          <UInput
            v-model="state.availability"
            placeholder="e.g. Immediate, 2 weeks notice"
            class="w-full"
            :disabled="formDisabled"
          />
        </UFormField>

        <UFormField
          label="Work rights in Australia"
          name="workRights"
          hint="Optional"
        >
          <UInput
            v-model="state.workRights"
            placeholder="e.g. Australian citizen, valid work visa"
            class="w-full"
            :disabled="formDisabled"
          />
        </UFormField>

        <UFormField
          label="Experience summary"
          name="experienceSummary"
          hint="Optional"
          class="sm:col-span-2"
        >
          <UTextarea
            v-model="state.experienceSummary"
            placeholder="Brief overview of your relevant experience"
            :rows="4"
            class="w-full"
            :disabled="formDisabled"
          />
        </UFormField>

        <UFormField
          label="Licence or certificate"
          name="licenceOrCertificate"
          hint="Optional"
          class="sm:col-span-2"
        >
          <UInput
            v-model="state.licenceOrCertificate"
            placeholder="e.g. White Card, Food Safety Certificate"
            class="w-full"
            :disabled="formDisabled"
          />
        </UFormField>

        <UFormField
          label="Resume"
          name="resume"
          required
          class="sm:col-span-2"
          description="PDF, DOC, or DOCX — maximum 5MB"
        >
          <div class="space-y-3">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                ref="fileInputRef"
                type="file"
                class="hidden"
                :accept="RESUME_ACCEPT"
                :disabled="formDisabled"
                @change="onResumeChange"
              >
              <UButton
                type="button"
                label="Choose resume file"
                icon="i-lucide-upload"
                color="neutral"
                variant="outline"
                class="w-full sm:w-auto"
                :disabled="formDisabled"
                @click="fileInputRef?.click()"
              />
              <UButton
                v-if="selectedResumeName"
                type="button"
                label="Remove"
                color="neutral"
                variant="ghost"
                size="sm"
                :disabled="formDisabled"
                @click="clearResume"
              />
            </div>

            <div
              v-if="selectedResumeName"
              class="flex items-start gap-2 rounded-lg border border-default bg-elevated/50 px-3 py-2 text-sm"
            >
              <UIcon
                name="i-lucide-file-text"
                class="size-5 text-primary shrink-0 mt-0.5"
              />
              <div class="min-w-0">
                <p class="font-medium text-highlighted truncate">
                  {{ selectedResumeName }}
                </p>
                <p
                  v-if="selectedResumeSize"
                  class="text-muted text-xs"
                >
                  {{ selectedResumeSize }}
                </p>
              </div>
            </div>
          </div>
        </UFormField>
      </div>

      <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
        <UButton
          type="submit"
          label="Submit application"
          icon="i-lucide-send"
          color="primary"
          size="lg"
          block
          class="sm:w-auto sm:min-w-[200px]"
          :loading="submitting"
          :disabled="formDisabled"
        />
      </div>
    </UForm>
  </div>
</template>
