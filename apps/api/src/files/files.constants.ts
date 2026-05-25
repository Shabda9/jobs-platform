export const RESUME_BUCKET = 'resumes';

export const RESUME_MAX_BYTES = 5 * 1024 * 1024;

export const RESUME_ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const;

/** MIME types allowed for resume uploads (PDF, DOC, DOCX). */
export const RESUME_ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
