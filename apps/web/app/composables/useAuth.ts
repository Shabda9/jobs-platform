import type { Session, User } from '@supabase/supabase-js'
import { EMPLOYER_CONTACT_NAME_METADATA_KEY } from '~/utils/employer-auth'

export function useAuth() {
  const supabase = useSupabase()
  const session = useState<Session | null>('auth-session', () => null)
  const user = useState<User | null>('auth-user', () => null)
  const authReady = useState('auth-ready', () => false)

  function applySession(nextSession: Session | null) {
    session.value = nextSession
    user.value = nextSession?.user ?? null
    authReady.value = true
  }

  async function fetchSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      applySession(null)
      return null
    }

    applySession(data.session)
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
    const result = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        data: {
          [EMPLOYER_CONTACT_NAME_METADATA_KEY]: input.contactName.trim()
        }
      }
    })

    if (result.data.session) {
      applySession(result.data.session)
    }

    return result
  }

  async function signInEmployer(input: { email: string; password: string }) {
    const result = await supabase.auth.signInWithPassword({
      email: input.email.trim(),
      password: input.password
    })

    if (result.data.session) {
      applySession(result.data.session)
    }

    return result
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    applySession(null)
    return { error }
  }

  if (import.meta.client && !authReady.value) {
    void fetchSession()

    supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession)
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
