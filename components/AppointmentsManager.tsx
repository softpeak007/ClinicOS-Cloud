/* eslint-disable */
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, Clock, BadgeHelp, CheckCircle, AlertOctagon, Plus, Search, 
  MapPin, CheckCircle2, ChevronRight, Ban, Check, X, Sparkles, Database, User
} from 'lucide-react';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number;
  reason: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
  notes?: string;
}

interface Patient {
  id: string;
  name: string;
}

interface AppointmentsManagerProps {
  initialPatientId?: string | null;
  onNavigateToPatientChart: (patientId: string) => void;
}

export default function AppointmentsManager({ initialPatientId, onNavigateToPatientChart }: AppointmentsManagerProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Create Appointment Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState(30);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchData = async () => {
    try {
      // Get Appointments
      const appRes = await fetch('/api/appointments?clinicId=clinic-default');
      const appData = await appRes.json();
      if (appData.success) {
        setAppointments(appData.data);
      }

      // Get Patients list for selection dropdown
      const patRes = await fetch('/api/patients?clinicId=clinic-default');
      const patData = await patRes.json();
      if (patData.success) {
        setPatients(patData.data.map((p: any) => ({ id: p.id, name: p.name })));
        
        // Auto select if passed from registry
        if (initialPatientId) {
          setSelectedPatientId(initialPatientId);
          setShowAddForm(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [initialPatientId]);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!selectedPatientId || !date || !time || !reason) {
      setFormError("Must select an enrolled patient, date, hour, and list primary clinical rationale.");
      return;
    }

    const matchedPatientName = patients.find(p => p.id === selectedPatientId)?.name || "Unknown Patient";

    try {
      const payload = {
        patientId: selectedPatientId,
        patientName: matchedPatientName,
        date,
        time,
        duration: Number(duration),
        reason,
        notes,
        status: 'Scheduled'
      };

      const res = await fetch('/api/appointments?clinicId=clinic-default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess(true);
        setReason('');
        setNotes('');
        
        fetchData();
        setTimeout(() => {
          setShowAddForm(false);
          setFormSuccess(false);
        }, 1200);
      } else {
        setFormError(data.error || "AWS scheduling error.");
      }
    } catch (err: any) {
      setFormError(err.message || "Endpoint error.");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'Completed' | 'Cancelled') => {
    try {
      const res = await fetch('/api/appointments?clinicId=clinic-default', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-blue-50 text-[#5B6CFF] border border-[#5B6CFF]/20">Scheduled</span>;
      case 'Completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-500/20">Completed</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-500/20">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-slate-50 text-slate-700 border border-slate-500/20">{status}</span>;
    }
  };

  const filteredApps = appointments.filter(app => {
    const matchesSearch = app.patientName.toLowerCase().includes(search.toLowerCase()) || app.reason.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6CFF] bg-[#5B6CFF]/10 px-2.5 py-1 rounded-full font-mono">
            Clinical Calendar Node
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-850 mt-1.5 font-sans">Master Appointment Book</h2>
          <p className="text-xs text-slate-500">Coordinate specialist clinical consultations, biometric reviews, and inpatient check-ins.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2.5 bg-[#5B6CFF] hover:bg-[#4656E6] text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Schedule Outpatient Block
        </button>
      </div>

      {/* Quick filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, symptoms, clinical tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-[#5B6CFF] outline-none text-xs rounded-xl"
          />
        </div>
        
        <div className="flex items-center gap-2 border border-slate-205 bg-white px-3 py-1.5 rounded-xl text-2xs font-extrabold shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400">Class Scope:</span>
          {['All', 'Scheduled', 'Completed', 'Cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-2.5 py-1 rounded text-2xs font-bold uppercase transition-all cursor-pointer ${statusFilter === f ? 'bg-[#5B6CFF]/10 text-[#5B6CFF]' : 'text-slate-500'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Appointments Feed */}
        <div className="bg-white/95 border border-slate-200/50 rounded-[24px] p-6 shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] lg:col-span-2 space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">
              Active Scheduled Workblocks
            </h3>
            <p className="text-2xs text-slate-450 leading-none mt-1">Found consultations: {filteredApps.length}</p>
          </div>

          <div className="space-y-3.5 max-h-[500px] overflow-auto pr-1">
            {filteredApps.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-16">No medical consultations booked in this filter bucket.</p>
            ) : (
              filteredApps.map((app) => (
                <div 
                  key={app.id} 
                  className="p-4 bg-[#F4F7FC]/55 border border-slate-100 hover:border-[#5B6CFF]/20 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-[#5B6CFF]/10 text-[#5B6CFF] border border-[#5B6CFF]/20 rounded-xl mt-1 shrink-0">
                      <Clock className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => onNavigateToPatientChart(app.patientId)}
                          className="font-extrabold text-slate-805 hover:text-[#5B6CFF] cursor-pointer text-left focus:outline-none text-xs"
                        >
                          {app.patientName}
                        </button>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-2xs text-slate-600 mt-1 font-sans">{app.reason}</p>
                      {app.notes && (
                        <p className="text-[10px] text-slate-500 mt-1.5 bg-white border border-slate-100 p-2 rounded-xl italic">
                          "{app.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 gap-3">
                    <div className="text-left sm:text-right font-mono">
                      <span className="text-xs font-extrabold text-slate-800 block">{app.date}</span>
                      <span className="text-[10px] text-slate-450 block mt-0.5">{app.time} ({app.duration}m check)</span>
                    </div>

                    {app.status === 'Scheduled' && (
                      <div className="flex gap-1.5 ml-auto">
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'Completed')}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100/50 border border-emerald-250 text-emerald-700 rounded-lg text-2xs font-extrabold transition-all cursor-pointer flex items-center gap-0.5"
                        >
                          <Check className="h-3 w-3" /> Done
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'Cancelled')}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100/50 border border-rose-250 text-rose-700 rounded-lg text-2xs font-extrabold transition-all cursor-pointer flex items-center gap-0.5"
                        >
                          <X className="h-3 w-3" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Appointment form */}
        <div id="add-appointment-box" className="bg-white/95 border border-slate-200/50 rounded-[24px] p-6 shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] overflow-hidden flex flex-col justify-between h-fit space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">
              Inpatient Booking Portal
            </h3>
            <p className="text-2xs text-slate-450 mt-1 leading-none">Register outpatient biometric follow-ups</p>
          </div>

          {formError && (
            <p className="p-2.5 bg-rose-50 border border-rose-200 text-rose-650 text-2xs rounded-xl">{formError}</p>
          )}

          {formSuccess && (
            <p className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 text-2xs rounded-xl">Saved into database block!</p>
          )}

          <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Select Patient Profile</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none text-slate-700"
              >
                <option value="">-- Choose Enrolled Patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (POL: {p.id})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Time Clock</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Duration (Minutes)</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none text-slate-700"
              >
                <option value={15}>15 Minutes Check</option>
                <option value={30}>30 Minutes Diagnostic</option>
                <option value={45}>45 Minutes Assessment</option>
                <option value={60}>60 Minutes Complete Board</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Clinical Rationale</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Glucose Screening, Cardiocardiogram"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Critical Directives / Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Clinical instructions or visit details..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none text-slate-700"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#5B6CFF] hover:bg-[#4656E6] text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer mt-2"
            >
              Commit Outpatient Booking
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
