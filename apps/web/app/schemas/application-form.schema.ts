import { z } from 'zod'
import {
  isAllowedResumeFile,
  RESUME_MAX_BYTES
} from '~/utils/application'

const optionalText = (max: number) =>
  z
    .string()
    .max(max, `Must be at most ${max} characters`)
    .optional()
    .or(z.literal(''))

export const applicationFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .max(200, 'Full name is too long'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .max(320, 'Email is too long'),
  phone: optionalText(50),
  coverMessage: optionalText(5000),
  availability: optionalText(500),
  workRights: optionalText(500),
  experienceSummary: optionalText(5000),
  licenceOrCertificate: optionalText(500),
  resume: z
    .custom<File>(
      (value) => value instanceof File,
      { message: 'Resume is required' }
    )
    .refine((file) => file.size > 0, 'Resume is required')
    .refine(
      (file) => file.size <= RESUME_MAX_BYTES,
      'Resume must be 5MB or smaller'
    )
    .refine(
      (file) => isAllowedResumeFile(file),
      'Resume must be a PDF, DOC, or DOCX file'
    )
})

export type ApplicationFormSchema = z.output<typeof applicationFormSchema>

export type ApplicationFormState = {
  fullName: string
  email: string
  phone: string
  coverMessage: string
  availability: string
  workRights: string
  experienceSummary: string
  licenceOrCertificate: string
  resume?: File
}

export function createApplicationFormState(): ApplicationFormState {
  return {
    fullName: '',
    email: '',
    phone: '',
    coverMessage: '',
    availability: '',
    workRights: '',
    experienceSummary: '',
    licenceOrCertificate: ''
  }
}
