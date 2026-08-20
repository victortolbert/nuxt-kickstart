import { describe, expect, it } from 'vitest'
import { applyIdentity, parseGitHubSlug } from '../../scripts/init'

describe('parseGitHubSlug', () => {
  it('reads owner/name from an https remote', () => {
    expect(parseGitHubSlug('https://github.com/acme/portal.git')).toBe('acme/portal')
  })

  it('reads owner/name from an ssh remote', () => {
    expect(parseGitHubSlug('git@github.com:acme/portal.git')).toBe('acme/portal')
  })

  it('tolerates a missing .git suffix and a trailing slash', () => {
    expect(parseGitHubSlug('https://github.com/acme/portal')).toBe('acme/portal')
    expect(parseGitHubSlug('https://github.com/acme/portal/')).toBe('acme/portal')
  })

  it('returns empty for a non-GitHub remote', () => {
    expect(parseGitHubSlug('https://gitlab.com/acme/portal.git')).toBe('')
  })
})

describe('applyIdentity', () => {
  const templatePkg = {
    name: 'acme-portal',
    author: { name: 'Template Author', email: 'template@example.com', url: 'https://template.example' },
    homepage: 'https://github.com/victortolbert/acme-portal#readme',
    repository: { type: 'git', url: 'git+https://github.com/victortolbert/acme-portal.git' },
    bugs: { url: 'https://github.com/victortolbert/acme-portal/issues' },
  }

  it('replaces the template author with the new one', () => {
    const pkg = applyIdentity({ ...templatePkg }, {
      authorName: 'Ada Lovelace',
      authorEmail: 'ada@example.com',
      authorUrl: 'https://ada.example',
      repoSlug: '',
    })

    expect(pkg.author).toEqual({ name: 'Ada Lovelace', email: 'ada@example.com', url: 'https://ada.example' })
  })

  it('points repository, bugs and homepage at the new GitHub slug', () => {
    const pkg = applyIdentity({ ...templatePkg }, {
      authorName: 'Ada Lovelace',
      authorEmail: 'ada@example.com',
      authorUrl: '',
      repoSlug: 'ada/portal',
    })

    expect(pkg.repository).toEqual({ type: 'git', url: 'git+https://github.com/ada/portal.git' })
    expect(pkg.bugs).toEqual({ url: 'https://github.com/ada/portal/issues' })
    expect(pkg.homepage).toBe('https://github.com/ada/portal#readme')
  })

  it('drops the author entirely rather than inheriting the template one', () => {
    const pkg = applyIdentity({ ...templatePkg }, {
      authorName: '',
      authorEmail: '',
      authorUrl: '',
      repoSlug: '',
    })

    expect(pkg.author).toBeUndefined()
    // The template's URLs must not survive either.
    expect(pkg.repository).toBeUndefined()
    expect(pkg.bugs).toBeUndefined()
    expect(pkg.homepage).toBeUndefined()
  })

  it('omits optional author fields that were left blank', () => {
    const pkg = applyIdentity({ ...templatePkg }, {
      authorName: 'Ada Lovelace',
      authorEmail: '',
      authorUrl: '',
      repoSlug: '',
    })

    expect(pkg.author).toEqual({ name: 'Ada Lovelace' })
  })
})
