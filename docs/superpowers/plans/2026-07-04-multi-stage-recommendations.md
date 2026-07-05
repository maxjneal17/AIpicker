# Multi-Stage AI Recommendations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the app recommend different AI tools for different parts of a multi-format project, returned as an adaptive single-task-or-workflow result.

**Architecture:** Claude decides per request whether the input is a single task or a multi-format project and returns one adaptive JSON structure (`mode: "single" | "workflow"` with an ordered `stages[]` array). The API route is unchanged structurally; the system prompt is rewritten to produce the new contract; the frontend loops over `stages` and renders either flat cards (single) or a numbered vertical timeline (workflow). The existing `Recommendation` type and `ResultCard` component are reused unchanged.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, `@anthropic-ai/sdk`.

## Global Constraints

- Model must remain `claude-sonnet-4-6` (do not change the model string).
- The `Recommendation` interface (tool, url, category, score, label, why, tags) must not change — it is reused inside each stage.
- Tools database (`TOOLS_DATABASE` in `lib/tools.ts`) must not change.
- Input validation in the API route stays: empty task → 400, task > 1000 chars → 400.
- No new npm dependencies.
- `label` values are exactly `"Best pick"` and `"Alternative"`.
- There is no automated test framework in this repo; verification is manual via `npm run dev` and browser checks.

---

### Task 1: Update the type model

**Files:**
- Modify: `lib/types.ts`

**Interfaces:**
- Consumes: nothing (leaf types).
- Produces:
  - `Recommendation` (unchanged): `{ tool: string; url: string; category: string; score: number; label: "Best pick" | "Alternative"; why: string; tags: string[] }`
  - `Stage`: `{ name: string; description: string; handoff: string | null; recommendations: Recommendation[] }`
  - `RecommendationResult`: `{ query_summary: string; mode: "single" | "workflow"; overview: string | null; stages: Stage[]; caveat: string | null }`

- [ ] **Step 1: Replace the contents of `lib/types.ts` with the new model**

```ts
export interface Recommendation {
  tool: string;
  url: string;
  category: string;
  score: number;
  label: "Best pick" | "Alternative";
  why: string;
  tags: string[];
}

export interface Stage {
  name: string;
  description: string;
  handoff: string | null;
  recommendations: Recommendation[];
}

export interface RecommendationResult {
  query_summary: string;
  mode: "single" | "workflow";
  overview: string | null;
  stages: Stage[];
  caveat: string | null;
}
```

- [ ] **Step 2: Type-check the change**

Run: `npx tsc --noEmit`
Expected: FAIL — errors in `app/page.tsx` (references `result.recommendations`) and `app/api/recommend/route.ts` only reference the type, so the main error is `Property 'recommendations' does not exist on type 'RecommendationResult'` in `app/page.tsx`. This confirms the type changed and shows exactly which consumers to update in later tasks. `lib/types.ts` itself must have no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add adaptive single/workflow recommendation types"
```

---

### Task 2: Rewrite the system prompt to emit the adaptive contract

**Files:**
- Modify: `lib/tools.ts` (the `SYSTEM_PROMPT` export only; leave `TOOLS_DATABASE` and `EXAMPLE_CHIPS` unchanged)

**Interfaces:**
- Consumes: `TOOLS_DATABASE` (unchanged, already interpolated into the prompt).
- Produces: `SYSTEM_PROMPT` string instructing Claude to return JSON matching `RecommendationResult` from Task 1.

- [ ] **Step 1: Replace the `SYSTEM_PROMPT` export in `lib/tools.ts` with the new prompt**

Replace the entire `export const SYSTEM_PROMPT = \`...\`;` block (currently spanning the system-prompt template literal) with:

```ts
export const SYSTEM_PROMPT = `You are an expert AI tool recommender with deep knowledge of every major AI tool available in 2025. A user will describe a task or project they want to accomplish.

Your first job is to decide whether the request is a SINGLE TASK or a MULTI-FORMAT PROJECT:
- SINGLE TASK: one deliverable in one format (e.g. "generate a logo", "write a blog post"). Use mode "single".
- MULTI-FORMAT PROJECT: spans multiple formats or a process with distinct parts best served by different tools (e.g. "an animated explainer video with a voiceover and a landing page"). Use mode "workflow".

Only use "workflow" when the project genuinely has distinct parts. Do NOT pad a simple task into artificial steps. When in doubt, prefer "single".

Here is the tool database to draw from:
${TOOLS_DATABASE}

You may also recommend tools not in this list if they are a genuinely better fit.

