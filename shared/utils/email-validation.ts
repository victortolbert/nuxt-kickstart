/**
 * Email validation utilities
 * RFC 5322 compliant email validation
 */

/**
 * RFC 5322 compliant email regex pattern
 * Supports:
 * - Plus addressing (user+tag@example.com)
 * - Multi-part TLDs (user@example.co.uk)
 * - Subdomains (user@sub.example.com)
 * - Special characters in local part
 */
export const EMAIL_REGEX = /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i

/**
 * Validates an email address against RFC 5322 standards
 * @param email - The email address to validate
 * @returns true if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }
  return EMAIL_REGEX.test(email)
}

/**
 * Validates an array of email addresses
 * @param emails - Array of email addresses to validate
 * @returns Object with valid emails, invalid emails, and validation status
 */
export function validateEmails(emails: string[]): {
  valid: string[]
  invalid: string[]
  allValid: boolean
} {
  const valid: string[] = []
  const invalid: string[] = []

  for (const email of emails) {
    if (isValidEmail(email)) {
      valid.push(email)
    }
    else {
      invalid.push(email)
    }
  }

  return {
    valid,
    invalid,
    allValid: invalid.length === 0,
  }
}
