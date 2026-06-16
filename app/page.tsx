/* eslint-disable */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Users, Calendar, FileText, CreditCard, Settings, Award, 
  ChevronLeft, ChevronRight, LogOut, Menu, X, Landmark, Compass, 
  Lock, ArrowRight, TableProperties, ShieldAlert, Sparkles, Send, Bot, Check, HelpCircle,
  Mail, Phone
} from 'lucide-react';

// Components imports
import LandingPage from '@/components/LandingPage';
import AuthPage from '@/components/AuthPage';
import Dashboard from '@/components/Dashboard';
import PatientsRegistry from '@/components/PatientsRegistry';
import AppointmentsManager from '@/components/AppointmentsManager';
import RecordsLockbox from '@/components/RecordsLockbox';
import BillingDesk from '@/components/BillingDesk';
import SettingsPage from '@/components/SettingsPage';
import HackathonHQ from '@/components/HackathonHQ';
import RiskDashboard from '@/components/RiskDashboard';

export default function Home() {
  const [view, setView] = useState<'landing' | 'login' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Cross-component deep reference states
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Clinician profile state
  const [userProfile, setUserProfile] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(false);

  // AI Chat States
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant', text: string }>>([
    { sender: 'assistant', text: "Hello, Dr. Jenkins. I am your ClinicOS AI Medical Assistant. I can analyze patient telemetry flags, audit billing collections, or inspect missing reports. What clinical task shall we inspect today?" }
  ]);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Sync class name theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkTheme) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkTheme]);

  const handleLoginSuccess = (email: string) => {
    setUserProfile({
      name: "Dr. Sarah Jenkins, MD",
      email: email,
      role: "Clinical Director",
      tenantId: "clinic-default",
      networkStatus: "Cognito Secured"
    });
    setView('app');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setView('landing');
    setUserProfile(null);
  };

  const handleOpenPatientChartFromGlobal = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('patients');
  };

  const handleNavigateToReportUpload = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('reports');
  };

  const handleNavigateToAppointmentAdd = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('appointments');
  };

  // Fetch Audit Logs inside Main Shell
  const fetchAuditLogs = async () => {
    try {
      setLoadingLogs(true);
      const res = await fetch('/api/audit-logs?clinicId=clinic-default');
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'audit-logs' && view === 'app') {
      fetchAuditLogs();
    }
  }, [activeTab, view]);

  // Handle AI Chat submissions
  const handleSendAiMessage = async (textToSend: string) => {
    if (!textToSend.trim() || aiLoading) return;
    
    const userMsg = textToSend.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiPrompt('');
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg })
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages(prev => [...prev, { sender: 'assistant', text: data.text }]);
      } else {
        setChatMessages(prev => [...prev, { sender: 'assistant', text: `System alert: unable to coordinate with Gemini cluster context. Details: ${data.error}` }]);
      }
    } catch (e) {
      setChatMessages(prev => [...prev, { sender: 'assistant', text: "System connection failure while authenticating secure API parameters." }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Render AI Assistant page
  const renderAiAssistantPage = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6CFF] bg-[#5B6CFF]/10 px-2.5 py-1 rounded-full font-mono">
              Elite Clinical Intelligence
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-teal-50 mt-1.5">Interactive AI Clinical Co-Pilot</h2>
            <p className="text-xs text-slate-500">Real-time summaries and intelligence powered server-side by Gemini-3.5-flash.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick clinical query shortcuts */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/50 p-5 rounded-[24px] shadow-[0_10px_35px_-5px_rgba(91,108,255,0.04)] space-y-3.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Analysis Directives</h3>
              <p className="text-2xs text-slate-400">Launch automated clinical intelligence tasks immediately:</p>
              
              <div className="space-y-2">
                {[
                  { text: "Run clinic billing balance audit", icon: CreditCard },
                  { text: "Check patient telemetry alarm vitals", icon: Activity },
                  { text: "Summarize missing S3 report status", icon: FileText },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAiMessage(item.text)}
                    className="w-full text-left p-3 hover:bg-[#5B6CFF]/5 border border-slate-100 hover:border-[#5B6CFF]/20 rounded-xl text-2xs font-medium text-slate-600 dark:text-slate-300 hover:text-[#5B6CFF] transition-all cursor-pointer flex items-center gap-2.5"
                  >
                    <item.icon className="h-4.5 w-4.5 shrink-0 text-[#5B6CFF]" />
                    <span className="leading-snug">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-[#EBF0FF]/50 border border-[#5B6CFF]/15 p-4 rounded-xl text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-bold text-[#5B6CFF] font-sans mb-1">
                <Sparkles className="h-4 w-4" /> HIPAA Compliance Guarded
              </div>
              <p className="text-[10px] leading-relaxed text-slate-600">All prompt sequences are filtered through clinical compliance guardrails before being executed on Gemini server endpoints.</p>
            </div>
          </div>

          {/* Chat box container */}
          <div className="lg:col-span-3 bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-[24px] shadow-[0_10px_35px_-5px_rgba(91,108,255,0.04)] flex flex-col h-[520px]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-[24px]">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-extrabold text-slate-700 tracking-tight flex items-center gap-1.5">
                  <Bot className="h-4 w-4 text-[#5B6CFF]" /> ClinicOS Gemini Core Node
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">AWS PrivateLink Tunnel Active</span>
            </div>

            {/* Chat message feed */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-4 rounded-[20px] max-w-lg text-xs leading-relaxed space-y-1.5 shadow-sm ${msg.sender === 'user' ? 'bg-[#5B6CFF] text-white rounded-tr-sm' : 'bg-[#F4F7FC] text-slate-800 rounded-tl-sm border border-slate-100'}`}>
                    <p className="font-sans whitespace-pre-wrap">{msg.text}</p>
                    <span className={`text-[9px] block text-right mt-1 ${msg.sender === 'user' ? 'text-[#EBF0FF]' : 'text-slate-400 font-mono'}`}>
                      {msg.sender === 'user' ? 'Clinician' : 'ClinicOS AI'}
                    </span>
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="p-4 rounded-[20px] bg-[#F4F7FC] border border-slate-150 text-slate-500 text-xs flex items-center gap-2">
                    <span className="animate-ping h-2.5 w-2.5 rounded-full bg-[#5B6CFF]" />
                    <span className="font-semibold font-sans animate-pulse">Gemini-3.5-flash formulating insights...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 rounded-b-[24px]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAiMessage(aiPrompt);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask Gemini to query vitals, research clinical correlations, or construct billing reviews..."
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 focus:border-[#5B6CFF] outline-none text-xs rounded-xl text-slate-800"
                />
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="px-4 py-3 bg-[#5B6CFF] hover:bg-[#4656E6] text-white rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 shrink-0"
                >
                  <Send className="h-4 w-4" /> Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render HTML analytics tab
  const renderAnalyticsPage = () => {
    return (
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6CFF] bg-[#5B6CFF]/10 px-2.5 py-1 rounded-full font-mono">
            Clinical Operations Dashboard
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-teal-50 mt-1.5">Interactive Analytics & Metrics Desk</h2>
          <p className="text-xs text-slate-500">Visualizing demographic distributions, clinical admission timelines, and collected billing assets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main timeline chart */}
          <div className="md:col-span-2 bg-white/85 backdrop-blur-md border border-slate-200/50 p-6 rounded-[24px] shadow-[0_10px_35px_-5px_rgba(91,108,255,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Monthly Patient Acquisition Velocity</h3>
                <p className="text-2xs text-slate-400">Total admission registrations organized by cohort partitions</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                +14.3% YoY Growth
              </span>
            </div>

            {/* Simulated bar chart */}
            <div className="h-56 flex items-end justify-between gap-3 pt-6 relative border-b border-slate-100">
              {/* Guidelines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-1">
                <div className="w-full border-t border-dashed border-slate-100 h-0" />
                <div className="w-full border-t border-dashed border-slate-100 h-0" />
                <div className="w-full border-t border-dashed border-slate-100 h-0" />
                <div className="w-full border-t border-slate-100 h-0" />
              </div>

              {[
                { label: 'Jan', val: 78, secondary: 20 },
                { label: 'Feb', val: 92, secondary: 30 },
                { label: 'Mar', val: 110, secondary: 15 },
                { label: 'Apr', val: 145, secondary: 40 },
                { label: 'May', val: 130, secondary: 35 },
                { label: 'Jun', val: 165, secondary: 55 },
              ].map((item, idx) => {
                const primaryHeight = (item.val / 180) * 100;
                const secondaryHeight = (item.secondary / 180) * 100;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group cursor-help relative animate-duration-1000">
                    <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] font-mono p-2 rounded shadow-lg pointer-events-none transition-all z-20 shrink-0 select-none whitespace-nowrap">
                      Admission: {item.val} | Consult: {item.secondary}
                    </div>

                    <div className="w-full max-w-[28px] h-full flex items-end justify-center gap-1">
                      <div
                        style={{ height: `${primaryHeight}%` }}
                        className="w-1/2 bg-[#5B6CFF] rounded-t-md transition-all duration-500"
                      />
                      <div
                        style={{ height: `${secondaryHeight}%` }}
                        className="w-1/2 bg-[#EBF0FF] rounded-t-md transition-all duration-500"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2 font-mono">{item.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-start gap-4 text-2xs mt-2 pt-2 text-slate-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-[#5B6CFF]" /> Primary Admissions</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-[#EBF0FF]" /> Specialty Consults</span>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-md border border-slate-200/50 p-6 rounded-[24px] shadow-[0_10px_35px_-5px_rgba(91,108,255,0.04)] justify-between flex flex-col">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Demographics Balance</h3>
              <p className="text-2xs text-slate-400 mb-4">Patient cohort classifications</p>

              {/* Progress bars bar charts */}
              <div className="space-y-4">
                {[
                  { label: "Endocrinology Cases", pct: "42%", count: "42 profiles", color: "bg-blue-500" },
                  { label: "Cardiological Reviews", pct: "35%", count: "35 profiles", color: "bg-[#5B6CFF]" },
                  { label: "Routine General Check", pct: "23%", count: "23 profiles", color: "bg-rose-500" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-2xs text-slate-600">
                      <span className="font-semibold">{item.label}</span>
                      <span className="font-mono text-slate-400">{item.pct} ({item.count})</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div style={{ width: item.pct }} className={`h-full ${item.color} rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#5B6CFF]/5 border border-[#5B6CFF]/15 p-4 rounded-xl text-2xs text-slate-500 mt-4 leading-normal">
              <div className="flex items-center gap-2 font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-wider mb-1">
                <Sparkles className="h-3 w-3" /> Predictive AI Audit
              </div>
              Predictive clinician allocation index suggests highest consult density on Thursdays from 10:00 to 14:00. Pagers synced.
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render HTML doctors list tab
  const renderDoctorsPage = () => {
    return (
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6CFF] bg-[#5B6CFF]/10 px-2.5 py-1 rounded-full font-mono">
            Accredited Clinical Directory
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-teal-50 mt-1.5">Enrolled Practitioners Registry</h2>
          <p className="text-xs text-slate-500">Verified doctors, roles, active pager frequencies, and real-time availability status indicators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Dr. Sarah Jenkins, MD", role: "Clinical Director", mail: "s.jenkins@oakridgefamilycare.com", tel: "+1 (512) 555-0100", pager: "148.55 MHz", status: "Active On-Duty", color: "bg-emerald-500" },
            { name: "Dr. Marcus Vance, FACC", role: "Chief Cardiologist", mail: "m.vance@oakridgefamilycare.com", tel: "+1 (512) 555-0112", pager: "149.20 MHz", status: "Active On-Duty", color: "bg-emerald-500" },
            { name: "Dr. Elena Rostova, PhD", role: "Senior Endocrinologist", mail: "e.rostova@oakridgefamilycare.com", tel: "+1 (512) 555-0145", pager: "152.05 MHz", status: "On-Call Only", color: "bg-[#5B6CFF]" },
            { name: "Dr. Alexander Wu, MD", role: "Pediatric Specialist", mail: "a.wu@oakridgefamilycare.com", tel: "+1 (512) 555-0182", pager: "151.70 MHz", status: "Out Of Station", color: "bg-slate-350" },
          ].map((doc, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/50 p-5 rounded-[24px] shadow-[0_10px_35px_-5px_rgba(91,108,255,0.04)] hover:shadow-[0_15px_30px_rgba(91,108,255,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-xl bg-[#5B6CFF]/10 text-[#5B6CFF] flex items-center justify-center font-bold text-sm">
                    {doc.name.split(' ')[1].charAt(0)}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${doc.status.includes('Active') ? 'bg-emerald-55 text-emerald-700 bg-emerald-50' : 'bg-slate-50 text-slate-500'} border border-slate-100`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${doc.color}`} /> {doc.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-850 text-sm leading-tight">{doc.name}</h3>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">{doc.role}</span>
                </div>

                <div className="space-y-1 text-2xs text-slate-500 font-mono">
                  <p className="flex items-center gap-1.5 truncate">
                    <Mail className="h-3 w-3 text-slate-400 shrink-0" /> {doc.mail}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-slate-400 shrink-0" /> {doc.tel}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-2xs">
                <span className="text-slate-400 font-mono">Pager: {doc.pager}</span>
                <button
                  onClick={() => alert(`Signaling practitioner pager at ${doc.pager}... Paging verified successfully.`)}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-[#5B6CFF]/5 text-slate-500 hover:text-[#5B6CFF] border border-slate-100 hover:border-[#5B6CFF]/20 rounded-lg text-2xs font-extrabold cursor-pointer transition-all"
                >
                  Signal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Main UI Tabs mapping
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigation={(tab) => {
              if (tab === 'add-patient' || tab === 'patients') {
                setActiveTab('patients');
              } else {
                setActiveTab(tab);
              }
              setSelectedPatientId(null);
            }} 
            onOpenPatientChart={handleOpenPatientChartFromGlobal} 
          />
        );
      case 'risk-dashboard':
        return (
          <RiskDashboard 
            onNavigation={(tab) => {
              if (tab === 'add-patient' || tab === 'patients') {
                setActiveTab('patients');
              } else {
                setActiveTab(tab);
              }
              setSelectedPatientId(null);
            }}
            onOpenPatientChart={handleOpenPatientChartFromGlobal}
          />
        );
      case 'patients':
        return (
          <PatientsRegistry 
            initialPatientId={selectedPatientId} 
            onSelectPatientId={setSelectedPatientId}
            onOpenReportUpload={handleNavigateToReportUpload}
            onOpenAppointmentAdd={handleNavigateToAppointmentAdd}
          />
        );
      case 'doctors':
        return renderDoctorsPage();
      case 'appointments':
        return (
          <AppointmentsManager 
            initialPatientId={selectedPatientId} 
            onNavigateToPatientChart={handleOpenPatientChartFromGlobal}
          />
        );
      case 'reports':
        return (
          <RecordsLockbox 
            initialPatientId={selectedPatientId} 
            onNavigateToPatientChart={handleOpenPatientChartFromGlobal}
          />
        );
      case 'invoices':
        return <BillingDesk />;
      case 'analytics':
        return renderAnalyticsPage();
      case 'ai-assistant':
        return renderAiAssistantPage();
      case 'settings':
        return (
          <SettingsPage 
            isDarkTheme={isDarkTheme} 
            onThemeToggle={() => setIsDarkTheme(!isDarkTheme)} 
          />
        );
      case 'hackathon-hq':
        return <HackathonHQ />;
      case 'audit-logs':
        return (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6CFF] bg-[#5B6CFF]/10 px-2.5 py-1 rounded-full font-mono">
                Multitenant Partition Auditing
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 mt-1.5">Secure Clinical Audit Vault</h2>
              <p className="text-xs text-slate-500">Every record view, database edit, and report upload is cataloged under rigid security protocols matching HIPAA and GDPR.</p>
            </div>

            <div className="bg-white border border-slate-200/50 rounded-[24px] overflow-hidden shadow-[0_10px_35px_-5px_rgba(91,108,255,0.04)]">
              <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest animate-pulse">Active Database Audit Ledger</span>
                <span className="text-[10px] text-[#5B6CFF] bg-[#5B6CFF]/5 border border-[#5B6CFF]/15 px-3 py-1 rounded-full font-bold">
                  AES-256 Partition Encrypted
                </span>
              </div>

              {loadingLogs ? (
                <div className="p-12 text-center text-xs text-slate-400">Reserving secure partition clusters...</div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[500px] overflow-auto">
                  {auditLogs.length === 0 ? (
                    <p className="text-center p-8 text-xs text-slate-400">No logs indexed inside this transaction context.</p>
                  ) : (
                    auditLogs.map((log: any) => (
                      <div key={log.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#F4F7FC]/30 transition-all font-mono text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[9px] bg-sky-50 text-sky-700 font-bold uppercase shrink-0">
                              {log.action}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="font-sans text-slate-600 leading-relaxed">{log.details}</p>
                        </div>
                        <div className="text-left md:text-right shrink-0">
                          <span className="text-slate-500 block text-[10px]">By: <span className="font-sans font-semibold text-slate-700">{log.userName}</span></span>
                          <span className="text-[9px] block text-slate-400 font-mono mt-0.5">Index: {log.entityType} ({log.entityId})</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return <div className="text-xs text-slate-400">Under operational review...</div>;
    }
  };

  // If viewing landing or login, route outside of core workspace layout
  if (view === 'landing') {
    return <LandingPage onStartDemo={() => setView('login')} onGoToHQ={() => { setView('login'); handleLoginSuccess('s.jenkins@oakridgefamilycare.com'); setActiveTab('hackathon-hq'); }} />;
  }

  if (view === 'login') {
    return <AuthPage onLogin={handleLoginSuccess} onGoBack={() => setView('landing')} />;
  }

  // Enterprise Clinical Workspace Shell Layout
  return (
    <div className="min-h-screen bg-[#F4F7FC] font-sans text-slate-800 flex flex-col selection:bg-[#5B6CFF] selection:text-white transition-colors duration-200">
      
      {/* Upper Navigation Header bar */}
      <header className="h-16 border-b border-slate-200/50 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-50 shadow-[0_2px_15px_-3px_rgba(91,108,255,0.02)]">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500 md:hidden cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="h-8.5 w-8.5 bg-[#5B6CFF]/10 border border-[#5B6CFF]/20 rounded-xl flex items-center justify-center">
              <Activity className="h-4.5 w-4.5 text-[#5B6CFF]" />
            </div>
            <span className="font-bold text-base tracking-tight text-slate-855 font-sans">
              ClinicOS <span className="text-[#5B6CFF]">Cloud</span>
            </span>
          </div>
        </div>

        {/* User Details metadata */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right font-sans text-xs">
            <span className="font-bold text-slate-700 leading-none">{userProfile?.name}</span>
            <span className="mt-1 flex items-center justify-end gap-1.5 text-[10px] text-emerald-600 font-semibold font-mono bg-emerald-50 px-2 py-0.5 rounded-full">
              <Lock className="h-3 w-3" /> Cognito Verified Identity
            </span>
          </div>
          <button 
            onClick={handleLogout}
            style={{ contentVisibility: 'auto' }}
            className="p-2 border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-650 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase shadow-sm"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Exit Node</span>
          </button>
        </div>
      </header>

      {/* Main Structural Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar navigation config */}
        <aside 
          className={`hidden md:flex flex-col border-r border-slate-200/50 bg-white transition-all duration-300 relative shrink-0 ${isSidebarCollapsed ? 'w-20' : 'w-64'} shadow-[2px_0_15px_-3px_rgba(91,108,255,0.01)]`}
        >
          {/* Collapse Controller */}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute top-4 -right-3 h-6 w-6 border border-slate-200 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-650 z-50 shadow-sm cursor-pointer"
          >
            {isSidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>

          {/* Navigation link group */}
          <div className="flex-1 p-4 space-y-6 overflow-y-auto">
            
            {/* Clinical workspace segment */}
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6CFF] block px-3 mb-2 font-mono">
                  Clinical Workspace
                </span>
              )}
              {[
                { id: 'dashboard', label: 'Clinical Desk', icon: Activity },
                { id: 'risk-dashboard', label: 'Risk Dashboard', icon: ShieldAlert },
                { id: 'patients', label: 'Patient Registry', icon: Users },
                { id: 'doctors', label: 'Doctors Registry', icon: Compass },
                { id: 'appointments', label: 'Consultations Book', icon: Calendar },
                { id: 'reports', label: 'S3 Secure Vault', icon: FileText },
                { id: 'invoices', label: 'Clinical Billing', icon: CreditCard },
                { id: 'analytics', label: 'Performance Specs', icon: TableProperties },
                { id: 'ai-assistant', label: 'Gemini Assistant', icon: Sparkles },
                { id: 'audit-logs', label: 'HIPAA Audit Trail', icon: Lock }
              ].map((item) => {
                const IconComp = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setSelectedPatientId(null); }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${isSelected ? 'bg-[#5B6CFF]/10 text-[#5B6CFF] border-l-4 border-[#5B6CFF]' : 'text-slate-500 hover:bg-[#F4F7FC] hover:text-slate-800'}`}
                  >
                    <IconComp className="h-4.5 w-4.5 shrink-0" />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>

            {/* DevOps segment */}
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-3 mb-2 font-mono">
                  DevOps Portal
                </span>
              )}
              {[
                { id: 'hackathon-hq', label: 'Architecture & Cloud', icon: Award },
                { id: 'settings', label: 'Settings & Cloud Locks', icon: Settings }
              ].map((item) => {
                const IconComp = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setSelectedPatientId(null); }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${isSelected ? 'bg-[#5B6CFF]/10 text-[#5B6CFF] border-l-4 border-[#5B6CFF]' : 'text-slate-500 hover:bg-[#F4F7FC] hover:text-slate-850'}`}
                  >
                    <IconComp className="h-4.5 w-4.5 shrink-0" />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Collapsed view Tenant info */}
          <div className="p-4 border-t border-slate-100 font-mono text-[9px] text-slate-400 shrink-0 select-none">
            {!isSidebarCollapsed ? (
              <div className="space-y-1">
                <p className="font-sans font-bold text-[10px] text-[#5B6CFF]">Oakridge Wellness Clinic</p>
                <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Aurora Serverless Node</span>
                </div>
              </div>
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse block mx-auto" />
            )}
          </div>
        </aside>

        {/* Mobile menu panel dropdown link list */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              className="fixed inset-y-16 left-0 w-64 bg-white border-r border-slate-200 z-50 p-4 flex flex-col justify-between shadow-2xl md:hidden"
            >
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6CFF] block px-3 mb-1 font-mono">WORKSPACE</span>
                  {[
                    { id: 'dashboard', label: 'Clinical Desk', icon: Activity },
                    { id: 'risk-dashboard', label: 'Risk Dashboard', icon: ShieldAlert },
                    { id: 'patients', label: 'Patient Registry', icon: Users },
                    { id: 'doctors', label: 'Doctors Registry', icon: Compass },
                    { id: 'appointments', label: 'Consultations Book', icon: Calendar },
                    { id: 'reports', label: 'S3 Secure Vault', icon: FileText },
                    { id: 'invoices', label: 'Clinical Billing', icon: CreditCard },
                    { id: 'analytics', label: 'Performance Specs', icon: TableProperties },
                    { id: 'ai-assistant', label: 'Gemini Assistant', icon: Sparkles },
                    { id: 'audit-logs', label: 'HIPAA Audit Trail', icon: Lock },
                    { id: 'hackathon-hq', label: 'Architecture & Cloud', icon: Award },
                    { id: 'settings', label: 'Settings & Cloud Locks', icon: Settings }
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setSelectedPatientId(null); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${isSelected ? 'bg-[#5B6CFF]/10 text-[#5B6CFF] border-l-4 border-[#5B6CFF]' : 'text-slate-500 hover:bg-[#F4F7FC]'}`}
                      >
                        <IconComp className="h-4.5 w-4.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1 select-none">
                <p className="font-bold text-xs text-[#5B6CFF] font-sans">Dr. Sarah Jenkins</p>
                <div className="flex items-center gap-1 font-mono text-[9px] text-emerald-600 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Aurora Serverless Connected</span>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Core Main Viewport viewport */}
        <main className="flex-1 overflow-y-auto px-6 py-8 relative">
          <div className="max-w-5xl mx-auto animate-duration-1000">
            {renderActiveTabContent()}
          </div>
        </main>

      </div>
    </div>
  );
}
