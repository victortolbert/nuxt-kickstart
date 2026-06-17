<template>
  <full-calendar :options="calendarOptions"></full-calendar>
</template>

<script setup lang="ts">
import type { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core'
import type { DateClickArg } from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'

// Event drop/resize types
interface EventDropInfo {
  event: { id: string, title: string, start: Date | null, end: Date | null, extendedProps: Record<string, unknown> }
  oldEvent: { id: string, title: string, start: Date | null, end: Date | null, extendedProps: Record<string, unknown> }
  revert: () => void
}

interface EventResizeInfo {
  event: { id: string, title: string, start: Date | null, end: Date | null, extendedProps: Record<string, unknown> }
  oldEvent: { id: string, title: string, start: Date | null, end: Date | null, extendedProps: Record<string, unknown> }
  revert: () => void
}

const props = withDefaults(defineProps<{
  events?: CalendarOptions['events']
  initialView?: string
  headerToolbar?: CalendarOptions['headerToolbar']
  editable?: boolean
  selectable?: boolean
  selectMirror?: boolean
  dayMaxEvents?: boolean | number
  weekends?: boolean
  height?: string | number
}>(), {
  events: () => [],
  initialView: 'dayGridMonth',
  headerToolbar: () => ({
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
  }),
  editable: false,
  selectable: false,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  height: 'auto',
})

const emit = defineEmits<{
  dateClick: [info: DateClickArg]
  eventClick: [info: EventClickArg]
  eventDrop: [info: EventDropInfo]
  eventResize: [info: EventResizeInfo]
  select: [info: DateSelectArg]
}>()

const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: props.initialView,
  headerToolbar: props.headerToolbar,
  buttonText: {
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    list: 'List',
  },
  titleFormat: { year: 'numeric', month: 'long' },
  events: props.events,
  editable: props.editable,
  selectable: props.selectable,
  selectMirror: props.selectMirror,
  dayMaxEvents: props.dayMaxEvents,
  weekends: props.weekends,
  height: props.height,
  dateClick: (info: DateClickArg) => emit('dateClick', info),
  eventClick: (info: EventClickArg) => emit('eventClick', info),
  eventDrop: (info: EventDropInfo) => emit('eventDrop', info),
  eventResize: (info: EventResizeInfo) => emit('eventResize', info),
  select: (info: DateSelectArg) => emit('select', info),
}))
</script>

<style>
/* FullCalendar theme overrides to match Nuxt UI */
.fc {
  /* Core colors */
  --fc-border-color: var(--ui-border);
  --fc-page-bg-color: var(--ui-bg);
  --fc-neutral-bg-color: var(--ui-bg-muted);

  /* Button styling */
  --fc-button-bg-color: var(--ui-bg-elevated);
  --fc-button-border-color: var(--ui-border);
  --fc-button-text-color: var(--ui-text);
  --fc-button-hover-bg-color: var(--ui-bg-accented);
  --fc-button-hover-border-color: var(--ui-border);
  --fc-button-active-bg-color: var(--color-primary-500);
  --fc-button-active-border-color: var(--color-primary-500);
  --fc-button-active-text-color: white;

  /* Today highlight - using color-mix for better compatibility */
  --fc-today-bg-color: color-mix(in oklch, var(--color-primary-500) 15%, transparent);

  /* Event colors */
  --fc-event-bg-color: var(--color-primary-500);
  --fc-event-border-color: var(--color-primary-600);
  --fc-event-text-color: white;

  /* List view specific */
  --fc-list-event-hover-bg-color: var(--ui-bg-accented);

  /* Non-business hours */
  --fc-non-business-color: var(--ui-bg-muted);

  /* Highlight (selection) */
  --fc-highlight-color: color-mix(in oklch, var(--color-primary-500) 25%, transparent);

  /* More link */
  --fc-more-link-bg-color: var(--ui-bg-elevated);
  --fc-more-link-text-color: var(--ui-text-muted);
}

/* Toolbar buttons */
.fc .fc-button {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0;
  transition: background-color 0.15s, border-color 0.15s;
}

.fc .fc-button:focus {
  box-shadow: 0 0 0 2px color-mix(in oklch, var(--color-primary-500) 40%, transparent);
}

