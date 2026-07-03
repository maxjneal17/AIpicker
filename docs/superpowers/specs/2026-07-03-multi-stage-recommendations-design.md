# Multi-Stage AI Recommendations — Design

**Date:** 2026-07-03
**Status:** Approved, ready for implementation planning

## Problem

Today the app takes a single task description and returns exactly 3 AI tool
recommendations for that one task. It cannot handle projects that span multiple
formats — e.g. "an animated explainer video with a voiceover and a matching
landing page" — where different parts of the process are best served by
different AI tools. Users doing multi-format work get a flat list of 3 tools
instead of a coherent, stage-by-stage plan.

## Goal

For complex, multi-format projects, recommend different AI tools for different
parts of the process, presented as an ordered workflow. Simple single-task
requests should keep working as they do today.

## Behavior

**Adaptive output.** Claude decides per request whether it is a single task or a
multi-format project, and returns one structure that covers both:

- **Single task** → one stage, rendered like today (best pick + alternatives).
- **Multi-format project** → an ordered sequence of stages, each with its own
  best-pick tool plus 1–2 alternatives, tied together by a top-level overview
  ("the plan") and per-stage handoff notes.

Claude decomposes a project into only as many stages as genuinely needed — no
padding simple requests into artificial multi-step workflows.

## Data model

One adaptive schema serves both modes. The existing `Recommendation` interface
is reused unchanged inside each stage.

```ts
interface RecommendationResult {
  query_summary: string;       // restatement of what the user wants (kept)
  mode: "single" | "workflow"; // Claude decides
  overview: string | null;     // workflow only: one-line "the plan"
  stages: Stage[];             // single task = 1 stage; workflow = N ordered stages
  caveat: string | null;       // overall tip/limitation (kept)
}

interface Stage {
  name: string;                // e.g. "Script writing", "Video generation"
  description: string;         // what this part of the process is
  handoff: string | null;      // workflow only: how output moves to the next stage
  recommendations: Recommendation[]; // best pick + 1-2 alternatives
}

interface Recommendation {     // UNCHANGED from current lib/types.ts
  tool: string;
  url: string;
  category: string;
  score: number;
  label: "Best pick" | "Alternative";
  why: string;
  tags: string[];
}
```

Rules:
- `mode: "single"` → exactly one stage; `overview` and each `stage.handoff` are `null`.
- `mode: "workflow"` → 2+ ordered stages; `overview` is set; `handoff` is set on
  each stage except (optionally) the last.
- The frontend has a single code path: it always loops over `stages`.

## Components affected

### `lib/types.ts`
Add `mode`, `overview`, `stages`, and the `Stage` interface. `Recommendation`
is unchanged.

### `lib/tools.ts` (system prompt)
Rewrite the prompt to:
1. First judge single-task vs multi-format project.
2. Decompose a project into ordered stages (only as many as needed).
3. Pick a best tool + 1–2 alternatives per stage.
4. Write a top-level `overview` and per-stage `handoff` notes for workflows.
5. Emit the new JSON contract. Include one worked example of each mode so output
   stays consistent.

The tools database (`TOOLS_DATABASE`) is unchanged.

### `app/api/recommend/route.ts`
- No structural change to the request handling.
- Revert the temporary debug `detail`/`apiStatus` in the `catch` block back to
  the generic error message (debugging is complete).
- Keep existing input validation (empty task → 400, >1000 chars → 400).

### `app/page.tsx`
- Loop over `result.stages`.
- **Single mode:** render the one stage's recommendation cards as today (no stage
  header).
- **Workflow mode:** render a vertical numbered timeline. Each stage block shows a
  number badge + stage name, the description, its recommendation cards, and the
  `handoff` note styled as a connector to the next stage. `overview` renders at the
  top as the plan; `caveat` stays at the bottom.

### `components/ResultCard.tsx`
Essentially untouched — still renders a single `Recommendation`.

## Model

Keep `claude-sonnet-4-6`. It handles the multi-step decomposition well and keeps
per-request cost low. Easy to bump to a stronger model later if results disappoint.

## Error handling

- API route: generic 500 with `{ error: "Failed to get recommendation" }` (debug
  instrumentation removed).
- Frontend: existing try/catch → red error banner on any non-OK response.

## Testing

No test framework is set up in this project. Verify by running representative
prompts against the deployed/local app:
- Simple: "generate a logo" → `mode: "single"`, one stage, renders like today.
- Multi-format: "animated explainer video with voiceover and a landing page" →
  `mode: "workflow"` with distinct ordered stages (e.g. script → video → voiceover
  → landing page), overview and handoff notes present.

Confirm the returned JSON validates against the new schema and renders correctly
in both modes.

## Out of scope (YAGNI)

- User-selectable single/workflow mode toggle (Claude decides adaptively).
- Persisting or sharing workflows.
- Changes to the tools database or scoring model.
- Automated test harness (none exists; manual verification for now).
