/** Supabase user_metadata key for employer contact name until company profile is saved. */
export const EMPLOYER_CONTACT_NAME_METADATA_KEY = 'contact_name'

export function getEmployerContactNameFromMetadata(
  metadata: Record<string, unknown> | undefined
): string | null {
  const value = metadata?.[EMPLOYER_CONTACT_NAME_METADATA_KEY]
  if (typeof value !== 'string') {
    return null
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

/** Map raw Supabase Auth errors to clearer employer-facing copy. */
export function formatSupabaseAuthError(message: string): string {
  if (/email not confirmed/i.test(message)) {
    return (
      'Your email address has not been confirmed yet. If you signed up before ' +
      'email confirmation was turned off in Supabase, delete the test user in ' +
      'Supabase Dashboard → Authentication → Users and sign up again, or open ' +
      'the user there and choose Confirm email.'
    )
  }

  return message
}
