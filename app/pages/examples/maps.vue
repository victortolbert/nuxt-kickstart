<template>
  <div class="space-y-8">
    <div>
      <div class="flex items-center gap-2 text-sm text-muted mb-2">
        <nuxt-link to="/examples" class="hover:underline">
          Examples
        </nuxt-link>
        <u-icon :name="resolveIcon('chevronRight')" class="size-4"></u-icon>
        <span>Maps</span>
      </div>
      <h1 class="text-3xl font-bold">
        Map Examples
      </h1>
      <p class="text-muted mt-2">
        Google Maps integration with @fawmi/vue-google-maps.
      </p>
    </div>

    <!-- API Key Notice -->
    <u-alert
      v-if="!apiKey"
      :icon="resolveIcon('warning')"
      color="warning"
      title="Google Maps API Key Required"
    >
      <template #description>
        Add <code class="text-xs bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded font-mono">NUXT_PUBLIC_GOOGLE_MAPS_KEY</code> to your .env file.
        <u-link
          to="https://console.cloud.google.com/apis/credentials"
          target="_blank"
          raw
          class="inline-flex items-center gap-1 ml-1 font-semibold text-black dark:text-black underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded-sm"
        >
          Create a key
          <u-icon
            :name="resolveIcon('external')"
            class="size-3"
            aria-hidden="true"
          ></u-icon>
        </u-link>
      </template>
    </u-alert>

    <!-- Main Map -->
    <u-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <u-icon :name="resolveIcon('map')" class="size-5"></u-icon>
            <h2 class="text-xl font-semibold">
              Location Map
            </h2>
          </div>
          <u-badge variant="subtle" size="sm">
            Theme: {{ theme }}
          </u-badge>
        </div>
        <p class="text-sm text-muted mt-1">
          Map styling automatically matches your current theme and color mode
        </p>
      </template>

      <client-only>
        <div
          v-if="apiKey"
          ref="mapContainerRef"
          class="relative h-125 rounded overflow-hidden bg-default map-hide-gm-fullscreen"
        >
          <g-map-map
            ref="mainMapRef"
            :center="center"
            :zoom="4"
            :map-type-id="mapConfig.mapTypeId"
            :options="mainMapOptions"
            class="w-full h-full"
          >
            <!-- Location markers + clustering are managed imperatively in
                 script (MarkerClusterer); see buildMarkers(). -->

            <!-- Marker dropped by search / locate-me -->
            <g-map-marker
              v-if="searchMarker"
              :position="searchMarker"
              :icon="primaryPinIcon"
            ></g-map-marker>

            <g-map-info-window
              v-if="selectedLocation"
              :key="selectedLocation.id"
              :position="{ lat: selectedLocation.lat, lng: selectedLocation.lng }"
              :opened="!!selectedLocation"
              @closeclick="selectedLocation = null"
            >
              <div class="gmap-info-window p-3 min-w-48">
                <div class="flex items-center gap-2 mb-2">
                  <u-icon :name="getTypeIcon(selectedLocation.type)" class="size-4 text-muted"></u-icon>
                  <span class="font-semibold text-highlighted">{{ selectedLocation.name }}</span>
                </div>
                <p class="text-sm text-muted">
                  {{ selectedLocation.description }}
                </p>
                <u-badge
                  :label="formatLabel(selectedLocation.type)"
                  size="sm"
                  class="mt-2"
                ></u-badge>
              </div>
            </g-map-info-window>
          </g-map-map>

          <!-- Places search (themed input over the map) -->
          <div class="absolute top-3 left-3 z-10 w-64 max-w-[calc(100%-5rem)]">
            <g-map-autocomplete
              placeholder="Search a place…"
              class="w-full rounded-(--ui-radius) border border-default bg-[var(--ui-bg-elevated)]/95 px-3 py-2 text-sm text-[var(--ui-text)] placeholder:text-[var(--ui-text-dimmed)] shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
              @place_changed="onPlaceChanged"
            ></g-map-autocomplete>
          </div>

          <!-- Custom themed controls (replace Google's default chrome) -->
          <div class="absolute top-3 right-3 z-10">
            <button
              type="button"
              :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
              class="flex items-center justify-center size-9 rounded-(--ui-radius) border border-default bg-[var(--ui-bg-elevated)]/90 text-[var(--ui-text-muted)] shadow-sm backdrop-blur-sm transition-colors hover:text-[var(--ui-text)] hover:bg-[var(--ui-bg-elevated)]"
              @click="toggleFullscreen"
            >
              <u-icon :name="resolveIcon(isFullscreen ? 'minimize' : 'maximize')" class="size-5"></u-icon>
            </button>
          </div>

          <div class="absolute bottom-3 right-3 z-10 flex flex-col items-end gap-2">
            <!-- Zoom in / out (connected) -->
            <div class="flex flex-col rounded-(--ui-radius) border border-default bg-[var(--ui-bg-elevated)]/90 shadow-sm backdrop-blur-sm overflow-hidden">
              <button
                type="button"
                aria-label="Zoom in"
                class="flex items-center justify-center size-9 text-[var(--ui-text-muted)] transition-colors hover:text-[var(--ui-text)] hover:bg-[var(--ui-bg-elevated)]"
                @click="zoomBy(1)"
              >
                <u-icon :name="resolveIcon('plus')" class="size-5"></u-icon>
              </button>
              <div class="h-px bg-[var(--ui-border)]" />
              <button
                type="button"
                aria-label="Zoom out"
                class="flex items-center justify-center size-9 text-[var(--ui-text-muted)] transition-colors hover:text-[var(--ui-text)] hover:bg-[var(--ui-bg-elevated)]"
                @click="zoomBy(-1)"
              >
                <u-icon :name="resolveIcon('minus')" class="size-5"></u-icon>
              </button>
            </div>

            <!-- Locate me (geolocation) -->
            <button
              type="button"
              aria-label="Use my location"
              class="flex items-center justify-center size-9 rounded-(--ui-radius) border border-default bg-[var(--ui-bg-elevated)]/90 text-[var(--ui-text-muted)] shadow-sm backdrop-blur-sm transition-colors hover:text-[var(--ui-text)] hover:bg-[var(--ui-bg-elevated)]"
              @click="locateMe"
            >
              <u-icon :name="resolveIcon('compass')" class="size-5"></u-icon>
            </button>

            <!-- Recenter -->
            <button
              type="button"
              aria-label="Recenter map"
              class="flex items-center justify-center size-9 rounded-(--ui-radius) border border-default bg-[var(--ui-bg-elevated)]/90 text-[var(--ui-text-muted)] shadow-sm backdrop-blur-sm transition-colors hover:text-[var(--ui-text)] hover:bg-[var(--ui-bg-elevated)]"
              @click="recenter"
            >
              <u-icon :name="resolveIcon('target')" class="size-5"></u-icon>
            </button>
          </div>
        </div>

        <!-- Fallback when no API key -->
        <div
          v-else
          class="h-125 flex items-center justify-center bg-muted/50 rounded"
        >
          <div class="text-center">
            <u-icon :name="resolveIcon('map')" class="size-12 text-muted mx-auto mb-3"></u-icon>
            <p class="text-muted">
              Map unavailable - API key not configured
            </p>
          </div>
        </div>

        <template #fallback>
          <div class="h-125 flex items-center justify-center bg-muted/50 rounded">
            <div class="flex items-center gap-2 text-muted">
              <u-icon :name="resolveIcon('loading')" class="size-5 animate-spin"></u-icon>
              <span>Loading map...</span>
            </div>
          </div>
        </template>
      </client-only>

      <!-- Location List -->
      <div class="mt-4 pt-4 border-t border-default">
        <h3 class="text-sm font-medium mb-3">
          Locations
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            v-for="location in locations"
            :key="location.id"
            class="flex items-start gap-3 p-3 rounded border border-default hover:bg-elevated transition-colors text-left"
            :class="{ 'ring-2 ring-primary': selectedLocation?.id === location.id }"
            @click="selectedLocation = location"
          >
            <div
              class="p-2 rounded"
              :style="{ backgroundColor: `${typeColor(location.type)}20` }"
            >
              <u-icon
                :name="getTypeIcon(location.type)"
                class="size-4"
                :style="{ color: typeColor(location.type) }"
              ></u-icon>
            </div>
            <div>
              <p class="font-medium">
                {{ location.name }}
              </p>
              <p class="text-sm text-muted">
                {{ location.description }}
              </p>
            </div>
          </button>
        </div>
      </div>
    </u-card>

    <!-- Map Configuration -->
    <u-card>
      <template #header>
        <div class="flex items-center gap-2">
          <u-icon :name="resolveIcon('settings')" class="size-5"></u-icon>
          <h2 class="text-xl font-semibold">
            Map Configuration
          </h2>
        </div>
        <p class="text-sm text-muted mt-1">
          Live-controls the Location Map above
        </p>
      </template>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
        <u-form-field
          label="Map type"
          :hint="themedMapType ? undefined : 'Imagery — theming applies to Roadmap/Terrain'"
        >
          <u-select
            v-model="mapConfig.mapTypeId"
            :items="mapTypeItems"
            class="w-full"
          ></u-select>
        </u-form-field>

        <u-form-field label="Gesture handling">
          <u-select
            v-model="mapConfig.gestureHandling"
            :items="gestureItems"
            class="w-full"
          ></u-select>
        </u-form-field>

        <u-form-field label="Zoom range">
          <div class="flex items-center gap-2">
            <u-input-number
              v-model="mapConfig.minZoom"
              :min="0"
              :max="22"
              class="w-full"
            ></u-input-number>
            <span class="text-sm text-muted">to</span>
            <u-input-number
              v-model="mapConfig.maxZoom"
              :min="0"
              :max="22"
              class="w-full"
            ></u-input-number>
          </div>
        </u-form-field>
      </div>

      <u-separator class="my-5"></u-separator>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
        <u-switch v-model="mapConfig.clustering" label="Cluster markers"></u-switch>
        <u-switch v-model="mapConfig.scrollwheel" label="Scroll to zoom"></u-switch>
        <u-switch v-model="mapConfig.draggable" label="Draggable"></u-switch>
        <u-switch v-model="mapConfig.disableDoubleClickZoom" label="Disable double-click zoom"></u-switch>
        <u-switch v-model="mapConfig.keyboardShortcuts" label="Keyboard shortcuts"></u-switch>
        <u-switch v-model="mapConfig.clickableIcons" label="Clickable POIs"></u-switch>
      </div>

      <u-separator class="my-5"></u-separator>

      <div>
        <h3 class="text-sm font-medium mb-3">
          Data layers <span class="text-muted font-normal">(Google-rendered — not themed)</span>
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
          <u-switch v-model="mapConfig.trafficLayer" label="Traffic"></u-switch>
          <u-switch v-model="mapConfig.transitLayer" label="Transit"></u-switch>
          <u-switch v-model="mapConfig.bicyclingLayer" label="Bicycling"></u-switch>
        </div>
      </div>
    </u-card>

    <!-- Map with Drawing -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Map with Circle -->
      <u-card>
        <template #header>
          <div class="flex items-center gap-2">
            <u-icon name="i-tabler-circle" class="size-5"></u-icon>
            <h2 class="text-xl font-semibold">
              Radius Overlay
            </h2>
          </div>
        </template>

        <client-only>
          <div v-if="apiKey" class="h-75 rounded overflow-hidden">
            <g-map-map
              :center="center"
              :zoom="10"
              map-type-id="roadmap"
              :options="mapOptions"
              class="w-full h-full"
            >
              <g-map-marker :position="center" :icon="primaryPinIcon"></g-map-marker>
              <g-map-circle
                :center="center"
                :radius="15000"
                :options="{
                  strokeColor: palette.primary,
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: palette.primary,
                  fillOpacity: 0.15,
                }"
              ></g-map-circle>
            </g-map-map>
          </div>
          <div
            v-else
            class="h-75 flex items-center justify-center bg-muted/50 rounded"
          >
            <p class="text-muted">
              API key required
            </p>
          </div>
        </client-only>
      </u-card>

      <!-- Map with Polyline -->
      <u-card>
        <template #header>
          <div class="flex items-center gap-2">
            <u-icon :name="resolveIcon('route')" class="size-5"></u-icon>
            <h2 class="text-xl font-semibold">
              Route Path
            </h2>
          </div>
        </template>

        <client-only>
          <div v-if="apiKey" class="h-75 rounded overflow-hidden">
            <g-map-map
              :center="{ lat: 37.0, lng: -95.0 }"
              :zoom="4"
              map-type-id="roadmap"
              :options="mapOptions"
              class="w-full h-full"
            >
              <g-map-marker
                v-for="location in locations"
                :key="location.id"
                :position="{ lat: location.lat, lng: location.lng }"
                :icon="markerIcon(location.type)"
              ></g-map-marker>
              <g-map-polyline
                :path="locations.map(l => ({ lat: l.lat, lng: l.lng }))"
                :options="{
                  strokeColor: palette.primary,
                  strokeOpacity: 0.8,
                  strokeWeight: 3,
                }"
              ></g-map-polyline>
            </g-map-map>
          </div>
          <div
            v-else
            class="h-75 flex items-center justify-center bg-muted/50 rounded"
          >
            <p class="text-muted">
              API key required
            </p>
          </div>
        </client-only>
      </u-card>
    </div>

    <!-- Usage Instructions -->
    <u-card>
      <template #header>
        <div class="flex items-center gap-2">
          <u-icon :name="resolveIcon('code')" class="size-5"></u-icon>
          <h2 class="text-xl font-semibold">
            Usage
          </h2>
        </div>
      </template>

      <div class="prose prose-sm max-w-none">
        <p>To use Google Maps, add your API key to <code>.env</code>:</p>
        <pre class="bg-muted p-3 rounded text-sm overflow-x-auto">NUXT_PUBLIC_GOOGLE_MAPS_KEY=your_api_key_here</pre>

        <p class="mt-4">
          Then use the components in your templates:
        </p>
        <pre class="bg-muted p-3 rounded text-sm overflow-x-auto">&lt;GMapMap :center="center" :zoom="10"&gt;
  &lt;GMapMarker :position="center" /&gt;
