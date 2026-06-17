import { z } from 'zod'

export const icon = z.object({
  provider: z.enum(['iconify', 'local']).default('iconify'),
  name: z.string().optional(),
  src: z.string().optional(),
  alt: z.string().optional(),
})
