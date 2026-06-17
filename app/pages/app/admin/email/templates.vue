<template>
  <div class="p-4 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold">
        Email Templates
      </h1>
      <p class="text-sm text-muted mt-1">
        Preview and send the Maizzle (Vue) email templates in <code>app/emails/</code>.
      </p>
    </div>

    <div v-if="templates.length" class="flex flex-col lg:flex-row gap-6">
      <!-- Left: picker + send form -->
      <aside class="lg:w-80 shrink-0 space-y-6">
        <u-card :ui="{ body: 'p-4 space-y-3' }">
          <h2 class="font-semibold">
            Template
          </h2>
          <div class="flex flex-col gap-1">
            <u-button
              v-for="name in templates"
              :key="name"
              :label="name"
              :icon="resolveIcon('mail')"
              :color="selected === name ? 'primary' : 'neutral'"
              :variant="selected === name ? 'subtle' : 'ghost'"
              class="justify-start"
              @click="selected = name"
            ></u-button>
          </div>
        </u-card>

        <u-card :ui="{ body: 'p-4 space-y-4' }">
          <h2 class="font-semibold">
            Send test
          </h2>
          <u-form-field label="Recipients" help="One per line or comma-separated.">
            <u-textarea
              v-model="recipientsText"
              :rows="3"
              placeholder="you@example.com"
              class="w-full"
            ></u-textarea>
          </u-form-field>

          <u-form-field label="Subject" help="Optional — overrides the template's subject.">
            <u-input
              v-model="subject"
              placeholder="(template default)"
              class="w-full"
            ></u-input>
          </u-form-field>

          <u-form-field label="Personalization data (JSON)" help="e.g { &quot;user&quot;: &quot;Alex&quot;, &quot;code&quot;: &quot;482913&quot; }">
            <u-textarea
              v-model="dataText"
              :rows="3"
              placeholder="{}"
              class="w-full font-mono text-xs"
            ></u-textarea>
          </u-form-field>

          <u-button
            :icon="resolveIcon('send')"
            :loading="sending"
            block
            @click="send"
          >
            Send
          </u-button>
        </u-card>
      </aside>

      <!-- Right: live preview -->
      <section class="flex-1 min-w-0">
        <u-card :ui="{ body: 'p-0' }">
          <div class="flex items-center justify-between border-b border-default px-4 py-2">
            <span class="text-sm text-muted">Preview: <code>{{ selected }}.vue</code></span>
            <div class="flex items-center gap-2">
              <u-button
                :icon="resolveIcon('reload')"
                color="neutral"
                variant="ghost"
                size="xs"
                aria-label="Refresh preview"
                @click="refresh"
              ></u-button>
              <u-button
                :icon="resolveIcon('external')"
                :to="previewUrl"
                target="_blank"
                color="neutral"
                variant="ghost"
                size="xs"
                aria-label="Open preview in new tab"
              ></u-button>
            </div>
          </div>
          <iframe
            :key="previewKey"
            :src="previewUrl"
            title="Email preview"
            class="w-full h-[70vh] bg-white"
          />
        </u-card>
      </section>
    </div>

    <!-- Empty state -->
    <u-card v-else>
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <u-icon :name="resolveIcon('mail')" class="text-6xl text-muted mb-4"></u-icon>
        <h2 class="text-lg font-semibold mb-2">
          No email templates
        </h2>
        <p class="text-sm text-muted">
          Add a <code>.vue</code> file to <code>app/emails/</code> to get started.
        </p>
      </div>
    </u-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
})

useHead({ title: 'Email Templates' })

const { resolveIcon } = useAppearance()
const toast = useToast()

const { data } = await useAsyncData('maizzle-templates', () =>
  $fetch<{ templates: string[] }>('/api/email/maizzle'))

const templates = computed(() => data.value?.templates ?? [])
const selected = ref(templates.value[0] ?? '')
watch(templates, (list) => {
  if (!selected.value && list.length)
    selected.value = list[0]!
})

const recipientsText = ref('')
const subject = ref('')
const dataText = ref('')
const sending = ref(false)

const previewKey = ref(0)
const previewUrl = computed(() => `/api/email/maizzle/${selected.value}`)
// Reload the iframe when the selected template changes or on manual refresh.
watch(selected, () => previewKey.value++)
function refresh() {
  previewKey.value++
}

async function send() {
  const recipients = recipientsText.value
    .split(/[\n,]/)
    .map(s => s.trim())
    .filter(Boolean)

  if (recipients.length === 0) {
    toast.add({ title: 'Add at least one recipient', color: 'warning' })
    return
  }

  let parsedData: Record<string, unknown> | undefined
  if (dataText.value.trim()) {
    try {
      parsedData = JSON.parse(dataText.value)
    }
    catch {
      toast.add({ title: 'Personalization data is not valid JSON', color: 'error' })
      return
    }
  }

  sending.value = true
  try {
    const res = await $fetch<{ sent: number, total: number, errors?: string[] }>(
      '/api/email/maizzle/send',
      {
        method: 'POST',
        body: {
          template: selected.value,
          recipients,
          subject: subject.value || undefined,
          data: parsedData,
        },
      },
    )
    toast.add({
      title: `Sent ${res.sent} of ${res.total}`,
      description: res.errors?.length ? res.errors.join('; ') : undefined,
      color: res.errors?.length ? 'warning' : 'success',
    })
  }
  catch (err) {
    toast.add({
      title: 'Send failed',
      description: err instanceof Error ? err.message : 'Unknown error',
      color: 'error',
    })
  }
  finally {
    sending.value = false
  }
}
</script>
