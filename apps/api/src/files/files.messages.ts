/** User-facing resume validation messages (shared across FilesService). */
export const RESUME_VALIDATION_MESSAGES = {
  required: 'Resume is required',
  maxSize: 'Resume must be 5MB or smaller',
  fileType: 'Resume must be a PDF, DOC, or DOCX file',
} as const
