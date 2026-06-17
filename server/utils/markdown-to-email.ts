import { marked } from 'marked'

const LINK_HREF_RE = /<a\s([^>]*?)href="([^"]+)"([^>]*)>/gi

/**
 * Convert Markdown content to email-safe HTML with inline styles
 * @param markdown - Markdown content to convert
 * @param options - Optional tracking parameters for link rewriting
 * @param options.emailId - Email ID for tracking
 * @param options.recipient - Recipient email for tracking
 */
export function renderMarkdownToEmailHtml(
  markdown: string,
  options?: { emailId?: string, recipient?: string },
): string {
  // Configure marked with minimal options for email compatibility
  const html = marked(markdown, {
    breaks: true, // Convert \n to <br>
    gfm: true, // GitHub Flavored Markdown
  })

  // Apply inline styles to HTML elements for email client compatibility
  let styledHtml = applyInlineStyles(html as string)

  // Rewrite links through click tracker if tracking params provided
  if (options?.emailId && options?.recipient) {
    styledHtml = rewriteLinksForTracking(styledHtml, options.emailId, options.recipient)
  }

  return styledHtml
}

/**
 * Rewrite all links in HTML to go through click tracking endpoint
 */
function rewriteLinksForTracking(html: string, emailId: string, recipient: string): string {
  return html.replace(LINK_HREF_RE, (match, before, href, after) => {
    // Skip anchor links and already-tracked links
    if (href.startsWith('#') || href.includes('/api/email/track/click')) {
      return match
    }

    // Build tracking URL with encoded params
    const trackingUrl = `/api/email/track/click?emailId=${encodeURIComponent(emailId)}&recipient=${encodeURIComponent(recipient)}&url=${encodeURIComponent(href)}`

    return `<a ${before}href="${trackingUrl}"${after}>`
  })
}

/**
 * Apply inline styles to HTML elements for email client compatibility
 */
function applyInlineStyles(html: string): string {
  const styles = {
    p: 'margin: 0 0 16px 0; line-height: 1.6; color: #333333; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;',
    h1: 'margin: 24px 0 16px 0; font-size: 28px; font-weight: 700; line-height: 1.3; color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;',
    h2: 'margin: 20px 0 12px 0; font-size: 24px; font-weight: 700; line-height: 1.3; color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;',
    h3: 'margin: 16px 0 8px 0; font-size: 20px; font-weight: 700; line-height: 1.3; color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;',
    ul: 'margin: 0 0 16px 0; padding-left: 24px; line-height: 1.6;',
    ol: 'margin: 0 0 16px 0; padding-left: 24px; line-height: 1.6;',
    li: 'margin: 0 0 8px 0; color: #333333; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;',
    a: 'color: #0066cc; text-decoration: underline;',
    code: 'background-color: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: "Courier New", Courier, monospace; font-size: 14px; color: #d63384;',
    pre: 'background-color: #f4f4f4; padding: 16px; border-radius: 4px; overflow-x: auto; margin: 0 0 16px 0;',
    blockquote: 'margin: 0 0 16px 0; padding: 12px 20px; border-left: 4px solid #dddddd; color: #666666; font-style: italic; background-color: #f9f9f9;',
    strong: 'font-weight: 700;',
    em: 'font-style: italic;',
    hr: 'border: none; border-top: 1px solid #dddddd; margin: 24px 0;',
    table: 'border-collapse: collapse; width: 100%; margin: 0 0 16px 0;',
    th: 'background-color: #f4f4f4; padding: 12px; text-align: left; border: 1px solid #dddddd; font-weight: 700;',
    td: 'padding: 12px; border: 1px solid #dddddd;',
  }

  let styledHtml = html

  // Apply styles to each element type
  Object.entries(styles).forEach(([tag, style]) => {
    // Match opening tags without existing style attribute
    const regex = new RegExp(`<${tag}(?!\\s+style=)([^>]*)>`, 'gi')
    styledHtml = styledHtml.replace(regex, `<${tag} style="${style}"$1>`)

    // Match opening tags with existing style attribute and merge
    const regexWithStyle = new RegExp(`<${tag}\\s+([^>]*?)style="([^"]*)"([^>]*)>`, 'gi')
    styledHtml = styledHtml.replace(regexWithStyle, `<${tag} $1style="${style} $2"$3>`)
  })

  return styledHtml
}
