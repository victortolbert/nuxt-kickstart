import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The layers in a project root, found the way Nuxt finds them: every folder
 * under `layers/`. The integrity specs read each layer's content tree, its
 * collections and its locale messages with the same checks as the base, so a
 * module that arrives as a folder is held to the template's rules on arrival.
 */

export const repoRoot = fileURLToPath(new URL('../..', import.meta.url))

export interface LayerDirs {
  name: string
  root: string
  /** Where the layer's collections resolve their sources: `<layer>/content`. */
  content: string
  /** `<layer>/content.config.ts`, when the layer defines collections. */
  contentConfig?: string
  /** `<layer>/i18n/locales`, when the layer ships messages. */
  locales?: string
}

export function layers(root = repoRoot): LayerDirs[] {
  const dir = join(root, 'layers')
  if (!existsSync(dir))
    return []
  return readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map((entry) => {
      const layerRoot = join(dir, entry.name)
      const contentConfig = join(layerRoot, 'content.config.ts')
      const locales = join(layerRoot, 'i18n/locales')
      return {
        name: entry.name,
        root: layerRoot,
        content: join(layerRoot, 'content'),
        contentConfig: existsSync(contentConfig) ? contentConfig : undefined,
        locales: existsSync(locales) ? locales : undefined,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}
