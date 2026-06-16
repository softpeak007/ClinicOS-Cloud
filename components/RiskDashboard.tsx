/* eslint-disable */
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, ShieldCheck, Heart, AlertOctagon, HeartHandshake,
  CheckCircle2, AlertTriangle, Users, Calendar, FileText, Ban,
  Search, RefreshCw, Layers, ArrowUpRight, CheckCircle, Database, ChevronRight
} from 'lucide-react';

interface RiskDashboardProps {
  onNavigation: (tab: string) => void;
  onOpenPatientChart: (patientId: string) => void;
}

export default function RiskDashboard({ onNavigation, onOpenPatientChart }: RiskDashboardProps) {
  // States matching prior database schema and search variables
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Filter keys
  const [searchQuery, setSearchQuery] = useState('');
  const [vitalsFilter, setVitalsFilter] = useState<'All' | 'High Risk' | 'Normal'>('All');

  const fetchData = async () => {
    try {
      setLoading(true);
      // Load all 5 system entity clusters (similar to prior implementation)
      const [patRes, appRes, invRes, repRes, logRes] = await Promise.all([
        fetch('/api/patients?clinicId=clinic-default'),
        fetch('/api/appointments?clinicId=clinic-default'),
        fetch('/api/invoices?clinicId=clinic-default'),
        fetch('/api/reports?clinicId=clinic-default'),
        fetch('/api/audit-logs?clinicId=clinic-default')
      ]);

      const [pat, app, inv, rep, log] = await Promise.all([
        patRes.json(), appRes.json(), invRes.json(), repRes.json(), logRes.json()
      ]);

      if (pat.success) setPatients(pat.data);
      if (app.success) setAppointments(app.data);
      if (inv.success) setInvoices(inv.data);
      if (rep.success) setReports(rep.data);
      if (log.success) setAuditLogs(log.data.slice(0, 5)); // show top 5 live audited entries

      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAuditVitals = async (id: string, notes: string) => {
    // Audit telemetry check trigger
    try {
      const res = await fetch('/api/patients?clinicId=clinic-default', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, notes: `Audited vitals: ${notes}. Recalibrated parameters.` })
      });
      const data = await res.json();
      if (data.success) {
        setPatients(prev => prev.map(p => p.id === id ? { ...p, notes: `Audited Vitals Node: approved.` } : p));
        alert("Compliance Audit registered successfully! State synchronized on AWS database partition.");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Computations for compliance metrics
  const highRiskPatients = patients.filter(p => {
    // Basic clinical trigger: primary condition includes high-intensity labels
    const cond = (p.primary_condition || '').toLowerCase();
    return cond.includes('hypertension') || cond.includes('diabetes') || cond.includes('high') || cond.includes('severe');
  });

  const unpaidInvoices = invoices.filter(i => i.status !== 'Paid');
  const outstandingSum = unpaidInvoices.reduce((acc, curr) => acc + Number(curr.amount), 0);
  
  // Simulated missing report indicators
  const missingFilesRequired = patients.length * 1.5 - reports.length;
  const missingFilesCount = missingFilesRequired > 0 ? Math.round(missingFilesRequired) : 2;

  // Render Risk KPIs
  const kpis = [
    {
      title: "Active Clinical Risk",
      value: `${highRiskPatients.length} Patients`,
      desc: "Endocrinology or blood pressure anomalies",
      icon: Heart,
      color: "text-amber-500",
      bgColor: "bg-amber-50 border-amber-200/50"
    },
    {
      title: "Incomplete Records",
      value: `${missingFilesCount} Pending Scans`,
      desc: "Awaiting incoming laboratory PDF feeds",
      icon: FileText,
      color: "text-[#5B6CFF]",
      bgColor: "bg-[#EBF0FF] border-[#5B6CFF]/20"
    },
    {
      title: "Aging Liability",
      value: `$${outstandingSum}`,
      desc: `${unpaidInvoices.length} outstanding accounts`,
      icon: AlertTriangle,
      color: "text-rose-500",
      bgColor: "bg-rose-50 border-rose-200/50"
    },
    {
      title: "Telemetry Status",
      value: "94% Clean",
      desc: "0 critical SQS warning queues",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 border-emerald-200/50"
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#5B6CFF]/25 border-t-[#5B6CFF]" />
        <p className="text-xs text-slate-400 font-mono tracking-wider animate-pulse">PARSING DATABASE ANOMALY MATRICES...</p>
      </div>
    );
  }

  // Filter lookup patients
  const filteredPatients = patients.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.primary_condition || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const cond = (p.primary_condition || '').toLowerCase();
    const isHighRisk = cond.includes('hypertension') || cond.includes('diabetes') || cond.includes('high') || cond.includes('severe');
    
    if (vitalsFilter === 'High Risk') return matchesQuery && isHighRisk;
    if (vitalsFilter === 'Normal') return matchesQuery && !isHighRisk;
    return matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Risk Dashboard title bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6CFF] bg-[#5B6CFF]/10 px-2.5 py-1 rounded-full font-mono">
            Biomedical Telemetry Monitor
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-850 mt-1.5">Compliance & Operational Anomaly Desk</h2>
          <p className="text-xs text-slate-500">Live monitoring filters tracking patient telemetry alerts, open collection liabilities, and missing AWS S3 records.</p>
        </div>
        
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-650 border border-slate-205 hover:border-slate-300 rounded-xl text-2xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Re-Seep Cluster
        </button>
      </div>

      {/* KPI Ribbons Row */}
      <div id="risk-kpi-row" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((k, idx) => (
          <div
            key={idx}
            className={`p-6 border rounded-[24px] bg-white shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] flex flex-col justify-between h-[155px] ${k.bgColor}`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-450 font-mono">
                {k.title}
              </span>
              <div className="p-2 bg-white/80 rounded-xl">
                <k.icon className={`h-4.5 w-4.5 ${k.color}`} />
              </div>
            </div>

            <div>
              <span className="text-xl font-extrabold text-slate-800 tracking-tight leading-none block">
                {k.value}
              </span>
              <span className="text-[10px] text-slate-500 font-sans block mt-1.5">
                {k.desc}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Telemetry Registry and Filter controls */}
      <div className="bg-white/95 border border-slate-200/50 p-6 rounded-[24px] shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-4">
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">Vitals Risk Scouter</h3>
            <p className="text-2xs text-slate-400">Search profiles flagged under telemetry parameters</p>
          </div>

          <div className="flex items-center gap-2 border border-slate-200 bg-slate-50 px-2.5 py-1.5 rounded-xl text-3xs font-extrabold">
            <span className="text-slate-400 uppercase tracking-wide">Telemetry Bucket:</span>
            {['All', 'High Risk', 'Normal'].map((bucket) => (
              <button
                key={bucket}
                onClick={() => setVitalsFilter(bucket as any)}
                className={`px-2 py-1 rounded text-3xs uppercase font-extrabold transition-all cursor-pointer ${vitalsFilter === bucket ? 'bg-white text-[#5B6CFF] shadow-sm' : 'text-slate-500'}`}
              >
                {bucket}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, symptoms, primary disease codex..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F4F7FC]/70 border border-slate-200 focus:border-[#5B6CFF] outline-none text-xs rounded-xl"
          />
        </div>

        {/* Scouter Feed list */}
        <div className="space-y-3 max-h-[350px] overflow-auto pr-1">
          {filteredPatients.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-10">No monitored entities match this scouter configuration.</p>
          ) : (
            filteredPatients.map((p) => {
              const cond = (p.primary_condition || '').toLowerCase();
              const isHighRisk = cond.includes('hypertension') || cond.includes('diabetes') || cond.includes('high') || cond.includes('severe');

              return (
                <div 
                  key={p.id} 
                  className="p-4 border border-slate-100 bg-[#F4F7FC]/55 hover:bg-slate-50 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-[#5B6CFF]/20"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${isHighRisk ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-emerald-50 border-emerald-200 text-emerald-500'}`}>
                      <Heart className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => onOpenPatientChart(p.id)}
                          className="font-extrabold text-slate-800 hover:text-[#5B6CFF] text-xs font-sans text-left cursor-pointer"
                        >
                          {p.name}
                        </button>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${isHighRisk ? 'bg-rose-50 text-rose-700 border border-rose-200/55' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/55'}`}>
                          {isHighRisk ? 'Flagged High Risk' : 'Normal Telemetry'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-550 mt-1 leading-tight">Vitals Condition Monitor: <span className="font-bold text-slate-700">{p.primary_condition || 'Baseline Routine'}</span></p>
                      {p.notes && (
                        <span className="text-[9px] block text-slate-450 italic mt-1 font-mono">Last trace update: "{p.notes}"</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => handleAuditVitals(p.id, p.primary_condition || 'Standard')}
                      className="px-3 py-1.5 bg-white border border-slate-205 hover:border-[#5B6CFF]/30 hover:bg-[#5B6CFF]/5 text-slate-600 hover:text-[#5B6CFF] text-2xs font-bold rounded-lg cursor-pointer transition-all"
                    >
                      Audit
                    </button>
                    <button
                      onClick={() => onOpenPatientChart(p.id)}
                      className="px-3 py-1.5 bg-[#5B6CFF] hover:bg-[#4656E6] text-white text-2xs font-semibold rounded-lg cursor-pointer transition-all flex items-center gap-0.5"
                    >
                      Record <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Double Column Display: Incomplete Records & Live Live multi-tenant logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Unpaid accounts ledger */}
        <div className="bg-white/95 border border-slate-200/50 p-6 rounded-[24px] shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-4">
          <div className="pb-2 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">Revenue Leak alerts</h3>
              <p className="text-2xs text-slate-400">Aging invoiced statements awaiting settlement</p>
            </div>
            <button
              onClick={() => onNavigation('invoices')}
              className="text-[10px] text-[#5B6CFF] font-bold hover:underline"
            >
              Billing Console
            </button>
          </div>

          <div className="space-y-3 max-h-[250px] overflow-auto pr-1">
            {unpaidInvoices.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-12">No outstanding collections detected.</p>
            ) : (
              unpaidInvoices.map((inv) => (
                <div key={inv.id} className="p-3 bg-[#F4F7FC]/65 border border-slate-100 rounded-xl flex items-center justify-between text-2xs">
                  <div>
                    <span className="font-extrabold text-slate-800 text-xs block">{inv.patientName}</span>
                    <span className="text-slate-450 block mt-0.5">{inv.service}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-rose-500 block text-xs">${inv.amount}</span>
                    <span className="text-[10px] text-slate-450 block font-mono">Due: {inv.dueDate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Aurora Live multi-tenant Activity Peek */}
        <div className="bg-white/95 border border-[#5B6CFF]/15 p-6 rounded-[24px] shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-4">
          <div className="pb-2 border-b border-slate-100 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">Aurora Live Audit Peek</h3>
              </div>
              <p className="text-2xs text-slate-400">Real-time ledger entries from AWS serverless pool</p>
            </div>
            <button
              onClick={() => onNavigation('audit-logs')}
              className="text-[10px] text-[#5B6CFF] font-bold hover:underline"
            >
              Audit Vault
            </button>
          </div>

          <div className="space-y-3 max-h-[250px] overflow-auto pr-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-mono text-[10px] text-slate-600 leading-normal">
                <div className="flex items-center justify-between font-bold text-[#5B6CFF] mb-1">
                  <span>{log.action}</span>
                  <span className="text-slate-400 text-[9px] font-normal">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="font-sans text-slate-800 leading-snug">{log.details}</p>
                <span className="text-[9px] text-slate-400 block mt-1">Tenant claim: {log.clinicId} • Sub: {log.userId}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
