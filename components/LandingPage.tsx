'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Brain, Database, FileText, ArrowRight, Activity, Users, Calendar, 
  Sparkles, Check, ChevronDown, Laptop, Star, ArrowUpRight, HelpCircle, Flame, Heart, Lock, CreditCard
} from 'lucide-react';

interface LandingPageProps {
  onStartDemo: () => void;
  onGoToHQ: () => void;
}

export default function LandingPage({ onStartDemo, onGoToHQ }: LandingPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoFormSubmitted, setDemoFormSubmitted] = useState(false);
  const [demoEmail, setDemoEmail] = useState('');
  const [doctorSpecialty, setDoctorSpecialty] = useState('Primary Care');

  // Interactive statistics state
  const [activeTab, setActiveTab] = useState<'overview' | 'compliance' | 'billing'>('overview');

  const faqData = [
    {
      q: "How does the HIPAA Compliance audit trail work?",
      a: "ClinicOS Cloud integrates real-time, tamper-resistant access logging. Every patient chart read, invoice status change, and document request triggers a permanent row entry tied to the active doctor session context, guaranteeing accountability."
    },
    {
      q: "Can I connect my own AWS environment?",
      a: "Yes. ClinicOS Cloud is built using a decoupled domain-driven layout. When transitioning from client-side testing to professional hosting, your VPC credentials for Cognito User Pools, Aurora Serverless clusters, and secure S4 private buckets can be mapped inside your Cloud Console configuration instantly."
    },
    {
      q: "How does the AI Clinical OCR summarizer function?",
      a: "Upon uploading any diagnostic lab sheet or medical report, our backend calls Google's latest Gemini model. It parses messy scanned text, isolates core diagnostic markers, categorizes anomalies, and outputs a highly integrated abstract saved securely to database records."
    },
    {
      q: "Will this handle custom tenant isolation?",
      a: "ClinicOS enforces secure row-level isolation via standardized system keys. Clinicians can only browse records and invoices assigned to their specific hospital registration credentials, ensuring high multi-tenant safety."
    }
  ];

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoEmail) {
      setDemoFormSubmitted(true);
      setTimeout(() => {
        setIsDemoModalOpen(false);
        setDemoFormSubmitted(false);
        setDemoEmail('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#5B6CFF] selection:text-white antialiased">
      
      {/* 1. STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-[#5B6CFF]/10 border border-[#5B6CFF]/20 rounded-xl flex items-center justify-center shadow-sm">
              <Activity className="h-5 w-5 text-[#5B6CFF]" />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight text-slate-900">
              ClinicOS <span className="text-[#5B6CFF]">Cloud</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-[#5B6CFF] transition-all">Platform Features</a>
            <a href="#ai-synthesis" className="hover:text-[#5B6CFF] transition-all">AI Workspace</a>
            <a href="#pricing" className="hover:text-[#5B6CFF] transition-all">Plans</a>
            <a href="#faq" className="hover:text-[#5B6CFF] transition-all">Support</a>
            <button 
              onClick={onGoToHQ}
              className="text-[#5B6CFF] hover:text-[#5B6CFF]/80 font-mono transition-all text-xs font-bold"
            >
              [ AWS Engine Blueprint ]
            </button>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="hidden sm:inline-block px-4 py-2 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Book Enterprise Demo
            </button>
            <button 
              onClick={onStartDemo}
              className="px-4 py-2 bg-[#5B6CFF] hover:bg-[#5B6CFF]/90 text-white text-xs font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer flex items-center gap-1.5"
            >
              <span>Connect Workstation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-24 px-6 overflow-hidden">
        {/* Abstract Light Gradients */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[70%] h-[400px] bg-gradient-to-tr from-blue-300/20 via-indigo-300/15 to-purple-300/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 shadow-sm rounded-full text-xs font-semibold text-slate-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#5B6CFF]" />
            <span>ClinicOS v1.2 Enterprise Cloud Architecture is fully ready</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-6 max-w-4xl mx-auto mt-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-sans tracking-tight text-slate-900 leading-[1.1]">
              The Trusted Unified Workstation <br />
              For <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B6CFF] to-indigo-700">Modern Clinical SaaS</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Consolidate high-fidelity patient charts, Amazon S3 medical report vaults, visual biometric drift counters, and structured HIPAA ledger logging into an intuitive, ultra-clean web platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onStartDemo}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#5B6CFF] hover:bg-[#5B6CFF]/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                Launch Workstation Portal <ArrowRight className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                Schedule Guided Call
              </button>
            </div>
          </motion.div>

          {/* Floating Previews / Dashboard Simulation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-5xl mx-auto mt-16 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xl relative"
          >
            {/* Window Handles */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 bg-red-400 rounded-full inline-block" />
                <span className="h-3 w-3 bg-amber-400 rounded-full inline-block" />
                <span className="h-3 w-3 bg-emerald-400 rounded-full inline-block" />
                <span className="text-xs text-slate-400 ml-2 font-mono">clinic_desk_v1.ts</span>
              </div>
              <div className="flex gap-2">
                {['overview', 'compliance', 'billing'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${activeTab === tab ? 'bg-[#5B6CFF]/15 text-[#5B6CFF]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Inner Simulator view based on active tab */}
            <div className="min-h-[280px] bg-slate-50/50 rounded-2xl p-6 text-left border border-slate-100 flex flex-col justify-between">
              
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* KPIS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-white border border-slate-200/60 rounded-xl shadow-xs">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Daily Registry</p>
                      <h4 className="text-2xl font-black text-slate-800 mt-1">1,248</h4>
                      <span className="text-[9px] text-[#5B6CFF] font-semibold mt-1 inline-block">↑ Row-Level Isolated</span>
                    </div>
                    <div className="p-4 bg-white border border-slate-200/60 rounded-xl shadow-xs">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Reports Digitized</p>
                      <h4 className="text-2xl font-black text-slate-800 mt-1">412 <span className="text-xs font-normal text-slate-400">files</span></h4>
                      <span className="text-[9px] text-emerald-600 font-semibold mt-1 inline-block">✓ OCR Completed</span>
                    </div>
                    <div className="p-4 bg-white border border-slate-200/60 rounded-xl shadow-xs">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Outstanding Claims</p>
                      <h4 className="text-2xl font-black text-[#5B6CFF] mt-1">$14,840</h4>
                      <span className="text-[9px] text-indigo-500 font-semibold mt-1 inline-block">⚡ Direct Billing Router</span>
                    </div>
                  </div>

                  {/* Sample table mock */}
                  <div className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-xs">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider flex justify-between">
                      <span>Clinical Operations Feed</span>
                      <span className="text-[#5B6CFF]">Real-Time Active</span>
                    </div>
                    <div className="p-3.5 space-y-2 text-xs">
                      <div className="flex justify-between items-center bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                        <span className="font-semibold text-slate-700">Eleanor Vance</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">Presigned URL Approved</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                        <span className="font-semibold text-slate-700">Julian Stark</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">Heart Drift Risk Level Red</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'compliance' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-[#5B6CFF]/10 text-[#5B6CFF] rounded-xl border border-[#5B6CFF]/20">
                    <Shield className="h-5 w-5 shrink-0" />
                    <p className="text-xs">
                      <strong>Audit Active Protection</strong>: Every data read registers an asynchronous log sequence linked to individual doctor tokens.
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200/60 p-4 rounded-xl space-y-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">GDPR & HIPAA SECURE AUDIT BLOCK</p>
                    <div className="font-mono text-[10px] text-slate-500 space-y-1">
                      <p className="flex justify-between border-b pb-1 border-slate-100"><span>12:28:04 UT01 - [S3_INITIATION_APPROVED]</span> <span className="text-emerald-600 font-bold">SHA-256 Validated</span></p>
                      <p className="flex justify-between border-b pb-1 border-slate-100"><span>12:28:12 UT01 - [VITAL_METRIC_RECALIBRATE]</span> <span className="text-slate-600">ID: Patient Vance</span></p>
                      <p className="flex justify-between"><span>12:29:01 UT01 - [GEMINI_OCR_SYNTHESIS]</span> <span className="text-[#5B6CFF] font-bold">Abstract Generated</span></p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-4">
                  <div className="border border-slate-200/60 bg-white p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Clinic Active Invoice Stream</span>
                      <span className="text-base font-bold text-slate-800">Total Pending Outstandings</span>
                    </div>
                    <span className="text-3xl font-extrabold text-indigo-600">$18,482.00</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3 bg-white border border-slate-100 rounded-xl">
                      <span className="text-slate-400 block pb-1 border-b mb-1 border-slate-50 uppercase text-[9px]">Medicare Reimbursements</span>
                      <span className="text-slate-800 font-bold">78% Streamed</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-100 rounded-xl">
                      <span className="text-slate-400 block pb-1 border-b mb-1 border-slate-50 uppercase text-[9px]">Average Collection Cycle</span>
                      <span className="text-[#5B6CFF] font-bold">14 Business Days</span>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-[10px] font-mono text-slate-400 text-center border-t border-slate-100/50 pt-3">
                Live Dynamic State Renderer Component v1.20
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. TRUST SECTION */}
      <section className="py-12 bg-white border-y border-slate-200/60">
        <div id="features" className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#5B6CFF]">Enterprise Security Architecture</p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mt-8">
            {[
              { label: "HIPAA Compliant", icon: Shield, desc: "Private metadata locks" },
              { label: "AWS Identity Pool", icon: Lock, desc: "Validated via Cognito" },
              { label: "Relational Aurora", icon: Database, desc: "Isolated Postgres v2" },
              { label: "Secure S3 Store", icon: FileText, desc: "Presigned URL access" },
              { label: "Gemini OCR AI", icon: Brain, desc: "Server-side OCR engine" },
              { label: "GDPR Audited", icon: Activity, desc: "Continuous write logs" }
            ].map((badge, idx) => {
              const IconComp = badge.icon;
              return (
                <div key={idx} className="flex flex-col items-center p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                  <div className="h-10 w-10 rounded-full bg-[#5B6CFF]/5 flex items-center justify-center mb-3">
                    <IconComp className="h-5 w-5 text-[#5B6CFF]" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">{badge.label}</span>
                  <span className="text-[9px] text-slate-400 mt-1 font-sans">{badge.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="p-1 px-3 bg-indigo-500/10 text-[#5B6CFF] text-[10px] uppercase font-bold rounded-full">Complete Modules Suite</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950">A Fully Integrated Clinical Ecosystem</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Eliminate loose paper spreadsheets and vulnerable files. ClinicOS Cloud manages operations reliably in one safe browser session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Unified Patient Registry",
              desc: "Deep visual history records highlighting vital trends, demographic entries, individual physician consultation updates, and historical billing invoice lists mapped securely.",
              icon: Users,
              color: "text-blue-500 bg-blue-500/10"
            },
            {
              title: "S3 Medical Records Lockbox",
              desc: "Drag-and-drop diagnostic reports into secure S3 private storage. ClinicOS requests cryptographically signed download tokens ensuring clinical charts are never exposed publicly.",
              icon: FileText,
              color: "text-indigo-500 bg-indigo-500/10"
            },
            {
              title: "Biometric Compliance Drift",
              desc: "Automated analysis software calculating heart rate fluctuations and vital indices drift thresholds. Clinicians see clear visual warnings on potential biometric anomalies.",
              icon: Heart,
              color: "text-rose-500 bg-rose-500/10"
            },
            {
              title: "Clinical Billing Desk",
              desc: "Track Medicare or self-pay accounts within organized pipelines. Review pending invoices, issue clinic adjustments, and audit payment receipts in full alignment.",
              icon: CreditCard,
              color: "text-emerald-500 bg-emerald-500/10"
            },
            {
              title: "Consultation Ledger",
              desc: "Schedule and reschedule diagnostic checkups via a unified clinic calendar, optimizing patient flow and managing physician time blocks with clear workflows.",
              icon: Calendar,
              color: "text-amber-500 bg-amber-500/10"
            },
            {
              title: "GDPR Access Audit Trail",
              desc: "Continuous, automatic session-tied transaction logging. Review clinical actions securely inside the admin module to verify compliance alignment anytime.",
              icon: Activity,
              color: "text-indigo-600 bg-indigo-600/10"
            }
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                whileHover={{ y: -5 }}
                key={idx}
                className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all space-y-4"
              >
                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${item.color}`}>
                  <IconComp className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. AI GLOW / GEMINI SECTION */}
      <section id="ai-synthesis" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-indigo-300">
              <Brain className="h-3.5 w-3.5 text-indigo-400" />
              <span>Google Gemini AI Integration</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Instant Medical Scans <br />
              <span className="text-[#5B6CFF]">OCR Abstract Summaries</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-350 leading-relaxed">
              Upon uploading hand-scanned notes or PDF diagnostic papers to S3 storage, ClinicOS initiates Google&apos;s elite Gemini model client server-side. Within seconds, it parses diagnostic findings and converts cluttered files into perfect structured bullet records.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400 shrink-0" /> Zero manual OCR data entry</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400 shrink-0" /> Highlights patient risk flags & metabolic markers</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400 shrink-0" /> Writes metadata abstracts securely into Postgres</li>
            </ul>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold font-mono">ELEANOR_VANCE_LAB_SCAN.pdf</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-mono animate-pulse">Gemini Parsed</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl space-y-3 font-mono text-[10px]">
              <div className="text-slate-400 border-b border-slate-800 pb-2">
                <strong>Raw Scan Audio/Text OCR Feed</strong>: Fasting Glucose levels read at 142 mg/dL. HbA1c read at 7.2%. Mild tachycardia observed during metabolic rest evaluations.
              </div>
              <div className="space-y-1">
                <p className="text-indigo-300 font-bold">Synthesized Clinical Abstract Summary:</p>
                <div className="space-y-1 font-sans text-slate-300 leading-normal pl-2 border-l border-indigo-500/40">
                  <p>• **Metabolic Alert**: Fasting glucose (142) and HbA1c (7.2%) indicate chronic pre-diabetic state.</p>
                  <p>• **Recommendations**: Adjust glycemic management blocks and trigger heart compliance watch lists.</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <span className="text-[9px] text-slate-500 font-mono">Safe Serverless Integration Core (gemini-3.5-flash)</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-24 px-6 bg-[#F1F5F9]/50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5B6CFF]">Practicing Directors Reviews</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">Vouched by Trusted Healthcare Networks</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                text: "Transitioning our clinic operations from loose offline logs to ClinicOS Cloud cut admin backlogs by 12 hours a week. The S3 presigned vault secures our patient reports seamlessly.",
                author: "Dr. Sarah Jenkins, MD",
                role: "Director, Oakridge Family Practice"
              },
              {
                text: "The server-side Google Gemini OCR tool has been a life saver for clinical intakes. Messy PDF lab scans compile instantly into actionable vitals metadata, improving patient care directly.",
                author: "Dr. Raymond Vance, MD",
                role: "Clinical Lead, Metro Health Network"
              },
              {
                text: "HIPAA compliance was our biggest barrier. ClinicOS solved it with deep audit recording and row-level isolated AWS Aurora configurations. A masterclass in software craftsmanship.",
                author: "Clara Brooks",
                role: "Operations Officer, Valley Cardiology"
              }
            ].map((test, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
                <p className="text-xs text-slate-600 leading-relaxed italic">&ldquo;{test.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-[#5B6CFF]">
                    {test.author.charAt(4)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{test.author}</h4>
                    <p className="text-[10px] text-slate-400">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5B6CFF]">Direct SaaS Pricing</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950">Plans Engineered To Scale</h2>
            <p className="text-sm text-slate-500">Transparent packages for physicians of any scale, from start-ups to state systems.</p>
            
            {/* Toggle */}
            <div className="inline-flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 mt-3">
              <button 
                onClick={() => setBillingPeriod('monthly')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${billingPeriod === 'monthly' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingPeriod('annual')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${billingPeriod === 'annual' ? 'bg-[#5B6CFF] text-white shadow-sm' : 'text-slate-400'}`}
              >
                <span>Annual</span>
                <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
            
            {/* Standard */}
            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl space-y-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Starter Suite</span>
                <h3 className="text-xl font-bold text-slate-800">Independent Physician</h3>
                <p className="text-xs text-slate-400 leading-normal">Perfect for solo physicians launching modern clinical databases with local states.</p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-800">
                    {billingPeriod === 'annual' ? '$149' : '$189'}
                  </span>
                  <span className="text-xs text-slate-400">/ clinic / mo</span>
                </div>
                <ul className="space-y-3.5 pt-4 text-xs text-slate-650">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Up to 250 Active Patients</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> S3 Sandbox Records Locker</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Daily Vitals Compliance Drifts</li>
                  <li className="flex items-center gap-2 text-slate-350"><Check className="h-4 w-4 text-slate-300 shrink-0" /> Gemini AI Summarizer Module</li>
                </ul>
              </div>
              <button onClick={onStartDemo} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer text-xs mt-6">
                Start Coding Local
              </button>
            </div>

            {/* Pro */}
            <div className="bg-white border-2 border-[#5B6CFF]/80 p-8 rounded-3xl space-y-6 shadow-lg relative flex flex-col justify-between">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#5B6CFF] text-white text-[9px] uppercase font-black px-2.5 py-1 rounded-full tracking-wide">
                ⭐ Highly Demanded
              </div>
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-[#5B6CFF] tracking-wider">Professional Team</span>
                <h3 className="text-xl font-bold text-slate-800">Multi-Specialty Care</h3>
                <p className="text-xs text-slate-400 leading-normal">Optimized for growing practices needing robust serverless AI integrations.</p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-800">
                    {billingPeriod === 'annual' ? '$299' : '$369'}
                  </span>
                  <span className="text-xs text-slate-400">/ clinic / mo</span>
                </div>
                <ul className="space-y-3.5 pt-4 text-xs text-slate-650">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Unlimited Registry Rows</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Presigned S3 Health Vaults</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Gemini AI Summaries (Standard)</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Master Consultation Ledger</li>
                </ul>
              </div>
              <button onClick={onStartDemo} className="w-full py-3 bg-[#5B6CFF] hover:bg-[#5B6CFF]/90 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs mt-6">
                Launch Workspace Today
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-slate-900 border border-slate-800 text-white p-8 rounded-3xl space-y-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Enterprise Network</span>
                <h3 className="text-xl font-bold">Federated Health Net</h3>
                <p className="text-xs text-slate-450 leading-normal">For multi-tenant hospital providers seeking dedicated AWS cluster structures.</p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-white">Custom</span>
                  <span className="text-xs text-slate-400"> / year</span>
                </div>
                <ul className="space-y-3.5 pt-4 text-xs text-slate-350">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400 shrink-0" /> Federated AWS Cognito Auth</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400 shrink-0" /> Serverless Aurora PostgreSQL</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400 shrink-0" /> GDPR & HIPAA Logs Ledger</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400 shrink-0" /> SLA & 24/7 Hot-Standby Route</li>
                </ul>
              </div>
              <button onClick={() => setIsDemoModalOpen(true)} className="w-full py-3 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-xl transition-all cursor-pointer text-xs mt-6">
                Contact Enterprise Architect
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="py-24 px-6 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5B6CFF]">Frequently Asked Solutions</span>
            <h2 className="text-3xl font-black text-slate-900">Platform Common Queries</h2>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-5 text-left font-bold text-slate-900 text-xs sm:text-sm flex items-center justify-between hover:text-[#5B6CFF] transition-all cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-all ${isOpen ? 'rotate-180 text-[#5B6CFF]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-slate-100 text-xs text-slate-500 leading-relaxed font-sans bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-r from-[#5B6CFF] via-indigo-600 to-indigo-700 text-white">
        <div className="absolute top-0 right-0 w-[45%] h-[350px] bg-sky-400/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black leading-tight">Elevate Your Clinical Practice to AWS Standards</h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl mx-auto">
            Review security-first charts, S3 lockboxes, compliance drift widgets, and automated OCR routines inside a single high-fidelity workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartDemo}
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#5B6CFF] font-bold rounded-xl hover:bg-slate-50 shadow-lg cursor-pointer text-sm font-sans"
            >
              Sign-In Secure Workstation
            </button>
            <button
              onClick={onGoToHQ}
              className="w-full sm:w-auto px-6 py-3.5 bg-indigo-500/30 border border-white/20 hover:bg-indigo-500/40 text-white font-bold rounded-xl transition-all cursor-pointer text-sm font-sans"
            >
              Inspect Compliance Stack
            </button>
          </div>
        </div>
      </section>

      {/* 10. PREMIUM ENTERPRISE FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#5B6CFF]/20 border border-[#5B6CFF]/30 rounded-lg flex items-center justify-center">
                <Activity className="h-4.5 w-4.5 text-[#5B6CFF]" />
              </div>
              <span className="font-sans font-bold text-sm tracking-tight text-white">ClinicOS Cloud</span>
            </div>
            <p className="max-w-xs text-slate-450 leading-relaxed font-sans text-[11px]">
              ClinicOS is state-approved compliance software mapping standard healthcare metadata charts securely within sandboxed multi-tenant contexts.
            </p>
            <p className="text-[10px] text-slate-500 font-mono">© 2026-present ClinicOS Cloud Inc. All rights reserved.</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Product</h4>
            <ul className="space-y-2 text-xs font-sans">
              <li><button onClick={onStartDemo} className="hover:text-white transition-all text-left">Clinical Desk</button></li>
              <li><button onClick={onStartDemo} className="hover:text-white transition-all text-left">Cognito Guard</button></li>
              <li><button onClick={onStartDemo} className="hover:text-white transition-all text-left font-semibold text-indigo-400">Gemini OCR Abstract</button></li>
              <li><button onClick={onStartDemo} className="hover:text-white transition-all text-left">Receivables desk</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Resources</h4>
            <ul className="space-y-2 text-xs font-sans">
              <li><button onClick={onGoToHQ} className="hover:text-white transition-all text-left text-[11px] font-mono">[ AWS Blueprint Docs ]</button></li>
              <li><a href="#faq" className="hover:text-white transition-all">Common FAQs</a></li>
              <li><a href="#pricing" className="hover:text-white transition-all font-semibold text-indigo-400">Enterprise Quote</a></li>
              <li><span className="text-slate-600 block">SLA Guidelines</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Legal Safeguards</h4>
            <ul className="space-y-2 text-xs font-sans">
              <li><span className="text-slate-500 block">HIPAA BAA Agreement</span></li>
              <li><span className="text-slate-500 block">GDPR Multi-Tenant Addendum</span></li>
              <li><span className="text-slate-500 block">Zero-Trust Audit Framework</span></li>
              <li><span className="text-slate-500 block">Terms of Healthcare SaaS</span></li>
            </ul>
          </div>

        </div>
      </footer>

      {/* BOOK DEMO MODAL POPUP */}
      <AnimatePresence>
        {isDemoModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 w-full max-w-lg relative whitespace-normal"
            >
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Laptop className="h-5 w-5 text-[#5B6CFF]" />
                <span className="font-bold text-slate-800">ClinicOS Cloud Demo Booking</span>
              </div>

              {demoFormSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="h-12 w-12 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                    ✓
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">Demo Request Streamed Successfully!</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Our Lead Enterprise Architect will reach out to you within 4 business hours to set up your isolated AWS sandbox cluster.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  <p className="text-xs text-slate-500">
                    Input your credentials to provision a dedicated 14-day staging environment linked directly to your AWS instance boundaries.
                  </p>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Work Email Address</label>
                    <input
                      type="email"
                      required
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      placeholder="directorship@practice-wellness.org"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none text-xs focus:border-[#5B6CFF] text-slate-800 bg-slate-50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Practice Vibe / Specialty</label>
                      <select 
                        value={doctorSpecialty} 
                        onChange={(e) => setDoctorSpecialty(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none text-xs text-slate-800 bg-slate-50"
                      >
                        <option>Primary Care</option>
                        <option>Cardiology</option>
                        <option>Pediatrics</option>
                        <option>Clinical Research</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Target Size</label>
                      <select className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none text-xs text-slate-800 bg-slate-50">
                        <option>1 - 5 Physicians</option>
                        <option>6 - 20 Physicians</option>
                        <option>Multi-District Center</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#5B6CFF] hover:bg-[#5B6CFF]/90 text-white font-bold rounded-xl text-xs transition-all tracking-wide"
                  >
                    Negotiate Demo Provision
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
