---
description: Fix a specific accessibility issue with before/after visual verification
---

# Accessibility Fix

Guided workflow for fixing a specific accessibility issue, with visual verification.

## Prerequisites

- Load `models/accessibility/ACCESSIBILITY-PATTERNS.md` for standing principles
- Do NOT attempt to scan for or identify issues yourself

## Step 1: Understand the Issue

The developer describes the accessibility issue. Gather to the best of your ability:

- **What** the specific issue is (e.g., missing aria-label, incorrect role, contrast failure)
- **Where** the developer believes it is in the code (e.g., file, component, element) knowing this could be wrong
- **How** it was identified (Axe audit, screen reader testing, manual inspection, etc.)

If any of these are unclear, ask before proceeding. The more specific the input, the better the fix.

## Step 2: Before Snapshot

Take a Playwright screenshot of the affected page/component in its current state.

Save as `before-a11y-fix.png` in the project working directory.

## Step 3: Discuss the Fix

Read the relevant code and explain:

- What's causing the issue
- The proposed fix and why it's semantically correct
- Any trade-offs or risks (style breakage, hierarchy changes)

Do NOT modify files directly. Present the proposed changes and let the developer decide whether to apply them, adjust, or type the fix themselves. Guide the fix, don't own it.

Questions to surface:

- Does the ARIA role match the actual content purpose?
- Does the element hierarchy remain logically correct?
- Will existing styles still apply correctly?

## Step 4: After Snapshot

Once the fix is applied (by either party), take a Playwright screenshot of the same page/component.

Save as `after-a11y-fix.png` in the project working directory.

## Step 5: Review

Present both screenshots for visual comparison. Flag any visible differences.

The developer makes the final call on whether to keep the fix.
