/**
 * Tech/Framework configuration for badges
 * Maps slug to brand color and icon
 */

import { formatLabel } from '../../shared/utils/case'

export interface TechConfig {
  label: string
  icon: string
  color: string // Tailwind color name or hex
}

/**
 * Brand colors and icons for common tech stacks
 * Colors chosen to match official brand guidelines where possible
 */
export const techConfigs: Record<string, TechConfig> = {
  // Frameworks
  'nuxt': {
    label: 'Nuxt',
    icon: 'logos:nuxt-icon',
    color: '#00DC82',
  },
  'vue': {
    label: 'Vue',
    icon: 'logos:vue',
    color: '#4FC08D',
  },
  'react': {
    label: 'React',
    icon: 'logos:react',
    color: '#61DAFB',
  },
  'next': {
    label: 'Next.js',
    icon: 'simple-icons:nextdotjs',
    color: '#000000',
  },
  'svelte': {
    label: 'Svelte',
    icon: 'logos:svelte-icon',
    color: '#FF3E00',
  },
  'angular': {
    label: 'Angular',
    icon: 'logos:angular-icon',
    color: '#DD0031',
  },
  'astro': {
    label: 'Astro',
    icon: 'logos:astro-icon',
    color: '#FF5D01',
  },

  // CSS / Styling
  'tailwind': {
    label: 'Tailwind',
    icon: 'logos:tailwindcss-icon',
    color: '#06B6D4',
  },
  'tailwind-css': {
    label: 'Tailwind CSS',
    icon: 'logos:tailwindcss-icon',
    color: '#06B6D4',
  },
  'sass': {
    label: 'Sass',
    icon: 'logos:sass',
    color: '#CC6699',
  },
  'css': {
    label: 'CSS',
    icon: 'logos:css-3',
    color: '#1572B6',
  },

  // Languages
  'typescript': {
    label: 'TypeScript',
    icon: 'logos:typescript-icon',
    color: '#3178C6',
  },
  'javascript': {
    label: 'JavaScript',
    icon: 'logos:javascript',
    color: '#F7DF1E',
  },
  'python': {
    label: 'Python',
    icon: 'logos:python',
    color: '#3776AB',
  },
  'rust': {
    label: 'Rust',
    icon: 'simple-icons:rust',
    color: '#000000',
  },
  'go': {
    label: 'Go',
    icon: 'logos:go',
    color: '#00ADD8',
  },

  // Databases
  'postgresql': {
    label: 'PostgreSQL',
    icon: 'logos:postgresql',
    color: '#4169E1',
  },
  'mysql': {
    label: 'MySQL',
    icon: 'logos:mysql-icon',
    color: '#4479A1',
  },
  'mongodb': {
    label: 'MongoDB',
    icon: 'logos:mongodb-icon',
    color: '#47A248',
  },
  'redis': {
    label: 'Redis',
    icon: 'logos:redis',
    color: '#DC382D',
  },
  'supabase': {
    label: 'Supabase',
    icon: 'logos:supabase-icon',
    color: '#3FCF8E',
  },

  // Tools / Platforms
  'docker': {
    label: 'Docker',
    icon: 'logos:docker-icon',
    color: '#2496ED',
  },
  'vercel': {
    label: 'Vercel',
    icon: 'simple-icons:vercel',
    color: '#000000',
  },
  'nodejs': {
    label: 'Node.js',
    icon: 'logos:nodejs-icon',
    color: '#339933',
  },
  'style-dictionary': {
    label: 'Style Dictionary',
    icon: 'i-tabler-paint',
    color: '#8B5CF6',
  },
  'netlify': {
    label: 'Netlify',
    icon: 'logos:netlify-icon',
    color: '#00C7B7',
  },
  'cloudflare': {
    label: 'Cloudflare',
    icon: 'logos:cloudflare-icon',
    color: '#F38020',
  },
  'aws': {
    label: 'AWS',
    icon: 'logos:aws',
    color: '#FF9900',
  },
  'github': {
    label: 'GitHub',
    icon: 'simple-icons:github',
    color: '#181717',
  },
  'figma': {
    label: 'Figma',
    icon: 'logos:figma',
    color: '#F24E1E',
  },

  // Nuxt ecosystem
  'nuxt-content': {
    label: 'Nuxt Content',
    icon: 'logos:nuxt-icon',
    color: '#00DC82',
  },
  'nuxt-ui': {
    label: 'Nuxt UI',
    icon: 'logos:nuxt-icon',
    color: '#00DC82',
  },
  'pinia': {
    label: 'Pinia',
    icon: 'logos:pinia',
    color: '#FFD859',
  },

  // Testing
  'vitest': {
    label: 'Vitest',
    icon: 'logos:vitest',
    color: '#6E9F18',
  },
  'playwright': {
    label: 'Playwright',
    icon: 'logos:playwright',
    color: '#2EAD33',
  },
  'cypress': {
    label: 'Cypress',
    icon: 'simple-icons:cypress',
    color: '#17202C',
  },

  // Expanded tech registry (UXLab taxonomy)
  'bash': { label: 'Bash', icon: 'logos:bash-icon', color: '#4EAA25' },
  'c': { label: 'C', icon: 'logos:c', color: '#A8B9CC' },
  'codeigniter': { label: 'CodeIgniter', icon: 'logos:codeigniter', color: '#EF4223' },
  'csharp': { label: 'C#', icon: 'logos:c-sharp', color: '#9B4F96' },
  'django': { label: 'Django', icon: 'logos:django-icon', color: '#092E20' },
  'dotnet-core': { label: '.NET Core', icon: 'logos:dotnet', color: '#512BD4' },
  'eslint': { label: 'ESLint', icon: 'logos:eslint', color: '#4B32C3' },
  'flask': { label: 'Flask', icon: 'logos:flask', color: '#000000' },
  'framer': { label: 'Framer', icon: 'logos:framer', color: '#0055FF' },
  'inertia': { label: 'Inertia', icon: 'simple-icons:inertia', color: '#9553E9' },
  'java': { label: 'Java', icon: 'logos:java', color: '#ED8B00' },
  'jquery': { label: 'jQuery', icon: 'logos:jquery', color: '#0769AD' },
  'laravel': { label: 'Laravel', icon: 'logos:laravel', color: '#FF2D20' },
  'livewire': { label: 'Livewire', icon: 'simple-icons:livewire', color: '#FB70A9' },
  'markdown': { label: 'Markdown', icon: 'logos:markdown', color: '#000000' },
  'nest': { label: 'NestJS', icon: 'logos:nestjs', color: '#E0234E' },
  'objective-c': { label: 'Objective-C', icon: 'i-tabler-brand-apple', color: '#438EFF' },
  'rails': { label: 'Ruby on Rails', icon: 'logos:rails', color: '#D30001' },
  'razor': { label: 'Razor', icon: 'logos:dotnet', color: '#512BD4' },
  'react-native': { label: 'React Native', icon: 'logos:react', color: '#61DAFB' },
  'ruby': { label: 'Ruby', icon: 'logos:ruby', color: '#CC342D' },
  'solid': { label: 'SolidJS', icon: 'logos:solidjs-icon', color: '#2C4F7C' },
  'streamlit': { label: 'Streamlit', icon: 'logos:streamlit', color: '#FF4B4B' },
  'swift': { label: 'Swift', icon: 'logos:swift', color: '#F05138' },
  'symfony': { label: 'Symfony', icon: 'logos:symfony', color: '#000000' },
  'tanstack-start': { label: 'TanStack Start', icon: 'simple-icons:tanstack', color: '#FF4154' },
  'vite': { label: 'Vite', icon: 'logos:vitejs', color: '#646CFF' },
}

/**
 * Get tech config by slug, with fallback for unknown tech
 */
export function getTechConfig(slug: string): TechConfig {
  return techConfigs[slug] || {
    label: formatLabel(slug),
    icon: 'i-tabler-code',
    // Must be a real CSS color — invalid values silently disable the chip
    // styling in TechBadge's color-mix() expressions
    color: 'var(--ui-text-muted)',
  }
}

/**
 * Check if a tech slug has a known configuration
 */
export function hasTechConfig(slug: string): boolean {
  return slug in techConfigs
}
