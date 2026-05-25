/**
 * Decode JWT role claim without verifying signature (config sanity check only).
 */
export function getSupabaseKeyRole(key: string): string | null {
  const parts = key.trim().split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf8'),
    ) as { role?: string };
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function assertServiceRoleKey(key: string, envVarName: string): void {
  const role = getSupabaseKeyRole(key);

  if (role === 'anon') {
    throw new Error(
      `${envVarName} is set to the anon (public) key. Use the service_role secret from Supabase Dashboard → Project Settings → API → service_role (legacy) or the secret key — never the anon/publishable key.`,
    );
  }

  if (role != null && role !== 'service_role') {
    throw new Error(
      `${envVarName} JWT role is "${role}", expected "service_role".`,
    );
  }

  // New-style secret keys (sb_secret_...) are not JWTs; Supabase client accepts them.
}