&lt;/GMapMap&gt;</pre>
      </div>
    </u-card>
  </div>
</template>

<script setup lang="ts">
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import { createMapStyles, createPinDataUri, readChartColors, readThemePalette } from '~/utils/map-styles'

const { locations } = useSampleData()
const { theme, colorMode } = useTheme()
const { resolveIcon } = useAppearance()

// Get API key from runtime config
const config = useRuntimeConfig()
const apiKey = config.public.googleMapsKey as string || ''

// Selected location for info window
const selectedLocation = ref<typeof locations[0] | null>(null)

// Compute if dark mode
const isDark = computed(() => colorMode.value === 'dark')

// Re-read the active theme's CSS variables whenever the theme or color mode
// changes, so map styling and markers track the live theme — including the
// default/system theme (which has no hardcoded palette).
const themeColors = computed(() => {
  // Touch reactive deps so this recomputes on theme / color-mode change.
  void theme.value
  void colorMode.value
  return {
    palette: readThemePalette(isDark.value),
    chart: readChartColors(),
  }
})

// Theme palette for overlays (circles, polylines, marker cut-outs)
const palette = computed(() => themeColors.value.palette)

// Theme-aware Google Maps styles
const mapStyles = computed(() => createMapStyles(palette.value))

// --- Configurable options (exposed via the Map Configuration panel) ---
type MapTypeId = 'roadmap' | 'terrain' | 'satellite' | 'hybrid'
type GestureHandling = 'cooperative' | 'greedy' | 'none' | 'auto'

