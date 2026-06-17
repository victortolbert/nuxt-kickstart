import { z } from 'zod'

export const status = z.enum(['seed', 'sprout', 'evergreen', 'wilted']).default('seed')
export const visibility = z.enum(['private', 'internal', 'public']).default('private')

export const horizon = z
  .enum(['ground', 'h1-next-actions', 'h2-areas', 'h3-projects', 'h4-vision', 'h5-purpose-principles'])
  .optional()

export const workState = z.enum(['not-started', 'in-progress', 'done', 'skipped']).default('not-started')

export const lifecycle = z.enum(['active', 'paused', 'deprecated', 'archived']).default('active')
