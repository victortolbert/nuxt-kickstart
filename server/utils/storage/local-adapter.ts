import type { Buffer } from 'node:buffer'
import type { StorageAdapter, StorageConfig } from '../storage-adapter'
import { access, constants, mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

export function createLocalAdapter(config: StorageConfig): StorageAdapter {
  const baseDir = join(process.cwd(), config.localDir || 'public/img')
  const baseUrl = config.localPublicUrl || 'http://localhost:3000'

  return {
    async upload(buffer: Buffer, path: string, _contentType: string): Promise<string> {
      const fullPath = join(baseDir, path)

      // Ensure directory exists
      await mkdir(dirname(fullPath), { recursive: true })

      // Delete existing file if present
      await rm(fullPath, { force: true })

      // Write file
      await writeFile(fullPath, buffer)

      // Return public URL (relative to public dir)
      // If baseDir is inside public/, strip public/ prefix
      const publicDir = join(process.cwd(), 'public')
      if (fullPath.startsWith(publicDir)) {
        const relativePath = fullPath.slice(publicDir.length)
        return relativePath.startsWith('/') ? relativePath : `/${relativePath}`
      }

      // Otherwise return full URL
      return `${baseUrl}/${path}`
    },

    async delete(path: string): Promise<void> {
      const fullPath = join(baseDir, path)
      await rm(fullPath, { force: true })
    },

    async exists(path: string): Promise<boolean> {
      const fullPath = join(baseDir, path)
      try {
        await access(fullPath, constants.F_OK)
        return true
      }
      catch {
        return false
      }
    },
  }
}
