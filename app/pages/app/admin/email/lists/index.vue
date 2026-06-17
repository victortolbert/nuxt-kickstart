<template>
  <div class="p-4 space-y-6">
    <!-- Header with New button -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">
          Email Lists
        </h1>
        <p class="text-sm text-muted mt-1">
          Manage recipient lists for email campaigns
        </p>
      </div>

      <u-button
        to="/app/admin/email/lists/new"
        :icon="resolveIcon('plus')"
        size="sm"
      >
        Create New List
      </u-button>
    </div>

    <!-- Lists Grid -->
    <div v-if="emailLists && emailLists.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <u-card v-for="list in emailLists" :key="list.path">
        <nuxt-link :to="`/admin/email/lists/${list.path.split('/').pop()}`" class="block">
          <div class="space-y-3">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <h2 class="font-semibold truncate">
                  {{ list.name || list.title }}
                </h2>
                <p v-if="list.description" class="text-sm text-muted line-clamp-2 mt-1">
                  {{ list.description }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-2 border-t border-[var(--ui-border)]">
              <u-icon :name="resolveIcon('users')" class="text-muted"></u-icon>
              <span class="text-sm text-muted">
                {{ list.contacts?.length || 0 }} {{ list.contacts?.length === 1 ? 'contact' : 'contacts' }}
              </span>
            </div>
          </div>
        </nuxt-link>
      </u-card>
    </div>

    <!-- Empty state -->
    <u-card v-else>
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <u-icon :name="resolveIcon('mailOpened')" class="text-6xl text-muted mb-4"></u-icon>
        <h2 class="text-lg font-semibold mb-2">
          No email lists yet
        </h2>
        <p class="text-sm text-muted mb-4">
          Create your first recipient list to start sending emails
        </p>
        <u-button
          to="/app/admin/email/lists/new"
          :icon="resolveIcon('plus')"
          size="sm"
        >
          Create New List
        </u-button>
      </div>
    </u-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
})

const { resolveIcon } = useAppearance()

const { data: emailLists } = await useAsyncData('email-lists', () =>
  queryCollection('emailLists').order('title', 'ASC').all())
</script>
