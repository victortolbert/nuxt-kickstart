<template>
  <div
    class="presentation-grid"
    :style="{
      '--grid-columns': columns,
      '--grid-cell-width': `${cellWidth}px`,
      '--grid-font-size': `${gridFontSize}px`,
      '--grid-offset': `${headerOffset}px`,
    }"
  >
    <transition-group name="grid-card">
      <scoreboard-team-card
        v-for="(team, index) in teams"
        :key="team.id"
        :team="team"
        :rank="index + 1"
        :max-score="maxScore"
        :team-identity-mode="teamIdentityMode"
        :animated-score="getAnimatedScore(team.id)"
        :highlighted="highlightedTeamIds?.has(team.id)"
      ></scoreboard-team-card>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

interface Team {
  id: number
  name: string
  emoji: string | null
  logo: string | null
  totalScore: number
}

interface PresentationGridProps {
  teams: Team[]
  maxScore: number
  teamIdentityMode: 'emoji' | 'logo'
  animatedScores: Map<number, number>
  highlightedTeamIds?: Set<number>
  headerOffset?: number
}

const props = withDefaults(defineProps<PresentationGridProps>(), {
  headerOffset: 0,
})

const { width: vw, height: vh } = useWindowSize()

const teamCount = computed(() => props.teams.length)

const columns = computed(() => {
  const count = teamCount.value
  if (count <= 0)
    return 1
  if (count <= 2)
    return count
  if (count <= 4) {
    return (vw.value / vh.value) > 1.5 ? count : 2
  }
  if (count <= 6)
    return 3
  if (count <= 9)
    return 3
  return Math.min(Math.ceil(Math.sqrt(count)), 5)
})

const rows = computed(() => Math.ceil(teamCount.value / columns.value))

const GAP = 12

const cellWidth = computed(() => {
  const available = vw.value - GAP * (columns.value + 1)
  return Math.floor(available / columns.value)
})

const gridFontSize = computed(() => {
  if (teamCount.value <= 0)
    return 16

  const availableHeight = vh.value - props.headerOffset
  const cellHeight = (availableHeight - GAP * (rows.value + 1)) / rows.value

  // Card content is ~13em tall (rank+logo/emoji+name+score+bar+padding+gaps), ~10em wide
  const fromHeight = cellHeight / 13
  const fromWidth = cellWidth.value / 10

  return Math.max(8, Math.min(fromHeight, fromWidth, 32))
})

function getAnimatedScore(teamId: number): number {
  return props.animatedScores.get(teamId) ?? 0
}
</script>

<style scoped>
.presentation-grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns, 3), var(--grid-cell-width, 1fr));
  justify-content: center;
  gap: 12px;
  padding: 12px;
  font-size: var(--grid-font-size, 16px);
  height: calc(100vh - var(--grid-offset, 0px));
  max-width: 100vw;
  box-sizing: border-box;
  align-content: center;
  overflow: hidden;
}

/* TransitionGroup renders a flat fragment — cards are direct children of .presentation-grid */
.grid-card-move {
  transition: transform 300ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .grid-card-move {
    transition: none;
  }
}
</style>
