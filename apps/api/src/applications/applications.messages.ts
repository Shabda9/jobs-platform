/** User-facing application endpoint messages. */
export const APPLICATION_MESSAGES = {
  validationFailed: 'Please check the highlighted fields and try again.',
  resumeRequired:
    'Resume is required. Upload a PDF, DOC, or DOCX file (maximum 5MB).',
  jobNotFound: 'This job was not found.',
  jobNotPublished:
    'This job is not accepting applications. It may be unpublished or still pending review.',
  jobExpired: 'This job has expired and is no longer accepting applications.',
  submitSuccess: 'Application submitted successfully',
} as const