.fc .fc-button-primary:not(:disabled).fc-button-active {
  color: white;
}

/* Toolbar title */
.fc .fc-toolbar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ui-text);
}

/* Table borders */
.fc-theme-standard td,
.fc-theme-standard th {
  border-color: var(--ui-border);
}

.fc-theme-standard .fc-scrollgrid {
  border-color: var(--ui-border);
}

/* ===== DAY GRID (Month view) ===== */
.fc .fc-daygrid-day {
  background-color: var(--ui-bg);
}

.fc .fc-daygrid-day.fc-day-today {
  background-color: color-mix(in oklch, var(--color-primary-500) 15%, var(--ui-bg));
}

.fc .fc-daygrid-day-number {
  color: var(--ui-text);
}

.fc .fc-daygrid-day.fc-day-other {
  background-color: var(--ui-bg-muted);
}

.fc .fc-daygrid-day.fc-day-other .fc-daygrid-day-number {
  color: var(--ui-text-dimmed);
}

.fc .fc-daygrid-day-top {
  padding: 0.25rem;
}

/* Day cell hover state */
.fc .fc-daygrid-day:hover {
  background-color: var(--ui-bg-accented);
}

.fc .fc-daygrid-day.fc-day-today:hover {
  background-color: color-mix(in oklch, var(--color-primary-500) 20%, var(--ui-bg));
}

/* Column headers (day names) */
.fc .fc-col-header-cell {
  background-color: var(--ui-bg-muted);
}

.fc .fc-col-header-cell-cushion {
  color: var(--ui-text-muted);
  padding: 0.5rem;
}

/* ===== TIME GRID (Week/Day views) ===== */
.fc .fc-timegrid-col {
  background-color: var(--ui-bg);
}

.fc .fc-timegrid-col.fc-day-today {
  background-color: color-mix(in oklch, var(--color-primary-500) 10%, var(--ui-bg));
}

.fc .fc-timegrid-slot {
  background-color: var(--ui-bg);
}

.fc .fc-timegrid-slot-label {
  color: var(--ui-text-muted);
  background-color: var(--ui-bg);
}

.fc .fc-timegrid-axis {
  background-color: var(--ui-bg);
}

.fc .fc-timegrid-axis-cushion {
  color: var(--ui-text-muted);
}

/* Time grid divider lines */
.fc .fc-timegrid-slot-minor {
  border-color: var(--ui-border);
}

/* Non-business hours in time grid */
.fc .fc-timegrid-col.fc-non-business {
  background-color: var(--ui-bg-muted);
}

/* ===== EVENT STYLING ===== */
.fc .fc-event {
  border-radius: 0;
}

.fc .fc-daygrid-event {
  border-radius: 0;
  padding: 0.125rem 0.25rem;
}

.fc .fc-daygrid-dot-event .fc-event-title {
  color: var(--ui-text);
}

/* Time grid events */
.fc .fc-timegrid-event {
  border-radius: 0;
}

.fc .fc-timegrid-event .fc-event-main {
  padding: 0.25rem;
}

.fc .fc-timegrid-event .fc-event-time,
.fc .fc-timegrid-event .fc-event-title {
  color: white;
}

/* ===== THEME-AWARE EVENT COLORS ===== */
/* Primary color (uses theme's primary) */
.fc .fc-event.fc-event-primary,
.fc .fc-event.fc-event-primary .fc-event-main {
  background-color: var(--color-primary-500);
  border-color: var(--color-primary-600);
}

.fc .fc-daygrid-dot-event.fc-event-primary .fc-daygrid-event-dot {
  border-color: var(--color-primary-500);
}

.fc .fc-list-event.fc-event-primary .fc-list-event-dot {
  border-color: var(--color-primary-500);
  background-color: var(--color-primary-500);
}

/* Accent colors (use theme's chart colors for variety) */
.fc .fc-event.fc-event-accent-1,
.fc .fc-event.fc-event-accent-1 .fc-event-main {
  background-color: var(--color-chart-1);
  border-color: color-mix(in oklch, var(--color-chart-1) 80%, black);
}

