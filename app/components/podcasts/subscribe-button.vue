<template>
  <u-button
    :icon="resolveIcon('bookmark')"
    :label="subscribed ? 'Subscribed' : 'Subscribe'"
    :color="subscribed ? 'primary' : 'neutral'"
    :loading="loading"
    @click="toggleSubscribe"
  ></u-button>
</template>

<script setup lang="ts">
const props = defineProps<{
  podcastSlug: string
  initialSubscribed?: boolean
}>()

const emit = defineEmits<{
  subscribe: []
  unsubscribe: []
}>()

const { resolveIcon } = useAppearance()

const subscribed = ref(props.initialSubscribed ?? false)
const loading = ref(false)
const subscriptionId = ref<number | null>(null)

// Subscription item type
interface Subscription {
  id: number
  podcastSlug: string
}

// Fetch subscription status on mount
onMounted(async () => {
  try {
    const response = await $fetch<Subscription[]>('/api/podcasts/subscriptions')
    const subscription = response.find((sub: Subscription) => sub.podcastSlug === props.podcastSlug)
    if (subscription) {
      subscribed.value = true
      subscriptionId.value = subscription.id
    }
  }
  catch (error) {
    console.error('Failed to fetch subscription status:', error)
  }
})

async function toggleSubscribe() {
  loading.value = true

  try {
    if (subscribed.value) {
      // Unsubscribe
      if (subscriptionId.value) {
        await $fetch(`/api/podcasts/subscriptions/${subscriptionId.value}`, {
          method: 'DELETE',
        })
        subscribed.value = false
        subscriptionId.value = null
        emit('unsubscribe')
      }
    }
    else {
      // Subscribe
      const response = await $fetch('/api/podcasts/subscriptions', {
        method: 'POST',
        body: { podcastSlug: props.podcastSlug },
      })
      if (response) {
        subscribed.value = true
        subscriptionId.value = response.id
        emit('subscribe')
      }
    }
  }
  catch (error) {
    console.error('Failed to toggle subscription:', error)
    // Revert optimistic update on error
    subscribed.value = !subscribed.value
  }
  finally {
    loading.value = false
  }
}
</script>
