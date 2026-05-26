import { z } from 'zod'

export const employerSignupSchema = z
  .object({
    contactName: z
      .string()
      .trim()
      .min(1, 'Contact name is required')
      .max(200, 'Contact name must be 200 characters or fewer'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Enter a valid email address')
      .max(320, 'Email must be 320 characters or fewer'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must be 72 characters or fewer'),
    confirmPassword: z.string().min(1, 'Confirm your password')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export type EmployerSignupSchema = z.infer<typeof employerSignupSchema>

export type EmployerSignupFormState = {
  contactName: string
  email: string
  password: string
  confirmPassword: string
}

export function createEmployerSignupFormState(): EmployerSignupFormState {
  return {
    contactName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
}
