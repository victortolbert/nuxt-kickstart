# Public

Static files served at the root URL. Not processed by the bundler.

## Structure

| Folder              | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `img/podcasts/`     | Podcast cover art (example app)                  |
| `img/teams/`        | Team logo uploads (scoreboard example, `local` storage provider) |
| `img/screenshots/`  | Project screenshots organized by slug            |
| `audio/`            | Sample episode audio (podcast example)           |

Loose files in `img/`: `avatar.png` (default user avatar) and the garden-status
art `seed.png` / `sprout.png` / `evergeen.png` / `wilted.png` — note the
misspelled `evergeen.png`, which is the filename the code actually references.

Root files: `favicon.svg` / `favicon-dark.svg` (referenced in `nuxt.config.ts`)
and `_robots.txt`.

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
