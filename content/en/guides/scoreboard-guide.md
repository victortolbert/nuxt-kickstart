---
title: VIP Scoreboard Guide
description: How to set up, play, judge, and manage the AI Champions Challenge scoreboard
category: getting-started
difficulty: beginner
prerequisites: []
order: 1
tags:
  - scoreboard
  - judges
  - events
  - demo
status: evergreen
visibility: private
---

The **AI Champions Challenge Scoreboard** is a live, real-time competition scoreboard for team-based events. Think of it as a game show board for conferences, hackathons, team offsites, or any event where teams compete across multiple challenges and judges score them live.

No login required. No accounts needed. Just open the URL and go.
    https://nuxt-kickstart.example.com/labs/scoreboard
    ---

## What It Does

- **Live leaderboard** with ranked teams, medals, and score bars — updates every 5 seconds
- **Flexible event setup** — 2 teams or 20, 1 challenge or 10, 1 judge or a full panel
- **Token-based judge scoring** — judges get a unique URL, no login needed
- **Challenge flow control** — activate challenges one at a time, lock when done, advance to next
- **PIN-protected admin** — only the event organizer can change settings (default PIN: `1234`)
- **Works on any device** — phones, tablets, laptops, projected screens

---

## Quick Start (5 Minutes)

### Step 1: Open the Scoreboard

Navigate to:

```
/labs/scoreboard
```

You'll see the live leaderboard with demo data (4 teams, 5 challenges, 3 judges).

### Step 2: Configure Your Event

1. Click **Admin Settings** at the bottom of the scoreboard
2. Enter the admin PIN: `1234`
3. Edit the event:
   - **Event name** and description
   - **Score range** (min/max per team per challenge)
   - **Teams** — add/remove teams, set emoji and name
   - **Challenges** — add/remove challenges with descriptions
   - **Judges** — add/remove judge names
4. Click **Save Configuration**

### Step 3: Generate Judge Links

1. In Admin Settings, scroll to the **Judges** section
2. Click **Generate All Links**
3. Each judge gets a unique URL like: `/labs/scoreboard/judge/abc123xyz456`
4. Click **Copy** next to each link to share with judges (text, email, QR code)

### Step 4: Run the Event

1. In Admin Settings, find the **Challenges** section
2. Click **Activate** on the first challenge — it goes live
3. Judges open their links and score each team
4. The leaderboard updates in real time
5. When a challenge is done, click **Lock & Next** to close scoring and start the next challenge
6. Repeat until all challenges are complete

---

## How to Play (For Teams)

You're part of a team competing in a series of challenges. Here's what to expect:

1. **Watch the big screen** — the leaderboard shows rankings, scores, and which challenge is active
2. **Compete in challenges** — when a challenge is activated, your team performs/presents/builds
3. **Judges score you** — each judge gives your team a score (within the configured range)
4. **Rankings update live** — watch your position climb (or hold on tight)
5. **Medals matter** — top 3 teams get gold, silver, and bronze medals on the board

**Tips for teams:**
- You can see which challenge is active from the colored banner at the top
- Progress dots show how many challenges are done vs remaining
- Scores are cumulative across all challenges — consistency wins

---

## How to Judge

As a judge, you receive a unique scoring link. No account or login needed.

### Your Scoring Workflow

1. **Open your link** — you'll see your name and the event name
2. **Wait for a challenge** — when no challenge is active, you'll see "Waiting for the next challenge..."
3. **Score each team** — when a challenge activates:
   - You'll see every team listed with a score input and optional comment field
   - Enter a score (within the configured range, shown on the form)
   - Add an optional comment about the team's performance
4. **Submit scores** — click "Submit Scores" to lock in your ratings
5. **Edit if needed** — click "Edit Scores" if you need to change something before the challenge is locked
6. **Repeat** — when the next challenge activates, your form resets automatically

