import type { H3Event } from 'h3'
import type { Buffer } from 'node:buffer'
import { getStorageAdapter } from './storage-adapter'

const MULTIPLE_SLASHES_RE = /\/+/g

export interface UploadImageOptions {
  width: number
  height: number
  format: 'webp' | 'png' | 'jpg'
}

export interface UploadConfig {
  allowedTypes: string[]
  maxSizeBytes: number
  /**
   * Path prefix for uploaded files (e.g., 'img/teams', 'uploads/covers')
   * This will be used as the folder structure in S3 or the subdirectory path locally
   */
  pathPrefix: string
  /**
   * Base filename (without extension)
   */
  filename: string
  imageOptions?: UploadImageOptions
}

export interface UploadResult {
  /**
   * Public URL or path to the uploaded file
   * - Local: relative path like '/img/teams/logo.webp'
   * - S3: full URL like 'https://bucket.s3.amazonaws.com/img/teams/logo.webp'
   * - Cloudinary: full URL like 'https://res.cloudinary.com/.../logo.webp'
   */
  url: string
  size: number
  format: string
}

export async function handleFileUpload(event: H3Event, config: UploadConfig): Promise<UploadResult> {
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }

  const file = formData[0]
  if (!file || !file.data) {
    throw createError({ statusCode: 400, message: 'No file data found' })
  }

  // Validate MIME type
  const mimeType = file.type || ''
  if (!config.allowedTypes.includes(mimeType)) {
    throw createError({
      statusCode: 415,
      message: `Unsupported file type: ${mimeType}. Allowed: ${config.allowedTypes.join(', ')}`,
    })
  }

  // Validate file size
  if (file.data.length > config.maxSizeBytes) {
    throw createError({
      statusCode: 413,
      message: `File too large: ${file.data.length} bytes. Maximum: ${config.maxSizeBytes} bytes`,
    })
  }

  let outputBuffer: Buffer = file.data
  let outputFormat = mimeType.split('/').pop() || 'bin'

  // Process image if imageOptions provided
  if (config.imageOptions) {
    try {
      const sharp = (await import('sharp')).default
      const { width, height, format } = config.imageOptions
      outputBuffer = await sharp(file.data)
        .resize(width, height, { fit: 'cover' })
        // sharp's format name is 'jpeg'; we keep 'jpg' for the file extension.
        .toFormat(format === 'jpg' ? 'jpeg' : format)
        .toBuffer()
      outputFormat = format
    }
    catch (err) {
      throw createError({
        statusCode: 500,
        message: `Image processing failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      })
    }
  }

  // Determine file extension and build path
  const ext = config.imageOptions ? config.imageOptions.format : (file.filename?.split('.').pop() || 'bin')
  const outputFilename = `${config.filename}.${ext}`
  // Build path: pathPrefix/filename.ext (e.g., 'img/teams/team-alpha.webp')
  const filePath = `${config.pathPrefix}/${outputFilename}`.replace(MULTIPLE_SLASHES_RE, '/')

  // Use storage adapter to upload
  const storage = getStorageAdapter()
  const url = await storage.upload(outputBuffer, filePath, mimeType)

  return {
    url,
    size: outputBuffer.length,
    format: outputFormat,
  }
}
