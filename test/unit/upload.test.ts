import type { H3Event } from 'h3'
import { Buffer } from 'node:buffer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// `handleFileUpload` leans on Nitro auto-imports (`readMultipartFormData`,
// `createError`) and delegates storage to `getStorageAdapter`. We stub the
// auto-imports as globals and mock the storage module so we can assert the
// computed object path without touching disk or the network.

function createError(input: { statusCode: number, message: string }) {
  const err = new Error(input.message) as Error & { statusCode: number }
  err.statusCode = input.statusCode
  return err
}

const readMultipartFormData = vi.fn()
vi.stubGlobal('createError', createError)
vi.stubGlobal('readMultipartFormData', readMultipartFormData)

const upload = vi.hoisted(() => vi.fn())
vi.mock('#server/utils/storage-adapter', () => ({
  getStorageAdapter: () => ({ upload, delete: vi.fn(), exists: vi.fn() }),
}))

// Chainable sharp mock: sharp(buf).resize(...).toFormat(...).toBuffer()
const sharp = vi.hoisted(() => ({
  toBuffer: vi.fn(),
  instance: null as any,
}))
vi.mock('sharp', () => {
  const chain = {
    resize: vi.fn(() => chain),
    toFormat: vi.fn(() => chain),
    toBuffer: sharp.toBuffer,
  }
  sharp.instance = chain
  return { default: vi.fn(() => chain) }
})

const { handleFileUpload } = await import('../../server/utils/upload')

const event = {} as H3Event

function file(overrides: Record<string, unknown> = {}) {
  return {
    data: Buffer.from('imagedata'),
    type: 'image/webp',
    filename: 'source.webp',
    ...overrides,
  }
}

const baseConfig = {
  allowedTypes: ['image/webp', 'image/png'],
  maxSizeBytes: 1024,
  pathPrefix: 'img/teams',
  filename: 'team-alpha',
}

beforeEach(() => {
  vi.clearAllMocks()
  upload.mockResolvedValue('/img/teams/team-alpha.webp')
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('handleFileUpload validation', () => {
  it('rejects when no form data is present', async () => {
    readMultipartFormData.mockResolvedValue(null)
    await expect(handleFileUpload(event, baseConfig)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('rejects when the part has no file data', async () => {
    readMultipartFormData.mockResolvedValue([{ type: 'image/webp' }])
    await expect(handleFileUpload(event, baseConfig)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('rejects an unsupported MIME type with 415', async () => {
    readMultipartFormData.mockResolvedValue([file({ type: 'application/pdf' })])
    await expect(handleFileUpload(event, baseConfig)).rejects.toMatchObject({ statusCode: 415 })
  })

  it('rejects files over the size limit with 413', async () => {
    readMultipartFormData.mockResolvedValue([file({ data: Buffer.alloc(2048) })])
    await expect(handleFileUpload(event, baseConfig)).rejects.toMatchObject({ statusCode: 413 })
  })
})

describe('handleFileUpload happy path (no image processing)', () => {
  it('uploads the raw buffer and derives path/format from the MIME type', async () => {
    readMultipartFormData.mockResolvedValue([file()])

    const result = await handleFileUpload(event, baseConfig)

    expect(upload).toHaveBeenCalledTimes(1)
    const [buffer, path, contentType] = upload.mock.calls[0]
    expect(buffer).toEqual(Buffer.from('imagedata'))
    expect(path).toBe('img/teams/team-alpha.webp')
    expect(contentType).toBe('image/webp')
    expect(result).toEqual({ url: '/img/teams/team-alpha.webp', size: 9, format: 'webp' })
  })

  it('collapses duplicate slashes in the computed path', async () => {
    readMultipartFormData.mockResolvedValue([file()])

    await handleFileUpload(event, { ...baseConfig, pathPrefix: 'img//teams/' })

    expect(upload.mock.calls[0][1]).toBe('img/teams/team-alpha.webp')
  })

  it('derives the extension from the source filename', async () => {
    readMultipartFormData.mockResolvedValue([file({ filename: 'photo.png', type: 'image/png' })])

    await handleFileUpload(event, { ...baseConfig, pathPrefix: 'img' })

    expect(upload.mock.calls[0][1]).toBe('img/team-alpha.png')
  })

  it('falls back to a bin extension when the part has no filename', async () => {
    readMultipartFormData.mockResolvedValue([file({ filename: undefined })])

    await handleFileUpload(event, { ...baseConfig, pathPrefix: 'img' })

    expect(upload.mock.calls[0][1]).toBe('img/team-alpha.bin')
  })
})

describe('handleFileUpload image processing', () => {
  const imageConfig = {
    ...baseConfig,
    imageOptions: { width: 256, height: 256, format: 'jpg' as const },
  }

  it('resizes via sharp, maps jpg→jpeg, and reports the processed size/format', async () => {
    readMultipartFormData.mockResolvedValue([file()])
    sharp.toBuffer.mockResolvedValue(Buffer.from('resized-bytes'))

    const result = await handleFileUpload(event, imageConfig)

    expect(sharp.instance.resize).toHaveBeenCalledWith(256, 256, { fit: 'cover' })
    expect(sharp.instance.toFormat).toHaveBeenCalledWith('jpeg')
    expect(upload.mock.calls[0][1]).toBe('img/teams/team-alpha.jpg')
    expect(result.format).toBe('jpg')
    expect(result.size).toBe(Buffer.from('resized-bytes').length)
  })

  it('wraps sharp failures in a 500 error', async () => {
    readMultipartFormData.mockResolvedValue([file()])
    sharp.toBuffer.mockRejectedValue(new Error('corrupt image'))

    await expect(handleFileUpload(event, imageConfig)).rejects.toMatchObject({
      statusCode: 500,
      message: expect.stringContaining('Image processing failed'),
    })
  })
})
