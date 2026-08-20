import { expect, test } from '@playwright/test'

test.describe('smoke', () => {
  test('landing page renders', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Kickstart/i)
    await expect(page.locator('#__nuxt')).toBeVisible()
  })

  test('guides index renders with guide links', async ({ page }) => {
    await page.goto('/guides')
    await expect(page.getByRole('heading', { name: 'Guides', exact: true }).first()).toBeVisible()
    await expect(page.getByText('Using This Template').first()).toBeVisible()
  })

  test('posts index renders seeded posts', async ({ page }) => {
    await page.goto('/posts')
    await expect(page.getByRole('heading', { name: 'Posts', exact: true }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /hello world/i })).toBeVisible()
  })

  test('spanish guides index renders translated chrome and content', async ({ page }) => {
    await page.goto('/es/guides')
    await expect(page.getByRole('heading', { name: 'Guías', exact: true }).first()).toBeVisible()
    // Translated guide (content/es/guides/using-this-template.md)
    await expect(page.getByText('Usar Esta Plantilla').first()).toBeVisible()
  })

  test('login page shows passwordless sign-in options', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('textbox').first()).toBeVisible()
  })

  test('admin area redirects unauthenticated visitors to login', async ({ page }) => {
    await page.goto('/app/admin')
    await page.waitForURL(/\/login/)
    await expect(page).toHaveURL(/\/login/)
  })

  test('theme is applied from localStorage before render', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kickstart-theme', 'nord')
    })
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'nord')
  })

  test('every page archetype renders exactly one h1', async ({ page }) => {
    for (const path of ['/', '/guides', '/guides/architecture', '/posts', '/tech', '/login']) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      await expect(page.locator('h1'), `expected exactly one h1 on ${path}`).toHaveCount(1)
    }
  })
})
