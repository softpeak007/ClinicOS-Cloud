import { NextRequest, NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic-default";
    
    const logs = getAuditLogs(clinicId);

    // Limit to latest 30 logs for risk review
    const recentLogs = logs.slice(0, 30);

    return NextResponse.json({
      success: true,
      data: recentLogs
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
