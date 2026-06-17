# Public

Static files served at the root URL. Not processed by the bundler.

## Structure

| Folder              | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `img/podcasts/`     | Podcast cover art (example app)                  |
| `img/teams/`        | Team logo uploads (scoreboard example, `local` storage provider) |
| `img/screenshots/`  | Project screenshots organized by slug            |
| `audio/`            | Sample episode audio (podcast example)           |
| `resources/fonts/`  | Self-hosted font files (loaded by `app/assets/css/fonts/`) |
| `sounds/judges/`    | Celebration sounds (judges scoreboard example)   |

Root files: `favicon.svg` / `favicon-dark.svg` (referenced in `nuxt.config.ts`)
and `_robots.txt`.

## Conventions

### Project Screenshots

```
img/screenshots/{project-slug}/screenshot-1.png
```

### Uploads

The `local` storage provider writes uploads under `img/` (see
`server/utils/storage/` and the File Storage guide at `/guides/file-storage`). Production should use
the `s3` or `cloudinary` provider instead.
