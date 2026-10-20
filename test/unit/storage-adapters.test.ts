import { Buffer } from 'node:buffer'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// `createError` is a Nitro auto-import used by the cloud adapters and the
// factory; stub it to a throwable that preserves statusCode/message.
function createError(input: { statusCode: number, message: string }) {
  const err = new Error(input.message) as Error & { statusCode: number }
  err.statusCode = input.statusCode
  return err
}
vi.stubGlobal('createError', createError)

// --- AWS S3 SDK mock ---
const s3 = vi.hoisted(() => ({ send: vi.fn() }))
vi.mock('@aws-sdk/client-s3', () => {
  class Command {
    constructor(public input: Record<string, unknown>) {}
  }
  class S3Client {
    send = s3.send
  }
  return {
    S3Client,
    PutObjectCommand: Command,
    DeleteObjectCommand: Command,
    HeadObjectCommand: Command,
  }
})

// --- Cloudinary SDK mock ---
const cloud = vi.hoisted(() => ({
  config: vi.fn(),
  upload: vi.fn(),
  destroy: vi.fn(),
  resource: vi.fn(),
}))
vi.mock('cloudinary', () => ({
  v2: {
    config: cloud.config,
    uploader: { upload: cloud.upload, destroy: cloud.destroy },
    api: { resource: cloud.resource },
  },
}))

const { createLocalAdapter } = await import('../../server/utils/storage/local-adapter')
const { createS3Adapter } = await import('../../server/utils/storage/s3-adapter')
const { createCloudinaryAdapter } = await import('../../server/utils/storage/cloudinary-adapter')
const { getStorageAdapter } = await import('../../server/utils/storage-adapter')

const tmpDirs: string[] = []
function makeTmpDir(prefix: string) {
  const dir = mkdtempSync(join(tmpdir(), prefix))
  tmpDirs.push(dir)
  return dir
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  for (const dir of tmpDirs) {
    rmSync(dir, { recursive: true, force: true })
  }
  tmpDirs.length = 0
})

describe('local adapter', () => {
  it('writes a file and round-trips exists/delete (full-URL branch outside public/)', async () => {
    // The adapter resolves localDir against process.cwd(), so use a relative
    // directory that sits outside public/ to exercise the full-URL branch.
    const rel = `.test-storage-${Math.random().toString(36).slice(2)}`
    const dir = join(process.cwd(), rel)
    tmpDirs.push(dir)
    const adapter = createLocalAdapter({ provider: 'local', localDir: rel, localPublicUrl: 'http://localhost:3000' })
    const buf = Buffer.from('hello')

    const url = await adapter.upload(buf, 'sub/logo.webp', 'image/webp')
    // Outside the project's public/ dir, so a full URL is returned.
    expect(url).toBe('http://localhost:3000/sub/logo.webp')
    expect(readFileSync(join(dir, 'sub/logo.webp'), 'utf-8')).toBe('hello')

    expect(await adapter.exists('sub/logo.webp')).toBe(true)
    await adapter.delete('sub/logo.webp')
    expect(await adapter.exists('sub/logo.webp')).toBe(false)
  })

  it('returns a public-relative path when the file lands under public/', async () => {
    // Create a unique subdirectory under the real public/ dir.
    const rel = `.test-uploads-${Math.random().toString(36).slice(2)}`
    const dir = join(process.cwd(), 'public', rel)
    await mkdir(dir, { recursive: true })
    tmpDirs.push(dir)

    const adapter = createLocalAdapter({ provider: 'local', localDir: join('public', rel) })
    const url = await adapter.upload(Buffer.from('x'), 'team.webp', 'image/webp')

    expect(url).toBe(`/${rel}/team.webp`)
  })

  it('serves an upload at the same key the cloud adapters use', async () => {
    // Deliberately omits localDir so the shipped default is what is under
    // test — every other case passes one explicitly, which is how the
    // public/img/img/... regression reached main unnoticed.
    const rel = `.test-teams-${Math.random().toString(36).slice(2)}`
    const key = `img/${rel}/team-alpha.webp`
    // Clean up whichever location the adapter picks, correct or not — but
    // scope both to this test's unique dir so a regression can never make
    // the suite delete committed assets.
    tmpDirs.push(join(process.cwd(), 'public', 'img', rel))
    tmpDirs.push(join(process.cwd(), 'public', 'img', 'img', rel))

    const adapter = createLocalAdapter({ provider: 'local' })
    const url = await adapter.upload(Buffer.from('logo'), key, 'image/webp')

    // S3 stores this key verbatim and serves it at <base>/img/<rel>/...,
    // so the local provider has to expose the same path.
    expect(url).toBe(`/img/${rel}/team-alpha.webp`)
    expect(readFileSync(join(process.cwd(), 'public', key), 'utf-8')).toBe('logo')
  })

  it('reports exists=false for a missing file', async () => {
    const dir = makeTmpDir('kickstart-local-')
    const adapter = createLocalAdapter({ provider: 'local', localDir: dir })
    expect(await adapter.exists('nope.webp')).toBe(false)
  })
})

