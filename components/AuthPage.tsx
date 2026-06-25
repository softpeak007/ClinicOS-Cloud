'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Mail, Key, Activity, Sparkles, Server, Check, UserPlus, HelpCircle, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onLogin: (email: string, userDetails?: any) => void;
  onGoBack: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'confirm-forgot-password';

export default function AuthPage({ onLogin, onGoBack }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Login & SignUp details
  const [email, setEmail] = useState('s.jenkins@oakridgefamilycare.com');
  const [password, setPassword] = useState('Jenkins@2026Secure!');
  const [name, setName] = useState('Dr. Sarah Jenkins, MD');
  const [role, setRole] = useState('Medical Director');

  // Forgot password flow
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        const response = await fetch('/api/auth/cognito?action=login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const result = await response.json();

        if (result.success) {
          const isSimulated = result.data.simulated;
          console.log("Cognito SignIn success. Token returned. Simulated:", isSimulated);
          
          // Determine clinic role and profile
          let userProfile = { name, role, email };
          if (email !== 's.jenkins@oakridgefamilycare.com') {
            userProfile = {
              name: email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
              role: role || 'Staff Clinician',
              email
            };
          }
          
          onLogin(email, userProfile);
        } else {
          setError(result.error || "Authentication failed.");
        }

      } else if (mode === 'signup') {
        const response = await fetch('/api/auth/cognito?action=signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, role }),
        });
        const result = await response.json();

        if (result.success) {
          setSuccess(`User registration successful. ${result.data.simulated ? "(Simulated Sandbox)" : "AWS User pool updated."}`);
          setMode('login');
        } else {
          setError(result.error || "Signup process failed.");
        }

      } else if (mode === 'forgot-password') {
        const response = await fetch('/api/auth/cognito?action=forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const result = await response.json();

        if (result.success) {
          setSuccess("Password reset code sent successfully.");
          setMode('confirm-forgot-password');
        } else {
          setError(result.error || "Failed to request code.");
        }

      } else if (mode === 'confirm-forgot-password') {
        const response = await fetch('/api/auth/cognito?action=confirm-forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code: resetCode, password: newPassword }),
        });
        const result = await response.json();

        if (result.success) {
          setSuccess("Password updated successfully. Please login.");
          setMode('login');
        } else {
          setError(result.error || "Failed to reset password.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during auth transaction.");
    } finally {
      setLoading(false);
    }
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
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="h-12 w-12 bg-[#5B6CFF]/10 border border-[#5B6CFF]/20 rounded-2xl flex items-center justify-center shadow-sm">
            <Activity className="h-6 w-6 text-[#5B6CFF]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight text-slate-900">
              {mode === 'login' && 'ClinicOS Workstation'}
              {mode === 'signup' && 'Register Clinician'}
              {mode === 'forgot-password' && 'Reset Password'}
              {mode === 'confirm-forgot-password' && 'Enter Reset Code'}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 justify-center font-mono">
              <Shield className="h-3.5 w-3.5 text-[#5B6CFF]" />
              <span>Identity Directory via AWS Cognito</span>
            </div>
          </div>
        </div>

        {/* Info or error panel */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl mb-4 text-xs text-rose-700 flex items-start gap-2.5 leading-relaxed font-mono">
            <span>⚠️</span>
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 text-xs text-emerald-700 flex items-start gap-2.5 leading-relaxed font-mono">
            <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <p>{success}</p>
          </div>
        )}

        {mode === 'login' && (
          <div className="p-3 bg-[#5B6CFF]/5 border border-[#5B6CFF]/20 rounded-xl mb-5 text-xs text-indigo-700 flex items-start gap-2.5 leading-relaxed">
            <Sparkles className="h-4 w-4 text-[#5B6CFF] shrink-0 mt-0.5" />
            <p>
              <strong>Sandbox Staging</strong>: Dr. Sarah Jenkins credentials are pre-authenticated. Click Sign-In below to launch the workstation immediately.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {(mode === 'login' || mode === 'signup' || mode === 'forgot-password' || mode === 'confirm-forgot-password') && (
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
          )}

          {mode === 'signup' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">Full Clinical Name</label>
                <div className="relative font-semibold">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] focus:bg-white rounded-xl outline-none text-xs text-slate-800 transition-all font-semibold"
                    placeholder="Dr. Sarah Jenkins, MD"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">Clinical Role / Specialty</label>
                <div className="relative font-semibold">
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] focus:bg-white rounded-xl outline-none text-xs text-slate-800 transition-all font-semibold"
                    placeholder="Medical Director / Staff Physician"
                  />
                </div>
              </div>
            </>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {mode === 'signup' ? 'Define Cognito Password' : 'Cognito Master Password'}
                </label>
                {mode === 'login' && <span className="text-[9px] text-[#5B6CFF] font-mono">Auto-Filled Staging</span>}
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
          )}

          {mode === 'confirm-forgot-password' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">Cognito OTP Verification Code</label>
                <div className="relative">
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] focus:bg-white rounded-xl outline-none text-xs text-slate-800 transition-all font-mono font-bold tracking-widest text-center"
                    placeholder="123456"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">Define New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#5B6CFF] focus:bg-white rounded-xl outline-none text-xs text-slate-800 transition-all font-mono"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between px-1 text-[10px] text-slate-400 font-semibold font-mono">
            {mode === 'login' ? (
              <>
                <button type="button" onClick={() => setMode('signup')} className="text-[#5B6CFF] hover:underline flex items-center gap-1 cursor-pointer">
                  <UserPlus className="h-3 w-3" /> Register Clinician
                </button>
                <button type="button" onClick={() => setMode('forgot-password')} className="text-slate-500 hover:underline flex items-center gap-1 cursor-pointer">
                  <HelpCircle className="h-3 w-3" /> Forgot Password?
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setMode('login')} className="text-[#5B6CFF] hover:underline flex items-center gap-1 cursor-pointer">
                <ArrowLeft className="h-3 w-3" /> Back to Log In
              </button>
            )}
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
                Processing secure Cognito authorization...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 uppercase tracking-wide">
                <Key className="h-3.5 w-3.5" /> 
                {mode === 'login' && 'Sign-In To Workstation'}
                {mode === 'signup' && 'Register Clinician Profile'}
                {mode === 'forgot-password' && 'Request Reset Code'}
                {mode === 'confirm-forgot-password' && 'Save New Password'}
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
