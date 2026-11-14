import { NextRequest, NextResponse } from "next/server";
import { InvestigationOrchestrator } from "@/lib/agents/orchestrator";
import { StorageAdapter } from "@/lib/storage/adapter";

export async function GET() {
  try {
    const list = await StorageAdapter.listInvestigations();
    return NextResponse.json({ success: true, investigations: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query?.trim();
    const domain = body.domain?.trim() || "General Scientific & Empirical";
    const selectedModel = body.selectedModel?.trim() || "auto";

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Research query is required" },
        { status: 400 }
      );
    }

    const investigation = await InvestigationOrchestrator.createInvestigation(query, domain, selectedModel);
    return NextResponse.json({ success: true, investigation }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

