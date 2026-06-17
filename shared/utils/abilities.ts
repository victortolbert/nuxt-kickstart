import type { AuthUser, ContentItem, Visibility } from '../types/auth'

// =============================================================================
// AUTHENTICATION ABILITIES
// =============================================================================

/**
 * Check if user is authenticated (any logged-in user)
 */
export const isAuthenticated = defineAbility((user: AuthUser) => {
  return !!user
})

/**
 * Check if user is an admin
 */
export const isAdmin = defineAbility((user: AuthUser) => {
  return user.role === 'admin'
})

/**
 * Check if user can edit content (admin or editor)
 */
export const canEdit = defineAbility((user: AuthUser) => {
  return user.role === 'admin' || user.role === 'editor'
})

// =============================================================================
// CONTENT VISIBILITY ABILITIES
// =============================================================================

/**
 * View public content - anyone can view (including guests)
 */
export const viewPublicContent = defineAbility(
  { allowGuest: true },
  (_user: AuthUser | null) => true,
)

/**
 * View internal content - requires authentication
 */
export const viewInternalContent = defineAbility((user: AuthUser) => {
  return !!user
})

/**
 * View private content - only author or admin
 */
export const viewPrivateContent = defineAbility((user: AuthUser, content: ContentItem) => {
  // Admins can view all private content
  if (user.role === 'admin')
    return true

  // Author can view their own private content
  if (content.authorId && content.authorId === user.id)
    return true

  return false
})

/**
 * Generic content visibility check based on visibility field
 */
export const viewContent = defineAbility(
  { allowGuest: true },
  (user: AuthUser | null, content: ContentItem) => {
    const visibility: Visibility = content.visibility || 'private'

    switch (visibility) {
      case 'public':
        return true

      case 'internal':
        return !!user

      case 'private':
        if (!user)
          return false
        if (user.role === 'admin')
          return true
        return content.authorId === user.id

      default:
        return false
    }
  },
)

// =============================================================================
// CONTENT MUTATION ABILITIES
// =============================================================================

/**
 * Create new content - any authenticated user
 */
export const createContent = defineAbility((user: AuthUser) => {
  return !!user
})

/**
 * Edit content - author, editor, or admin
 */
export const editContent = defineAbility((user: AuthUser, content: ContentItem) => {
  if (user.role === 'admin' || user.role === 'editor')
    return true
  return content.authorId === user.id
})

/**
 * Delete content - only author or admin
 */
export const deleteContent = defineAbility((user: AuthUser, content: ContentItem) => {
  if (user.role === 'admin')
    return true
  return content.authorId === user.id
})

/**
 * Change content visibility - only author or admin
 */
export const changeVisibility = defineAbility((user: AuthUser, content: ContentItem) => {
  if (user.role === 'admin')
    return true
  return content.authorId === user.id
})

// =============================================================================
// FEATURE-SPECIFIC ABILITIES
// =============================================================================

/**
 * Access settings page
 */
export const accessSettings = defineAbility((user: AuthUser) => {
  return user.role === 'admin'
})

/**
 * Manage users
 */
export const manageUsers = defineAbility((user: AuthUser) => {
  return user.role === 'admin'
})

/**
 * Export content
 */
export const exportContent = defineAbility((user: AuthUser) => {
  return !!user // Any authenticated user can export
})
