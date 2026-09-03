import { z } from 'zod'

export const genderOptions = ['MALE', 'FEMALE'] as const
export const maritalStatusOptions = ['SINGLE', 'MARRIED'] as const

const BIRTHDATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export const registerSchema = z
  .object({
    email: z.string().email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    firstName: z.string().min(1, 'First name is required').max(80, 'First name must be at most 80 characters'),
    middleName: z.string().max(80, 'Middle name must be at most 80 characters').optional(),
    lastName: z.string().min(1, 'Last name is required').max(80, 'Last name must be at most 80 characters'),
    gender: z.enum(genderOptions, { message: 'Select a gender' }),
    birthdate: z.string().regex(BIRTHDATE_PATTERN, 'Enter a valid date (YYYY-MM-DD)'),
    contactNo: z.string().optional(),
    address: z.string().optional(),
    maritalStatus: z.enum(maritalStatusOptions).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
export type Gender = (typeof genderOptions)[number]
export type MaritalStatus = (typeof maritalStatusOptions)[number]
