import { isAdmin } from '~~/shared/utils/abilities'
import { listMaizzleTemplates } from '../../../utils/maizzle'

/** List the available Maizzle email templates (admin only). */
export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin)
  return { templates: await listMaizzleTemplates() }
})