describe('s3 adapter', () => {
  const config = {
    provider: 's3' as const,
    s3Bucket: 'my-bucket',
    s3Region: 'us-east-1',
    s3AccessKeyId: 'key',
    s3SecretAccessKey: 'secret',
  }

  it('throws a 500 when required config is missing', () => {
    expect(() => createS3Adapter({ provider: 's3', s3Bucket: 'b' }))
      .toThrowError(/S3 storage requires/)
  })

  it('uploads with public-read ACL and returns the object URL', async () => {
    s3.send.mockResolvedValue({})
    const adapter = createS3Adapter(config)

    const url = await adapter.upload(Buffer.from('data'), 'img/a.webp', 'image/webp')

    expect(url).toBe('https://my-bucket.s3.us-east-1.amazonaws.com/img/a.webp')
    const command = s3.send.mock.calls[0][0]
    expect(command.input).toMatchObject({
      Bucket: 'my-bucket',
      Key: 'img/a.webp',
      ContentType: 'image/webp',
      ACL: 'public-read',
    })
  })

  it('honors a custom public URL (e.g. CloudFront)', async () => {
    s3.send.mockResolvedValue({})
    const adapter = createS3Adapter({ ...config, s3PublicUrl: 'https://cdn.example.com' })

    expect(await adapter.upload(Buffer.from('d'), 'k.webp', 'image/webp'))
      .toBe('https://cdn.example.com/k.webp')
  })

  it('maps a successful HEAD to exists=true and a rejection to false', async () => {
    const adapter = createS3Adapter(config)

    s3.send.mockResolvedValueOnce({})
    expect(await adapter.exists('k')).toBe(true)

    s3.send.mockRejectedValueOnce(new Error('404'))
    expect(await adapter.exists('k')).toBe(false)
  })

  it('issues a delete command', async () => {
    s3.send.mockResolvedValue({})
    const adapter = createS3Adapter(config)

    await adapter.delete('img/a.webp')
    expect(s3.send.mock.calls[0][0].input).toMatchObject({ Bucket: 'my-bucket', Key: 'img/a.webp' })
  })
})

describe('cloudinary adapter', () => {
  const config = {
    provider: 'cloudinary' as const,
    cloudinaryCloudName: 'demo',
    cloudinaryApiKey: 'key',
    cloudinaryApiSecret: 'secret',
  }

  it('throws a 500 when required config is missing', () => {
    expect(() => createCloudinaryAdapter({ provider: 'cloudinary', cloudinaryCloudName: 'demo' }))
      .toThrowError(/Cloudinary storage requires/)
  })

  it('uploads a base64 data URI under a public_id without extension', async () => {
    cloud.upload.mockResolvedValue({ secure_url: 'https://res.cloudinary.com/demo/img/a.webp' })
    const adapter = createCloudinaryAdapter(config)

    const url = await adapter.upload(Buffer.from('data'), 'img/a.webp', 'image/webp')

    expect(url).toBe('https://res.cloudinary.com/demo/img/a.webp')
    const [dataUri, opts] = cloud.upload.mock.calls[0]
    expect(dataUri).toMatch(/^data:image\/webp;base64,/)
    expect(opts).toMatchObject({ public_id: 'img/a', overwrite: true })
  })

  it('destroys by public_id on delete', async () => {
    cloud.destroy.mockResolvedValue({})
    const adapter = createCloudinaryAdapter(config)

    await adapter.delete('img/a.webp')
    expect(cloud.destroy).toHaveBeenCalledWith('img/a', { resource_type: 'image' })
  })

  it('maps resource lookups to exists true/false', async () => {
    const adapter = createCloudinaryAdapter(config)

    cloud.resource.mockResolvedValueOnce({})
    expect(await adapter.exists('img/a.webp')).toBe(true)

    cloud.resource.mockRejectedValueOnce(new Error('not found'))
    expect(await adapter.exists('img/a.webp')).toBe(false)
  })
})

describe('getStorageAdapter factory', () => {
  function stubConfig(config: Record<string, unknown>) {
    vi.stubGlobal('useRuntimeConfig', () => config)
  }

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.stubGlobal('createError', createError)
  })

  it('defaults to the local adapter when no provider is set', async () => {
    stubConfig({ public: { siteUrl: 'http://localhost:3000' } })
    const adapter = getStorageAdapter()
    // Local adapter writes relative paths under public/ — smoke-test the shape.
    expect(typeof adapter.upload).toBe('function')
    expect(typeof adapter.exists).toBe('function')
  })

  it('builds an s3 adapter when storageProvider is s3', () => {
    stubConfig({
      storageProvider: 's3',
      s3Bucket: 'b',
      s3Region: 'r',
      s3AccessKeyId: 'k',
      s3SecretAccessKey: 's',
      public: {},
    })
    expect(() => getStorageAdapter()).not.toThrow()
  })

  it('builds a cloudinary adapter when storageProvider is cloudinary', () => {
    stubConfig({
      storageProvider: 'cloudinary',
      cloudinaryCloudName: 'demo',
      cloudinaryApiKey: 'k',
      cloudinaryApiSecret: 's',
      public: {},
    })
    expect(() => getStorageAdapter()).not.toThrow()
  })

  it('surfaces the validation error for a misconfigured s3 provider', () => {
    stubConfig({ storageProvider: 's3', public: {} })
    expect(() => getStorageAdapter()).toThrowError(/S3 storage requires/)
  })
})
