'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Mail, Key, Activity, Sparkles, Server, Check } from 'lucide-react';

interface AuthPageProps {
  onLogin: (email: string) => void;
  onGoBack: () => void;
}

export default function AuthPage({ onLogin, onGoBack }: AuthPageProps) {
  const [email, setEmail] = useState('s.jenkins@oakridgefamilycare.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin(email);
      setLoading(false);
    }, 1200);
  };

  return (
    <div id="auth-page-root" className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col items-center justify-center p-6 selection:bg-[#5B6CFF] selection:text-white leading-normal relative">
      
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onGoBack}
          className="text-xs font-mono font-bold text-slate-500 hover:text-[#5B6CFF] flex items-center gap-1 transition-all cursor-pointer bg-white border border-slate-200 p-2 rounded-xl shadow-xs"
        >
          ← Return to Landing Page
        </button>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 relative shadow-2xl relative z-10">
        
        {/* Branding header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="h-12 w-12 bg-[#5B6CFF]/10 border border-[#5B6CFF]/20 rounded-2xl flex items-center justify-center shadow-sm">
            <Activity className="h-6 w-6 text-[#5B6CFF] animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight text-slate-900">ClinicOS Workstation Access</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 justify-center font-mono">
              <Shield className="h-3.5 w-3.5 text-[#5B6CFF]" />
              <span>Identity Verified via AWS Cognito</span>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="p-3 bg-[#5B6CFF]/5 border border-[#5B6CFF]/20 rounded-xl mb-6 text-xs text-indigo-700 flex items-start gap-2.5 leading-relaxed">
          <Sparkles className="h-4 w-4 text-[#5B6CFF] shrink-0 mt-0.5" />
          <p>
            <strong>Sandbox Staging</strong>: Dr. Sarah Jenkins credentials are pre-authenticated. Click Sign-In below to launch the workstation immediately.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">Clinician Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] focus:bg-white rounded-xl outline-none text-xs text-slate-800 transition-all font-semibold"
                placeholder="doctor@clinic.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cognito Master Password</label>
              <span className="text-[9px] text-[#5B6CFF] font-mono">Auto-Filled Staging</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] focus:bg-white rounded-xl outline-none text-xs text-slate-800 transition-all font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-1 py-1 text-[10px] text-slate-400">
            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span>Row-level tenant encryption keys are fully loaded</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#5B6CFF] hover:bg-[#5B6CFF]/90 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Syncing AWS Cognito Workspace Instance...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 uppercase tracking-wide">
                <Key className="h-3.5 w-3.5" /> Sign-In To Staging Workstation
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-[10px] text-slate-400 space-y-1.5 font-mono">
          <div className="flex items-center justify-center gap-1 text-slate-500 font-semibold mb-1">
            <Server className="h-3.5 w-3.5 text-[#5B6CFF]" />
            <span>Node: cluster-aurora-aws-pool:oakridge-prod</span>
          </div>
          <p>© AWS Security Gateway & HIPAA Tunnel Router v5.24</p>
        </div>
      </div>
    </div>
  );
}
