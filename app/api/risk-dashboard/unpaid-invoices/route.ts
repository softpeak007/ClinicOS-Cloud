import { NextRequest, NextResponse } from "next/server";
import { getInvoices } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic-default";
    
    const invoices = getInvoices(clinicId);
    const todayStr = "2026-06-13";

    // Filtering unpaid invoices
    const unpaid = invoices.filter(i => i.status !== "Paid");

    // Map over unpaid invoices to add explicit overdue boolean & warning parameters
    const enrichedUnpaid = unpaid.map(i => {
      const isOverdue = i.status === "Overdue" || new Date(i.dueDate) < new Date(todayStr);
      
      // Calculate days overdue
      let daysOverdue = 0;
      if (isOverdue) {
        const diffTime = Math.abs(new Date(todayStr).getTime() - new Date(i.dueDate).getTime());
        daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      return {
        ...i,
        isOverdue,
        daysOverdue,
        riskTier: daysOverdue > 14 ? "Critical" : daysOverdue > 0 ? "Warning" : "Standard Pending"
      };
    });

    // Sort: most critical (daysOverdue high) first, then upcoming due dates
    enrichedUnpaid.sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      return b.daysOverdue - a.daysOverdue;
    });

    return NextResponse.json({
      success: true,
      data: enrichedUnpaid
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
