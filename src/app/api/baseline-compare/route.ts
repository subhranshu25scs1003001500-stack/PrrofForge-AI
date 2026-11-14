import { NextRequest, NextResponse } from "next/server";
import { getLlmProvider } from "@/lib/llm/provider";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 });
    }

    const provider = getLlmProvider();
    const naivePrompt = `Provide a concise, direct scientific answer to this research inquiry: "${query}"`;
    const naiveAnswer = await provider.complete({
      systemPrompt: "You are a standard direct AI assistant. Provide a concise answer.",
      userPrompt: naivePrompt,
      maxTokens: 300,
    });

    return NextResponse.json({
      success: true,
      query,
      naiveAnswer,
      comparisonHighlights: [
        "Naive LLM generates answers without measuring conclusion stability.",
        "ProofForge decomposes claims into atomic propositions and runs evidence mutation tests.",
        "ProofForge exposes hidden selection bias and empirical fragility.",
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

