---
title: Video & Social Embeds
description: Embed YouTube videos and Twitter/X posts in your content using simple MDC components.
category: content
difficulty: beginner
order: 31
status: evergreen
visibility: public
tags:
  - youtube
  - twitter
  - embeds
  - video
---

Kickstart provides simple components for embedding external media in your markdown content.

## YouTube Videos

Embed YouTube videos using the `youtube` component with a video ID:

**Syntax:** `::youtube{id="VIDEO_ID"}` followed by `::` on a new line

### Example

::youtube{id="dQw4w9WgXcQ"}
::

### Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string`{lang="ts-type"} | required | YouTube video ID |
| `aspect` | `string`{lang="ts-type"} | `16/9` | Aspect ratio (e.g., `16/9`, `4/3`, `1/1`) |
| `maxWidth` | `string`{lang="ts-type"}/`number`{lang="ts-type"} | `800` | Maximum width in pixels |
| `start` | `number`{lang="ts-type"} | `0` | Start time in seconds |
| `autoplay` | `boolean`{lang="ts-type"} | `false` | Auto-play video |
| `loop` | `boolean`{lang="ts-type"} | `false` | Loop video |
| `mute` | `boolean`{lang="ts-type"} | `false` | Mute audio |

### Custom Aspect Ratio Example

For a square video or different aspect ratio:

`::youtube{id="dQw4w9WgXcQ" aspect="4/3" maxWidth="600"}` followed by `::` on a new line

### Finding Video IDs

The video ID is the value after `v=` in a YouTube URL:

- `https://youtube.com/watch?v=dQw4w9WgXcQ` → ID is `dQw4w9WgXcQ`
- `https://youtu.be/dQw4w9WgXcQ` → ID is `dQw4w9WgXcQ`

## Twitter/X Posts

Embed tweets using the `tweet` component with a tweet ID:

**Syntax:** `::tweet{id="TWEET_ID"}` followed by `::` on a new line

### Example

::tweet{id="20"}
::

The above embeds the very first tweet ever posted (by Jack Dorsey on March 21, 2006).

### Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string/number | required | Tweet ID |
| `conversation` | `none`/`all` | `none` | Show conversation thread |
| `cards` | `hidden`/`visible` | `visible` | Show link cards |
| `align` | `left`/`center`/`right` | `center` | Alignment |
| `width` | number | `550` | Max width in pixels |
| `scale` | number | `1` | Scale factor for larger display |

### Larger Tweet Example

For a larger, more prominent tweet display (like Slidev):

`::tweet{id="20" scale="1.2"}` followed by `::` on a new line

### Finding Tweet IDs

The tweet ID is the number at the end of a tweet URL:

- `https://twitter.com/jack/status/20` → ID is `20`
- `https://x.com/elonmusk/status/1234567890` → ID is `1234567890`

## Theme Support

Both components automatically adapt to your current color mode:

- **YouTube**: Uses privacy-enhanced mode with rounded corners
- **Tweets**: Re-render with Twitter's dark/light theme when you toggle color mode

## Print Support

Embeds are print-friendly:

- YouTube shows a placeholder with the video URL
- Tweets render as static content with a link to view on X

## Tips

- Use `maxWidth` on YouTube to prevent videos from stretching too wide
- Use `scale` on tweets for presentations or hero sections
- Both components lazy-load for better page performance
- For accessibility, both include proper titles and fallback content
