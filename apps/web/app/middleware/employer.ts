export default defineNuxtRouteMiddleware(async (to) => {
  // Supabase client and session live in the browser only.
  if (import.meta.server) return

  const { fetchSession, session, authReady } = useAuth()

  if (!authReady.value) {
    await fetchSession()
  }

  if (!session.value) {
    return navigateTo({
      path: '/employers/login',
      query: { redirect: to.fullPath }
    })
  }
})
