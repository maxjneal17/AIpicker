import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/tools";
import { RecommendationResult } from "@/lib/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { task } = await req.json();

    if (!task || typeof task !== "string" || task.trim().length === 0) {
      return NextResponse.json({ error: "No task provided" }, { status: 400 });
    }

    if (task.length > 1000) {
      return NextResponse.json({ error: "Task too long" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: task.trim() }],
    });

    const raw = message.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    const clean = raw.replace(/```json|```/g, "").trim();
    const result: RecommendationResult = JSON.parse(clean);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Recommend API error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendation" },
      { status: 500 }
    );
  }
}
