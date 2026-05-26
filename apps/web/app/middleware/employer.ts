export default defineNuxtRouteMiddleware(async (to) => {
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
