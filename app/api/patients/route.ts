import { NextRequest, NextResponse } from "next/server";
import { getPatients, addPatient, updatePatient } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic-default";
    const patients = getPatients(clinicId);
    return NextResponse.json({ success: true, data: patients });
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
    if (!body.name || !body.email || !body.dob) {
      return NextResponse.json({ success: false, error: "Missing required fields (name, email, dob)" }, { status: 400 });
    }

    const patient = addPatient(body, clinicId, userId);
    return NextResponse.json({ success: true, data: patient });
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
      return NextResponse.json({ success: false, error: "Missing patient ID" }, { status: 400 });
    }

    const patient = updatePatient(id, updatedData, clinicId, userId);
    if (!patient) {
      return NextResponse.json({ success: false, error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: patient });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
