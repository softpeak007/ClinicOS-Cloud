/* eslint-disable */
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, Plus, Trash2, Heart, Shield, FileText, Calendar, 
  CreditCard, Activity, ChevronRight, CheckCircle2, AlertOctagon, 
  Clock, Database, Mail, Phone, MapPin, User, Download, PlusCircle, X
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  dob: string;
  gender?: string;
  blood_type?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  primary_condition?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

interface PatientsRegistryProps {
  initialPatientId?: string | null;
  onSelectPatientId: (id: string | null) => void;
  onOpenReportUpload: (id: string) => void;
  onOpenAppointmentAdd: (id: string) => void;
}

export default function PatientsRegistry({ 
  initialPatientId, 
  onSelectPatientId, 
  onOpenReportUpload, 
  onOpenAppointmentAdd 
}: PatientsRegistryProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Patient detailed dashboard view states
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientReports, setPatientReports] = useState<any[]>([]);
  const [patientAppointments, setPatientAppointments] = useState<any[]>([]);
  const [patientInvoices, setPatientInvoices] = useState<any[]>([]);
  const [fetchProfileLoading, setFetchProfileLoading] = useState(false);

  // Forms state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Female');
  const [bloodType, setBloodType] = useState('O+');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [primaryCondition, setPrimaryCondition] = useState('');
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Quick Invoicing Modal overlay state inside detailed profile chart
  const [showQuickBill, setShowQuickBill] = useState(false);
  const [billAmount, setBillAmount] = useState('');
  const [billService, setBillService] = useState('Diagnostic Lab Review');
  const [billDueDate, setBillDueDate] = useState('');
  const [billError, setBillError] = useState('');
  const [billSuccess, setBillSuccess] = useState(false);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/patients?clinicId=clinic-default');
      const data = await res.json();
      if (data.success) {
        setPatients(data.data);
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Fetch full details for patient profile
  const fetchPatientDetails = async (pat: Patient) => {
    try {
      setFetchProfileLoading(true);
      setSelectedPatient(pat);
      onSelectPatientId(pat.id);

      // Fetch patient's specific reports
      const repRes = await fetch(`/api/reports?clinicId=clinic-default`);
      const repData = await repRes.json();
      if (repData.success) {
        setPatientReports(repData.data.filter((r: any) => r.patientId === pat.id));
      }

      // Fetch patient's specific appointments
      const appRes = await fetch(`/api/appointments?clinicId=clinic-default`);
      const appData = await appRes.json();
      if (appData.success) {
        setPatientAppointments(appData.data.filter((a: any) => a.patientId === pat.id));
      }

      // Fetch patient's specific invoices
      const invRes = await fetch(`/api/invoices?clinicId=clinic-default`);
      const invData = await invRes.json();
      if (invData.success) {
        setPatientInvoices(invData.data.filter((i: any) => i.patientId === pat.id));
      }

      setFetchProfileLoading(false);
    } catch (err) {
      console.error(err);
      setFetchProfileLoading(false);
    }
  };

  // Trigger detailed view if initialPatientId is passed from active external nodes
  useEffect(() => {
    if (initialPatientId && patients.length > 0) {
      const match = patients.find(p => p.id === initialPatientId);
      if (match) {
        fetchPatientDetails(match);
      }
    }
  }, [initialPatientId, patients]);

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!name || !dob || !primaryCondition) {
      setFormError("Must list legal name, baseline date of birth, and primary physiological entry tag.");
      return;
    }

    try {
      const payload = {
        name,
        email,
        phone,
        dob,
        gender,
        bloodType,
        address,
        emergencyContactName: emergencyName,
        emergencyContactPhone: emergencyPhone,
        primaryCondition,
        status: 'Active'
      };

      const res = await fetch('/api/patients?clinicId=clinic-default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setPrimaryCondition('');
        setAddress('');
        setEmergencyName('');
        setEmergencyPhone('');
        
        fetchPatients();
        setTimeout(() => {
          setShowAddForm(false);
          setFormSuccess(false);
        }, 1200);
      } else {
        setFormError(data.error || "AWS endpoint error parsing patient form variables.");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed post request.");
    }
  };

  const handleCreateQuickInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setBillError('');
    setBillSuccess(false);

    if (!selectedPatient || !billAmount || !billDueDate) {
      setBillError("All Quick Invoice parameters must be defined.");
      return;
    }

    try {
      const payload = {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        amount: parseFloat(billAmount),
        dueDate: billDueDate,
        status: 'Unpaid',
        service: billService
      };

      const res = await fetch('/api/invoices?clinicId=clinic-default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setBillSuccess(true);
        setBillAmount('');
        // Reload invoices feed for active profile
        setPatientInvoices(prev => [data.data, ...prev]);
        setTimeout(() => {
          setShowQuickBill(false);
          setBillSuccess(false);
        }, 1200);
      }
    } catch (err: any) {
      setBillError(err.message || "Endpoint error.");
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.primary_condition || '').toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6CFF] bg-[#5B6CFF]/10 px-2.5 py-1 rounded-full font-mono">
            Oakridge Care Facility
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-850 mt-1.5 font-sans">Active Clinical Patient Registry</h2>
          <p className="text-xs text-slate-500">Coordinate biographical intake profiles, S3 radiological reports, and diagnostic consultation records.</p>
        </div>

        <button
          onClick={() => { setShowAddForm(true); setSelectedPatient(null); onSelectPatientId(null); }}
          className="px-4 py-2.5 bg-[#5B6CFF] hover:bg-[#4656E6] text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Enroll Clinical Profile
        </button>
      </div>

      {/* Main Grid: Shows Lookup on Left, details or forms on right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Patient Index list (Left) */}
        <div className="lg:col-span-2 bg-white/95 border border-slate-200/50 p-5 rounded-[24px] shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">Profile Registry Index</h3>
            <p className="text-2xs text-slate-400">Total registered profiles: {patients.length}</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by legal name, condition tag, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F4F7FC]/70 border border-slate-200 focus:border-[#5B6CFF] outline-none text-xs rounded-xl"
            />
          </div>

          {loading ? (
            <p className="text-center py-10 text-xs text-slate-400 font-mono">Querying database pool...</p>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-auto pr-1">
              {filteredPatients.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-8">No enrolled profiles match search parameters.</p>
              ) : (
                filteredPatients.map(p => {
                  const isSelected = selectedPatient?.id === p.id;
                  const cond = (p.primary_condition || '').toLowerCase();
                  const isHighRisk = cond.includes('hypertension') || cond.includes('diabetes') || cond.includes('high') || cond.includes('severe');

                  return (
                    <div
                      key={p.id}
                      onClick={() => fetchPatientDetails(p)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${isSelected ? 'bg-[#5B6CFF]/10 border-[#5B6CFF]/30' : 'bg-[#F4F7FC]/55 border-slate-100 hover:border-[#5B6CFF]/10'}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-slate-800 text-xs font-sans leading-tight block truncate pr-1">
                          {p.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-[6px] text-[8px] font-mono font-bold uppercase shrink-0 ${isHighRisk ? 'bg-amber-50 text-amber-700' : 'bg-slate-55 bg-indigo-50 text-indigo-700'}`}>
                          {p.blood_type || 'O+'} • {p.gender?.charAt(0) || 'F'}
                        </span>
                      </div>
                      
                      <div className="text-[10px] text-slate-550 space-y-0.5 mt-2 font-sans">
                        <p className="truncate">Tag: <span className="font-semibold text-slate-700">{p.primary_condition || 'Routine Diagnostics'}</span></p>
                        <p className="font-mono text-[9px] text-slate-400">POL: {p.id}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Detailed chart overview or forms context (Right) */}
        <div className="lg:col-span-3">
          
          <AnimatePresence mode="wait">
            {!selectedPatient && !showAddForm && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/85 border border-slate-205 p-12 rounded-[24px] shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] text-center space-y-3.5 py-24"
              >
                <div className="h-14 w-14 bg-[#5B6CFF]/10 border border-[#5B6CFF]/20 rounded-2xl flex items-center justify-center text-[#5B6CFF] mx-auto">
                  <User className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">No Profiler Selected</h4>
                  <p className="text-2xs text-slate-450 mt-1 max-w-sm mx-auto leading-relaxed">
                    Select a family profile from the registry index list on the left to review OCR medical files, billing statements, and check vitals.
                  </p>
                </div>
              </motion.div>
            )}

            {showAddForm && (
              <motion.div
                key="add-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white p-6 rounded-[24px] border border-slate-200/50 shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-4"
              >
                <div className="pb-2 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">Biographical Intake Portal</h3>
                    <p className="text-2xs text-slate-400">Create legally audited AWS RDS registry indicators</p>
                  </div>
                  <button 
                    onClick={() => setShowAddForm(false)} 
                    className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-650 rounded-lg cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {formError && (
                  <p className="p-2.5 bg-rose-50 text-rose-600 border border-rose-200 text-2xs rounded-xl">{formError}</p>
                )}

                {formSuccess && (
                  <p className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-250 text-2xs rounded-xl">Intake profile finalized on Aurora database partition!</p>
                )}

                <form onSubmit={handleCreatePatient} className="grid grid-cols-2 gap-4 text-xs">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Legal Patient Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Medical Condition Flag</label>
                    <input
                      type="text"
                      required
                      value={primaryCondition}
                      onChange={(e) => setPrimaryCondition(e.target.value)}
                      placeholder="e.g. Chronic Hypertension"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Preferred Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. e.vance@mail.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Primary Telephone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (512) 555-0144"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Biological Sex</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-Binary">Non-Binary</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Blood Type</label>
                    <select
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-450">Residential Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 1045 Oakridge Lane, West Lake Hills TX"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-455">Emergency Contact Legal Name</label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder="Alexander Vance"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-455">Emergency Contact Telephone</label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="+1 (512) 555-0145"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] rounded-lg outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 col-span-2 bg-[#5B6CFF] hover:bg-[#4656E6] text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer mt-2"
                  >
                    Commit Biographical Intake
                  </button>
                </form>
              </motion.div>
            )}

            {selectedPatient && !showAddForm && (
              <motion.div
                key="details-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                
                {/* Core Patient profile summary banner */}
                <div className="bg-gradient-to-br from-[#5B6CFF]/15 via-white to-white border border-[#5B6CFF]/15 p-6 rounded-[24px] shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <User className="h-24 w-24 text-[#5B6CFF]" />
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold tracking-widest leading-none">POL COMPLIANT</span>
                      <h3 className="text-xl font-extrabold text-slate-850 font-sans tracking-tight">{selectedPatient.name}</h3>
                      <div className="flex items-center gap-1.5 flex-wrap text-2xs mt-1 text-slate-500 font-mono">
                        <span>DOB: {selectedPatient.dob}</span>
                        <span>•</span>
                        <span>Blood: <strong className="text-slate-700">{selectedPatient.blood_type || 'O+'}</strong></span>
                        <span>•</span>
                        <span>Sex: <strong className="text-slate-700">{selectedPatient.gender || 'Female'}</strong></span>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-emerald-50 border border-emerald-150 text-emerald-700 text-[10px] font-mono font-bold uppercase rounded-full">
                      {selectedPatient.status}
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-4 grid grid-cols-2 gap-4 text-2xs text-slate-500">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 truncate">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {selectedPatient.email || 'No email archived'}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {selectedPatient.phone || 'No phone archived'}
                      </p>
                    </div>
                    <div className="space-y-1 font-mono">
                      <p className="truncate">Emergency Contact: <span className="font-semibold text-slate-700 font-sans">{selectedPatient.emergency_contact_name || 'None'}</span></p>
                      <p>Emergency Phone: <span className="text-slate-600">{selectedPatient.emergency_contact_phone || 'None'}</span></p>
                    </div>
                  </div>
                </div>

                {/* Patient medical files & consultation sub-rows */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Presigned reports lists */}
                  <div className="bg-white border border-slate-200/50 p-5 rounded-[24px] shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">S3 Presigned scans ({patientReports.length})</span>
                      <button 
                        onClick={() => onOpenReportUpload(selectedPatient.id)}
                        className="text-[10px] text-[#5B6CFF] hover:underline flex items-center gap-0.5 cursor-pointer font-bold font-sans"
                      >
                        <PlusCircle className="h-3.5 w-3.5 mr-0.5" /> Upload File
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[160px] overflow-auto pr-1 text-2xs">
                      {patientReports.length === 0 ? (
                        <p className="text-slate-400 text-center py-6 leading-normal">No radiological or diagnostic scans cataloged for this profile targets.</p>
                      ) : (
                        patientReports.map(rep => (
                          <div key={rep.id} className="p-2 border border-slate-100 bg-[#F4F7FC]/55 rounded-xl flex items-center justify-between gap-3 font-sans">
                            <div className="truncate pr-1">
                              <span className="font-bold text-slate-800 block truncate" title={rep.fileName}>{rep.fileName}</span>
                              <span className="text-[9px] text-[#5B6CFF] font-mono uppercase font-bold">{rep.category} ({rep.fileSize})</span>
                            </div>
                            <button
                              onClick={() => alert(`Presigned URL generated successfully!\nActive visual transport mapped under GDPR secure tunnel:\nhttps://s3.us-east-1.amazonaws.com/clinical-records-lockbox-prod/${rep.s3Key}?Expires=300`)}
                              className="p-1 px-2 border border-slate-200 hover:border-[#5B6CFF]/20 hover:bg-[#5B6CFF]/5 text-slate-500 hover:text-[#5B6CFF] rounded-lg cursor-pointer transition-colors"
                            >
                              <Download className="h-3 w-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Scheduled outpatient consultations */}
                  <div className="bg-white border border-slate-200/50 p-5 rounded-[24px] shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">Consultations ({patientAppointments.length})</span>
                      <button 
                        onClick={() => onOpenAppointmentAdd(selectedPatient.id)}
                        className="text-[10px] text-[#5B6CFF] hover:underline flex items-center gap-0.5 cursor-pointer font-bold font-sans"
                      >
                        <PlusCircle className="h-3.5 w-3.5 mr-0.5" /> Schedule
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[160px] overflow-auto pr-1 text-2xs">
                      {patientAppointments.length === 0 ? (
                        <p className="text-slate-400 text-center py-6 leading-normal">No consulting blocks set up in active slots.</p>
                      ) : (
                        patientAppointments.map(app => (
                          <div key={app.id} className="p-2 border border-slate-100 bg-[#F4F7FC]/55 rounded-xl flex justify-between items-center font-mono">
                            <div>
                              <span className="font-bold text-slate-850 block font-sans">{app.reason}</span>
                              <span className="text-[9px] text-slate-400 block">{app.time} ({app.duration}m check)</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 shrink-0 text-right font-mono">{app.date}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Billing invoice statement manager and quick invoice trigger */}
                <div className="bg-white border border-slate-200/50 p-5 rounded-[24px] shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">Outstanding Statement Ledger</h3>
                      <p className="text-2xs text-slate-400">Total bills issued: {patientInvoices.length}</p>
                    </div>
                    
                    <button
                      onClick={() => setShowQuickBill(true)}
                      className="px-3 py-1.5 bg-[#5B6CFF] hover:bg-[#4656E6] text-white rounded-lg text-2xs font-bold transition-all cursor-pointer flex items-center gap-0.5"
                    >
                      <Plus className="h-3 w-3" /> Issue Quick Charge
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[180px] overflow-auto pr-1 text-2xs">
                    {patientInvoices.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">No invoice receivables indexed on database partition.</p>
                    ) : (
                      patientInvoices.map(inv => (
                        <div key={inv.id} className="p-3 bg-[#F4F7FC]/65 border border-slate-100 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-800 block text-xs font-sans">{inv.service}</span>
                            <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-bold uppercase font-mono mt-1 inline-block ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/30' : 'bg-amber-50 text-amber-700 border border-amber-200/30'}`}>
                              {inv.status}
                            </span>
                          </div>
                          
                          <div className="text-right font-mono shrink-0">
                            <span className="text-sm font-extrabold text-slate-850 block">${inv.amount}</span>
                            <span className="text-[10px] text-slate-400 block pb-0.5">Due: {inv.dueDate}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Invoicing slideover modal container */}
                <AnimatePresence>
                  {showQuickBill && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.95, y: 15 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white border border-slate-200 p-6 rounded-[24px] max-w-sm w-full shadow-2xl space-y-4"
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <div>
                            <h4 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">Issue Statement Charge</h4>
                            <p className="text-2xs text-slate-450 leading-none mt-1">Target Account: {selectedPatient.name}</p>
                          </div>
                          <button onClick={() => setShowQuickBill(false)} className="p-1 hover:bg-slate-50 text-slate-400 rounded">
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {billError && <p className="p-2 bg-rose-50 text-rose-600 rounded-xl text-3xs">{billError}</p>}
                        {billSuccess && <p className="p-2 bg-emerald-50 text-emerald-600 rounded-xl text-3xs">Invoicing success!</p>}

                        <form onSubmit={handleCreateQuickInvoice} className="space-y-3.5 text-xs">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Therapeutic Service Description</label>
                            <input
                              type="text"
                              required
                              value={billService}
                              onChange={(e) => setBillService(e.target.value)}
                              placeholder="e.g. Cardiological Routine In-Clinic Check"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-205 focus:border-[#5B6CFF] rounded-lg outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Charge Fee value (USD $)</label>
                            <input
                              type="number"
                              required
                              value={billAmount}
                              onChange={(e) => setBillAmount(e.target.value)}
                              placeholder="350"
                              min="1"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-205 focus:border-[#5B6CFF] rounded-lg outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Payment Due Date</label>
                            <input
                              type="date"
                              required
                              value={billDueDate}
                              onChange={(e) => setBillDueDate(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-205 focus:border-[#5B6CFF] rounded-lg outline-none"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-[#5B6CFF] hover:bg-[#4656E6] text-white font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                          >
                            Post Ledger Statement
                          </button>
                        </form>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
