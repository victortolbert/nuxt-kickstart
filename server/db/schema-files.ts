import { globSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Where the migration tooling looks for Drizzle schema files: the base schema,
 * plus one per layer, found by convention. A layer that keeps tables declares
 * them in `layers/<name>/server/db/schema.ts`, and nothing has to register it.
 *
 * All of them feed one migration chain (`server/db/migrations/`), so ordering
 * is global and a deploy applies a single sequence. Deleting a layer removes
 * its file from this list but generates no drop: its tables stay, inert
 * (ADR-0010).
 */
export const SCHEMA_GLOBS = [
  'server/db/schema.ts',
  'layers/*/server/db/schema.ts',
] as const

/** The schema files under `rootDir`, base first, then layers by name. */
export function schemaFiles(rootDir: string): string[] {
  const [base, ...layers] = SCHEMA_GLOBS
  const layerFiles = layers.flatMap(glob => globSync(glob, { cwd: rootDir })).sort()
  return [base, ...layerFiles].map(file => resolve(rootDir, file))
}
