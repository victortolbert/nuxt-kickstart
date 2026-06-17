import { beforeEach, describe, expect, it, vi } from 'vitest'

// Back the scoreboard data layer with a real in-memory libSQL database so the
// actual SQL (upserts, joins, ON CONFLICT, cascades) is exercised — only the
// connection is swapped out. The mock factory is hoisted above imports, so the
// in-memory client is created lazily inside it and shared as a singleton.
vi.mock('#server/utils/db', async () => {
  const { createClient } = await import('@libsql/client')
  return { db: createClient({ url: ':memory:' }) }
})

const {
  buildEventState,
  createChallenge,
  createJudge,
  createTeam,
  deleteChallenges,
  deleteJudges,
  deleteTeams,
  findJudgeByToken,
  getActiveChallenge,
  getChallenges,
  getEvent,
  getJudges,
  getScores,
  getTeam,
  getTeams,
  seedScoreboardData,
  updateChallengeStatus,
  updateJudgeToken,
  updateTeamLogo,
  upsertEvent,
  upsertScore,
} = await import('../../server/utils/scoreboard-db')
const { db } = await import('#server/utils/db')

async function resetTables() {
  // Ensure the table-init promise has resolved before we touch the schema.
  await getEvent()
  for (const table of ['sb_scores', 'sb_judges', 'sb_challenges', 'sb_teams', 'sb_events']) {
    await db.execute(`DELETE FROM ${table}`)
  }
}

// Teams/challenges/judges carry a FOREIGN KEY onto sb_events(id), so any test
// that creates child rows needs the parent event present first.
async function seedEvent() {
  await upsertEvent({
    name: 'E',
    description: null,
    score_min: 1,
    score_max: 200,
    team_identity_mode: 'emoji',
    status: 'active',
  })
}

beforeEach(async () => {
  await resetTables()
})

describe('event operations', () => {
  it('returns undefined when no event exists', async () => {
    expect(await getEvent()).toBeUndefined()
  })

  it('inserts then updates the singleton event via upsert', async () => {
    const created = await upsertEvent({
      name: 'Hackathon',
      description: 'desc',
      score_min: 1,
      score_max: 50,
      team_identity_mode: 'emoji',
      status: 'draft',
    })
    expect(created.id).toBe(1)
    expect(created.name).toBe('Hackathon')

    const updated = await upsertEvent({
      name: 'Hackathon v2',
      description: null,
      score_min: 5,
      score_max: 100,
      team_identity_mode: 'logo',
      status: 'active',
    })
    expect(updated.id).toBe(1)
    expect(updated.name).toBe('Hackathon v2')
    expect(updated.status).toBe('active')
    expect(updated.team_identity_mode).toBe('logo')

    // Still a single event row.
    const teams = await getTeams()
    expect(teams).toEqual([])
  })
})

describe('team operations', () => {
  beforeEach(seedEvent)

  it('creates, fetches, updates logo, and deletes teams', async () => {
    const team = await createTeam({ event_id: 1, name: 'Red', emoji: '🔴', logo: null, sort_order: 1 })
    expect(team.id).toBeGreaterThan(0)

    expect(await getTeam(team.id)).toMatchObject({ name: 'Red', emoji: '🔴' })

    await updateTeamLogo(team.id, '/img/red.webp')
    expect((await getTeam(team.id))?.logo).toBe('/img/red.webp')

    await deleteTeams()
    expect(await getTeams()).toEqual([])
  })

  it('orders teams by sort_order then id', async () => {
    await createTeam({ event_id: 1, name: 'B', emoji: null, logo: null, sort_order: 2 })
    await createTeam({ event_id: 1, name: 'A', emoji: null, logo: null, sort_order: 1 })

    expect((await getTeams()).map(t => t.name)).toEqual(['A', 'B'])
  })

  it('returns undefined for an unknown team id', async () => {
    expect(await getTeam(99999)).toBeUndefined()
  })
})

describe('challenge operations', () => {
  beforeEach(seedEvent)

  it('creates challenges and finds the active one', async () => {
    await createChallenge({ event_id: 1, name: 'C1', description: null, sort_order: 1, status: 'locked' })
    const active = await createChallenge({ event_id: 1, name: 'C2', description: null, sort_order: 2, status: 'active' })

    expect((await getChallenges()).map(c => c.name)).toEqual(['C1', 'C2'])
    expect((await getActiveChallenge())?.id).toBe(active.id)
  })

  it('updates challenge status and clears the active challenge', async () => {
    const c = await createChallenge({ event_id: 1, name: 'C', description: null, sort_order: 1, status: 'active' })

    await updateChallengeStatus(c.id, 'locked')
    expect(await getActiveChallenge()).toBeUndefined()

    await deleteChallenges()
    expect(await getChallenges()).toEqual([])
  })
})

