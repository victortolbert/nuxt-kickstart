/**
 * Detect confidential data in content before it reaches a build artifact.
 *
 * Nuxt Content gzips every row of every collection into
 * `.output/public/__nuxt_content/<collection>/sql_dump.txt` and serves it as a
 * static asset with no authorization — `visibility: private` hides a page from
 * the UI, not from that dump. So a credential, a real email address or a phone
 * number written into `content/` is published the moment the site is built,
 * whatever the document's frontmatter says. `test/unit/content-secrets.test.ts`
 * runs this over every file under `content/` and fails on any finding.
 *
 * ## Design constraints
 *
 * - **Allowlist by domain, never by file.** A named-file exception silently stops
 *   covering the file the moment its contents change.
 * - **Placeholders must not fail the build.** Documentation legitimately contains
 *   `ghp_YourPersonalAccessTokenHere` and AWS's published `AKIAIOSFODNN7EXAMPLE`.
 *   An assertion that must be muted is worse than no assertion at all.
 * - **Findings are redacted.** CI logs are themselves an exposure surface, so a
 *   finding names the location and shape of a secret, never its value.
 */

export type ContentFindingSeverity = 'critical' | 'high'

export interface ContentFinding {
  /** Which rule matched: `credential`, `email`, or `phone`. */
  rule: 'credential' | 'email' | 'phone'
  severity: ContentFindingSeverity
  /** Redacted form of the match — safe to print in CI logs. */
  match: string
  /** 1-indexed line number within the scanned text. */
  line: number
  /**
   * Stable identity for this finding's *value*, for baseline matching.
   *
   * Deliberately excludes the line number and surrounding text: a fingerprint that
   * moved with the line would be invalidated by any edit above it, and an accepted
   * baseline that rots is a baseline nobody trusts. Derived from the raw value
   * rather than `match`, because two different addresses redact identically
   * (`v***@gmail.com`) and a baseline entry must not accept both.
   */
  fingerprint: string
}

/**
 * RFC 2606 / RFC 6761 reserved names, plus the placeholder and vendor-test
 * domains that appear in setup guides. Allowlisting the domain keeps
 * the rule honest: a new file using `user@example.com` is covered automatically,
 * and a real address in an allowlisted file is still caught.
 */
const ALLOWED_EMAIL_DOMAINS = new Set([
  'example.com',
  'example.net',
  'example.org',
  'example',
  'test',
  'invalid',
  'localhost',
  'domain.com',
  'yourdomain.com',
  'email.com',
  'company.com',
  'mycompany.com',
  'acme.com',
  'sample.com',
  // Resend's documented zero-setup test sender (`onboarding@resend.dev`),
  // which the authentication guide tells you to start with.
  'resend.dev',
])

/**
 * Substrings that mark a token-shaped string as documentation rather than a
 * secret. Deliberately a heuristic: a real token containing `test` would be
 * missed. That trade is accepted because the alternative — flagging every setup
 * guide — gets the whole check disabled, and credentials are additionally
 * covered by the reserved-prefix rules that placeholders rarely satisfy.
 */
const PLACEHOLDER_MARKERS = [
  'your',
  'example',
  'placeholder',
  'changeme',
  'redacted',
  'dummy',
  'sample',
  'xxxx',
  'todo',
  'insert',
  'replace',
]

const CREDENTIAL_PATTERNS: { name: string, pattern: RegExp }[] = [
  { name: 'atlassian-token', pattern: /\bATCTT3[\w-]{16,}/g },
  { name: 'github-pat', pattern: /\bghp_[A-Za-z0-9]{20,}/g },
  { name: 'github-fine-grained-pat', pattern: /\bgithub_pat_\w{20,}/g },
  { name: 'openai-key', pattern: /\bsk-[A-Za-z0-9]{20,}/g },
  { name: 'slack-token', pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}/g },
  { name: 'aws-access-key', pattern: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: 'private-key', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { name: 'bearer-token', pattern: /\bBearer\s+[\w.-]{20,}/g },
  { name: 'basic-token-auth', pattern: /\bx-token-auth:[\w.-]{10,}/g },
]

const EMAIL_PATTERN = /\b[\w.%+-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,}|localhost|test|invalid|example)\b/g

/**
 * North American phone shapes only, each anchored so that a bare `\d{4}-\d{2}-\d{2}`
 * cannot satisfy it. An unanchored version matches ISO dates in nearly every
 * frontmatter block — the check has to survive a frontmatter block untouched or it
 * will be turned off.
 */
const PHONE_PATTERNS: RegExp[] = [
  /\(\d{3}\)\s*\d{3}[.\s-]\d{4}\b/g,
  /\b\d{3}-\d{3}-\d{4}\b/g,
  /\+1[.\s-]?\d{3}[.\s-]?\d{3}[.\s-]?\d{4}\b/g,
]

/**
 * FNV-1a over `rule|value`, as 12 hex chars. This is an *identity* function, not a
 * security one — it exists so a baseline can name a finding without storing the
 * value. A cryptographic hash would imply a guarantee it does not need, and would
 * pull `node:crypto` into a module that is otherwise environment-agnostic.
 */
