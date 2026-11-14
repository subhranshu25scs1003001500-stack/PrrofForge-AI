import { NextRequest, NextResponse } from "next/server";
import { InvestigationOrchestrator } from "@/lib/agents/orchestrator";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updated = await InvestigationOrchestrator.executeNextStep(params.id);
    return NextResponse.json({
      success: true,
      investigation: updated,
      isCompleted: updated.stage === "COMPLETED",
      currentStage: updated.stage,
      stepIndex: updated.currentStepIndex,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

