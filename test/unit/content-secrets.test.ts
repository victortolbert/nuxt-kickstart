import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { redactSecret, scanContentForSecrets } from '../../shared/utils/content-secrets'
import { contentDir, walk } from '../helpers/content-tree'

describe('scanContentForSecrets — credentials', () => {
  it('detects a Bitbucket access token', () => {
    const findings = scanContentForSecrets('Authorization: Bearer ATCTT3qZ8wLm2Nf7Kd4Rt9Vb1Hc6Jp0Xs5Gy3Ue')
    expect(findings).toHaveLength(1)
    expect(findings[0]!.rule).toBe('credential')
    expect(findings[0]!.severity).toBe('critical')
  })

  it('detects a token in an x-token-auth clone URL', () => {
    const findings = scanContentForSecrets('git clone https://x-token-auth:ATCTT3qZ8wLm2Nf7Kd4Rt9Vb1Hc6@bitbucket.org/x.git')
    expect(findings.some(f => f.rule === 'credential')).toBe(true)
  })

  it('detects a GitHub personal access token', () => {
    const findings = scanContentForSecrets('NUXT_CONTENT_AUTH_TOKEN=ghp_aB3dEfGhIjKlMnOpQrStUvWxYz012345')
    expect(findings.some(f => f.rule === 'credential')).toBe(true)
  })

  it('detects a private key header', () => {
    const findings = scanContentForSecrets('-----BEGIN RSA PRIVATE KEY-----')
    expect(findings.some(f => f.rule === 'credential')).toBe(true)
  })

  // Documentation placeholders must not fail the build, or the check gets muted.
  it('ignores a documented placeholder token', () => {
    expect(scanContentForSecrets('NUXT_CONTENT_AUTH_TOKEN=ghp_YourPersonalAccessTokenHere')).toHaveLength(0)
  })

  it('ignores the AWS documentation example key', () => {
    expect(scanContentForSecrets('NUXT_S3_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE')).toHaveLength(0)
  })
})

describe('scanContentForSecrets — emails', () => {
  it('detects a real work email', () => {
    const findings = scanContentForSecrets('- Jane Roe <jane.roe@corp-mail.net>')
    expect(findings).toHaveLength(1)
    expect(findings[0]!.rule).toBe('email')
  })

  // RFC 2606 / RFC 6761 reserved names, allowlisted by domain rather than by file.
  it.each([
    'user@example.com',
    'user@example.org',
    'user@example.net',
    'user@test',
    'user@localhost',
    'user@invalid',
  ])('ignores the reserved domain in %s', (address) => {
    expect(scanContentForSecrets(address)).toHaveLength(0)
  })

  it('ignores Resend’s documented test sender', () => {
    expect(scanContentForSecrets('Kickstart <onboarding@resend.dev>')).toHaveLength(0)
  })

  it('reports each distinct address once per line', () => {
    expect(scanContentForSecrets('a@corp-mail.net; b@corp-mail.net')).toHaveLength(2)
  })

  // `https://user:password@host` is URL userinfo syntax, not an address, and
  // appears in any guide that documents a connection string.
  it('ignores URL userinfo', () => {
    expect(scanContentForSecrets('https://user:password@sindresorhus.com/path')).toHaveLength(0)
  })

  it('ignores schemeless URL userinfo in a code sample', () => {
    expect(scanContentForSecrets('normalizeUrl(\'user:password@sindresorhus.com\');')).toHaveLength(0)
  })

  it('still flags a mailto: address', () => {
    expect(scanContentForSecrets('[mail](mailto:jane.roe@corp-mail.net)')).toHaveLength(1)
  })

  it('still flags an address following a URL on the same line', () => {
    const findings = scanContentForSecrets('| <https://example.com/x> | sam.lee@corp-mail.net |')
    expect(findings).toHaveLength(1)
  })
})

describe('scanContentForSecrets — phone numbers', () => {
  it('detects a US phone number', () => {
    expect(scanContentForSecrets('call 312-847-2910').some(f => f.rule === 'phone')).toBe(true)
  })

  it('detects a parenthesized area code', () => {
    expect(scanContentForSecrets('call (312) 847-2910').some(f => f.rule === 'phone')).toBe(true)
  })

  // NANP reserves area code 555 entirely, and 555-0100..0199 for fiction. Both
  // appear throughout documentation and prompt examples.
  it('ignores the reserved 555 area code', () => {
    expect(scanContentForSecrets('call (555) 123-4567')).toHaveLength(0)
  })

  it('ignores the reserved fictional exchange range', () => {
    expect(scanContentForSecrets('call 312-555-0142')).toHaveLength(0)
  })

  // An unanchored phone regex matches ISO dates in nearly every frontmatter block.
  it('does not match an ISO date', () => {
    expect(scanContentForSecrets('created: 2026-08-12')).toHaveLength(0)
  })

  it('does not match a frontmatter date range', () => {
    expect(scanContentForSecrets('updated: 2026-01-25\ncreated: 2026-01-25')).toHaveLength(0)
  })

  it('does not match an IP address with a port', () => {
    expect(scanContentForSecrets('10.253.40.23:4503')).toHaveLength(0)
  })

  it('does not match a semver version', () => {
    expect(scanContentForSecrets('nuxt 4.5.1234')).toHaveLength(0)
  })
})

