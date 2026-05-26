export const AUTH_MESSAGES = {
  missingToken: 'Authentication required. Please log in again.',
  invalidToken: 'Your session is invalid or has expired. Please log in again.',
  notProvisioned:
    'Your employer account is not set up yet. Please try signing in again.',
  notEmployer: 'This account is not registered as an employer.',
  emailInUse:
    'An account with this email already exists. Try logging in or use a different email.',
  bootstrapSuccess: 'Employer account ready.',
} as const;