Respond ONLY with a valid JSON object (no markdown, no preamble) in this exact format:
{
  "query_summary": "concise one-sentence restatement of what the user wants to do",
  "mode": "single" | "workflow",
  "overview": "workflow only: one sentence describing the overall plan and how the stages fit together. Use null for single mode.",
  "stages": [
    {
      "name": "For single mode use a short label for the task. For workflow mode name this part of the process, e.g. 'Script writing' or 'Video generation'.",
      "description": "1 sentence describing what this stage covers.",
      "handoff": "workflow only: one sentence on how the output of this stage moves into the next (e.g. 'Export the clip from Runway, then caption it in CapCut'). Use null for single mode, and null for the final stage of a workflow.",
      "recommendations": [
        {
          "tool": "Exact Tool Name",
          "url": "https://tool-website.com",
          "category": "e.g. Image Generation",
          "score": 96,
          "label": "Best pick",
          "why": "2-3 sentences explaining specifically why this tool is the best fit for THIS stage. Reference specific features that match what the user wants. Be concrete, not generic.",
          "tags": ["Feature tag 1", "Feature tag 2", "Feature tag 3"]
        },
        {
          "tool": "Alternative Tool Name",
          "url": "https://url.com",
          "category": "category",
          "score": 82,
          "label": "Alternative",
          "why": "2-3 sentences on why this is a strong alternative and how it differs from the best pick.",
          "tags": ["tag1", "tag2", "tag3"]
        }
      ]
    }
  ],
  "caveat": "One practical tip or limitation the user should know across the whole request, or null"
}

Rules:
- SINGLE mode: exactly one stage. Set overview to null and that stage's handoff to null. Provide the best pick plus 2 alternatives (3 recommendations total), matching the depth of a focused recommendation.
- WORKFLOW mode: 2 or more ordered stages. Set overview. Each stage has a best pick plus 1-2 alternatives. Set handoff on every stage except the last, whose handoff is null.
- Every stage's recommendations must contain exactly one item with label "Best pick" (the highest score), listed first, followed by alternatives with label "Alternative".
- Score reflects fit for THIS specific stage (0-100). Be specific in the why fields — reference what the user described.`;
```

- [ ] **Step 2: Type-check (prompt is a plain string, should not introduce type errors)**

Run: `npx tsc --noEmit`
Expected: Same errors as Task 1 (still only `app/page.tsx` consuming the old shape). No new errors originating in `lib/tools.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/tools.ts
git commit -m "feat: rewrite system prompt for adaptive single/workflow output"
```

---

### Task 3: Revert debug instrumentation in the API route

**Files:**
- Modify: `app/api/recommend/route.ts` (the `catch` block only)

**Interfaces:**
- Consumes: `RecommendationResult` (type only — the `JSON.parse` result is annotated with it).
- Produces: unchanged POST handler behavior; generic 500 on failure.

- [ ] **Step 1: Restore the generic catch block**

Replace the current debug `catch` block:

```ts
  } catch (error) {
    console.error("Recommend API error:", error);
    // TEMPORARY DEBUG: surface the real error so we can diagnose the 500.
    // Revert this to a generic message once the root cause is found.
    const detail =
      error instanceof Error ? error.message : JSON.stringify(error);
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? (error as { status?: number }).status
        : undefined;
    return NextResponse.json(
      { error: "Failed to get recommendation", detail, apiStatus: status },
      { status: 500 }
    );
  }
```

with:

```ts
  } catch (error) {
    console.error("Recommend API error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendation" },
      { status: 500 }
    );
  }
```

- [ ] **Step 2: Confirm the route still references the type correctly**

Run: `npx tsc --noEmit`
Expected: Errors remain only in `app/page.tsx`. `app/api/recommend/route.ts` has no errors (it annotates `const result: RecommendationResult = JSON.parse(clean);`, which is still valid against the new type).

- [ ] **Step 3: Commit**

```bash
git add app/api/recommend/route.ts
git commit -m "chore: remove temporary debug detail from recommend API"
```

---

### Task 4: Render stages in the UI

**Files:**
- Modify: `app/page.tsx` (the results-rendering block, currently under `{status === "done" && result && (...)}`)
- Read (do not modify): `components/ResultCard.tsx` — renders one `Recommendation` via prop `rec` and `rank`.

**Interfaces:**
- Consumes: `RecommendationResult`, `Stage` from `lib/types.ts`; `ResultCard` component with props `{ rec: Recommendation; rank: number }`.
- Produces: rendered output for both modes.

- [ ] **Step 1: Update the import of `RecommendationResult` (already imported) and add `Stage`**

In `app/page.tsx`, change the types import line:

```ts
import { RecommendationResult } from "@/lib/types";
```

to:

