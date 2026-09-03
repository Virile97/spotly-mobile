import { z } from 'zod'

export const genderOptions = ['female', 'male', 'other'] as const
export const maritalStatusOptions = ['single', 'married', 'divorced', 'widowed'] as const

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  contactNumber: z.string().min(7, 'Enter a valid contact number'),
  birthdate: z.string().min(1, 'Birthdate is required'),
  gender: z.enum(genderOptions, { message: 'Select a gender' }),
  maritalStatus: z.enum(maritalStatusOptions, { message: 'Select a marital status' }),
  address: z.string().min(1, 'Address is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
export type Gender = (typeof genderOptions)[number]
export type MaritalStatus = (typeof maritalStatusOptions)[number]