const mapConfig = reactive({
  mapTypeId: 'roadmap' as MapTypeId,
  gestureHandling: 'cooperative' as GestureHandling,
  minZoom: 3,
  maxZoom: 18,
  scrollwheel: true,
  draggable: true,
  disableDoubleClickZoom: false,
  keyboardShortcuts: true,
  clickableIcons: false,
  clustering: true,
  trafficLayer: false,
  transitLayer: false,
  bicyclingLayer: false,
})

const mapTypeItems = [
  { label: 'Roadmap', value: 'roadmap' },
  { label: 'Terrain', value: 'terrain' },
  { label: 'Satellite', value: 'satellite' },
  { label: 'Hybrid', value: 'hybrid' },
]
const gestureItems = [
  { label: 'Cooperative', value: 'cooperative' },
  { label: 'Greedy', value: 'greedy' },
  { label: 'None', value: 'none' },
  { label: 'Auto', value: 'auto' },
]

// Custom map styling only applies to roadmap/terrain; satellite & hybrid show
// Google imagery and ignore it.
const themedMapType = computed(() =>
  mapConfig.mapTypeId === 'roadmap' || mapConfig.mapTypeId === 'terrain')

// Shared base options — drop the map-type, street-view, and (newer) camera
// controls everywhere; styling stays theme-aware.
const baseMapOptions = computed(() => ({
  styles: mapStyles.value,
  mapTypeControl: false,
  streetViewControl: false,
  cameraControl: false,
}))

