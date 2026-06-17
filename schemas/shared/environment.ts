import { z } from 'zod'

export const environment = z.object({
  name: z.string(),
  kind: z.enum(['local', 'dev', 'test', 'qa', 'stage', 'preprod', 'prod', 'other']).default('other'),
  url: z.string().optional(),
  port: z.number().int().optional(),
  notes: z.string().optional(),
  isPrimary: z.boolean().optional(),
  requiresVPN: z.boolean().optional(),
  auth: z.enum(['none', 'basic', 'sso', 'other']).optional(),
  lastVerified: z.string().optional(),
})
