import { NextRequest, NextResponse } from "next/server";
import { StorageAdapter } from "@/lib/storage/adapter";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const investigation = await StorageAdapter.getInvestigation(params.id);
    if (!investigation) {
      return NextResponse.json(
        { success: false, error: "Investigation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, investigation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await StorageAdapter.deleteInvestigation(params.id);
    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

