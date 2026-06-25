export const EMPLOYER_AUTH_MESSAGES = {
  signupSuccessTitle: 'Account created',
  signupSuccessBody:
    'You can now use your employer dashboard. If email confirmation is enabled, check your inbox first, then log in.',
  signupConfirmTitle: 'Confirm your email',
  signupConfirmBody:
    'We sent a confirmation link to your email. After confirming, log in to access your employer dashboard.',
  signupNoSessionBody:
    'Your account was created but no login session was issued. Confirm your email, or if you disabled email confirmation in Supabase after signing up, delete this test user in Supabase and sign up again.',
  loginErrorTitle: 'Could not log in',
  signupErrorTitle: 'Could not create account',
  provisionErrorTitle: 'Could not finish setting up your account',
  networkError: 'Something went wrong. Please check your connection and try again.',
  logoutSuccess: 'You have been logged out.'
} as const

export const EMPLOYER_DASHBOARD_MESSAGES = {
  title: 'Employer dashboard',
  welcome: 'Welcome back',
  emailLabel: 'Account email',
  contactNameLabel: 'Contact name',
  companyIncompleteTitle: 'Complete your company profile',
  companyIncompleteBody:
    'Add your business details so you are ready to post jobs when listing goes live.',
  companyIncompleteCta: 'Company profile (coming soon)',
  signedInHint: 'You are signed in as an employer.'
} as const
