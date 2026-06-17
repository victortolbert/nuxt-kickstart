import type { Client } from '@libsql/client'
import type { ScoreboardEventPayload } from './scoreboard-events'
import { toKebabCase } from '#shared/utils/case'
import { db as authDb } from './db'

// Re-export the shared database client (both auth and scoreboard use the same DB)
const db = authDb as Client

// Initialize scoreboard tables (runs on first access)
async function initScoreboardTables() {
  // Events table - single event per database (id defaults to 1)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sb_events (
      id INTEGER PRIMARY KEY DEFAULT 1,
      name TEXT NOT NULL,
      description TEXT,
      score_min INTEGER DEFAULT 1,
      score_max INTEGER DEFAULT 200,
      team_identity_mode TEXT DEFAULT 'emoji',
      status TEXT CHECK(status IN ('draft', 'active', 'completed')) DEFAULT 'draft',
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    )
  `)

  // Teams table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sb_teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER DEFAULT 1,
      name TEXT NOT NULL,
      emoji TEXT,
      logo TEXT,
      sort_order INTEGER,
      FOREIGN KEY (event_id) REFERENCES sb_events(id) ON DELETE CASCADE
    )
  `)

  // Challenges table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sb_challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER DEFAULT 1,
      name TEXT NOT NULL,
      description TEXT,
      sort_order INTEGER,
      status TEXT CHECK(status IN ('upcoming', 'active', 'locked')) DEFAULT 'upcoming',
      FOREIGN KEY (event_id) REFERENCES sb_events(id) ON DELETE CASCADE
    )
  `)

  // Judges table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sb_judges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER DEFAULT 1,
      name TEXT NOT NULL,
      token TEXT UNIQUE,
      FOREIGN KEY (event_id) REFERENCES sb_events(id) ON DELETE CASCADE
    )
  `)

  // Scores table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sb_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      judge_id INTEGER NOT NULL,
      team_id INTEGER NOT NULL,
      challenge_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      comment TEXT,
      submitted_at INTEGER DEFAULT (unixepoch()),
      FOREIGN KEY (judge_id) REFERENCES sb_judges(id) ON DELETE CASCADE,
      FOREIGN KEY (team_id) REFERENCES sb_teams(id) ON DELETE CASCADE,
      FOREIGN KEY (challenge_id) REFERENCES sb_challenges(id) ON DELETE CASCADE,
      UNIQUE(judge_id, team_id, challenge_id)
    )
  `)

  // Create indexes
  await db.execute('CREATE INDEX IF NOT EXISTS idx_sb_teams_event ON sb_teams(event_id)')
  await db.execute('CREATE INDEX IF NOT EXISTS idx_sb_challenges_event ON sb_challenges(event_id)')
  await db.execute('CREATE INDEX IF NOT EXISTS idx_sb_judges_event ON sb_judges(event_id)')
  await db.execute('CREATE INDEX IF NOT EXISTS idx_sb_judges_token ON sb_judges(token)')
  await db.execute('CREATE INDEX IF NOT EXISTS idx_sb_scores_judge ON sb_scores(judge_id)')
  await db.execute('CREATE INDEX IF NOT EXISTS idx_sb_scores_team ON sb_scores(team_id)')
  await db.execute('CREATE INDEX IF NOT EXISTS idx_sb_scores_challenge ON sb_scores(challenge_id)')

  // Migrations for existing databases — ALTER TABLE with error handling for already-existing columns
  await db.execute('ALTER TABLE sb_events ADD COLUMN team_identity_mode TEXT DEFAULT \'emoji\'').catch(() => {})
  await db.execute('ALTER TABLE sb_teams ADD COLUMN logo TEXT').catch(() => {})
}

// Initialize on module load with error handling
const scoreboardReady = initScoreboardTables().catch((err) => {
  const errorMsg = err instanceof Error ? err.message : String(err)
  const isCertError = errorMsg.includes('certificate') || errorMsg.includes('ECONNREFUSED') || errorMsg.includes('ETIMEDOUT')

  if (isCertError) {
    console.warn('⚠️  Remote database connection failed for scoreboard tables')
    console.info('📁 The database client has already fallen back to local SQLite')
    console.info('🔄 Retrying scoreboard initialization...')

    // The db client should now be using local, retry once
    return initScoreboardTables().catch((retryErr) => {
      console.error('❌ Failed to initialize scoreboard tables:', retryErr)
      throw retryErr
    })
  }
  else {
    console.error('❌ Failed to initialize scoreboard tables:', err)
    throw err
  }
})

// Type definitions
export interface DbEvent {
  id: number
  name: string
  description: string | null
  score_min: number
  score_max: number
  team_identity_mode: 'emoji' | 'logo'
  status: 'draft' | 'active' | 'completed'
  created_at: number
  updated_at: number
}

export interface DbTeam {
  id: number
  event_id: number
  name: string
  emoji: string | null
  logo: string | null
  sort_order: number | null
}

export interface DbChallenge {
  id: number
  event_id: number
  name: string
  description: string | null
  sort_order: number | null
  status: 'upcoming' | 'active' | 'locked'
}

export interface DbJudge {
  id: number
  event_id: number
  name: string
  token: string | null
}

export interface DbScore {
  id: number
  judge_id: number
  team_id: number
  challenge_id: number
  score: number
  comment: string | null
  submitted_at: number
}

// Event operations
export async function getEvent(eventId = 1): Promise<DbEvent | undefined> {
  await scoreboardReady
  const result = await db.execute({
    sql: 'SELECT * FROM sb_events WHERE id = ?',
    args: [eventId],
  })
  return result.rows[0] as unknown as DbEvent | undefined
}

export async function upsertEvent(event: Omit<DbEvent, 'id' | 'created_at' | 'updated_at'>): Promise<DbEvent> {
  await scoreboardReady
  await db.execute({
    sql: `INSERT INTO sb_events (id, name, description, score_min, score_max, team_identity_mode, status)
          VALUES (1, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            description = excluded.description,
            score_min = excluded.score_min,
            score_max = excluded.score_max,
            team_identity_mode = excluded.team_identity_mode,
            status = excluded.status,
            updated_at = unixepoch()`,
    args: [event.name, event.description, event.score_min, event.score_max, event.team_identity_mode, event.status],
  })
  return (await getEvent())!
}

// Team operations
export async function getTeams(eventId = 1): Promise<DbTeam[]> {
  await scoreboardReady
  const result = await db.execute({
    sql: 'SELECT * FROM sb_teams WHERE event_id = ? ORDER BY sort_order, id',
    args: [eventId],
  })
  return result.rows as unknown as DbTeam[]
}

export async function createTeam(team: Omit<DbTeam, 'id'>): Promise<DbTeam> {
  await scoreboardReady
  const result = await db.execute({
    sql: `INSERT INTO sb_teams (event_id, name, emoji, logo, sort_order)
          VALUES (?, ?, ?, ?, ?)
          RETURNING *`,
    args: [team.event_id, team.name, team.emoji, team.logo, team.sort_order],
  })
  return result.rows[0] as unknown as DbTeam
}

export async function getTeam(teamId: number): Promise<DbTeam | undefined> {
  await scoreboardReady
  const result = await db.execute({
    sql: 'SELECT * FROM sb_teams WHERE id = ?',
    args: [teamId],
  })
  return result.rows[0] as unknown as DbTeam | undefined
}

export async function updateTeamLogo(teamId: number, logo: string | null): Promise<void> {
  await scoreboardReady
  await db.execute({
    sql: 'UPDATE sb_teams SET logo = ? WHERE id = ?',
    args: [logo, teamId],
  })
}

export async function deleteTeams(eventId = 1): Promise<void> {
  await scoreboardReady
  await db.execute({
    sql: 'DELETE FROM sb_teams WHERE event_id = ?',
    args: [eventId],
  })
}

// Challenge operations
export async function getChallenges(eventId = 1): Promise<DbChallenge[]> {
  await scoreboardReady
  const result = await db.execute({
    sql: 'SELECT * FROM sb_challenges WHERE event_id = ? ORDER BY sort_order, id',
    args: [eventId],
  })
  return result.rows as unknown as DbChallenge[]
}

export async function createChallenge(challenge: Omit<DbChallenge, 'id'>): Promise<DbChallenge> {
  await scoreboardReady
  const result = await db.execute({
    sql: `INSERT INTO sb_challenges (event_id, name, description, sort_order, status)
          VALUES (?, ?, ?, ?, ?)
          RETURNING *`,
    args: [challenge.event_id, challenge.name, challenge.description, challenge.sort_order, challenge.status],
  })
  return result.rows[0] as unknown as DbChallenge
}

export async function deleteChallenges(eventId = 1): Promise<void> {
  await scoreboardReady
  await db.execute({
    sql: 'DELETE FROM sb_challenges WHERE event_id = ?',
    args: [eventId],
  })
}

export async function updateChallengeStatus(challengeId: number, status: 'upcoming' | 'active' | 'locked'): Promise<void> {
  await scoreboardReady
  await db.execute({
    sql: 'UPDATE sb_challenges SET status = ? WHERE id = ?',
    args: [status, challengeId],
  })
}

export async function getActiveChallenge(eventId = 1): Promise<DbChallenge | undefined> {
  await scoreboardReady
  const result = await db.execute({
    sql: 'SELECT * FROM sb_challenges WHERE event_id = ? AND status = ? LIMIT 1',
    args: [eventId, 'active'],
  })
  return result.rows[0] as unknown as DbChallenge | undefined
}

// Judge operations
export async function getJudges(eventId = 1): Promise<DbJudge[]> {
  await scoreboardReady
  const result = await db.execute({
    sql: 'SELECT * FROM sb_judges WHERE event_id = ? ORDER BY id',
    args: [eventId],
  })
  return result.rows as unknown as DbJudge[]
}

export async function createJudge(judge: Omit<DbJudge, 'id'>): Promise<DbJudge> {
  await scoreboardReady
  const result = await db.execute({
    sql: `INSERT INTO sb_judges (event_id, name, token)
          VALUES (?, ?, ?)
          RETURNING *`,
    args: [judge.event_id, judge.name, judge.token],
  })
  return result.rows[0] as unknown as DbJudge
}

export async function deleteJudges(eventId = 1): Promise<void> {
  await scoreboardReady
  await db.execute({
    sql: 'DELETE FROM sb_judges WHERE event_id = ?',
    args: [eventId],
  })
}

export async function findJudgeByToken(token: string): Promise<DbJudge | undefined> {
  await scoreboardReady
  const result = await db.execute({
    sql: 'SELECT * FROM sb_judges WHERE token = ?',
    args: [token],
  })
  return result.rows[0] as unknown as DbJudge | undefined
}

export async function updateJudgeToken(judgeId: number, token: string): Promise<void> {
  await scoreboardReady
  await db.execute({
    sql: 'UPDATE sb_judges SET token = ? WHERE id = ?',
    args: [token, judgeId],
  })
}

// Score operations
export async function getScores(eventId = 1): Promise<DbScore[]> {
  await scoreboardReady
  const result = await db.execute({
    sql: `SELECT s.* FROM sb_scores s
          INNER JOIN sb_judges j ON s.judge_id = j.id
          WHERE j.event_id = ?
          ORDER BY s.submitted_at DESC`,
    args: [eventId],
  })
  return result.rows as unknown as DbScore[]
}

export async function upsertScore(score: Omit<DbScore, 'id' | 'submitted_at'>): Promise<DbScore> {
  await scoreboardReady
  const result = await db.execute({
    sql: `INSERT INTO sb_scores (judge_id, team_id, challenge_id, score, comment)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(judge_id, team_id, challenge_id) DO UPDATE SET
            score = excluded.score,
            comment = excluded.comment,
            submitted_at = unixepoch()
          RETURNING *`,
    args: [score.judge_id, score.team_id, score.challenge_id, score.score, score.comment],
  })
  return result.rows[0] as unknown as DbScore
}

// Seed function with sample data
export async function seedScoreboardData(force = false): Promise<void> {
  await scoreboardReady

  // Check if already seeded (unless forced)
  if (!force) {
    const existing = await getEvent()
    if (existing) {
      return // Already has data
    }
  }

  // Create event
  await upsertEvent({
    name: 'Hot Dog Challenge - AI Engagement Champions',
    description: 'Teams compete to create the most innovative AI-powered hot dog marketing campaigns',
    score_min: 1,
    score_max: 30,
    team_identity_mode: 'logo',
    status: 'active',
  })

  // Create teams (Hot Dog themed from original AI scorecard)
  const teamNames = ['Bonds & Bonds', 'Fast Franks', 'Tasty Dogs', 'Mustard Market Movers', 'Grill Sergeants']
  const teamEmojis = ['🌭', '🔥', '🟡', '🥒', '🍅']
  const teamRows = teamNames.map((name, i) => ({
    event_id: 1,
    name,
    emoji: teamEmojis[i]!,
    logo: `/img/teams/${toKebabCase(name)}.webp`,
    sort_order: i + 1,
  }))
  const teams: DbTeam[] = []
  for (const team of teamRows) {
    teams.push(await createTeam(team))
  }

  // Create challenges (from original AI scorecard)
  const challengeRows = [
    { event_id: 1, name: 'Know Your Hot Dog Audience', description: 'Use AI to analyze customer preferences and create targeted personas', sort_order: 1, status: 'locked' as const },
    { event_id: 1, name: 'Train Like a Pro Team', description: 'Your volunteer parents need the skills of a Michelin-starred crew', sort_order: 2, status: 'locked' as const },
    { event_id: 1, name: 'Make Them Stop and Stare', description: 'Create the most irresistible marketing campaign', sort_order: 3, status: 'active' as const },
  ]
  const challenges: DbChallenge[] = []
  for (const challenge of challengeRows) {
    challenges.push(await createChallenge(challenge))
  }

  // Create judges (from original AI scorecard)
  const judgeRows = [
    { event_id: 1, name: 'Raj Virdi', token: null },
    { event_id: 1, name: 'Erin Carroll', token: null },
    { event_id: 1, name: 'Mike Travlos', token: null },
    { event_id: 1, name: 'Madeline McFadden', token: null },
  ]
  const judges: DbJudge[] = []
  for (const judge of judgeRows) {
    judges.push(await createJudge(judge))
  }

  // No sample scores — all judges start at zero for every team/challenge
}

// Build full event state payload (same shape as GET /api/scoreboard/event)
export async function buildEventState(): Promise<ScoreboardEventPayload> {
  const event = await getEvent()
  if (!event) {
    throw new Error('Event not found')
  }

  const teams = await getTeams()
  const challenges = await getChallenges()
  const judges = await getJudges()
  const scores = await getScores()
  const activeChallenge = await getActiveChallenge()

  const teamScores = new Map<number, number>()
  for (const score of scores) {
    const current = teamScores.get(score.team_id) || 0
    teamScores.set(score.team_id, current + score.score)
  }

  return {
    event: {
      name: event.name,
      description: event.description,
      teamIdentityMode: event.team_identity_mode || 'emoji',
      scoreMin: event.score_min,
      scoreMax: event.score_max,
      status: event.status,
    },
    teams: teams.map(team => ({
      id: team.id,
      name: team.name,
      emoji: team.emoji,
      logo: team.logo,
      totalScore: teamScores.get(team.id) || 0,
    })),
    challenges: challenges.map(challenge => ({
      id: challenge.id,
      name: challenge.name,
      description: challenge.description,
      status: challenge.status,
      sortOrder: challenge.sort_order,
    })),
    activeChallenge: activeChallenge
      ? {
          id: activeChallenge.id,
          name: activeChallenge.name,
          description: activeChallenge.description,
          status: activeChallenge.status,
          sortOrder: activeChallenge.sort_order,
        }
      : null,
    judges: judges.map(judge => ({
      id: judge.id,
      name: judge.name,
    })),
  }
}