// Smaller demo maps keep Google's lightweight zoom/fullscreen controls
const mapOptions = computed(() => ({
  ...baseMapOptions.value,
  zoomControl: true,
  fullscreenControl: true,
}))

// Main map hides Google's UI — we render our own themed controls below. Most
// controls obey these options, but Google keeps the fullscreen control here
// regardless (a library/version quirk), so it's also hidden via CSS on the
// `.map-hide-gm-fullscreen` container.
const mainMapOptions = computed(() => ({
  ...baseMapOptions.value,
  zoomControl: false,
  fullscreenControl: false,
  rotateControl: false,
  scaleControl: false,
  // Configurable behaviors (from the Map Configuration panel)
  gestureHandling: mapConfig.gestureHandling,
  minZoom: mapConfig.minZoom,
  maxZoom: mapConfig.maxZoom,
  scrollwheel: mapConfig.scrollwheel,
  draggable: mapConfig.draggable,
  disableDoubleClickZoom: mapConfig.disableDoubleClickZoom,
  keyboardShortcuts: mapConfig.keyboardShortcuts,
  clickableIcons: mapConfig.clickableIcons,
}))

// Map center (Atlanta)
const center = { lat: 33.7490, lng: -84.3880 }

// --- Custom themed controls for the main map ---
// Minimal shape of the google.maps.Map methods we drive (the SDK has no types
// installed; the map is accessed via the library's $mapPromise).
interface GMapInstance {
  getZoom: () => number | undefined
  setZoom: (zoom: number) => void
  panTo: (latLng: { lat: number, lng: number }) => void
}

