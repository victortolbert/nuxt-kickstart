---
title: Form Patterns
description: Standard form styling patterns for Nuxt UI v4 with Zod validation, icons, and consistent design
tags:
  - forms
  - validation
  - zod
  - nuxt-ui
status: evergreen
visibility: public
category: customization
difficulty: beginner
order: 10
prerequisites:
  - getting-started
created: '2026-01-25'
---

## Overview

All forms in Kickstart follow consistent patterns using Nuxt UI v4 components with Zod validation schemas. This guide documents the standard conventions for icons, sizing, spacing, and validation.

## Icon Conventions

Use these Tabler icons consistently across forms:

| Field Type | Icon | Usage |
|------------|------|-------|
| Email | `i-tabler-mail` | Email inputs, recipient fields |
| Password | `i-tabler-lock` | Password and confirm password fields |
| Search | `i-tabler-search` | Search inputs, filter fields |
| User/Name | `i-tabler-user` | Name, username, profile fields |
| Title/Text | `i-tabler-bulb` | Title fields, idea capture |
| Calendar | `i-tabler-calendar` | Date/datetime inputs |

### Example

```vue
<UInput
  v-model="form.email"
  type="email"
  leading-icon="i-tabler-mail"
  placeholder="your@email.com"
/>
```

## Sizing Conventions

Choose component size based on context:

| Size | Usage | Example |
|------|-------|---------|
| `lg` | Full-page forms, primary actions | Login, register, compose |
| `md` | Modal dialogs, secondary forms | Settings, confirmations |
| `sm` | Filters, search, dense lists | Index page filters, toolbars |

### Example

```vue
<!-- Full-page login form -->
<UInput
  v-model="form.email"
  size="lg"
  leading-icon="i-tabler-mail"
/>

<!-- Modal form -->
<UInput
  v-model="form.name"
  size="md"
  leading-icon="i-tabler-user"
/>

<!-- Filter input -->
<UInput
  v-model="searchQuery"
  size="sm"
  icon="i-tabler-search"
  placeholder="Search..."
/>
```

## Spacing Conventions

Maintain consistent spacing between form elements:

| Spacing | Usage | Class |
|---------|-------|-------|
| Between fields | Standard vertical spacing within a form | `space-y-5` |
| Between sections | Larger spacing between logical groups | `space-y-8` or `mb-8` |

### Example

```vue
<UForm :schema="loginSchema" :state="form">
  <!-- space-y-5 between fields -->
  <div class="space-y-5">
    <UFormField name="email" label="Email">
      <UInput v-model="form.email" />
    </UFormField>

    <UFormField name="password" label="Password">
      <UInput v-model="form.password" type="password" />
    </UFormField>
  </div>

  <!-- Section break -->
  <div class="mt-8">
    <UButton type="submit" label="Sign In" />
  </div>
</UForm>
```

## Validation Patterns

### Basic Schema

Create reusable validation schemas in `shared/schemas/`:

```ts
// shared/schemas/common.ts
import { z } from 'zod'

export const emailSchema = z.string().email('Invalid email address')
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')
export const requiredStringSchema = z.string().min(1, 'This field is required')
export const optionalStringSchema = z.string().optional()
```

### Form Schema

Compose schemas for specific forms:

```ts
// shared/schemas/auth.ts
import { z } from 'zod'
import { emailSchema, passwordSchema } from './common'

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type LoginForm = z.infer<typeof loginSchema>
```

### Component Usage

Use `UForm` with schema validation:

```vue
<script setup lang="ts">
import { loginSchema } from '#shared/schemas/auth'

const form = ref({
  email: '',
  password: '',
})

async function handleSubmit() {
  // Form is validated before this runs
  console.log('Valid form data:', form.value)
}
</script>

<template>
  <UForm
    :schema="loginSchema"
    :state="form"
    @submit="handleSubmit"
  >
    <div class="space-y-5">
      <UFormField name="email" label="Email Address">
        <UInput
          v-model="form.email"
          type="email"
          leading-icon="i-tabler-mail"
          size="lg"
          placeholder="your@email.com"
        />
      </UFormField>

      <UFormField
        name="password"
        label="Password"
        help="At least 8 characters"
      >
        <UInput
          v-model="form.password"
          type="password"
          leading-icon="i-tabler-lock"
          size="lg"
        />
      </UFormField>
    </div>

    <div class="mt-8">
      <UButton
        type="submit"
        label="Sign In"
        size="lg"
        block
      />
    </div>
  </UForm>
</template>
```

## Common Patterns

### Password Visibility Toggle

```vue
<script setup lang="ts">
const showPassword = ref(false)
</script>

<template>
  <UFormField name="password" label="Password">
    <UInput
      v-model="form.password"
      :type="showPassword ? 'text' : 'password'"
      leading-icon="i-tabler-lock"
      size="lg"
    >
      <template #trailing>
        <UButton
          :icon="showPassword ? 'i-tabler-eye-off' : 'i-tabler-eye'"
          variant="ghost"
          @click="showPassword = !showPassword"
        />
      </template>
    </UInput>
  </UFormField>
</template>
```

### Search Input

```vue
<script setup lang="ts">
const searchQuery = ref('')

const filtered = computed(() => {
  if (!searchQuery.value) return items.value
  const query = searchQuery.value.toLowerCase()
  return items.value.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.description?.toLowerCase().includes(query)
  )
})
</script>

<template>
  <UInput
    v-model="searchQuery"
    icon="i-tabler-search"
    size="sm"
    placeholder="Search..."
  />
</template>
```

### Form Field with Description

```vue
<UFormField
  name="recipients"
  label="Recipients"
  description="Separate multiple emails with commas"
  :hint="recipientCount > 0 ? `${recipientCount} recipients` : undefined"
>
  <UInput
    v-model="form.recipients"
    type="text"
    leading-icon="i-tabler-mail"
    size="lg"
  />
</UFormField>
```

## Best Practices

1. **Always use Zod schemas** for form validation instead of manual validation
2. **Import from `#shared/schemas`** to reuse common validation patterns
3. **Add descriptive help text** for complex fields (password requirements, format hints)
4. **Use dynamic hints** to show real-time feedback (character count, recipient count)
5. **Keep forms accessible** with proper labels, descriptions, and error messages
6. **Match icon context** to field purpose (don't use `i-tabler-mail` for non-email fields)
7. **Consistent sizing** within a form (don't mix `lg` and `sm` in the same form)
8. **Space fields logically** using `space-y-5` for fields and `space-y-8` for sections

## Related

- [Nuxt UI Documentation](https://ui.nuxt.com)
- [Zod Documentation](https://zod.dev)
- [Authentication Guide](/guides/authentication)
