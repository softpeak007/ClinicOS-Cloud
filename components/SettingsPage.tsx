/* eslint-disable */
'use client';

import React from 'react';
import { 
  Settings, Shield, Key, Eye, User, Server, Compass, 
  Moon, Sun, CheckCircle, Database, HelpCircle, Info
} from 'lucide-react';

interface SettingsPageProps {
  isDarkTheme: boolean;
  onThemeToggle: () => void;
}

export default function SettingsPage({ isDarkTheme, onThemeToggle }: SettingsPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6CFF] bg-[#5B6CFF]/10 px-2.5 py-1 rounded-full font-mono">
          System Administration
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-850 mt-1.5 font-sans">Settings & Control Desk</h2>
        <p className="text-xs text-slate-500">Configure visual themes, audit AWS endpoints, and manage encrypted HIPAA compliant parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core parameters */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Visual Preferences */}
          <div className="bg-white/95 border border-slate-200/50 rounded-[24px] p-6 shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-4">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">Visual Preferences</h3>
              <p className="text-2xs text-slate-400">Configure default rendering assets for client terminals</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F4F7FC]/55 border border-slate-100 rounded-2xl">
              <div className="space-y-0.5">
                <span className="font-sans font-bold text-slate-805 text-xs block">Vitals Dark Mode Canvas</span>
                <span className="text-2xs text-slate-450 block">Invert visual templates to reduce ophthalmological strain during night clinics</span>
              </div>
              
              <button
                onClick={onThemeToggle}
                className="p-2 border border-slate-205 hover:bg-[#5B6CFF]/5 hover:text-[#5B6CFF] hover:border-[#5B6CFF]/20 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-mono text-3xs font-extrabold text-slate-500 uppercase shadow-xs bg-white shrink-0"
              >
                {isDarkTheme ? (
                  <>
                    <Sun className="h-4 w-4 text-amber-500" />
                    <span>Deploy Light UI</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 text-indigo-500" />
                    <span>Deploy Dark UI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tenant credentials metadata */}
          <div className="bg-white/95 border border-slate-200/50 rounded-[24px] p-6 shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-4">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">Tenant Environmental parameters</h3>
              <p className="text-2xs text-slate-400">Environment keys managed server-side (.env.example active)</p>
            </div>

            {/* Display list of environment statuses (No input fields for secret entries, as per guidelines) */}
            <div className="space-y-3.5">
              {[
                { name: "CLINICOS_AWS_REGION", val: "us-east-1", status: "Active Environment", desc: "Default region route for ECS nodes and Aurora partitions" },
                { name: "CLINICOS_AURORA_DB_URL", val: "postgresql://******.cluster-ro-****.us-east-1.rds.amazonaws.com", status: "Active Environment", desc: "Multi-tenant partitioned serverless database engine pools" },
                { name: "CLINICOS_COGNITO_USER_POOL", val: "us-east-1_xTD*****9", status: "Active Environment", desc: "Clinician identity claims partition block" },
                { name: "CLINICOS_AWS_S3_VAULT", val: "clinical-records-lockbox-prod", status: "Active Environment", desc: "S3 SQS storage bucket endpoint" }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 bg-[#F4F7FC]/65 border border-slate-100 rounded-xl space-y-1">
                  <div className="flex justify-between items-center flex-wrap gap-1.5">
                    <span className="font-mono text-xs font-bold text-slate-800">{item.name}</span>
                    <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-[#5B6CFF]/10 text-[#5B6CFF] uppercase">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-550 italic leading-none truncate font-mono">{item.val}</p>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-sans pt-1 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#5B6CFF]/5 border border-[#5B6CFF]/15 p-4 rounded-xl text-3xs font-mono text-slate-550 flex items-start gap-2.5">
              <Info className="h-4.5 w-4.5 text-[#5B6CFF] shrink-0" />
              <p className="leading-normal">
                Credentials are core-isolated inside AWS Secrets Manager parameters. 
                Never commit secret strings directly inside client-side repository assets. Refer to `.env.example` file profiles inside the workspace root.
              </p>
            </div>
          </div>

        </div>

        {/* Security Summary & FAQ side column */}
        <div id="settings-side-column" className="space-y-6">
          <div className="bg-white/95 border border-slate-200/50 p-6 rounded-[24px] shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-4">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">HIPAA & GDPR Assurance</h3>
              <p className="text-2xs text-slate-400">Institutional certifications & parameters</p>
            </div>

            <div className="space-y-4 text-xs font-sans">
              {[
                { title: "AES-256 Volume encryption", checked: true },
                { title: "TLS v1.3 Transit protocol enforced", checked: true },
                { title: "Continuous CloudTrail audit logging", checked: true },
                { title: "Independent annual SOC2 certification", checked: true }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  <span className="text-slate-650 font-bold font-sans text-2xs leading-none">{item.title}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4 text-center font-mono text-[9px] text-slate-400">
              Last System Audit Score: <span className="font-bold text-[#5B6CFF]">100/100 HIPAA</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