const mapContainerRef = ref<HTMLElement | null>(null)
const mainMapRef = ref<{ $mapPromise?: Promise<unknown> } | null>(null)
const mapInstance = shallowRef<GMapInstance | null>(null)
const isFullscreen = ref(false)

// Resolve the underlying map once the component is ready, so our custom
// controls can drive it.
watch(mainMapRef, (comp) => {
  if (comp?.$mapPromise && !mapInstance.value) {
    comp.$mapPromise.then((m) => {
      mapInstance.value = m as GMapInstance
    })
  }
}, { immediate: true })

function zoomBy(delta: number) {
  const m = mapInstance.value
  if (m)
    m.setZoom((m.getZoom() ?? 4) + delta)
}

function recenter() {
  const m = mapInstance.value
  if (!m)
    return
  m.panTo(center)
  m.setZoom(4)
}

function toggleFullscreen() {
  const el = mapContainerRef.value
  if (!el)
    return
  if (document.fullscreenElement)
    void document.exitFullscreen().catch(() => {})
  else
    void el.requestFullscreen?.()?.catch(() => {})
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => document.addEventListener('fullscreenchange', onFullscreenChange))
onBeforeUnmount(() => document.removeEventListener('fullscreenchange', onFullscreenChange))

// --- Places search + geolocation ---
interface GPlace { geometry?: { location?: { lat: () => number, lng: () => number } } }
const searchMarker = shallowRef<{ lat: number, lng: number } | null>(null)
const toast = useToast()

function flyTo(pos: { lat: number, lng: number }, zoom = 12) {
  searchMarker.value = pos
  const m = mapInstance.value
  if (m) {
    m.panTo(pos)
    m.setZoom(zoom)
  }
}

