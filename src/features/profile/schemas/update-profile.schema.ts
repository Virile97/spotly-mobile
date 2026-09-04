import { z } from "zod"

export const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,30}$/

export const updateProfileSchema = z.object({
  username: z
    .string()
    .max(30, "Username must be at most 30 characters")
    .refine((value) => {
      const trimmed = value.trim()
      return trimmed.length === 0 || USERNAME_PATTERN.test(trimmed)
    }, "Use 3–30 letters, numbers, or underscores"),
  displayName: z.string().max(20, "Display name must be at most 20 characters"),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(80, "First name must be at most 80 characters"),
  middleName: z.string().max(80, "Middle name must be at most 80 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(80, "Last name must be at most 80 characters"),
  bio: z.string().max(500, "Bio must be at most 500 characters"),
  address: z.string().max(255, "Address must be at most 255 characters"),
  maritalStatus: z.enum(["SINGLE", "MARRIED"]).optional()
})

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>
