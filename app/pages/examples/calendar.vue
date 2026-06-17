<template>
  <div class="space-y-8">
    <div>
      <div class="flex items-center gap-2 text-sm text-muted mb-2">
        <nuxt-link to="/examples" class="hover:underline">
          Examples
        </nuxt-link>
        <u-icon :name="resolveIcon('chevronRight')" class="size-4"></u-icon>
        <span>Calendar</span>
      </div>
      <h1 class="text-3xl font-bold">
        Calendar Examples
      </h1>
      <p class="text-muted mt-2">
        FullCalendar integration with Nuxt UI styling, plus the built-in UCalendar component.
      </p>
    </div>

    <!-- Full Calendar -->
    <u-card>
      <template #header>
        <div class="flex items-center gap-2">
          <u-icon :name="resolveIcon('calendar')" class="size-5"></u-icon>
          <h2 class="text-xl font-semibold">
            Full Calendar
          </h2>
        </div>
        <p class="text-sm text-muted mt-1">
          Interactive calendar with events, multiple views, and drag-and-drop support
        </p>
      </template>

      <client-only>
        <calendar-full-calendar
          :events="calendarEvents"
          initial-view="dayGridMonth"
          :editable="true"
          :selectable="true"
          height="600px"
          @event-click="handleEventClick"
          @date-click="handleDateClick"
        ></calendar-full-calendar>
        <template #fallback>
          <div class="h-150 flex items-center justify-center bg-muted/50 rounded">
            <div class="flex items-center gap-2 text-muted">
              <u-icon :name="resolveIcon('loading')" class="size-5 animate-spin"></u-icon>
              <span>Loading calendar...</span>
            </div>
          </div>
        </template>
      </client-only>
    </u-card>

    <!-- Calendar Views Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Week View -->
      <u-card>
        <template #header>
          <div class="flex items-center gap-2">
            <u-icon :name="resolveIcon('calendarWeek')" class="size-5"></u-icon>
            <h2 class="text-xl font-semibold">
              Week View
            </h2>
          </div>
        </template>

        <client-only>
          <calendar-full-calendar
            :events="calendarEvents"
            initial-view="timeGridWeek"
            :header-toolbar="{
              left: 'prev,next',
              center: 'title',
              right: '',
            }"
            height="400px"
          ></calendar-full-calendar>
          <template #fallback>
            <div class="h-100 flex items-center justify-center bg-muted/50 rounded">
              <u-icon :name="resolveIcon('loading')" class="size-5 animate-spin text-muted"></u-icon>
            </div>
          </template>
        </client-only>
      </u-card>

      <!-- List View -->
      <u-card>
        <template #header>
          <div class="flex items-center gap-2">
            <u-icon :name="resolveIcon('list')" class="size-5"></u-icon>
            <h2 class="text-xl font-semibold">
              List View
            </h2>
          </div>
        </template>

        <client-only>
          <calendar-full-calendar
            :events="calendarEvents"
            initial-view="listWeek"
            :header-toolbar="{
              left: 'prev,next',
              center: 'title',
              right: '',
            }"
            height="400px"
          ></calendar-full-calendar>
          <template #fallback>
            <div class="h-100 flex items-center justify-center bg-muted/50 rounded">
              <u-icon :name="resolveIcon('loading')" class="size-5 animate-spin text-muted"></u-icon>
            </div>
          </template>
        </client-only>
      </u-card>
    </div>

    <!-- Nuxt UI Calendar Component -->
    <u-card>
      <template #header>
        <div class="flex items-center gap-2">
          <u-icon :name="resolveIcon('calendarMonth')" class="size-5"></u-icon>
          <h2 class="text-xl font-semibold">
            Nuxt UI Calendar
          </h2>
        </div>
        <p class="text-sm text-muted mt-1">
          Built-in UCalendar component for date picking
        </p>
      </template>

      <div class="flex flex-wrap gap-8">
        <div>
          <h3 class="text-sm font-medium mb-2">
            Single Date
          </h3>
          <u-calendar v-model="selectedDate"></u-calendar>
          <p class="text-sm text-muted mt-2">
            Selected: {{ selectedDate.toString() }}
          </p>
        </div>

        <div>
          <h3 class="text-sm font-medium mb-2">
            With Min/Max
          </h3>
          <u-calendar
            v-model="selectedDate"
            :min-value="minDate"
            :max-value="maxDate"
          ></u-calendar>
        </div>
      </div>
    </u-card>

    <!-- Event Detail Modal -->
    <u-modal
      v-model:open="isModalOpen"
      title="Event Details"
      description="View event information"
    >
      <template #content>
        <u-card v-if="selectedEvent">
          <template #header>
            <div class="flex items-center gap-3">
              <div
                class="size-4 rounded"
                :style="{ backgroundColor: selectedEvent.backgroundColor }"
              />
              <h3 class="text-lg font-semibold">
                {{ selectedEvent.title }}
              </h3>
            </div>
          </template>

          <div class="space-y-3">
            <div class="flex items-center gap-2 text-muted">
              <u-icon :name="resolveIcon('clock')" class="size-4"></u-icon>
              <span>{{ formatEventTime(selectedEvent.start, selectedEvent.allDay) }}</span>
            </div>

            <div
              v-if="selectedEvent.end && !selectedEvent.allDay"
              class="flex items-center gap-2 text-muted"
            >
              <u-icon :name="resolveIcon('clock')" class="size-4"></u-icon>
              <span>{{ formatEventTime(selectedEvent.end, false) }}</span>
            </div>

            <u-badge
              v-if="selectedEvent.allDay"
              label="All Day"
              color="info"
              size="sm"
            ></u-badge>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <u-button
                label="Edit"
                color="neutral"
                variant="soft"
                :icon="resolveIcon('edit')"
              ></u-button>
              <u-button
                label="Close"
                @click="isModalOpen = false"
              ></u-button>
            </div>
          </template>
        </u-card>
      </template>
    </u-modal>
  </div>
</template>

<script setup lang="ts">
import type { EventClickArg } from '@fullcalendar/core'
import type { DateClickArg } from '@fullcalendar/interaction'
import type { CalendarDate, DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'

// Selected event type for modal display
interface SelectedEvent {
  title: string
  start: Date | null
  end: Date | null
  allDay: boolean
  backgroundColor: string
}

const { calendarEvents } = useSampleData()
const { resolveIcon } = useAppearance()

// Modal state for event details
const selectedEvent = ref<SelectedEvent | null>(null)
const isModalOpen = ref(false)

// Handle event click
function handleEventClick(info: EventClickArg) {
  selectedEvent.value = {
    title: info.event.title,
    start: info.event.start,
    end: info.event.end,
    allDay: info.event.allDay,
    backgroundColor: info.event.backgroundColor || '#3b82f6',
  }
  isModalOpen.value = true
}

// Handle date click (for creating new events)
function handleDateClick(_info: DateClickArg) {
  // TODO: Implement new event creation UI
}

// Format date for display
function formatEventTime(date: Date | null, allDay: boolean): string {
  if (!date)
    return ''
  if (allDay) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// Nuxt UI Calendar (smaller date picker style)
// CalendarDate is the type from @internationalized/date used by Nuxt UI's UCalendar
const selectedDate = shallowRef<DateValue>(today(getLocalTimeZone()))
const minDate = computed<CalendarDate>(() => today(getLocalTimeZone()))
const maxDate = computed<CalendarDate>(() => today(getLocalTimeZone()).add({ days: 30 }))
</script>
