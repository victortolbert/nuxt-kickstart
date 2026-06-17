import type { Buffer } from 'node:buffer'
import type { StorageAdapter, StorageConfig } from '../storage-adapter'

const FILE_EXTENSION_RE = /\.[^.]+$/

export function createCloudinaryAdapter(config: StorageConfig): StorageAdapter {
  if (!config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
    throw createError({
      statusCode: 500,
      message: 'Cloudinary storage requires: cloudName, apiKey, and apiSecret',
    })
  }

  // Lazy-load cloudinary SDK
  let cloudinary: any
  async function getCloudinary() {
    if (!cloudinary) {
      const { v2 } = await import('cloudinary')
      v2.config({
        cloud_name: config.cloudinaryCloudName,
        api_key: config.cloudinaryApiKey,
        api_secret: config.cloudinaryApiSecret,
      })
      cloudinary = v2
    }
    return cloudinary
  }

  return {
    async upload(buffer: Buffer, path: string, contentType: string): Promise<string> {
      const client = await getCloudinary()

      // Convert buffer to base64 data URI
      const base64 = buffer.toString('base64')
      const dataUri = `data:${contentType};base64,${base64}`

      // Use public_id as the path (without extension)
      const publicId = path.replace(FILE_EXTENSION_RE, '')

      const result = await client.uploader.upload(dataUri, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'auto',
      })

      return result.secure_url
    },

    async delete(path: string): Promise<void> {
      const client = await getCloudinary()
      const publicId = path.replace(FILE_EXTENSION_RE, '')

      await client.uploader.destroy(publicId, {
        resource_type: 'image',
      })
    },

    async exists(path: string): Promise<boolean> {
      const client = await getCloudinary()
      const publicId = path.replace(FILE_EXTENSION_RE, '')

      try {
        await client.api.resource(publicId)
        return true
      }
      catch {
        return false
      }
    },
  }
}
