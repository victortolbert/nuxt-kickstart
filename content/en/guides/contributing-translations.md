---
title: Contributing Translations
description: Learn how to contribute translations to Kickstart and help make content accessible in multiple languages.
category: getting-started
difficulty: beginner
order: 10
status: sprout
visibility: internal
tags:
  - i18n
  - translation
  - contributing
---

# Contributing Translations

Kickstart supports multiple languages to make content accessible to a broader audience. This guide explains how to contribute translations and help expand our multilingual content.

## Supported Languages

Kickstart currently supports the following languages:

| Code | Language | Native Name |
|------|----------|-------------|
| `en` | English | English (default) |
| `es` | Spanish | Español |

Only `en` and `es` are configured — in `nuxt.config.ts` (`i18n.locales`), in
`i18n/locales/`, and under `content/`. Adding a language means adding it in all
three places.

## Directory Structure

Content is organized by locale in the `content/` directory:

```
content/
  en/                    # English (default)
    guides/
    posts/
    apps/
    blocks/
  es/                    # Spanish
    guides/
```

## Creating a Translation

### 1. Find Content to Translate

Browse the `content/en/` directory to find content you'd like to translate. Start with shorter, high-impact guides.

### 2. Create the Translated File

Create a new file in the corresponding locale directory with the same path:

```bash
# English source
content/en/guides/getting-started.md

# Spanish translation
content/es/guides/getting-started.md
```

### 3. Copy and Translate

1. Copy the English frontmatter
2. Translate the title and description
3. Add `machineTranslated: true` if using machine translation
4. Translate the body content

### Frontmatter Example

```yaml
---
title: Primeros Pasos
description: Aprende cómo empezar con Kickstart.
machineTranslated: true  # Add this for machine translations
category: getting-started
difficulty: beginner
order: 1
status: sprout
visibility: public
tags:
  - getting-started
---
```

## Translation Quality

### Machine Translations

If you're using AI or machine translation tools:

1. **Mark it**: Add `machineTranslated: true` to frontmatter
2. **Review it**: Check for context and technical accuracy
3. **Update later**: Remove the flag after human review

### Quality Checklist

- [ ] Technical terms are accurate
- [ ] Code examples are unchanged
- [ ] Links are still valid
- [ ] Formatting is preserved
- [ ] Cultural context is appropriate

## Contributing via GitHub

1. Fork the repository
2. Create a new branch: `git checkout -b translate/es/getting-started`
3. Add your translation
4. Submit a Pull Request
5. Request review from a native speaker if possible

## Need Help?

- Join our community discussions
- Tag translations for review in your PR
- Start with shorter content to build confidence

Thank you for helping make Kickstart accessible to more people!
