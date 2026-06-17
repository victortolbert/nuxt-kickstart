---
name: slc-product-planner
description: "Helps plan a new product or feature using the Simple, Lovable, Complete framework. Use when you need to define an MVP scope that is simple yet delightful and fully functional (SLC approach), or when comparing MVP vs SLC strategies for product planning."
---

# SLC Product Planner

## What This Skill Does

This skill guides you (or an AI agent) through planning a product or feature release according to the **Simple, Lovable, Complete (SLC)** framework. It ensures that any proposed v1 solution is minimal in scope, includes a lovable user experience element, and is functionally complete for its primary use-case. The skill is triggered for queries about product roadmaps, MVP planning, or when explicitly asked about SLC-style development.

**Key capabilities include:**

- **Scope Refinement:** It will help identify the *single core use-case* for the product and suggest cutting out secondary features. (This addresses the **Simple** aspect of SLC.)
- **Lovable UX Suggestions:** It provides ideas for small but impactful UX details or design choices that can make the early product delightful for users, not just usable. (Addressing the **Lovable** aspect.)
- **Completeness Check:** It outlines the critical components needed so that the product is **usable end-to-end** for that core use-case, avoiding the pitfalls of an incomplete MVP. (Ensuring **Complete** functionality.)

## SLC Planning Prompt Design

When activated, the skill uses a structured planning prompt to generate an SLC-aligned plan. It will typically produce an output with three sections – *Simple*, *Lovable*, *Complete* – under a given use-case. The internal prompt (used by Claude when applying this skill) is along these lines:

> **User Request (for context):** _e.g. "Plan the first version of an e-commerce app using SLC principles"_
> **Skill Plan:** Identify the primary user goal and minimal feature set needed (Simple). Propose one or two delightful UX elements that would make this minimal product feel special (Lovable). Ensure the plan covers all necessary functionality for purchasing flow to work without gaps (Complete).
> **Format:** Provide a brief description of the product context, then list recommendations under **Simple**, **Lovable**, **Complete** headings.

*(The above is embedded in the skill to guide the response structure. Claude will follow this format when the skill is invoked.)*

## Quick Start

**Using this Skill in Claude.ai or Claude API:**

1. **Install the Skill:** Save the above `SKILL.md` to a folder (e.g., `slc-product-planner`) and zip it, or add it to your Claude skills directory (`~/.claude/skills/`). Upload it via the Claude web interface under **Settings > Capabilities > Skills**, or use the Claude API to create the skill (as documented in Anthropic’s skill upload guide).
2. **Invoke the Skill:** Simply ask Claude a planning question that implies SLC. For example, in a chat prompt say: *“I have an idea for a habit-tracking app. Can you outline a Simple, Lovable, Complete v1 for it?”* The skill will recognize the context and automatically provide a structured plan. You should see Claude’s answer broken into **Simple**, **Lovable**, and **Complete** sections with concrete suggestions.
3. **Local Dev Agent Usage:** If you're running a local dev-agent loop (e.g. a bash or Python script that iteratively plans and builds features), ensure the agent loads this skill. The agent’s planning step can be as easy as making an API call to Claude with your request. For instance, via cURL or the Anthropics Python SDK, you might include your prompt and get a response. The skill’s guidance will be applied behind the scenes. **Example CLI invocation:**

   ```bash
   # Pseudo-code: using curl to call Claude API with the skill active
   curl -H "Authorization: Bearer $CLAUDE_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{
              "model": "claude-2",
              "prompt": "Plan an SLC-style MVP for a recipe sharing platform.",
              "max_tokens_to_sample": 1000
            }' \
        https://api.anthropic.com/v1/complete
