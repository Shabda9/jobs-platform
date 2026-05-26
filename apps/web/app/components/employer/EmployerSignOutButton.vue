<script setup lang="ts">
import { EMPLOYER_AUTH_MESSAGES } from '~/utils/employer-messages'

const toast = useToast()
const { signOut } = useAuth()

const signingOut = ref(false)

async function onSignOut() {
  signingOut.value = true
  try {
    await signOut()
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
