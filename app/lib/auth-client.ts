import { adminClient, emailOTPClient, magicLinkClient, phoneNumberClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'

/**
 * Better Auth Vue client for Kickstart
 *
 * Configured with passwordless authentication methods:
 * - Magic link (email)
 * - Email OTP (6-digit code)
 * - Phone number OTP (SMS)
 * - GitHub OAuth
 *
 * Admin plugin enabled for user management:
 * - List/search/filter users
 * - Set roles, ban/unban users
 * - Revoke sessions, remove users
 *
 * Usage in components:
 * ```vue
 * <script setup>
 * import { authClient } from '~/lib/auth-client'
 *
 * const session = authClient.useSession()
 *
 * // Magic link
 * await authClient.signIn.magicLink({ email, callbackURL })
 *
 * // Email OTP
 * await authClient.emailOtp.sendVerificationOtp({ email, type: 'sign-in' })
 * await authClient.emailOtp.verifyOtp({ email, otp })
 *
 * // Phone OTP
 * await authClient.phoneNumber.sendOtp({ phoneNumber })
 * await authClient.phoneNumber.verifyOtp({ phoneNumber, otp })
 *
 * // GitHub OAuth
 * await authClient.signIn.social({ provider: 'github' })
 *
 * // Admin operations (requires admin role)
 * await authClient.admin.listUsers({ limit, offset, sortBy, sortDirection })
 * await authClient.admin.setRole({ userId, role })
 * await authClient.admin.banUser({ userId, banReason })
 * await authClient.admin.unbanUser({ userId })
 * await authClient.admin.removeUser({ userId })
 *
 * // Sign out
 * await authClient.signOut()
 * </script>
 * ```
 */
export const authClient = createAuthClient({
  // baseURL is automatically inferred when running on same domain
  // Falls back to localhost:3000 for development if needed
  baseURL: typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:3000',
  plugins: [
    adminClient(),
    magicLinkClient(),
    emailOTPClient(),
    phoneNumberClient(),
  ],
})

// Export useSession for convenience
export const useSession = authClient.useSession
