/** Mirrors backend resume rules (apps/api/src/files/files.constants.ts). */

export const RESUME_MAX_BYTES = 5 * 1024 * 1024

export const RESUME_ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const

export const RESUME_ACCEPT =
  '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export function getResumeExtension(fileName: string): string {
  const index = fileName.lastIndexOf('.')
  return index >= 0 ? fileName.slice(index).toLowerCase() : ''
}

export function isAllowedResumeFile(file: File): boolean {
  const extension = getResumeExtension(file.name)
  return RESUME_ALLOWED_EXTENSIONS.includes(
    extension as (typeof RESUME_ALLOWED_EXTENSIONS)[number]
  )
}

export function formatResumeSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
