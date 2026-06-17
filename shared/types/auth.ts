// Shared user type for authorization (Better Auth)
export interface AuthUser {
  id: string
  name: string | null
  email: string | null
  avatar: string | null
  provider: 'github' | 'magic-link' | 'email-otp' | 'phone'
  role: 'admin' | 'editor' | 'viewer'
}

// Content visibility levels
export type Visibility = 'public' | 'internal' | 'private'

// Content item with visibility
export interface ContentItem {
  visibility?: Visibility
  authorId?: string
  [key: string]: unknown
}
