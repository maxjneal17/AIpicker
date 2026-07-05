"use client";

import { useState } from "react";
import ResultCard from "@/components/ResultCard";
import { RecommendationResult, Stage } from "@/lib/types";
import { EXAMPLE_CHIPS } from "@/lib/tools";

type Status = "idle" | "loading" | "done" | "error";

export default function Home() {
  const [task, setTask] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<RecommendationResult | null>(null);

  async function handleSubmit() {
    if (!task.trim()) return;

    setStatus("loading");
    setResult(null);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });

      if (!res.ok) throw new Error("API error");

      const data: RecommendationResult = await res.json();
      setResult(data);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function handleChipClick(chip: string) {
    setTask(chip);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-14">

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 tracking-tight mb-2">
            Find the right AI for your task
          </h1>
          <p className="text-base text-gray-500 leading-relaxed">
            Describe what you want to create or accomplish. Get a ranked
            recommendation from 60+ AI tools — with clear reasons why.
          </p>
        </div>

        {/* Input */}
        <div className="mb-4">
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. I want to create a short animated explainer video for my startup's product launch..."
            rows={4}
            className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-base leading-relaxed resize-none outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 placeholder-gray-400 transition"
          />
          <p className="text-xs text-gray-400 mt-1.5 text-right">
            Press Enter to search, or Shift+Enter for a new line
          </p>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {EXAMPLE_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-500 text-sm hover:border-purple-400 hover:text-purple-800 hover:bg-purple-50 transition"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Submit button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleSubmit}
            disabled={status === "loading" || !task.trim()}
            className="px-6 py-2.5 rounded-lg bg-purple-800 text-purple-50 text-sm font-medium hover:bg-purple-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          >
            {status === "loading" ? "Finding best AI…" : "Find best AI →"}
          </button>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="flex items-center gap-3 text-gray-500 text-sm mb-6">
            <svg
              className="animate-spin h-4 w-4 text-purple-600"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Analysing your task…
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-6">
            Something went wrong — please try again.
          </div>
        )}

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
      </div>
    </main>
  );
}