describe('scanContentForSecrets — reporting', () => {
  it('reports 1-indexed line numbers', () => {
    const findings = scanContentForSecrets('clean line\nanother clean line\njane.roe@corp-mail.net')
    expect(findings[0]!.line).toBe(3)
  })

  it('never returns the raw secret in the match field', () => {
    const token = 'ATCTT3qZ8wLm2Nf7Kd4Rt9Vb1Hc6Jp0Xs5Gy3Ue'
    const findings = scanContentForSecrets(`Authorization: Bearer ${token}`)
    expect(findings[0]!.match).not.toContain(token)
  })

  it('keeps the email domain visible so a finding is actionable', () => {
    const findings = scanContentForSecrets('jane.roe@corp-mail.net')
    expect(findings[0]!.match).toContain('@corp-mail.net')
    expect(findings[0]!.match).not.toContain('jane.roe')
  })

  it('returns nothing for clean prose', () => {
    expect(scanContentForSecrets('# Design Tokens\n\nStyle Dictionary transformation.')).toHaveLength(0)
  })
})

describe('scanContentForSecrets — fingerprints', () => {
  // The fingerprint is what a baseline stores. It must survive ordinary editing:
  // if it moved with the line number, every edit above a finding would invalidate
  // the baseline and the accepted set would rot into noise.
  it('is stable when the finding moves to a different line', () => {
    const a = scanContentForSecrets('jane.roe@corp-mail.net')
    const b = scanContentForSecrets('\n\n\npadding\njane.roe@corp-mail.net')
    expect(a[0]!.fingerprint).toBe(b[0]!.fingerprint)
  })

  it('is stable across surrounding text', () => {
    const a = scanContentForSecrets('- Jane Roe <jane.roe@corp-mail.net>')
    const b = scanContentForSecrets('| jane.roe@corp-mail.net | Engineering |')
    expect(a[0]!.fingerprint).toBe(b[0]!.fingerprint)
  })

  it('differs between different values', () => {
    const a = scanContentForSecrets('jane.roe@corp-mail.net')
    const b = scanContentForSecrets('john.doe@corp-mail.net')
    expect(a[0]!.fingerprint).not.toBe(b[0]!.fingerprint)
  })

  // Two different addresses redact to the same display string, so the fingerprint
  // must be derived from the raw value or a baseline entry would accept both.
  it('differs between values that redact identically', () => {
    const a = scanContentForSecrets('vincent.torres@gmail.com')
    const b = scanContentForSecrets('valerie.tran@gmail.com')
    expect(a[0]!.match).toBe(b[0]!.match)
    expect(a[0]!.fingerprint).not.toBe(b[0]!.fingerprint)
  })

  it('differs between rules even for the same text', () => {
    const email = scanContentForSecrets('jane.roe@corp-mail.net')[0]!
    const phone = scanContentForSecrets('312-847-2910')[0]!
    expect(email.fingerprint).not.toBe(phone.fingerprint)
  })

  it('never contains the raw value', () => {
    const findings = scanContentForSecrets('jane.roe@corp-mail.net')
    expect(findings[0]!.fingerprint).not.toContain('jane.roe')
    expect(findings[0]!.fingerprint).toMatch(/^[0-9a-f]{12}$/)
  })
})

describe('redactSecret', () => {
  it('keeps a short head and tail for long values', () => {
    const out = redactSecret('ATCTT3qZ8wLm2Nf7Kd4Rt9Vb1Hc6Jp0Xs5Gy3Ue')
    expect(out).toContain('ATCT')
    expect(out).not.toContain('Kd4Rt9Vb')
  })

  it('fully masks short values', () => {
    expect(redactSecret('abc')).toBe('***')
  })
})

// Nuxt Content serves every collection row from a public `sql_dump.txt`,
// whatever `visibility` says, so anything under `content/` ships. The rules
// above are the detector; this is the gate over the tree itself.
describe('content/ carries no secrets', () => {
  const SCANNED_EXTENSIONS = ['.md', '.yml', '.yaml', '.json', '.csv']
  const files = walk(contentDir).filter(file => SCANNED_EXTENSIONS.some(ext => file.endsWith(ext)))

  it('scans the content tree', () => {
    // A floor, not a count: catches the walk silently finding nothing.
    expect(files.length).toBeGreaterThanOrEqual(70)
  })

  it('finds no credential, real email address, or phone number', () => {
    const findings = files.flatMap(file =>
      scanContentForSecrets(readFileSync(join(contentDir, file), 'utf-8'))
        .map(f => `content/${file}:${f.line} [${f.rule}] ${f.match}`),
    )
    expect(
      findings,
      'Remove these from content/, or replace them with a reserved placeholder '
      + '(example.com, 555 numbers). Allowlist a domain in content-secrets.ts only '
      + 'if it is a documented placeholder, never a file.',
    ).toEqual([])
  })
})
