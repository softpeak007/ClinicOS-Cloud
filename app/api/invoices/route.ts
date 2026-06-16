import { NextRequest, NextResponse } from "next/server";
import { getInvoices, addInvoice, updateInvoice } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic-default";
    const invoices = getInvoices(clinicId);
    return NextResponse.json({ success: true, data: invoices });
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
    if (!body.patientId || !body.patientName || !body.amount || !body.dueDate || !body.service) {
      return NextResponse.json({ success: false, error: "Missing required fields (patientId, patientName, amount, dueDate, service)" }, { status: 400 });
    }

    const inv = addInvoice(body, clinicId, userId);
    return NextResponse.json({ success: true, data: inv });
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
      return NextResponse.json({ success: false, error: "Missing invoice ID" }, { status: 400 });
    }

    const inv = updateInvoice(id, updatedData, clinicId, userId);
    if (!inv) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: inv });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
