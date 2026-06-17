// examples
import { examplesEpisodes } from './examples/episodes'
import { examplesPodcasts } from './examples/podcasts'

// publishing
import { guides } from './publishing/guides'
import { meta } from './publishing/meta'
import { posts } from './publishing/posts'

import { apps } from './registries/apps'
// registries
import { blocks } from './registries/blocks'
import { tech } from './registries/tech'

// systems
import { emailAnalytics, emailDrafts, emailLists } from './systems/email'

export const collections = {
  // publishing
  guides,
  posts,
  meta,

  // registries
  tech,
  apps,
  blocks,

  // email subsystem
  emailLists,
  emailDrafts,
  emailAnalytics,

  // examples
  examplesPodcasts,
  examplesEpisodes,
}
