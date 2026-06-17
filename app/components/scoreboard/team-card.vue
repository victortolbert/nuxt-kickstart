<template>
  <div
    class="scoreboard-team-card"
    :class="{
      'scoreboard-team-card--gold': rank === 1,
      'scoreboard-team-card--silver': rank === 2,
      'scoreboard-team-card--bronze': rank === 3,
      'scoreboard-team-card--highlighted': highlighted,
    }"
  >
    <!-- Rank badge -->
    <div class="scoreboard-team-card__rank">
      <span v-if="medal" class="scoreboard-team-card__medal">{{ medal }}</span>
      <span v-else class="scoreboard-team-card__rank-number">{{ rank }}</span>
    </div>

    <!-- Team identity (emoji or logo) -->
    <div class="scoreboard-team-card__identity">
      <template v-if="teamIdentityMode === 'logo'">
        <img
          v-if="team.logo"
          :src="team.logo"
          :alt="team.name"
          class="scoreboard-team-card__logo"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        >
        <u-icon
          v-else
          :name="resolveIcon('photo')"
          class="scoreboard-team-card__logo-fallback"
        ></u-icon>
      </template>
      <span v-else-if="team.emoji" class="scoreboard-team-card__emoji">
        {{ team.emoji }}
      </span>
    </div>

    <!-- Team name -->
    <div class="scoreboard-team-card__name">
      {{ team.name }}
    </div>

    <!-- Animated score -->
    <div class="scoreboard-team-card__score">
      {{ animatedScore }}
    </div>

    <!-- Progress bar -->
    <div class="scoreboard-team-card__bar">
      <div
        class="scoreboard-team-card__bar-fill"
        :style="{ width: `${scorePercent}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface TeamCardProps {
  team: {
    id: number
    name: string
    emoji: string | null
    logo: string | null
    totalScore: number
  }
  rank: number
  maxScore: number
  teamIdentityMode: 'emoji' | 'logo'
  animatedScore: number
  highlighted?: boolean
}

const props = defineProps<TeamCardProps>()

const { resolveIcon } = useAppearance()

const medal = computed(() => {
  if (props.rank === 1)
    return '🥇'
  if (props.rank === 2)
    return '🥈'
  if (props.rank === 3)
    return '🥉'
  return ''
})

const scorePercent = computed(() => {
  if (props.maxScore <= 0)
    return 0
  return Math.min((props.team.totalScore / props.maxScore) * 100, 100)
})
</script>

<style scoped>
.scoreboard-team-card {
  --glow-gold: oklch(0.8 0.15 85);
  --glow-silver: oklch(0.75 0.02 250);
  --glow-bronze: oklch(0.65 0.1 55);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
  padding: 1em 0.75em;
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border);
  position: relative;
  text-align: center;
  overflow: hidden;
}

.scoreboard-team-card--gold {
  border-color: var(--glow-gold);
  box-shadow: 0 0 12px 2px var(--glow-gold);
}

.scoreboard-team-card--silver {
  border-color: var(--glow-silver);
  box-shadow: 0 0 10px 2px var(--glow-silver);
}

.scoreboard-team-card--bronze {
  border-color: var(--glow-bronze);
  box-shadow: 0 0 10px 2px var(--glow-bronze);
}

.scoreboard-team-card__rank {
  font-size: 0.9em;
  font-weight: 700;
  color: var(--ui-text-dimmed);
  line-height: 1;
}

.scoreboard-team-card__medal {
  font-size: 1.4em;
}

.scoreboard-team-card__rank-number {
  font-variant-numeric: tabular-nums;
}

.scoreboard-team-card__identity {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.scoreboard-team-card__emoji {
  font-size: 2.5em;
}

.scoreboard-team-card__logo {
  width: 4em;
  height: 4em;
  object-fit: cover;
  border-radius: var(--ui-radius, 0);
}

.scoreboard-team-card__logo-fallback {
  width: 4em;
  height: 4em;
  color: var(--ui-text-dimmed);
}

.scoreboard-team-card__name {
  font-family: var(--font-display);
  font-size: 1.1em;
  font-weight: 700;
  color: var(--ui-text);
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scoreboard-team-card__score {
  font-family: var(--font-display);
  font-size: 2em;
  font-weight: 800;
  color: var(--color-primary-500);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.scoreboard-team-card__bar {
  width: 80%;
  height: 0.25em;
  background: var(--ui-bg-muted);
  overflow: hidden;
  margin-top: 0.25em;
}

.scoreboard-team-card__bar-fill {
  height: 100%;
  background: var(--color-primary-500);
  transition: width 500ms ease;
}

@keyframes card-pulse {
  0% {
    box-shadow: 0 0 0 0 var(--color-primary-500);
  }
  50% {
    box-shadow: 0 0 16px 4px var(--color-primary-500);
  }
  100% {
    box-shadow: 0 0 0 0 var(--color-primary-500);
  }
}

.scoreboard-team-card--highlighted {
  animation: card-pulse 1.5s ease-out;
}

/* Preserve medal glow when highlighted */
.scoreboard-team-card--gold.scoreboard-team-card--highlighted {
  animation: none;
  box-shadow: 0 0 20px 4px var(--glow-gold);
}

.scoreboard-team-card--silver.scoreboard-team-card--highlighted {
  animation: none;
  box-shadow: 0 0 18px 4px var(--glow-silver);
}

.scoreboard-team-card--bronze.scoreboard-team-card--highlighted {
  animation: none;
  box-shadow: 0 0 18px 4px var(--glow-bronze);
}

@media (prefers-reduced-motion: reduce) {
  .scoreboard-team-card__bar-fill {
    transition: none;
  }

  .scoreboard-team-card--gold,
  .scoreboard-team-card--silver,
  .scoreboard-team-card--bronze {
    box-shadow: none;
  }

  .scoreboard-team-card--highlighted {
    animation: none;
  }
}
</style>
