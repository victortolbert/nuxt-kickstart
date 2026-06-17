import { describe, expect, it } from 'vitest'
import { EMAIL_REGEX, isValidEmail, validateEmails } from '../../shared/utils/email-validation'

describe('email-validation', () => {
  describe('isValidEmail', () => {
    describe('valid email addresses', () => {
      const validEmails = [
        // Standard emails
        'user@example.com',
        'test@domain.org',
        'hello@world.net',

        // Plus addressing (Issue #6 requirement)
        'user+tag@example.com',
        'user+newsletter@domain.org',
        'test+filter+nested@example.com',

        // Multi-part TLDs (Issue #6 requirement)
        'user@example.co.uk',
        'test@domain.com.au',
        'hello@example.org.uk',

        // Subdomains (Issue #6 requirement)
        'user@sub.example.com',
        'test@mail.domain.org',
        'hello@a.b.c.example.com',

        // Numbers in local part
        'user123@example.com',
        '123user@example.com',
        '123@example.com',

        // Dots in local part
        'first.last@example.com',
        'user.name.test@domain.org',

        // Special characters in local part
        'user!def@example.com',
        'user#hash@example.com',
        'user$dollar@example.com',
        'user%percent@example.com',
        'user&and@example.com',
        'user\'quote@example.com',
        'user*star@example.com',
        'user=equals@example.com',
        'user?question@example.com',
        'user^caret@example.com',
        'user_underscore@example.com',
        'user`backtick@example.com',
        'user{brace@example.com',
        'user|pipe@example.com',
        'user}brace@example.com',
        'user~tilde@example.com',

        // Hyphens in domain
        'user@my-domain.com',
        'test@sub-domain.example.com',

        // Mixed case
        'User@Example.COM',
        'USER@EXAMPLE.COM',
        'user@EXAMPLE.com',
      ]

      it.each(validEmails)('should accept: %s', (email) => {
        expect(isValidEmail(email)).toBe(true)
      })
    })

    describe('invalid email addresses', () => {
      const invalidEmails = [
        // Missing parts
        '',
        '@',
        'user@',
        '@example.com',
        'userexample.com',

        // Invalid characters
        'user name@example.com',
        'user\t@example.com',
        'user\n@example.com',

        // Multiple @
        'user@@example.com',
        'user@user@example.com',

        // Invalid domain
        'user@.com',
        'user@example.',
        'user@.example.com',
        'user@example..com',

        // Domain starting/ending with hyphen
        'user@-example.com',
        'user@example-.com',

        // Too long domain label (>63 chars)
        `user@${'a'.repeat(64)}.com`,

        // No TLD
        'user@localhost',

        // Non-string inputs
        null,
        undefined,
        123,
        {},
        [],
      ]

      it.each(invalidEmails)('should reject: %s', (email) => {
        expect(isValidEmail(email as string)).toBe(false)
      })
    })
  })

  describe('validateEmails', () => {
    it('returns all valid when all emails are valid', () => {
      const emails = ['user@example.com', 'test+tag@domain.co.uk']
      const result = validateEmails(emails)

      expect(result.valid).toEqual(emails)
      expect(result.invalid).toEqual([])
      expect(result.allValid).toBe(true)
    })

    it('separates valid and invalid emails', () => {
      const emails = ['user@example.com', 'invalid', 'test@domain.org', '@bad']
      const result = validateEmails(emails)

      expect(result.valid).toEqual(['user@example.com', 'test@domain.org'])
      expect(result.invalid).toEqual(['invalid', '@bad'])
      expect(result.allValid).toBe(false)
    })

    it('handles empty array', () => {
      const result = validateEmails([])

      expect(result.valid).toEqual([])
      expect(result.invalid).toEqual([])
      expect(result.allValid).toBe(true)
    })

    it('handles all invalid emails', () => {
      const emails = ['invalid', '@bad', 'no-at-sign']
      const result = validateEmails(emails)

      expect(result.valid).toEqual([])
      expect(result.invalid).toEqual(emails)
      expect(result.allValid).toBe(false)
    })
  })

  describe('eMAIL_REGEX', () => {
    it('is exported and is a RegExp', () => {
      expect(EMAIL_REGEX).toBeInstanceOf(RegExp)
    })

    it('matches the regex used in isValidEmail', () => {
      // Verify the regex is consistent
      const testEmail = 'user+tag@example.co.uk'
      expect(EMAIL_REGEX.test(testEmail)).toBe(isValidEmail(testEmail))
    })
  })
})
