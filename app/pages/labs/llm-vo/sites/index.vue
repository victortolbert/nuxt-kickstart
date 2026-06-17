<template>
  <div class="space-y-8">
    <nav class="flex items-center gap-2 text-sm text-muted">
      <nuxt-link to="/labs/llm-vo" class="hover:underline">
        {{ t('pages.llmOptimizer.breadcrumb') }}
      </nuxt-link>
      <u-icon
        :name="resolveIcon('chevronRight')"
        class="size-4"
        aria-hidden="true"
      ></u-icon>
      <span>{{ t('pages.llmOptimizer.sites.crumb') }}</span>
    </nav>

    <section>
      <h1 class="text-3xl font-bold">
        {{ t('pages.llmOptimizer.sites.title') }}
      </h1>
      <p class="text-muted mt-1">
        {{ t('pages.llmOptimizer.sites.subtitle') }}
      </p>
    </section>

    <form class="flex flex-wrap items-end gap-3" @submit.prevent="create">
      <u-form-field
        :label="t('pages.llmOptimizer.sites.nameLabel')"
        name="name"
        class="flex-1 min-w-[14rem]"
      >
        <u-input
          v-model="form.name"
          name="name"
          :placeholder="t('pages.llmOptimizer.sites.namePlaceholder')"
          autocomplete="off"
        ></u-input>
      </u-form-field>
      <u-form-field
        :label="t('pages.llmOptimizer.sites.urlLabel')"
        name="baseUrl"
        class="flex-1 min-w-[14rem]"
      >
        <u-input
          v-model="form.baseUrl"
          name="baseUrl"
          type="url"
          inputmode="url"
          spellcheck="false"
          placeholder="https://example.com"
          autocomplete="off"
        ></u-input>
      </u-form-field>
      <u-button
        type="submit"
        color="primary"
        :loading="creating"
        :disabled="!form.name.trim() || !form.baseUrl.trim()"
        :icon="resolveIcon('plus')"
        :label="t('pages.llmOptimizer.sites.add')"
        class="h-fit"
      ></u-button>
    </form>
    <p
      v-if="formError"
      class="text-sm text-error"
      role="alert"
      aria-live="polite"
    >
      {{ formError }}
    </p>

    <div v-if="siteList.length" class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))]">
      <u-card
        v-for="site in siteList"
        :key="site.id"
        variant="subtle"
      >
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold tabular-nums" :style="{ color: gradeColorVar(site.latestGrade) }">
            {{ site.latestGrade ?? '—' }}
          </span>
          <u-button
            color="neutral"
            variant="ghost"
            size="xs"
            :icon="resolveIcon('trash')"
            :aria-label="t('common.delete')"
            @click="askDelete(site)"
          ></u-button>
        </div>
        <nuxt-link :to="`/labs/llm-vo/sites/${site.id}`" class="mt-1.5 block text-lg font-semibold hover:underline">
          {{ site.name }}
        </nuxt-link>
        <p class="truncate text-xs text-dimmed">
          {{ displayHost(site.baseUrl) }}
        </p>
        <p class="mt-1 text-xs text-muted tabular-nums">
          <span v-if="site.latestScore !== null">{{ site.latestScore }} · </span>
          <span v-else>{{ t('pages.llmOptimizer.sites.notScanned') }} · </span>
          {{ t('pages.llmOptimizer.sites.scanCount', { count: site.scanCount }) }}
        </p>
      </u-card>
    </div>
    <p v-else class="text-muted">
      {{ t('pages.llmOptimizer.sites.empty') }}
    </p>

    <u-modal
      v-model:open="deleteOpen"
      :title="t('pages.llmOptimizer.sites.deleteTitle')"
      :description="t('pages.llmOptimizer.sites.deleteDesc')"
    >
      <template #footer>
        <u-button
          color="neutral"
          variant="ghost"
          :label="t('common.cancel')"
          @click="deleteOpen = false"
        ></u-button>
        <u-button
          color="error"
          :loading="deleting"
          :label="t('common.delete')"
          @click="confirmDelete"
        ></u-button>
      </template>
    </u-modal>
  </div>
</template>

<script setup lang="ts">
import type { Site, SiteSummary } from '#shared/types/llm-optimizer'

const { t } = useI18n()
const { resolveIcon } = useAppearance()

const { data, refresh } = await useFetch<SiteSummary[]>('/api/llm-optimizer/sites', { default: () => [] })
const siteList = computed(() => data.value ?? [])

const form = reactive({ name: '', baseUrl: '' })
const creating = ref(false)
const formError = ref('')

async function create() {
  if (!form.name.trim() || !form.baseUrl.trim())
    return
  creating.value = true
  formError.value = ''
  try {
    await $fetch('/api/llm-optimizer/sites', {
      method: 'POST',
      body: { name: form.name.trim(), baseUrl: form.baseUrl.trim() },
      signal: AbortSignal.timeout(WRITE_TIMEOUT_MS),
    })
    form.name = ''
    form.baseUrl = ''
    await refresh()
  }
  catch (err) {
    formError.value = isTimeoutError(err) ? t('common.requestTimeout') : t('pages.llmOptimizer.sites.formError')
  }
  finally {
    creating.value = false
  }
}

const deleteOpen = ref(false)
const deleting = ref(false)
const target = ref<Site | null>(null)

function askDelete(site: Site) {
  target.value = site
  deleteOpen.value = true
}

async function confirmDelete() {
  if (!target.value)
    return
  deleting.value = true
  try {
    await $fetch(`/api/llm-optimizer/sites/${target.value.id}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(WRITE_TIMEOUT_MS),
    })
    await refresh()
  }
  catch (err) {
    formError.value = isTimeoutError(err) ? t('common.requestTimeout') : t('pages.llmOptimizer.sites.formError')
  }
  finally {
    deleting.value = false
    deleteOpen.value = false
    target.value = null
  }
}

const displayHost = (url: string): string => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

useSeoMeta({ title: () => t('pages.llmOptimizer.sites.title') })
</script>
