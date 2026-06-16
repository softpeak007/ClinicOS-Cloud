import { NextRequest, NextResponse } from "next/server";
import { getAppointments, addAppointment, updateAppointment } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic-default";
    const appointments = getAppointments(clinicId);
    return NextResponse.json({ success: true, data: appointments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic-default";
    const userId = searchParams.get("userId") || "user-default";
    
    const body = await req.json();
    
    // Inputs validation
    if (!body.patientId || !body.patientName || !body.date || !body.time) {
      return NextResponse.json({ success: false, error: "Missing required fields (patientId, patientName, date, time)" }, { status: 400 });
    }

    const app = addAppointment(body, clinicId, userId);
    return NextResponse.json({ success: true, data: app });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic-default";
    const userId = searchParams.get("userId") || "user-default";
    
    const { id, ...updatedData } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing appointment ID" }, { status: 400 });
    }

    const app = updateAppointment(id, updatedData, clinicId, userId);
    if (!app) {
      return NextResponse.json({ success: false, error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: app });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
