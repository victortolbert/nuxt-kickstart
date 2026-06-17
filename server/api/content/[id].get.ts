import { viewContent } from '~~/shared/utils/abilities'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  // Simulated content fetch - replace with actual database query
  const content = {
    id,
    title: 'Example Content',
    visibility: 'internal' as const,
    authorId: 'user-123',
  }

  // Check if user can view this content based on visibility
  // This will throw 403 if not authorized
  await authorize(event, viewContent, content)

  return content
})
