import type { Buffer } from 'node:buffer'
import { createCloudinaryAdapter } from './storage/cloudinary-adapter'
import { createLocalAdapter } from './storage/local-adapter'
import { createS3Adapter } from './storage/s3-adapter'

export interface StorageAdapter {
  /**
   * Upload a file and return its public URL
   */
  upload: (buffer: Buffer, path: string, contentType: string) => Promise<string>

  /**
   * Delete a file by its path/key
   */
  delete: (path: string) => Promise<void>

  /**
   * Check if a file exists
   */
  exists: (path: string) => Promise<boolean>
}

export interface StorageConfig {
  provider: 'local' | 's3' | 'cloudinary'
  // Local filesystem options (dev only)
  localDir?: string
  localPublicUrl?: string
  // S3 options
  s3Bucket?: string
  s3Region?: string
  s3AccessKeyId?: string
  s3SecretAccessKey?: string
  s3PublicUrl?: string // Optional custom domain (e.g., CloudFront)
  // Cloudinary options
  cloudinaryCloudName?: string
  cloudinaryApiKey?: string
  cloudinaryApiSecret?: string
}

/**
 * Get the configured storage adapter based on environment
 */
export function getStorageAdapter(): StorageAdapter {
  const config = useRuntimeConfig()
  const provider = config.storageProvider as StorageConfig['provider'] || 'local'

  switch (provider) {
    case 's3':
      return createS3Adapter({
        provider,
        s3Bucket: config.s3Bucket,
        s3Region: config.s3Region,
        s3AccessKeyId: config.s3AccessKeyId,
        s3SecretAccessKey: config.s3SecretAccessKey,
        s3PublicUrl: config.s3PublicUrl,
      })
    case 'cloudinary':
      return createCloudinaryAdapter({
        provider,
        cloudinaryCloudName: config.cloudinaryCloudName,
        cloudinaryApiKey: config.cloudinaryApiKey,
        cloudinaryApiSecret: config.cloudinaryApiSecret,
      })
    case 'local':
    default:
      return createLocalAdapter({
        provider: 'local',
        localDir: config.localStorageDir || 'public/img',
        localPublicUrl: config.public.siteUrl || 'http://localhost:3000',
      })
  }
}
