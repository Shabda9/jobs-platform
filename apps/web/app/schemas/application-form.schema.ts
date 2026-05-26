import { z } from 'zod'
import { RESUME_FORM_MESSAGES } from '~/utils/application-messages'
import { getResumeValidationError } from '~/utils/application'

const optionalText = (max: number, label: string) =>
  z
    .string()
    .max(max, `${label} must be at most ${max} characters`)
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
    .max(320, 'Email must be at most 320 characters'),
  phone: optionalText(10, 'Phone'),
  coverMessage: optionalText(5000, 'Cover message'),
  availability: optionalText(500, 'Availability'),
  workRights: optionalText(500, 'Work rights'),
  experienceSummary: optionalText(5000, 'Experience summary'),
  licenceOrCertificate: optionalText(500, 'Licence or certificate'),
  resume: z
    .custom<File>(
      (value) => value instanceof File,
      { message: RESUME_FORM_MESSAGES.required }
    )
    .superRefine((file, ctx) => {
      const error = getResumeValidationError(file)
      if (error) {
        ctx.addIssue({
          code: 'custom',
          message: error
        })
      }
    })
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
