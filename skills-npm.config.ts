// skills-npm.config.ts
import { defineConfig } from 'skills-npm'

export default defineConfig({
  // Source to discover skills from: 'node_modules' or 'package.json'
  source: 'package.json',
  // Target specific agents (defaults to all detected agents)
  agents: ['cursor', 'windsurf'],
  // Scan recursively for monorepo packages (default: false)
  recursive: false,
  // Whether to update .gitignore (default: true)
  gitignore: true,
  // Skip confirmation prompts (default: false)
  yes: false,
  // Dry run mode (default: false)
  dryRun: false,
  // Include specific packages or skills
  include: [
    // Include all skills from a package
    '@some/package',
    // Include specific skills from a package
    { package: '@slidev/cli', skills: ['presenter-mode'] },
  ],
  // Exclude specific packages or skills
  exclude: [
    // Exclude all skills from a package
    '@some/package',
    // Exclude specific skills from a package
    { package: '@slidev/cli', skills: ['presenter-mode'] },
  ],
})
