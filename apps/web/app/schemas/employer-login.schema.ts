import { z } from 'zod'

export const employerLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .max(320, 'Email must be 320 characters or fewer'),
  password: z.string().min(1, 'Password is required')
})

export type EmployerLoginSchema = z.infer<typeof employerLoginSchema>

export type EmployerLoginFormState = {
  email: string
  password: string
}

export function createEmployerLoginFormState(): EmployerLoginFormState {
  return {
    email: '',
    password: ''
  }
}
