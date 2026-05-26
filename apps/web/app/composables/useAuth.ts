import type { Session, User } from '@supabase/supabase-js'
import { EMPLOYER_CONTACT_NAME_METADATA_KEY } from '~/utils/employer-auth'

export function useAuth() {
  const supabase = useSupabase()
  const session = useState<Session | null>('auth-session', () => null)
  const user = useState<User | null>('auth-user', () => null)
  const authReady = useState('auth-ready', () => false)

  async function fetchSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      session.value = null
      user.value = null
      authReady.value = true
      return null
    }

    session.value = data.session
    user.value = data.session?.user ?? null
    authReady.value = true
    return data.session
  }

  async function getAccessToken(): Promise<string | null> {
    const current = session.value ?? (await fetchSession())
    return current?.access_token ?? null
  }

  async function signUpEmployer(input: {
    email: string
    password: string
    contactName: string
  }) {
    return supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        data: {
          [EMPLOYER_CONTACT_NAME_METADATA_KEY]: input.contactName.trim()
        }
      }
    })
  }

  async function signInEmployer(input: { email: string; password: string }) {
    return supabase.auth.signInWithPassword({
      email: input.email.trim(),
      password: input.password
    })
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    session.value = null
    user.value = null
    return { error }
  }

  if (import.meta.client && !authReady.value) {
    void fetchSession()

    supabase.auth.onAuthStateChange((_event, nextSession) => {
      session.value = nextSession
      user.value = nextSession?.user ?? null
      authReady.value = true
    })
  }

  return {
    supabase,
    session,
    user,
    authReady,
    fetchSession,
    getAccessToken,
    signUpEmployer,
    signInEmployer,
    signOut
  }
}
