import { Buffer } from 'node:buffer'

/**
 * Terms from the author's employer and its clients that must never appear in
 * this template. Kickstart is MIT-licensed and public, and it was carved out
 * of a working project that also held day-job notes; a company name, a
 * product name or an internal system's name in any tracked file would publish
 * it. `test/unit/employer-terms.test.ts` fails on any tracked file containing
 * one, case-insensitively.
 *
 * The list is stored base64-encoded so that the guard does not itself publish
 * what it guards: a plain-text list in a public repository names the employer
 * as surely as a leaked note would. Decode one with
 * `node -p "Buffer.from('<entry>', 'base64').toString()"`, and encode a new one
 * with `node -p "Buffer.from('<term>').toString('base64')"`.
 *
 * Every entry must be distinctive enough to match nothing else. A short
 * internal acronym that is also an ordinary word or a common identifier
 * fragment does not belong here: a guard that fires on unrelated text gets
 * muted, and then it guards nothing.
 */
const ENCODED_EMPLOYER_TERMS = [
  'YWJidmll', // the employer
  'YWJidmllbmV0', // its intranet
  'c2t5cml6aQ==', // product
  'cmludm9x', // product
  'aHVtaXJh', // product
  'YmlvbWFya2VyIGJvb3N0', // client program
  'Y3dkcw==', // internal design system
]

export const EMPLOYER_TERMS: readonly string[] = ENCODED_EMPLOYER_TERMS
  .map(entry => Buffer.from(entry, 'base64').toString('utf8'))

/**
 * Tracked paths the sweep does not read. Lockfiles are generated from the
 * registry, not authored, and are too large to scan usefully.
 */
export const EMPLOYER_TERMS_IGNORE: readonly RegExp[] = [
  /(?:^|\/)pnpm-lock\.yaml$/,
  /(?:^|\/)package-lock\.json$/,
  /(?:^|\/)yarn\.lock$/,
]
