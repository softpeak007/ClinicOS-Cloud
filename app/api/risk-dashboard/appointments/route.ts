import { NextRequest, NextResponse } from "next/server";
import { getAppointments } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic-default";
    
    const appointments = getAppointments(clinicId);
    const todayStr = "2026-06-13";

    // Filtering for today's date
    const todayApps = appointments.filter(a => a.date === todayStr);

    const scheduled = todayApps.filter(a => a.status === "Scheduled").length;
    // Highlight a operational risk if too many scheduled appointments remain unresolved
    const riskStatus = scheduled >= 2 ? "High Congestion Potential" : "Normal Load";

    return NextResponse.json({
      success: true,
      data: {
        appointments: todayApps,
        riskStatus,
        congestionWarning: scheduled >= 3
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
