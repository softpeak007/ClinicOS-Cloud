/* eslint-disable */
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, Search, Plus, Trash2, CheckCircle2, AlertOctagon, 
  ArrowUpRight, AlertTriangle, Coins, TrendingUp, CheckCircle, Database 
} from 'lucide-react';

interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  service: string;
  created_at: string;
}

interface Patient {
  id: string;
  name: string;
}

export default function BillingDesk() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Create Invoice States
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [service, setService] = useState('Diagnostic Lab Review');
  const [billingStatus, setBillingStatus] = useState<'Paid' | 'Unpaid'>('Unpaid');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchData = async () => {
    try {
      const invRes = await fetch('/api/invoices?clinicId=clinic-default');
      const invData = await invRes.json();
      if (invData.success) {
        setInvoices(invData.data);
      }

      const patRes = await fetch('/api/patients?clinicId=clinic-default');
      const patData = await patRes.json();
      if (patData.success) {
        setPatients(patData.data.map((p: any) => ({ id: p.id, name: p.name })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!selectedPatientId || !amount || !dueDate || !service) {
      setFormError("Must specify an enrolled patient, billing service, dollar amount, and due date.");
      return;
    }

    const matchedPatientName = patients.find(p => p.id === selectedPatientId)?.name || "Unknown Patient";

    try {
      const payload = {
        patientId: selectedPatientId,
        patientName: matchedPatientName,
        amount: parseFloat(amount),
        dueDate,
        status: billingStatus,
        service
      };

      const res = await fetch('/api/invoices?clinicId=clinic-default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess(true);
        setAmount('');
        fetchData();
        setTimeout(() => {
          setShowAddForm(false);
          setFormSuccess(false);
        }, 1200);
      } else {
        setFormError(data.error || "AWS billing write parameters error.");
      }
    } catch (err: any) {
      setFormError(err.message || "Endpoint error.");
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      const res = await fetch('/api/invoices?clinicId=clinic-default', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Paid' })
      });
      const data = await res.json();
      if (data.success) {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Calculations
  const calculatedStats = () => {
    let paid = 0;
    let unpaid = 0;
    invoices.forEach(i => {
      const val = Number(i.amount);
      if (i.status === 'Paid') paid += val;
      else unpaid += val;
    });
    return { paid, unpaid, total: paid + unpaid };
  };

  const stats = calculatedStats();

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.patientName.toLowerCase().includes(search.toLowerCase()) || inv.service.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6CFF] bg-[#5B6CFF]/10 px-2.5 py-1 rounded-full font-mono">
            Oakridge Receivables Engine
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-850 mt-1.5 font-sans">Active Clinical Billing Desk</h2>
          <p className="text-xs text-slate-500">Track multi-tenant client receivables, generate automated payment links, and catalog invoice records.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2.5 bg-[#5B6CFF] hover:bg-[#4656E6] text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Issue Invoice Statement
        </button>
      </div>

      {/* Floating Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { title: "Cleared Capital Assets", value: `$${stats.paid}`, desc: "Settled check payments", color: "text-emerald-600", bg: "bg-emerald-55/40 bg-emerald-50 border-emerald-200/50" },
          { title: "Outstanding Receivables", value: `$${stats.unpaid}`, desc: "Pending outpatient checkouts", color: "text-amber-600", bg: "bg-amber-55/40 bg-amber-50 border-amber-200/50" },
          { title: "Total Book value", value: `$${stats.total}`, desc: "Aggregated transaction logs", color: "text-[#5B6CFF]", bg: "bg-indigo-50/50 border-[#5B6CFF]/20" }
        ].map((item, idx) => (
          <div key={idx} className={`p-5 rounded-[24px] border ${item.bg} shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] flex flex-col justify-between h-[125px]`}>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-450 font-mono block leading-none">{item.title}</span>
            <div>
              <span className={`text-xl font-extrabold tracking-tight block ${item.color}`}>{item.value}</span>
              <span className="text-[10px] text-slate-500 mt-1 block leading-none">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Invoice Feed Table lists (Left) */}
        <div className="lg:col-span-2 bg-white/95 border border-slate-200/50 rounded-[24px] p-6 shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">Invoice Records Vault</h3>
              <p className="text-2xs text-slate-450 mt-1 leading-none">Cataloged active entries: {filteredInvoices.length}</p>
            </div>

            <div className="flex items-center gap-1.5 border border-slate-200 bg-slate-50 px-2 py-1 rounded-xl text-3xs font-extrabold">
              <span className="text-slate-400">Class:</span>
              {['All', 'Paid', 'Unpaid'].map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-1.5 py-0.5 rounded text-3xs font-bold uppercase transition-all cursor-pointer ${statusFilter === f ? 'bg-white text-[#5B6CFF] shadow-xs' : 'text-slate-500'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Find */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search statements by patient name or service spec..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-205 focus:border-[#5B6CFF] outline-none text-xs rounded-xl"
            />
          </div>

          <div className="space-y-3 max-h-[450px] overflow-auto pr-1">
            {filteredInvoices.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-16">No billing invoice entries indexed.</p>
            ) : (
              filteredInvoices.map((inv) => (
                <div 
                  key={inv.id} 
                  className="p-3.5 bg-[#F4F7FC]/55 border border-slate-100 hover:border-[#5B6CFF]/20 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl mt-0.5 shrink-0">
                      <CreditCard className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-800 text-xs block leading-snug">{inv.patientName}</span>
                      <p className="text-2xs text-slate-550 mt-1">{inv.service}</p>
                      <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-mono font-bold uppercase mt-1.5 inline-block ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-slate-150 pt-2 sm:pt-0 gap-2.5">
                    <div className="text-left sm:text-right font-mono">
                      <span className="text-xs font-extrabold text-slate-800 block">${inv.amount}</span>
                      <span className="text-[10px] text-slate-450 block mt-0.5">Due: {inv.dueDate}</span>
                    </div>

                    {inv.status !== 'Paid' && (
                      <button
                        onClick={() => handleMarkAsPaid(inv.id)}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100/50 border border-emerald-250 text-emerald-700 rounded-lg text-3xs font-extrabold transition-all cursor-pointer shadow-xs ml-auto"
                      >
                        Clear Balance
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Issuing Billing box Statement (Right) */}
        <div className="bg-white/95 border border-slate-205 rounded-[24px] p-6 shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] h-fit space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">
              Invoicing Outpatient Station
            </h3>
            <p className="text-2xs text-slate-400 mt-1 leading-none">Configure Aurora database transaction slots</p>
          </div>

          {formError && <p className="p-2.5 bg-rose-50 border border-rose-220 text-rose-650 text-2xs rounded-xl">{formError}</p>}
          {formSuccess && <p className="p-2.5 bg-emerald-50 border border-emerald-220 text-emerald-600 text-2xs rounded-xl">Transaction cleared and cataloged on cloud database!</p>}

          <form onSubmit={handleCreateInvoice} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Payee Patient Target</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none text-slate-705"
              >
                <option value="">-- Choose Enrolled Payee --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (POL: {p.id})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-455">Diagnostic Service Provided</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none text-slate-705"
              >
                <option value="Cardiological ECG Assessment">Cardiological ECG Assessment</option>
                <option value="Endocrinology Glucose profiling">Endocrinology Glucose profiling</option>
                <option value="Pathology biopsy review">Pathology biopsy review</option>
                <option value="Routine Family Consult">Routine Family Consult</option>
                <option value="Outpatient emergency admission check">Outpatient emergency admission check</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Charge Amount (USD $)</label>
                <input
                  type="number"
                  required
                  placeholder="350"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none text-slate-705"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Expiry Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none text-slate-705"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Initial Entry State</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {['Unpaid', 'Paid'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setBillingStatus(st as any)}
                    className={`p-2 border rounded-xl text-2xs font-extrabold uppercase transition-all cursor-pointer ${billingStatus === st ? 'bg-[#5B6CFF]/10 text-[#5B6CFF] border-[#5B6CFF]/45 shadow-3xs' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#5B6CFF] hover:bg-[#4656E6] text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer mt-2"
            >
              Post Billing Entry Balance
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
