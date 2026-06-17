import { describe, expect, it } from 'vitest'

/**
 * Tests for Better Auth Vue client setup
 * Verifies US-009 acceptance criteria
 */
describe('auth-client', () => {
  it('should export authClient', async () => {
    const { authClient } = await import('../../app/lib/auth-client')
    expect(authClient).toBeDefined()
    // authClient is a Proxy/function, not a plain object
    expect(authClient).toBeTruthy()
  })

  it('should export useSession composable', async () => {
    const { useSession } = await import('../../app/lib/auth-client')
    expect(useSession).toBeDefined()
    expect(typeof useSession).toBe('function')
  })

  it('should have useSession method on authClient', async () => {
    const { authClient } = await import('../../app/lib/auth-client')
    expect(authClient.useSession).toBeDefined()
    expect(typeof authClient.useSession).toBe('function')
  })

  it('should have signIn.social method for GitHub OAuth', async () => {
    const { authClient } = await import('../../app/lib/auth-client')
    expect(authClient.signIn).toBeDefined()
    expect(authClient.signIn.social).toBeDefined()
    expect(typeof authClient.signIn.social).toBe('function')
  })

  it('should have signIn.magicLink method', async () => {
    const { authClient } = await import('../../app/lib/auth-client')
    expect(authClient.signIn).toBeDefined()
    expect(authClient.signIn.magicLink).toBeDefined()
    expect(typeof authClient.signIn.magicLink).toBe('function')
  })

  it('should have emailOtp.sendVerificationOtp method', async () => {
    const { authClient } = await import('../../app/lib/auth-client')
    expect(authClient.emailOtp).toBeDefined()
    expect(authClient.emailOtp.sendVerificationOtp).toBeDefined()
    expect(typeof authClient.emailOtp.sendVerificationOtp).toBe('function')
  })

  it('should have emailOtp.verifyOtp method', async () => {
    const { authClient } = await import('../../app/lib/auth-client')
    expect(authClient.emailOtp).toBeDefined()
    expect(authClient.emailOtp.verifyOtp).toBeDefined()
    expect(typeof authClient.emailOtp.verifyOtp).toBe('function')
  })

  it('should have phoneNumber.sendOtp method', async () => {
    const { authClient } = await import('../../app/lib/auth-client')
    expect(authClient.phoneNumber).toBeDefined()
    expect(authClient.phoneNumber.sendOtp).toBeDefined()
    expect(typeof authClient.phoneNumber.sendOtp).toBe('function')
  })

  it('should have phoneNumber.verifyOtp method', async () => {
    const { authClient } = await import('../../app/lib/auth-client')
    expect(authClient.phoneNumber).toBeDefined()
    expect(authClient.phoneNumber.verifyOtp).toBeDefined()
    expect(typeof authClient.phoneNumber.verifyOtp).toBe('function')
  })

  it('should have signOut method', async () => {
    const { authClient } = await import('../../app/lib/auth-client')
    expect(authClient.signOut).toBeDefined()
    expect(typeof authClient.signOut).toBe('function')
  })

  it('should have admin.listUsers method', async () => {
    const { authClient } = await import('../../app/lib/auth-client')
    expect(authClient.admin).toBeDefined()
    expect(authClient.admin.listUsers).toBeDefined()
    expect(typeof authClient.admin.listUsers).toBe('function')
  })

  it('should have admin.setRole method', async () => {
    const { authClient } = await import('../../app/lib/auth-client')
    expect(authClient.admin).toBeDefined()
    expect(authClient.admin.setRole).toBeDefined()
    expect(typeof authClient.admin.setRole).toBe('function')
  })

  it('should have admin.banUser method', async () => {
    const { authClient } = await import('../../app/lib/auth-client')
    expect(authClient.admin).toBeDefined()
    expect(authClient.admin.banUser).toBeDefined()
    expect(typeof authClient.admin.banUser).toBe('function')
  })

  it('should have admin.unbanUser method', async () => {
    const { authClient } = await import('../../app/lib/auth-client')
    expect(authClient.admin).toBeDefined()
    expect(authClient.admin.unbanUser).toBeDefined()
    expect(typeof authClient.admin.unbanUser).toBe('function')
  })

  it('should have admin.removeUser method', async () => {
    const { authClient } = await import('../../app/lib/auth-client')
    expect(authClient.admin).toBeDefined()
    expect(authClient.admin.removeUser).toBeDefined()
    expect(typeof authClient.admin.removeUser).toBe('function')
  })
})
