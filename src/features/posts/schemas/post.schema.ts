import { z } from 'zod'

import { LIMITS } from '@/shared/constants/limits'

export const createPostSchema = z.object({
  caption: z.string().max(LIMITS.POST_CAPTION_MAX_LENGTH),
  mediaUrls: z.array(z.string().min(1)).min(1).max(LIMITS.MAX_MEDIA_PER_POST),
  placeId: z.string().optional(),
})

export type CreatePostFormValues = z.infer<typeof createPostSchema>