function onPlaceChanged(place: GPlace) {
  const loc = place?.geometry?.location
  if (loc)
    flyTo({ lat: loc.lat(), lng: loc.lng() })
}

function locateMe() {
  if (!import.meta.client || !navigator.geolocation) {
    toast.add({ title: 'Geolocation is not available', color: 'error' })
    return
  }
  navigator.geolocation.getCurrentPosition(
    pos => flyTo({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 13),
    () => toast.add({ title: 'Unable to retrieve your location', color: 'error' }),
  )
}

// --- Google data layers (raw SDK; toggled from the config panel) ---
interface GLayer { setMap: (map: unknown) => void }
interface GMapsApi {
  maps?: {
    TrafficLayer: new () => GLayer
    TransitLayer: new () => GLayer
    BicyclingLayer: new () => GLayer
  }
}
const layers: { traffic?: GLayer, transit?: GLayer, bicycling?: GLayer } = {}

function syncLayers() {
  const map = mapInstance.value
  const g = (globalThis as unknown as { google?: GMapsApi }).google
  if (!map || !g?.maps)
    return
  layers.traffic ??= new g.maps.TrafficLayer()
  layers.transit ??= new g.maps.TransitLayer()
  layers.bicycling ??= new g.maps.BicyclingLayer()
  layers.traffic.setMap(mapConfig.trafficLayer ? map : null)
  layers.transit.setMap(mapConfig.transitLayer ? map : null)
  layers.bicycling.setMap(mapConfig.bicyclingLayer ? map : null)
}

watch(
  () => [mapInstance.value, mapConfig.trafficLayer, mapConfig.transitLayer, mapConfig.bicyclingLayer],
  syncLayers,
)

// Map each location type to a theme chart color, so markers stay distinct per
// type AND adapt to every theme.
const typeColorIndex: Record<string, number> = {
  office: 0,
  client: 1,
  event: 2,
  remote: 3,
}

function typeColor(type: string): string {
  const colors = themeColors.value.chart
  const idx = typeColorIndex[type] ?? 4
  return colors[idx] ?? colors[0] ?? '#808080'
}

// Theme-colored SVG pin for map markers (inner dot uses the map bg as a cut-out)
function markerIcon(type: string): string {
  return createPinDataUri(typeColor(type), palette.value.bg)
}

// Primary-colored pin for single/unspecified markers
const primaryPinIcon = computed(() => createPinDataUri(palette.value.primary, palette.value.bg))

// Location type icons
function getTypeIcon(type: string) {
  const icons: Record<string, string> = {
    office: resolveIcon('building'),
    client: resolveIcon('users'),
    event: resolveIcon('calendarEvent'),
    remote: resolveIcon('home'),
  }
  return icons[type] || resolveIcon('mapPin')
}

// --- Location markers + clustering (managed imperatively for MarkerClusterer) ---
// @fawmi's <GMapCluster> is broken against the bundled markerclusterer, so the
// location markers are created directly and clustered via @googlemaps/markerclusterer.
interface GMarker {
  setMap: (map: unknown) => void
  addListener: (event: string, cb: () => void) => void
}
function googleMaps() {
  return (globalThis as unknown as {
    google?: {
      maps?: {
        Marker: new (opts: Record<string, unknown>) => GMarker
        SymbolPath: { CIRCLE: number }
      }
    }
  }).google?.maps
}

// Themed cluster bubble: a primary-filled circle sized by, and labelled with,
// the contained marker count.
const clusterRenderer = {
  render: (cluster: { count: number, position: unknown }) => {
    const maps = googleMaps()!
    return new maps.Marker({
      position: cluster.position,
      icon: {
        path: maps.SymbolPath.CIRCLE,
        fillColor: palette.value.primary,
        fillOpacity: 0.9,
        strokeColor: palette.value.bg,
        strokeWeight: 2,
        scale: 14 + Math.min(cluster.count, 24),
      },
      label: {
        text: String(cluster.count),
        color: palette.value.bg,
        fontSize: '12px',
        fontWeight: '600',
      },
      zIndex: 1000 + cluster.count,
    })
  },
}

// MarkerClusterer extends google.maps.OverlayView, which is untyped here, so
// `setMap` isn't visible on the class type — expose it via an intersection.
type ClustererInstance = MarkerClusterer & { setMap: (map: unknown) => void }
let locationMarkers: GMarker[] = []
let clusterer: ClustererInstance | null = null

// Denser dataset for the clustering demo: a handful of points jittered around
// each metro so clusters actually form at the default zoom (the 5 canonical
// locations are continent-spread and never overlap). Deterministic offsets keep
// the layout stable across renders.
const clusterJitter: [number, number][] = [
  [0, 0],
  [0.18, 0.14],
  [-0.15, 0.2],
  [0.12, -0.19],
  [-0.2, -0.12],
  [0.06, 0.26],
  [-0.24, 0.05],
]
const clusterLocations = computed<typeof locations>(() =>
  locations.flatMap(base =>
    clusterJitter.map(([dLat, dLng], i) => ({
      ...base,
      id: `${base.id}-${i}`,
      lat: base.lat + dLat,
      lng: base.lng + dLng,
    })),
  ),
)

function teardownMarkers() {
  clusterer?.clearMarkers()
  clusterer?.setMap(null)
  clusterer = null
  locationMarkers.forEach(m => m.setMap(null))
  locationMarkers = []
}

function buildMarkers() {
  const map = mapInstance.value
  const maps = googleMaps()
  if (!map || !maps)
    return
  teardownMarkers()
  locationMarkers = clusterLocations.value.map((loc) => {
    const marker = new maps.Marker({
      position: { lat: loc.lat, lng: loc.lng },
      icon: markerIcon(loc.type),
      title: loc.name,
    })
    marker.addListener('click', () => {
      selectedLocation.value = loc
    })
    return marker
  })
  if (mapConfig.clustering) {
    clusterer = new MarkerClusterer({
      map: map as never,
      markers: locationMarkers as never,
      renderer: clusterRenderer as never,
    }) as ClustererInstance
  }
  else {
    locationMarkers.forEach(m => m.setMap(map))
  }
}

// Rebuild when the map resolves, clustering toggles, or the theme changes
// (so marker + cluster colors track the active theme).
watch(
  () => [mapInstance.value, mapConfig.clustering, themeColors.value],
  buildMarkers,
)

onBeforeUnmount(teardownMarkers)
</script>

<style>
/* Google Maps InfoWindow chrome — Google paints it white; follow the theme.
   Global (unscoped) on purpose: the markup is injected outside Vue's scope. */
.gm-style .gm-style-iw-c {
  background: var(--ui-bg-elevated) !important;
  color: var(--ui-text) !important;
  box-shadow: 0 2px 12px rgb(0 0 0 / 0.35) !important;
}

.gm-style .gm-style-iw-d {
  background: transparent !important;
}

/* The little tail/arrow under the window */
.gm-style .gm-style-iw-tc::after {
  background: var(--ui-bg-elevated) !important;
}

/* Close button glyph */
.gm-style .gm-ui-hover-effect > span {
  background-color: var(--ui-text-muted) !important;
}

/* The main map keeps Google's fullscreen control even with fullscreenControl:
   false, so hide it there — we provide a themed fullscreen button instead.
   (Scoped to the main map; the smaller demo maps keep Google's controls.) */
.map-hide-gm-fullscreen .gm-fullscreen-control {
  display: none !important;
}

/* Places Autocomplete dropdown — Google appends it to <body> and paints it
   white; theme it to match. Global (unscoped) since it lives outside the map. */
.pac-container {
  background: var(--ui-bg-elevated) !important;
  border: 1px solid var(--ui-border) !important;
  border-radius: var(--ui-radius) !important;
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.25) !important;
  margin-top: 4px;
  font-family: inherit;
}

.pac-item {
  color: var(--ui-text-muted) !important;
  border-top-color: var(--ui-border) !important;
  padding: 0.25rem 0.5rem;
}

.pac-item:hover,
.pac-item-selected {
  background: var(--ui-bg-muted) !important;
}

.pac-item-query,
.pac-matched {
  color: var(--ui-text) !important;
}

.pac-icon {
  display: none;
}
</style>
