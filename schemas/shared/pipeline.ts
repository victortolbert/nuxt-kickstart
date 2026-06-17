import { z } from 'zod'
import { workState } from './enums'

export const defaultPipeline = {
  figmaBuilt: 'not-started',
  responsive: 'not-started',
  variables: 'not-started',
  aemDialog: 'not-started',
  prototyped: 'not-started',
} as const

export const pipeline = z.record(z.string(), workState).default(defaultPipeline)
