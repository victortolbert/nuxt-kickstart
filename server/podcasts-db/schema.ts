import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const subscriptions = sqliteTable('subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  podcastSlug: text('podcast_slug').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const playbackProgress = sqliteTable('playback_progress', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  episodeSlug: text('episode_slug').notNull(),
  position: integer('position').notNull(), // Position in seconds
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})
