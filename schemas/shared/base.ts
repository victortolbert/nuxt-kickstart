import { z } from 'zod'
import { horizon, status, visibility } from './enums'

export const base = z.object({
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status,
  visibility,
  horizon,
  created: z.string().optional(),
  updated: z.string().optional(),
})
