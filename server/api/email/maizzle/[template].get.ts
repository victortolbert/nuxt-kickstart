import { isAdmin } from '~~/shared/utils/abilities'
import { renderMaizzleTemplate } from '../../../utils/maizzle'

/**
 * Render a Maizzle email template to HTML for display/preview (admin only).
 * Returns raw HTML so it can be opened directly or used as an iframe `src`.
 */
export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin)
  const param = getRouterParam(event, 'template') || ''
  const name = param.replace(/\.(?:html|vue)$/, '')
  const { html } = await renderMaizzleTemplate(name)
  setHeader(event, 'content-type', 'text/html; charset=utf-8')
  return html
})