function fingerprintOf(rule: string, value: string): string {
  const input = `${rule}|${value}`
  let h = 0x811C9DC5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  // One pass gives 8 hex chars; fold in a length-salted second pass for 12, which
  // makes accidental collisions across a few hundred findings very unlikely.
  let h2 = h ^ input.length
  h2 = Math.imul(h2, 0x01000193) >>> 0
  return (h.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0')).slice(0, 12)
}

/** Mask a value so a finding is actionable without reproducing the secret. */
export function redactSecret(value: string): string {
  if (value.length <= 10) {
    return '***'
  }
  return `${value.slice(0, 4)}…${'*'.repeat(6)}…${value.slice(-2)}`
}

function isPlaceholder(value: string): boolean {
  const lowered = value.toLowerCase()
  return PLACEHOLDER_MARKERS.some(marker => lowered.includes(marker))
}

/** URI schemes that legitimately precede a real address rather than userinfo. */
const ADDRESS_SCHEMES = new Set(['mailto', 'tel', 'sms', 'callto', 'xmpp', 'im'])

/**
 * `user:password@host` is URL userinfo, not an address. Scan back to the preceding
 * whitespace and inspect that token:
 *
 *   - `https://user:pass@host` — a scheme separator means the `@` is structural.
 *   - `normalizeUrl('user:password@host')` — userinfo appears schemeless in docs
 *     too, so a bare colon inside the token also counts, unless what precedes it
 *     is an address scheme. That exception is what keeps `mailto:` flagged.
 *
 * A URL earlier on the same line is unaffected: the scan stops at whitespace.
 */
function isUrlUserinfo(text: string, index: number): boolean {
  const lineStart = text.lastIndexOf('\n', index) + 1
  const tokenStart = Math.max(lineStart, text.lastIndexOf(' ', index) + 1)
  const prefix = text.slice(tokenStart, index)

  if (prefix.includes('://')) {
    return true
  }

  const colon = prefix.indexOf(':')
  if (colon === -1) {
    return false
  }

  const scheme = prefix.slice(0, colon).match(/([A-Z][A-Z0-9+.-]*)$/i)?.[1]?.toLowerCase()
  return !scheme || !ADDRESS_SCHEMES.has(scheme)
}

/**
 * NANP reserves area code 555 outright, and the 555-0100..0199 exchange range for
 * fiction. Both are common in prompt examples and directory mockups, so treating
 * them as real contact details would fail the build on invented data.
 */
function isReservedPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '').replace(/^1/, '')
  if (digits.length !== 10) {
    return false
  }
  if (digits.startsWith('555')) {
    return true
  }
  const exchange = digits.slice(3, 6)
  const line = Number(digits.slice(6))
  return exchange === '555' && line >= 100 && line <= 199
}

/** Keep the domain — it is what makes a finding triageable — and mask the local part. */
function redactEmail(address: string): string {
  const [local = '', domain = ''] = address.split('@')
  return `${local.slice(0, 1)}***@${domain}`
}

function lineNumberAt(text: string, index: number): number {
  let line = 1
  for (let i = 0; i < index; i++) {
    if (text[i] === '\n') {
      line++
    }
  }
  return line
}

/**
 * Scan text for confidential data. Returns one finding per match, in source
 * order. An empty array means the text is clean under every rule.
 */
export function scanContentForSecrets(text: string): ContentFinding[] {
  const findings: ContentFinding[] = []

  // `Authorization: Bearer ATCTT3…` satisfies both the Atlassian rule and the
  // generic Bearer rule. One secret must produce one finding, so claim character
  // ranges as they match: CREDENTIAL_PATTERNS runs most-specific first, and a
  // later pattern overlapping a claimed range is the same secret seen again.
  const claimed: { start: number, end: number }[] = []

  for (const { pattern } of CREDENTIAL_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      const value = match[0]
      const start = match.index
      const end = start + value.length

      if (claimed.some(range => start < range.end && end > range.start)) {
        continue
      }
      if (isPlaceholder(value)) {
        // Claim it anyway: a placeholder matched by a specific rule must not be
        // re-reported by a generic one.
        claimed.push({ start, end })
        continue
      }

      claimed.push({ start, end })
      findings.push({
        rule: 'credential',
        severity: 'critical',
        match: redactSecret(value),
        line: lineNumberAt(text, start),
        fingerprint: fingerprintOf('credential', value),
      })
    }
  }

  for (const match of text.matchAll(EMAIL_PATTERN)) {
    const address = match[0]
    const domain = address.split('@')[1]?.toLowerCase() ?? ''
    if (ALLOWED_EMAIL_DOMAINS.has(domain) || isPlaceholder(address) || isUrlUserinfo(text, match.index)) {
      continue
    }
    findings.push({
      rule: 'email',
      severity: 'high',
      match: redactEmail(address),
      line: lineNumberAt(text, match.index),
      fingerprint: fingerprintOf('email', address),
    })
  }

  for (const pattern of PHONE_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      if (isReservedPhone(match[0])) {
        continue
      }
      findings.push({
        rule: 'phone',
        severity: 'high',
        match: redactSecret(match[0]),
        line: lineNumberAt(text, match.index),
        fingerprint: fingerprintOf('phone', match[0]),
      })
    }
  }

  return findings.sort((a, b) => a.line - b.line)
}
