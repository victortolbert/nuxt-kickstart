# Public

Static files served at the root URL. Not processed by the bundler.

## Structure

| Folder              | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `img/screenshots/`  | Project screenshots organized by slug            |

Root files: `favicon.svg` / `favicon-dark.svg` (referenced in `nuxt.config.ts`)
and `_robots.txt`. `img/` holds only the screenshot placeholders until the
`local` storage provider writes an upload there.

Fonts are **not** self-hosted here — they come from npm via
`app/assets/css/fonts/index.css`, which imports the `@fontsource` packages
(`@fontsource-variable/jetbrains-mono`, `@fontsource/roboto`,
`@fontsource/barlow-condensed`). There is no `resources/fonts/` directory.

## Conventions

### Project Screenshots

```
img/screenshots/{project-slug}/screenshot-1.png
```

### Uploads

The `local` storage provider writes uploads under `img/` (see
`server/utils/storage/` and the File Storage guide at `/guides/file-storage`). Production should use
the `s3` or `cloudinary` provider instead.
