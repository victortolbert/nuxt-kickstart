import type { Buffer } from 'node:buffer'
import type { StorageAdapter, StorageConfig } from '../storage-adapter'

export function createS3Adapter(config: StorageConfig): StorageAdapter {
  if (!config.s3Bucket || !config.s3Region || !config.s3AccessKeyId || !config.s3SecretAccessKey) {
    throw createError({
      statusCode: 500,
      message: 'S3 storage requires: bucket, region, accessKeyId, and secretAccessKey',
    })
  }

  // Lazy-load AWS SDK (only in production when needed)
  let s3Client: any
  async function getS3Client() {
    if (!s3Client) {
      const { S3Client } = await import('@aws-sdk/client-s3')
      s3Client = new S3Client({
        region: config.s3Region,
        credentials: {
          accessKeyId: config.s3AccessKeyId!,
          secretAccessKey: config.s3SecretAccessKey!,
        },
      })
    }
    return s3Client
  }

  const bucket = config.s3Bucket
  const baseUrl = config.s3PublicUrl || `https://${bucket}.s3.${config.s3Region}.amazonaws.com`

  return {
    async upload(buffer: Buffer, path: string, contentType: string): Promise<string> {
      const { PutObjectCommand } = await import('@aws-sdk/client-s3')
      const client = await getS3Client()

      await client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: path,
        Body: buffer,
        ContentType: contentType,
        // Make publicly readable (or configure bucket policy instead)
        ACL: 'public-read',
      }))

      return `${baseUrl}/${path}`
    },

    async delete(path: string): Promise<void> {
      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3')
      const client = await getS3Client()

      await client.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: path,
      }))
    },

    async exists(path: string): Promise<boolean> {
      const { HeadObjectCommand } = await import('@aws-sdk/client-s3')
      const client = await getS3Client()

      try {
        await client.send(new HeadObjectCommand({
          Bucket: bucket,
          Key: path,
        }))
        return true
      }
      catch {
        return false
      }
    },
  }
}
