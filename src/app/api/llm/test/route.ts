import { NextRequest, NextResponse } from "next/server";
import { SharedLlmService } from "@/lib/llm/llm-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = body.prompt?.trim() || "What is the primary significance of evidence mutation testing in scientific verification?";
    const preferredProvider = body.preferredProvider || "auto";
    const model = body.model;

    const result = await SharedLlmService.complete({
      systemPrompt: "You are the ProofForge LLM Diagnostic Auditor. Provide a clear, concise 2-sentence response.",
      userPrompt: prompt,
      maxTokens: 200,
      model,
      preferredProvider,
    });

    return NextResponse.json({
      success: true,
      result,
      prompt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

