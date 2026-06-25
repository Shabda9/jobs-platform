<script setup lang="ts">
import { EMPLOYER_AUTH_MESSAGES } from '~/utils/employer-messages'

const toast = useToast()
const { signOut } = useAuth()

const signingOut = ref(false)

/** Clear the Supabase session and return to the employer landing page. */
async function onSignOut() {
  signingOut.value = true
  try {
    const { error } = await signOut()

    if (error) {
      toast.add({
        title: 'Could not log out',
        description: error.message,
        color: 'error'
      })
      return
    }

    toast.add({
      title: EMPLOYER_AUTH_MESSAGES.logoutSuccess,
      color: 'success'
    })
    await navigateTo('/employers')
  } finally {
    signingOut.value = false
  }
}
</script>

<template>
  <UButton
    label="Log out"
    color="neutral"
    variant="outline"
    size="sm"
    :loading="signingOut"
    @click="onSignOut"
  />
</template>