.fc .fc-daygrid-dot-event.fc-event-accent-1 .fc-daygrid-event-dot,
.fc .fc-list-event.fc-event-accent-1 .fc-list-event-dot {
  border-color: var(--color-chart-1);
  background-color: var(--color-chart-1);
}

.fc .fc-event.fc-event-accent-2,
.fc .fc-event.fc-event-accent-2 .fc-event-main {
  background-color: var(--color-chart-2);
  border-color: color-mix(in oklch, var(--color-chart-2) 80%, black);
}

.fc .fc-daygrid-dot-event.fc-event-accent-2 .fc-daygrid-event-dot,
.fc .fc-list-event.fc-event-accent-2 .fc-list-event-dot {
  border-color: var(--color-chart-2);
  background-color: var(--color-chart-2);
}

.fc .fc-event.fc-event-accent-3,
.fc .fc-event.fc-event-accent-3 .fc-event-main {
  background-color: var(--color-chart-3);
  border-color: color-mix(in oklch, var(--color-chart-3) 80%, black);
}

.fc .fc-daygrid-dot-event.fc-event-accent-3 .fc-daygrid-event-dot,
.fc .fc-list-event.fc-event-accent-3 .fc-list-event-dot {
  border-color: var(--color-chart-3);
  background-color: var(--color-chart-3);
}

.fc .fc-event.fc-event-accent-4,
.fc .fc-event.fc-event-accent-4 .fc-event-main {
  background-color: var(--color-chart-4);
  border-color: color-mix(in oklch, var(--color-chart-4) 80%, black);
}

.fc .fc-daygrid-dot-event.fc-event-accent-4 .fc-daygrid-event-dot,
.fc .fc-list-event.fc-event-accent-4 .fc-list-event-dot {
  border-color: var(--color-chart-4);
  background-color: var(--color-chart-4);
}

.fc .fc-event.fc-event-accent-5,
.fc .fc-event.fc-event-accent-5 .fc-event-main {
  background-color: var(--color-chart-5);
  border-color: color-mix(in oklch, var(--color-chart-5) 80%, black);
}

.fc .fc-daygrid-dot-event.fc-event-accent-5 .fc-daygrid-event-dot,
.fc .fc-list-event.fc-event-accent-5 .fc-list-event-dot {
  border-color: var(--color-chart-5);
  background-color: var(--color-chart-5);
}

/* Ensure event text is readable on all accent colors */
.fc .fc-event.fc-event-accent-1 .fc-event-time,
.fc .fc-event.fc-event-accent-1 .fc-event-title,
.fc .fc-event.fc-event-accent-2 .fc-event-time,
.fc .fc-event.fc-event-accent-2 .fc-event-title,
.fc .fc-event.fc-event-accent-3 .fc-event-time,
.fc .fc-event.fc-event-accent-3 .fc-event-title,
.fc .fc-event.fc-event-accent-4 .fc-event-time,
.fc .fc-event.fc-event-accent-4 .fc-event-title,
.fc .fc-event.fc-event-accent-5 .fc-event-time,
.fc .fc-event.fc-event-accent-5 .fc-event-title {
  color: white;
  text-shadow: 0 1px 2px rgb(0 0 0 / 20%);
}

/* List view - container */
.fc .fc-list {
  border-color: var(--ui-border);
}

/* List view - day header */
.fc .fc-list-day-cushion {
  background-color: var(--ui-bg-muted);
  color: var(--ui-text);
}

.fc .fc-list-day-text,
.fc .fc-list-day-side-text {
  color: var(--ui-text);
}

/* List view - event rows */
.fc .fc-list-event {
  cursor: pointer;
}

.fc .fc-list-event td {
  border-color: var(--ui-border);
  padding: 0.5rem 0.75rem;
  background-color: var(--ui-bg);
}

/* List view - event dot (the colored indicator) */
.fc .fc-list-event-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border-width: 5px;
  border-style: solid;
  border-color: var(--color-primary-500);
  box-sizing: border-box;
}

/* Ensure dot is visible in graphic cell */
.fc .fc-list-event-graphic {
  padding: 0.5rem;
  vertical-align: middle;
}

/* List view - time column (includes "all-day" text) */
.fc .fc-list-event-time {
  color: var(--ui-text);
  font-weight: 500;
  white-space: nowrap;
}

