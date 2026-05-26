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
