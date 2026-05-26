import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const url = String(config.public.supabaseUrl || '').trim()
  const anonKey = String(config.public.supabaseAnonKey || '').trim()

  if (!url || !anonKey) {
    console.warn(
      '[supabase] NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY must be set.'
    )
  }

  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })

  return {
    provide: {
      supabase
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $supabase: SupabaseClient
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $supabase: SupabaseClient
  }
}