.fc .fc-list-event-title {
  color: var(--ui-text);
}

.fc .fc-list-event-title a {
  color: var(--ui-text);
}

/* List view - hover state (critical for dark mode accessibility) */
.fc .fc-list-event:hover td {
  background-color: var(--ui-bg-accented);
}

.fc .fc-list-event:hover .fc-list-event-time {
  color: var(--ui-text);
}

.fc .fc-list-event:hover .fc-list-event-title,
.fc .fc-list-event:hover .fc-list-event-title a {
  color: var(--ui-text);
}

/* Ensure dot remains visible on hover */
.fc .fc-list-event:hover .fc-list-event-dot {
  box-shadow: 0 0 0 2px var(--ui-bg-accented);
}

/* List view - empty state */
.fc .fc-list-empty {
  background-color: var(--ui-bg);
}

.fc .fc-list-empty-cushion {
  color: var(--ui-text-muted);
}

/* Popover (more events popup) */
.fc .fc-popover {
  background-color: var(--ui-bg-elevated);
  border-color: var(--ui-border);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.fc .fc-popover-header {
  background-color: var(--ui-bg-muted);
  color: var(--ui-text);
}

.fc .fc-popover-body {
  background-color: var(--ui-bg-elevated);
}

/* More link */
.fc .fc-daygrid-more-link {
  color: var(--ui-text-muted);
}

.fc .fc-daygrid-more-link:hover {
  color: var(--ui-text);
  background-color: var(--ui-bg-accented);
}

/* Now indicator (current time line) */
.fc .fc-timegrid-now-indicator-line {
  border-color: var(--color-primary-500);
}

.fc .fc-timegrid-now-indicator-arrow {
  border-color: var(--color-primary-500);
  border-top-color: transparent;
  border-bottom-color: transparent;
}

/* Week number */
.fc .fc-daygrid-week-number {
  color: var(--ui-text-dimmed);
}

/* ===== SCROLLGRID BACKGROUNDS ===== */
.fc .fc-scrollgrid {
  background-color: var(--ui-bg);
}

.fc .fc-scrollgrid-section-header > * {
  background-color: var(--ui-bg-muted);
}

.fc .fc-scrollgrid-section-body > * {
  background-color: var(--ui-bg);
}

/* ===== DARK MODE OVERRIDES ===== */
.dark .fc .fc-button-primary:not(:disabled).fc-button-active {
  color: white;
}

.dark .fc .fc-list-event:hover td {
  background-color: var(--ui-bg-accented);
}

/* Dark mode - list view text contrast */
.dark .fc .fc-list-event-time {
  color: var(--ui-text);
}

.dark .fc .fc-list-event-title,
.dark .fc .fc-list-event-title a {
  color: var(--ui-text);
}

/* Dark mode - ensure dot is visible */
.dark .fc .fc-list-event-dot {
  box-shadow: 0 0 0 1px var(--ui-bg);
}

/* Dark mode - ensure today is visible */
.dark .fc .fc-daygrid-day.fc-day-today {
  background-color: color-mix(in oklch, var(--color-primary-500) 20%, var(--ui-bg));
}

.dark .fc .fc-timegrid-col.fc-day-today {
  background-color: color-mix(in oklch, var(--color-primary-500) 15%, var(--ui-bg));
}

/* Dark mode - other days (adjacent months) */
.dark .fc .fc-daygrid-day.fc-day-other {
  background-color: var(--ui-bg-muted);
}

/* ===== FOCUS STYLES FOR ACCESSIBILITY ===== */
.fc .fc-event:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.fc .fc-daygrid-day:focus-within {
  outline: 2px solid color-mix(in oklch, var(--color-primary-500) 60%, transparent);
  outline-offset: -2px;
}

/* ===== ALL DAY SECTION ===== */
.fc .fc-daygrid-body {
  background-color: var(--ui-bg);
}

.fc .fc-timegrid-divider {
  background-color: var(--ui-bg-muted);
  border-color: var(--ui-border);
}

/* All-day row in week/day view */
.fc .fc-daygrid-body-natural .fc-daygrid-day-events {
  margin-bottom: 0;
}
</style>