```ts
import { RecommendationResult, Stage } from "@/lib/types";
```

- [ ] **Step 2: Replace the results block**

Find the current results block (starts at `{status === "done" && result && (` and ends at its closing `)}` before the final `</div>` of the container). Replace the whole block with:

```tsx
        {/* Results */}
        {status === "done" && result && (
          <div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              Recommendations for: &ldquo;{result.query_summary}&rdquo;
            </div>

            {/* Workflow overview (the plan) */}
            {result.mode === "workflow" && result.overview && (
              <div className="rounded-lg bg-purple-50 border border-purple-100 px-4 py-3 text-sm text-purple-900 leading-relaxed mb-6">
                <span className="font-medium">The plan: </span>
                {result.overview}
              </div>
            )}

            {result.mode === "single" ? (
              /* Single task: flat list of cards, like before */
              <div className="flex flex-col gap-3 mb-4">
                {result.stages[0]?.recommendations.map((rec, i) => (
                  <ResultCard key={rec.tool} rec={rec} rank={i + 1} />
                ))}
              </div>
            ) : (
              /* Workflow: numbered vertical timeline of stages */
              <div className="flex flex-col gap-6 mb-4">
                {result.stages.map((stage: Stage, sIndex: number) => (
                  <div key={stage.name} className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-800 text-purple-50 text-sm font-medium flex items-center justify-center">
                        {sIndex + 1}
                      </span>
                      <h2 className="text-base font-medium text-gray-900">
                        {stage.name}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3 ml-10">
                      {stage.description}
                    </p>
                    <div className="flex flex-col gap-3 ml-10">
                      {stage.recommendations.map((rec, i) => (
                        <ResultCard key={rec.tool} rec={rec} rank={i + 1} />
                      ))}
                    </div>
                    {stage.handoff && (
                      <div className="ml-10 mt-3 text-sm text-gray-400 italic border-l-2 border-gray-200 pl-3">
                        &darr; {stage.handoff}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Caveat */}
            {result.caveat && (
              <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-500 leading-relaxed mt-2">
                💡 {result.caveat}
              </div>
            )}

            {/* Try again */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setStatus("idle");
                  setResult(null);
                  setTask("");
                }}
                className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 transition"
              >
                Search again
              </button>
            </div>
          </div>
        )}
```

- [ ] **Step 3: Type-check the whole project**

Run: `npx tsc --noEmit`
Expected: PASS (no output). All consumers now match the new type.

- [ ] **Step 4: Build to confirm no compile errors**

Run: `npm run build`
Expected: Build completes successfully (`✓ Compiled successfully`).

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: render single-task and workflow recommendation modes"
```

---

### Task 5: Manual verification of both modes

**Files:**
- None (verification only).

**Interfaces:**
- Consumes: the running app.
- Produces: confirmation that both modes work end-to-end.

> Requires a valid `ANTHROPIC_API_KEY` in `.env.local` for local runs.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: Server starts on http://localhost:3000.

- [ ] **Step 2: Verify single mode**

In the browser, submit: `generate a logo`
Expected: One flat list of recommendation cards (best pick + 2 alternatives), no numbered stages, no "The plan" banner. Behaves like the original app.

- [ ] **Step 3: Verify workflow mode**

In the browser, submit: `an animated explainer video with a voiceover and a matching landing page`
Expected: A "The plan" overview banner at top, then numbered stages (e.g. script → video → voiceover → landing page), each with a best pick + alternatives, and handoff notes between stages (none after the last). A caveat may appear at the bottom.

- [ ] **Step 4: Verify error handling still works**

Temporarily stop the dev server or submit with an invalid key, submit any task.
Expected: The red "Something went wrong — please try again." banner appears; no crash.

- [ ] **Step 5: Commit any final tweaks (if changes were needed)**

If Steps 2–4 required prompt or UI adjustments, commit them:

```bash
git add -A
git commit -m "fix: adjust output for correct single/workflow rendering"
```

If no changes were needed, this step is a no-op.

---

## Self-Review Notes

- **Spec coverage:** adaptive mode (Task 2 prompt + Task 1 types), per-stage best pick + alternatives (Task 2 rules + Task 4 rendering), overview + handoff notes (Task 2 + Task 4), single-mode parity with today (Task 4 single branch), debug revert (Task 3), model unchanged (Global Constraints), manual testing (Task 5). All spec sections map to a task.
- **Types:** `Recommendation` unchanged; `Stage` and `RecommendationResult` defined in Task 1 and consumed with matching property names (`mode`, `overview`, `stages`, `handoff`, `recommendations`) in Tasks 3 and 4.
- **No placeholders:** all steps contain concrete code and exact commands.
