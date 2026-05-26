/** User-facing messages aligned with apps/api (applications + files). */

export const APPLICATION_FORM_MESSAGES = {
  validationFailed: 'Please check the highlighted fields and try again.',
  submitSuccess: 'Application submitted successfully',
  submitSuccessDetail:
    'The employer will review your application. You can close this window.',
  submitting: 'Submitting your application…',
  submitErrorTitle: 'Could not submit application',
  networkError: 'Something went wrong. Please check your connection and try again.',
} as const

export const RESUME_FORM_MESSAGES = {
  required: 'Resume is required',
  maxSize: 'Resume must be 5MB or smaller',
  fileType: 'Resume must be a PDF, DOC, or DOCX file',
  hint: 'PDF, DOC, or DOCX — maximum 5MB',
} as const
