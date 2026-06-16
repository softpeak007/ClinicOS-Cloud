import { NextRequest, NextResponse } from "next/server";
import { getAppointments, getInvoices, getReports, getPatientReadings, getPatients } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic-default";
    
    // Secure Tenant Loading
    const appointments = getAppointments(clinicId);
    const invoices = getInvoices(clinicId);
    const reports = getReports(clinicId);
    const readings = getPatientReadings(clinicId);
    const patients = getPatients(clinicId);

    // Today's Local Offset: 2026-06-13
    const todayStr = "2026-06-13";

    // 1. Today's Appointments Breakdown
    const todayApps = appointments.filter(a => a.date === todayStr);
    const totalToday = todayApps.length;
    const completedToday = todayApps.filter(a => a.status === "Completed").length;
    const upcomingToday = todayApps.filter(a => a.status === "Scheduled").length;
    const cancelledToday = todayApps.filter(a => a.status === "Cancelled" || a.status === "No Show").length;

    // Risk indicator if we have too many pending/upcoming today (e.g. > 1 scheduled and close to limit)
    const pendingTooHigh = upcomingToday >= 2;

    // 2. Unpaid & Overdue Invoices
    const unpaidInvoices = invoices.filter(i => i.status === "Unpaid");
    const totalUnpaidAmount = unpaidInvoices.reduce((sum, i) => sum + i.amount, 0);
    
    // Check overdue invoices (status is 'Unpaid' or 'Overdue' and dueDate is past 2026-06-13)
    const overdueInvoices = invoices.filter(i => 
      (i.status === "Overdue") || 
      (i.status === "Unpaid" && new Date(i.dueDate) < new Date(todayStr))
    );
    const overdueAmount = overdueInvoices.reduce((sum, i) => sum + i.amount, 0);
    const overdueCount = overdueInvoices.length;

    // 3. Missing Reports after completed appointments
    // Completed appointments on or before 2026-06-13
    const completedAppointments = appointments.filter(a => a.status === "Completed");
    const missingReports = [];

    for (const app of completedAppointments) {
      // Find if there is an uploaded report for this patient
      const hasReport = reports.some(r => r.patientId === app.patientId);
      if (!hasReport) {
        const appDate = new Date(app.date);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate.getTime() - appDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isOlderThan7Days = diffDays > 7 && appDate < todayDate;

        missingReports.push({
          appointmentId: app.id,
          patientId: app.patientId,
          patientName: app.patientName,
          appointmentDate: app.date,
          reportTypeNeeded: app.reason.toLowerCase().includes("hba1c") || app.reason.toLowerCase().includes("glucose") ? "Lab Test" : 
                            app.reason.toLowerCase().includes("asthma") ? "Spirometry / Respiratory" : "Clinical Progress Note",
          daysPending: diffDays,
          isOverdue: isOlderThan7Days
        });
      }
    }

    const missingReportsCount = missingReports.length;

    // 4. Abnormal Readings
    const criticalReadingsCount = readings.filter(r => r.status === "Urgent").length;
    const reviewReadingsCount = readings.filter(r => r.status === "Review").length;

    // 5. Revenue Trend 7 and 30 Days (from simulated timestamps/dueDates)
    // Paid revenue & projects
    const paidRevenue30 = invoices.filter(i => i.status === "Paid").reduce((sum, i) => sum + i.amount, 0);
    const unpaidRevenue30 = invoices.filter(i => i.status === "Unpaid").reduce((sum, i) => sum + i.amount, 0);
    const projectedRevenue30 = paidRevenue30 + unpaidRevenue30;

    const paidRevenue7 = invoices.filter(i => i.status === "Paid" && i.dueDate >= "2026-06-06").reduce((sum, i) => sum + i.amount, 0);
    const unpaidRevenue7 = invoices.filter(i => i.status === "Unpaid" && i.dueDate >= "2026-06-06").reduce((sum, i) => sum + i.amount, 0);
    const projectedRevenue7 = paidRevenue7 + unpaidRevenue7;

    return NextResponse.json({
      success: true,
      data: {
        kpis: {
          todayAppointments: totalToday,
          pendingAppointments: upcomingToday,
          completedAppointments: completedToday,
          cancelledAppointments: cancelledToday,
          appointmentsRisk: pendingTooHigh,
          totalUnpaidAmount,
          overdueInvoicesCount: overdueCount,
          overdueInvoicesAmount: overdueAmount,
          missingReportsCount,
          criticalReadingsCount,
          reviewReadingsCount,
          revenue7Day: paidRevenue7,
          revenue30Day: paidRevenue30,
          projectedRevenue30,
          projectedRevenue7,
        }
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