**Tips for judges:**
- Your link is unique — don't share it with other judges
- Scores update the leaderboard immediately after submission
- You can only score the currently active challenge
- Once a challenge is locked by the admin, scores for that challenge are final
- The page auto-refreshes every 5 seconds, so you'll see new challenges appear automatically

---

## How to Configure (Admin Guide)

### Accessing Settings

1. Go to the scoreboard page
2. Click **Admin Settings** at the bottom
3. Enter the PIN (default: `1234`)

### Event Information

| Field | Description | Example |
|-------|-------------|---------|
| Event Name | Displayed as the main heading | "AI Champions Challenge 2026" |
| Description | Shown below the heading | "Q1 Innovation Sprint" |
| Min Score | Lowest score a judge can give | 1 |
| Max Score | Highest score a judge can give | 100 |

**Tip:** For small events (3-5 teams), use a 1-10 range. For larger events, use 1-100 for more differentiation.

### Managing Teams

- Click **+ Add Team** to add a team
- Set an **emoji** (displayed next to the team name on the leaderboard)
- Set the **team name**
- Click the trash icon to remove a team
- **Save Configuration** to persist changes

### Managing Challenges

Challenges have three states:

| State | Meaning | Actions Available |
|-------|---------|-------------------|
| **Upcoming** | Not yet started | Activate |
| **Active** | Currently being scored by judges | Lock, Lock & Next |
| **Locked** | Scoring complete, scores are final | Re-activate (with confirmation) |

**Challenge flow:**
1. All challenges start as **Upcoming**
2. Admin clicks **Activate** to start the first challenge
3. Judges score teams while the challenge is active
4. Admin clicks **Lock & Next** to close the current and open the next
5. Repeat until all challenges are locked

**Important:** Only one challenge can be active at a time. Activating a new challenge automatically locks the current one.

### Managing Judges

- Click **+ Add Judge** to add a judge
- Enter the judge's name
- After saving, click **Generate All Links** to create unique scoring URLs
- **Copy** individual links or **Copy All Links** to share them
- Each judge's link is a unique token — treat it like a password

### Saving Changes

- Click **Save Configuration** to save all changes (event info, teams, challenges, judges)
- **Warning:** Saving rebuilds teams, challenges, and judges from scratch — existing scores are preserved but new teams/challenges start at 0
- Click **Reset to Demo Data** to restore the default sample data (useful for testing)

---

## Event Size Examples

### Small Meeting (2 Teams, 1 Judge, 3 Challenges)

Perfect for a quick team comparison:
- 2 teams competing
- 1 judge (the manager or facilitator)
- 3 short challenges (e.g., pitch, demo, Q&A)
- Score range: 1-10

### Medium Workshop (4-6 Teams, 3 Judges, 5 Challenges)

Good for a half-day workshop or offsite:
- 4-6 teams
- 3 judges (rotating or fixed panel)
- 5 challenges across the event
- Score range: 1-100

### Large Conference (8+ Teams, 5 Judges, 7 Challenges)

Full-scale competition:
- 8+ teams
- 5 judges (executive panel)
- 7 challenges spanning multiple sessions
- Score range: 1-200

---

## URL Reference

| Page | URL | Auth Required |
|------|-----|---------------|
| Live Scoreboard | `/labs/scoreboard` | None |
| Admin Settings | `/labs/scoreboard/settings` | PIN |
| Judge Scoring | `/labs/scoreboard/judge/{token}` | Token (from link) |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Scoreboard shows 0 points | Make sure a challenge is **Active** and judges have submitted scores |
| Judge sees "Invalid or Expired Link" | Generate new links from Admin Settings |
| Scores not updating | The board auto-refreshes every 5 seconds — wait a moment |
| "Waiting for next challenge..." | Admin needs to activate a challenge from Settings |
| Can't save settings | Verify the PIN is correct and all required fields are filled |
| Need to start over | Use **Reset to Demo Data** in Settings to wipe and reload sample data |
