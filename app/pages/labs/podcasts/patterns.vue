<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">
        Cruddy by Design Patterns
      </h1>
      <p class="text-lg text-muted mb-4">
        This podcast app demonstrates four key REST API design patterns from Adam Wathan's "Cruddy by Design" talk,
        translated from Laravel to Nuxt with Nuxt Content.
      </p>
      <div class="flex gap-4 flex-wrap">
        <u-button
          to="https://www.youtube.com/watch?v=MF0jFKvS4SI"
          target="_blank"
          rel="noopener noreferrer"
          icon="i-tabler-brand-youtube"
          color="neutral"
          variant="outline"
        >
          Watch Original Talk
        </u-button>
        <u-button
          to="https://github.com/adamwathan/laracon2017"
          target="_blank"
          rel="noopener noreferrer"
          icon="i-tabler-brand-github"
          color="neutral"
          variant="outline"
        >
          View Original Laravel Code
        </u-button>
        <u-button
          to="/labs/podcasts"
          :icon="resolveIcon('arrowLeft')"
          color="neutral"
          variant="ghost"
        >
          Back to Podcast App
        </u-button>
      </div>
    </div>

    <div class="space-y-12">
      <div
        v-for="pattern in patterns"
        :key="pattern.id"
        class="border rounded-lg p-6"
      >
        <div class="mb-6">
          <div class="flex items-start gap-4 mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl shrink-0">
              {{ pattern.id }}
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold mb-2">
                {{ pattern.title }}
              </h2>
              <p class="text-muted mb-4">
                {{ pattern.description }}
              </p>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="border-l-2 border-red-500 pl-4">
                  <div class="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">
                    Problem
                  </div>
                  <div class="text-sm text-muted">
                    {{ pattern.problem }}
                  </div>
                </div>
                <div class="border-l-2 border-green-500 pl-4">
                  <div class="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">
                    Solution
                  </div>
                  <div class="text-sm text-muted">
                    {{ pattern.solution }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div
            v-for="(example, idx) in pattern.examples"
            :key="idx"
            class="bg-muted/50 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold">
                {{ example.label }}
              </h3>
              <u-badge
                color="neutral"
                variant="subtle"
                size="sm"
              >
                {{ example.path }}
              </u-badge>
            </div>
            <pre class="bg-black/80 text-green-400 p-4 rounded-md overflow-x-auto text-sm"><code>{{ example.code }}</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12 border-t pt-8">
      <h2 class="text-2xl font-bold mb-4">
        Key Takeaways
      </h2>
      <ul class="space-y-3 text-muted">
        <li class="flex gap-3">
          <u-icon :name="resolveIcon('check')" class="text-green-500 shrink-0 mt-0.5"></u-icon>
          <span><strong>Think in resources, not actions.</strong> Every URL should represent a resource (noun), not an action (verb).</span>
        </li>
        <li class="flex gap-3">
          <u-icon :name="resolveIcon('check')" class="text-green-500 shrink-0 mt-0.5"></u-icon>
          <span><strong>Embrace standard CRUD operations.</strong> Store (POST), Show (GET), Update (PUT), Destroy (DELETE) cover most use cases.</span>
        </li>
        <li class="flex gap-3">
          <u-icon :name="resolveIcon('check')" class="text-green-500 shrink-0 mt-0.5"></u-icon>
          <span><strong>Create new resources instead of custom actions.</strong> Publishing is creating a published-episode, not a custom /publish action.</span>
        </li>
        <li class="flex gap-3">
          <u-icon :name="resolveIcon('check')" class="text-green-500 shrink-0 mt-0.5"></u-icon>
          <span><strong>Let URLs reveal your domain model.</strong> Good resource modeling makes your API self-documenting.</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const { resolveIcon } = useAppearance()

const patterns = [
  {
    id: 1,
    title: 'Nested Resources Get Dedicated Routes',
    description: 'Instead of treating nested resources as actions on the parent, give them their own dedicated routes and controllers.',
    problem: 'Coupling nested resources to parent controllers leads to bloated, unfocused code.',
    solution: 'Episodes are a first-class resource with their own dedicated endpoints.',
    examples: [
      {
        label: 'List episodes for podcast',
        path: '/api/podcasts/[podcastId]/episodes/index.get.ts',
        code: `// Dedicated route for listing episodes
// GET /api/podcasts/full-stack-radio/episodes
export default defineEventHandler(async (event) => {
  const podcastId = getRouterParam(event, 'podcastId')
  const episodes = await queryCollection(event, 'examplesEpisodes')
    .where('podcastSlug', podcastId)
    .where('status', 'published')
    .all()
  return episodes
})`,
      },
      {
        label: 'Get single episode',
        path: '/api/podcasts/[podcastId]/episodes/[episodeId].get.ts',
        code: `// Dedicated route for single episode
// GET /api/podcasts/full-stack-radio/episodes/episode-1
export default defineEventHandler(async (event) => {
  const episodeId = getRouterParam(event, 'episodeId')
  const episode = await queryCollection(event, 'examplesEpisodes')
    .where('slug', episodeId)
    .first()
  return episode
})`,
      },
    ],
  },
  {
    id: 2,
    title: 'Properties Edited Independently Become Separate Resources',
    description: 'When a property needs to be managed independently from its parent entity, model it as its own resource with dedicated CRUD operations.',
    problem: 'Mixing property-specific logic with general entity updates creates coupling and complexity.',
    solution: 'Cover images and playback progress have their own resource endpoints.',
    examples: [
      {
        label: 'Update cover image',
        path: '/api/podcasts/[podcastId]/cover-image.put.ts',
        code: `// Independent resource for cover image updates
// PUT /api/podcasts/full-stack-radio/cover-image
export default defineEventHandler(async (event) => {
  const podcastId = getRouterParam(event, 'podcastId')
  const formData = await readMultipartFormData(event)
  const imageFile = formData?.find(field => field.name === 'image')

  // Store image and update podcast frontmatter
  const imagePath = await saveImage(imageFile)
  await updatePodcastFrontmatter(podcastId, { coverImage: imagePath })

  return { coverImage: imagePath }
})`,
      },
      {
        label: 'Update playback progress',
        path: '/api/podcasts/playback-progress/[episodeSlug].put.ts',
        code: `// Progress is independent from episode content
// PUT /api/podcasts/playback-progress/episode-1
export default defineEventHandler(async (event) => {
  const episodeSlug = getRouterParam(event, 'episodeSlug')
  const { position, completed } = await readBody(event)

  await db.insert(playbackProgress)
    .values({ userId, episodeSlug, position, completed })
    .onConflictDoUpdate({ set: { position, completed } })

  return { success: true }
})`,
      },
    ],
  },
  {
    id: 3,
    title: 'Pivot Models Are Their Own Resource',
    description: 'Instead of treating many-to-many relationships as actions on one side, model the pivot table as its own resource with full CRUD operations.',
    problem: 'Treating subscriptions as /podcasts/[id]/subscribe creates asymmetry and limits functionality.',
    solution: 'Subscriptions are a first-class resource with list, create, and delete operations.',
    examples: [
      {
        label: 'List subscriptions',
        path: '/api/podcasts/subscriptions/index.get.ts',
        code: `// Subscriptions as a resource, not an action
// GET /api/podcasts/subscriptions
export default defineEventHandler(async (event) => {
  const userId = await getUserId(event)
  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, userId))
  return subscriptions
})`,
      },
      {
        label: 'Create subscription',
        path: '/api/podcasts/subscriptions/index.post.ts',
        code: `// POST /api/podcasts/subscriptions
export default defineEventHandler(async (event) => {
  const { podcastSlug } = await readBody(event)
  const userId = await getUserId(event)

  const subscription = await db.insert(subscriptionsTable)
    .values({ userId, podcastSlug })
    .returning()

  return subscription[0]
})`,
      },
      {
        label: 'Delete subscription',
        path: '/api/podcasts/subscriptions/[id].delete.ts',
        code: `// DELETE /api/podcasts/subscriptions/123
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  await db.delete(subscriptionsTable)
    .where(eq(subscriptionsTable.id, id))
  return { success: true }
})`,
      },
    ],
  },
  {
    id: 4,
    title: 'Different States as Different Resources',
    description: 'Instead of filtering by status or using state transition actions, model different states as separate resources with their own endpoints.',
    problem: 'State transitions as actions (publish, archive) obscure the underlying CRUD operations.',
    solution: 'Draft and published episodes are separate resources. Publishing is creating a published-episode; unpublishing is deleting it.',
    examples: [
      {
        label: 'List draft episodes',
        path: '/api/podcasts/[podcastId]/draft-episodes/index.get.ts',
        code: `// Draft episodes as a resource
// GET /api/podcasts/full-stack-radio/draft-episodes
export default defineEventHandler(async (event) => {
  const podcastId = getRouterParam(event, 'podcastId')
  const drafts = await queryCollection(event, 'examplesEpisodes')
    .where('podcastSlug', podcastId)
    .where('status', 'draft')
    .all()
  return drafts
})`,
      },
      {
        label: 'Publish episode (create published-episode)',
        path: '/api/podcasts/published-episodes/index.post.ts',
        code: `// Publishing = creating a published-episode resource
// POST /api/podcasts/published-episodes
export default defineEventHandler(async (event) => {
  const { episodeSlug } = await readBody(event)

  // Update status in markdown frontmatter
  await updateEpisodeFrontmatter(episodeSlug, { status: 'published' })

  return { success: true }
})`,
      },
      {
        label: 'Unpublish episode (delete published-episode)',
        path: '/api/podcasts/published-episodes/[id].delete.ts',
        code: `// Unpublishing = deleting a published-episode resource
// DELETE /api/podcasts/published-episodes/episode-1
export default defineEventHandler(async (event) => {
  const episodeSlug = getRouterParam(event, 'id')

  // Update status in markdown frontmatter
  await updateEpisodeFrontmatter(episodeSlug, { status: 'draft' })

  return { success: true }
})`,
      },
      {
        label: 'In-progress episodes as a resource',
        path: '/api/podcasts/in-progress-episodes.get.ts',
        code: `// Playback state as a filterable resource
// GET /api/podcasts/in-progress-episodes
export default defineEventHandler(async (event) => {
  const userId = await getUserId(event)
  const progress = await db.select()
    .from(playbackProgressTable)
    .where(and(
      eq(playbackProgressTable.userId, userId),
      gt(playbackProgressTable.position, 0),
      eq(playbackProgressTable.completed, false)
    ))
  return progress
})`,
      },
    ],
  },
]
</script>