describe('judge operations', () => {
  beforeEach(seedEvent)

  it('creates judges and looks them up by token', async () => {
    await createJudge({ event_id: 1, name: 'No Token', token: null })
    const judge = await createJudge({ event_id: 1, name: 'Has Token', token: 'abc123' })

    expect(await getJudges()).toHaveLength(2)
    expect((await findJudgeByToken('abc123'))?.id).toBe(judge.id)
    expect(await findJudgeByToken('missing')).toBeUndefined()
  })

  it('updates a judge token and deletes all judges', async () => {
    const judge = await createJudge({ event_id: 1, name: 'J', token: null })

    await updateJudgeToken(judge.id, 'fresh-token')
    expect((await findJudgeByToken('fresh-token'))?.id).toBe(judge.id)

    await deleteJudges()
    expect(await getJudges()).toEqual([])
  })
})

describe('score operations', () => {
  beforeEach(seedEvent)

  it('upserts scores on the judge/team/challenge unique key', async () => {
    const team = await createTeam({ event_id: 1, name: 'T', emoji: null, logo: null, sort_order: 1 })
    const challenge = await createChallenge({ event_id: 1, name: 'C', description: null, sort_order: 1, status: 'active' })
    const judge = await createJudge({ event_id: 1, name: 'J', token: null })

    const first = await upsertScore({ judge_id: judge.id, team_id: team.id, challenge_id: challenge.id, score: 10, comment: 'good' })
    expect(first.score).toBe(10)

    const updated = await upsertScore({ judge_id: judge.id, team_id: team.id, challenge_id: challenge.id, score: 25, comment: 'better' })
    expect(updated.score).toBe(25)
    expect(updated.comment).toBe('better')

    // Conflict updated in place rather than inserting a second row.
    expect(await getScores()).toHaveLength(1)
  })
})

describe('seedScoreboardData', () => {
  it('seeds a full event with teams, challenges, and judges', async () => {
    await seedScoreboardData()

    expect(await getEvent()).toBeDefined()
    expect(await getTeams()).toHaveLength(5)
    expect(await getChallenges()).toHaveLength(3)
    expect(await getJudges()).toHaveLength(4)
    expect((await getActiveChallenge())?.name).toBe('Make Them Stop and Stare')
  })

  it('does not reseed when data already exists unless forced', async () => {
    await seedScoreboardData()
    await createTeam({ event_id: 1, name: 'Extra', emoji: null, logo: null, sort_order: 99 })

    await seedScoreboardData() // no-op, event exists
    expect(await getTeams()).toHaveLength(6)

    await seedScoreboardData(true) // force re-adds the 5 seed teams
    expect(await getTeams()).toHaveLength(11)
  })
})

describe('buildEventState', () => {
  it('throws when there is no event', async () => {
    await expect(buildEventState()).rejects.toThrow('Event not found')
  })

  it('aggregates per-team total scores across judges', async () => {
    await upsertEvent({
      name: 'E',
      description: null,
      score_min: 1,
      score_max: 30,
      team_identity_mode: 'logo',
      status: 'active',
    })
    const team = await createTeam({ event_id: 1, name: 'T', emoji: '🌭', logo: '/t.webp', sort_order: 1 })
    const challenge = await createChallenge({ event_id: 1, name: 'C', description: null, sort_order: 1, status: 'active' })
    const j1 = await createJudge({ event_id: 1, name: 'J1', token: null })
    const j2 = await createJudge({ event_id: 1, name: 'J2', token: null })

    await upsertScore({ judge_id: j1.id, team_id: team.id, challenge_id: challenge.id, score: 10, comment: null })
    await upsertScore({ judge_id: j2.id, team_id: team.id, challenge_id: challenge.id, score: 15, comment: null })

    const state = await buildEventState()

    expect(state.event).toMatchObject({ name: 'E', teamIdentityMode: 'logo', status: 'active' })
    expect(state.teams).toHaveLength(1)
    expect(state.teams[0]).toMatchObject({ name: 'T', totalScore: 25 })
    expect(state.activeChallenge?.name).toBe('C')
    expect(state.judges).toEqual([
      { id: j1.id, name: 'J1' },
      { id: j2.id, name: 'J2' },
    ])
  })

  it('reports a null activeChallenge when none is active', async () => {
    await upsertEvent({
      name: 'E',
      description: null,
      score_min: 1,
      score_max: 30,
      team_identity_mode: 'emoji',
      status: 'draft',
    })
    await createChallenge({ event_id: 1, name: 'C', description: null, sort_order: 1, status: 'locked' })

    const state = await buildEventState()
    expect(state.activeChallenge).toBeNull()
  })
})
