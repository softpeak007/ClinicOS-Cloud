import { NextRequest, NextResponse } from "next/server";
import { getPatientReadings } from "@/lib/db";

// Helper to determine blood pressure risk level
function getBPRisk(bp: string): "Normal" | "Review" | "Urgent" {
  try {
    const [sysStr, diaStr] = bp.split("/");
    const sys = parseInt(sysStr, 10);
    const dia = parseInt(diaStr, 10);
    
    if (sys >= 140 || dia >= 90) return "Urgent";
    if (sys >= 120 || dia >= 80) return "Review";
    return "Normal";
  } catch (e) {
    return "Normal";
  }
}

// Helper to check glucose risk level
function getGlucoseRisk(glucose: number): "Normal" | "Review" | "Urgent" {
  if (glucose >= 126) return "Urgent";
  if (glucose >= 100) return "Review";
  return "Normal";
}

// Helper to check pulse risk level
function getPulseRisk(pulse: number): "Normal" | "Review" | "Urgent" {
  if (pulse > 100 || pulse < 50) return "Urgent";
  if (pulse > 90 || pulse < 60) return "Review";
  return "Normal";
}

// Helper to check HbA1c risk level
function getHbA1cRisk(hba1c: number): "Normal" | "Review" | "Urgent" {
  if (hba1c >= 6.5) return "Urgent";
  if (hba1c >= 5.7) return "Review";
  return "Normal";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic-default";
    
    const readings = getPatientReadings(clinicId);

    // Map over readings to evaluate individual biometrics risk
    const enrichedReadings = readings.map(r => {
      const bpStatus = getBPRisk(r.bloodPressure);
      const glucoseStatus = getGlucoseRisk(r.glucose);
      const pulseStatus = getPulseRisk(r.pulse);
      const hba1cStatus = getHbA1cRisk(r.hba1c);

      // Determine cumulative risk status: Red (Urgent) > Orange (Review) > Green (Normal)
      let overallStatus: "Normal" | "Review" | "Urgent" = "Normal";
      if (bpStatus === "Urgent" || glucoseStatus === "Urgent" || pulseStatus === "Urgent" || hba1cStatus === "Urgent") {
        overallStatus = "Urgent";
      } else if (bpStatus === "Review" || glucoseStatus === "Review" || pulseStatus === "Review" || hba1cStatus === "Review") {
        overallStatus = "Review";
      }

      return {
        ...r,
        status: overallStatus, // Override status with calculated cumulative risk just in case
        biometrics: {
          bloodPressure: { value: r.bloodPressure, status: bpStatus },
          glucose: { value: r.glucose, status: glucoseStatus },
          pulse: { value: r.pulse, status: pulseStatus },
          hba1c: { value: r.hba1c, status: hba1cStatus }
        }
      };
    });

    // Sort by "Urgent" first, then "Review", then "Normal"
    enrichedReadings.sort((a, b) => {
      const priority = { "Urgent": 2, "Review": 1, "Normal": 0 };
      return priority[b.status] - priority[a.status];
    });

    return NextResponse.json({
      success: true,
      data: enrichedReadings
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
