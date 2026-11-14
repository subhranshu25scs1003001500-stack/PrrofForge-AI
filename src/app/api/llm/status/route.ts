import { NextResponse } from "next/server";
import { SharedLlmService } from "@/lib/llm/llm-service";

export async function GET() {
  try {
    const status = SharedLlmService.getStatus();
    return NextResponse.json({
      success: true,
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

