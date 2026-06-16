import { NextRequest, NextResponse } from "next/server";
import { getAppointments, getReports } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic-default";
    
    const appointments = getAppointments(clinicId);
    const reports = getReports(clinicId);
    const todayStr = "2026-06-13";

    // Grab all completed appointments
    const completedApps = appointments.filter(a => a.status === "Completed");
    const missingReports = [];

    for (const app of completedApps) {
      // Check if report with same patientId exists
      const hasReport = reports.some(r => r.patientId === app.patientId);
      if (!hasReport) {
        // Calculate days elapsed since the appointment
        const appDate = new Date(app.date);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate.getTime() - appDate.getTime());
        const daysPending = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isOverdue = daysPending > 7;

        // Establish Report Type Needed based on appointment reason
        let reportTypeNeeded = "Diagnostic Report";
        const reasonLower = app.reason.toLowerCase();
        if (reasonLower.includes("hba1c") || reasonLower.includes("blood") || reasonLower.includes("glucose")) {
          reportTypeNeeded = "Lab Panel (Endocrinology)";
        } else if (reasonLower.includes("bp") || reasonLower.includes("hypertension") || reasonLower.includes("cardio")) {
          reportTypeNeeded = "EKG / Cardiovascular Record";
        } else if (reasonLower.includes("asthma") || reasonLower.includes("spirometry")) {
          reportTypeNeeded = "Spirometry / Pulmonary Function";
        } else if (reasonLower.includes("psychiatric") || reasonLower.includes("anxiety") || reasonLower.includes("lexapro")) {
          reportTypeNeeded = "Psychiatry Assessment Note";
        }

        missingReports.push({
          id: `missing-${app.id}`,
          appointmentId: app.id,
          patientId: app.patientId,
          patientName: app.patientName,
          appointmentDate: app.date,
          reportTypeNeeded,
          duration: app.duration,
          reason: app.reason,
          daysPending,
          isOverdue
        });
      }
    }

    // Sort by largest days pending (descending order)
    missingReports.sort((a, b) => b.daysPending - a.daysPending);

    return NextResponse.json({
      success: true,
      data: missingReports
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
