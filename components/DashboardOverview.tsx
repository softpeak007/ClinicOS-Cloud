/* eslint-disable */
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Calendar, FileText, CreditCard, ArrowUpRight, 
  Clock, Shield, Sparkles, ChevronRight, Activity, TrendingUp
} from 'lucide-react';

interface Metric {
  title: string;
  value: string;
  icon: any;
  change: string;
  isPositive: boolean;
  navTab: string;
  color: string;
  bgGlow: string;
}

interface DashboardOverviewProps {
  onNavigation: (tab: string) => void;
  onOpenPatientChart: (patientId: string) => void;
}

export default function DashboardOverview({ onNavigation, onOpenPatientChart }: DashboardOverviewProps) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [revenueStats, setRevenueStats] = useState({ totalPaid: 0, outstanding: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardState = async () => {
      try {
        setLoading(true);
        // Load Patients count for metrics
        const patRes = await fetch('/api/patients?clinicId=clinic-default');
        const patData = await patRes.json();
        const patientCount = patData.success ? patData.data.length : 0;

        // Load Appointments
        const appRes = await fetch('/api/appointments?clinicId=clinic-default');
        const appData = await appRes.json();
        const allAppointments = appData.success ? appData.data : [];
        
        // Filter active appointments
        const scheduledApps = allAppointments.filter((a: any) => a.status === 'Scheduled');
        setRecentAppointments(allAppointments.slice(0, 4));

        // Load Reports
        const repRes = await fetch('/api/reports?clinicId=clinic-default');
        const repData = await repRes.json();
        const reportCount = repData.success ? repData.data.length : 0;

        // Load Invoices for financial metrics
        const invRes = await fetch('/api/invoices?clinicId=clinic-default');
        const invData = await invRes.json();
        const allInvoices = invData.success ? invData.data : [];

        let totalPaid = 0;
        let outstanding = 0;
        allInvoices.forEach((inv: any) => {
          if (inv.status === 'Paid') {
            totalPaid += inv.amount;
          } else {
            outstanding += inv.amount;
          }
        });
        setRevenueStats({ totalPaid, outstanding });

        setMetrics([
          {
            title: "Total Registry",
            value: `${patientCount} Patients`,
            icon: Users,
            change: "Physiological profiles active",
            isPositive: true,
            navTab: "patients",
            color: "text-[#5B6CFF]",
            bgGlow: "from-blue-500/10 via-transparent to-transparent"
          },
          {
            title: "Consultations",
            value: `${scheduledApps.length} Scheduled`,
            icon: Calendar,
            change: "Next check starts in 10m",
            isPositive: true,
            navTab: "appointments",
            color: "text-indigo-500",
            bgGlow: "from-indigo-500/10 via-transparent to-transparent"
          },
          {
            title: "S3 Report Vault",
            value: `${reportCount} Clinical Files`,
            icon: FileText,
            change: "GDPR presigned-link active",
            isPositive: true,
            navTab: "reports",
            color: "text-purple-500",
            bgGlow: "from-purple-500/10 via-transparent to-transparent"
          },
          {
            title: "Receivables",
            value: `$${totalPaid + outstanding}`,
            icon: CreditCard,
            change: `$${outstanding} remaining balance`,
            isPositive: outstanding > 0,
            navTab: "invoices",
            color: "text-emerald-500",
            bgGlow: "from-emerald-500/10 via-transparent to-transparent"
          }
        ]);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };

    fetchDashboardState();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#5B6CFF]/20 border-t-[#5B6CFF]" />
        <p className="text-xs text-slate-400 font-mono tracking-wider animate-pulse">DECRYPTING REAL-TIME SYSTEM TELEMETRY...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome banner segment with glassmorphism */}
      <div 
        id="welcome-clinical-banner" 
        className="relative bg-gradient-to-r from-[#5B6CFF]/15 via-[#EBF0FF]/40 to-white/10 border border-white/60 p-7 rounded-[28px] overflow-hidden shadow-[0_8px_32px_0_rgba(91,108,255,0.03)] backdrop-blur-md"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Shield className="h-28 w-28 text-[#5B6CFF]" />
        </div>
        
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6CFF] bg-[#5B6CFF]/10 px-2.5 py-0.5 rounded-full font-mono">
              Clinical Workspace Active
            </span>
            <span className="text-[10px] font-mono text-slate-400">Tenant ID: clinic-default</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-850">Hello, Dr. Jenkins</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            ClinicOS has successfully parsed all patient telemetry tables, billing statements, and S3 medical pointers. 
            No security exceptions have been recorded in the current Cognito session.
          </p>
        </div>
      </div>

      {/* Metrics Row mapping floating KPI cards */}
      <div id="metrics-grid-row" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((met, idx) => (
          <div
            key={idx}
            onClick={() => onNavigation(met.navTab)}
            className="group relative bg-white/95 border border-slate-200/50 p-6 rounded-[24px] shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] hover:shadow-[0_15px_35px_-5px_rgba(91,108,255,0.06)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between h-[155px]"
          >
            {/* Soft color glow corner background */}
            <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${met.bgGlow} rounded-full group-hover:scale-150 transition-transform duration-500`} />
            
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">
                {met.title}
              </span>
              <div className={`p-2 bg-slate-50 rounded-xl group-hover:bg-[#5B6CFF]/10 transition-colors`}>
                <met.icon className={`h-4.5 w-4.5 ${met.color} group-hover:scale-110 transition-transform`} />
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">
                {met.value}
              </div>
              <p className="text-[10px] text-slate-450 mt-1.5 font-medium leading-none flex items-center gap-1">
                {met.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Panels displaying consultations feed & invoice metrics */}
      <div id="main-overview-panels-row" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Appointments Desk list */}
        <div className="lg:col-span-2 bg-white/95 border border-slate-200/50 p-6 rounded-[24px] shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">Consultation Desk</h3>
              <p className="text-2xs text-slate-400">Incoming scheduled clinical interviews</p>
            </div>
            <button 
              onClick={() => onNavigation('appointments')}
              className="text-[10px] font-sans font-bold text-[#5B6CFF] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Master Book <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-auto max-h-[290px] pr-1">
            {recentAppointments.length === 0 ? (
              <p className="text-2xs text-slate-400 text-center py-12">No active outpatient bookings found.</p>
            ) : (
              recentAppointments.map((app: any, idx: number) => (
                <div 
                  key={app.id || idx}
                  className="p-3 bg-[#F4F7FC]/70 border border-slate-100 hover:border-[#5B6CFF]/20 rounded-xl flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-xs shrink-0">
                      {app.patientName?.charAt(0)}
                    </div>
                    <div>
                      <button
                        onClick={() => onOpenPatientChart(app.patientId)}
                        className="font-bold text-slate-800 hover:text-[#5B6CFF] text-xs font-sans text-left"
                      >
                        {app.patientName}
                      </button>
                      <p className="text-[10px] text-slate-550 truncate max-w-[200px] mt-0.5">{app.reason}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono shrink-0">
                    <span className="text-[10px] font-bold text-slate-700 block">{app.date}</span>
                    <span className="text-[9px] text-slate-450 block">{app.time} ({app.duration}m)</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Invoice Gauge balance stats */}
        <div className="bg-white/95 border border-slate-200/50 p-6 rounded-[24px] shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-4 flex flex-col justify-between">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">Invoice Assets Tracker</h3>
            <p className="text-2xs text-slate-400">Collected balance metrics overview</p>
          </div>

          <div className="py-4 flex flex-col items-center">
            {/* Gorgeous HTML/CSS radial indicator */}
            <div className="relative h-28 w-28 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-full shadow-inner">
              <div className="absolute inset-2 border-4 border-dashed border-[#EBF0FF] rounded-full animate-spin duration-1500" />
              <div className="absolute inset-2 border-4 border-[#5B6CFF]/20 border-t-[#5B6CFF] rounded-full animate-spin duration-1000" />
              <div className="text-center z-10">
                <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold tracking-wider leading-none">CLEARED</span>
                <span className="text-sm font-extrabold text-[#5B6CFF] mt-1 block">
                  {revenueStats.totalPaid > 0 ? `${Math.round((revenueStats.totalPaid / (revenueStats.totalPaid + revenueStats.outstanding)) * 100)}%` : "0%"}
                </span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-2 mt-6 text-center font-mono text-2xs">
              <div className="bg-[#F4F7FC]/50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-sans">Collected</span>
                <span className="font-extrabold text-emerald-600 block mt-0.5">${revenueStats.totalPaid}</span>
              </div>
              <div className="bg-[#F4F7FC]/50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-sans">Outstanding</span>
                <span className="font-extrabold text-amber-600 block mt-0.5">${revenueStats.outstanding}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigation('invoices')}
            className="w-full py-2 bg-slate-50 hover:bg-[#5B6CFF]/5 text-slate-650 hover:text-[#5B6CFF] border border-slate-100 hover:border-[#5B6CFF]/20 hover:shadow-sm rounded-xl text-2xs font-extrabold transition-all cursor-pointer"
          >
            Manage Billing Desk
          </button>
        </div>

      </div>
    </div>
  );
}
