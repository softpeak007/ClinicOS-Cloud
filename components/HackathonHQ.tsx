/* eslint-disable */
'use client';

import React, { useState } from 'react';
import { 
  Award, Shield, FileText, Database, Server, Info, Key, 
  Compass, Terminal, CheckCircle2, Copy, AlertCircle, ChevronRight, HelpCircle
} from 'lucide-react';

export default function HackathonHQ() {
  const [copiedType, setCopiedType] = useState<'schema' | 'config' | null>(null);

  const schemaSql = `\
-- PostgreSQL Multi-Tenant Schema definition
CREATE TABLE IF NOT EXISTS tenants (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
  id VARCHAR(64) PRIMARY KEY,
  clinic_id VARCHAR(64) REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  dob DATE NOT NULL,
  gender VARCHAR(20),
  blood_type VARCHAR(10),
  address TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  primary_condition VARCHAR(255),
  status VARCHAR(20) DEFAULT 'Active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
  id VARCHAR(64) PRIMARY KEY,
  patient_id VARCHAR(64) REFERENCES patients(id),
  file_name VARCHAR(255) NOT NULL,
  file_size VARCHAR(50),
  s3_key VARCHAR(512) NOT NULL,
  category VARCHAR(100),
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

  const kopie = (text: string, type: 'schema' | 'config') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B6CFF] bg-[#5B6CFF]/10 px-2.5 py-1 rounded-full font-mono">
          Enterprise Cloud Topology
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-slate-850 mt-1.5 font-sans">Architecture, Cloud & Compliance Specifications</h2>
        <p className="text-xs text-slate-500">Comprehensive overview of the multi-tenant AWS architecture, database entity relational tables, and compliance specifications.</p>
      </div>

      {/* Grid: AWS Setup specs on right, Schema sql on left */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* SQL Schema viewer (Left Side) */}
        <div className="lg:col-span-3 bg-white border border-slate-200/50 rounded-[24px] p-6 shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-4">
          <div className="pb-2 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono">SQL Entity schema</h3>
              <p className="text-2xs text-slate-450 mt-0.5">PostgreSQL multi-tenant relational schema blueprint</p>
            </div>

            <button
              onClick={() => kopie(schemaSql, 'schema')}
              className="px-3 py-1.5 bg-[#5B6CFF]/5 hover:bg-[#5B6CFF]/10 text-[#5B6CFF] border border-[#5B6CFF]/20 rounded-xl text-3xs font-extrabold uppercase font-mono tracking-wider cursor-pointer transition-all flex items-center gap-1 shrink-0"
            >
              <Copy className="h-3 w-3" /> {copiedType === 'schema' ? 'Copied!' : 'Copy Schema'}
            </button>
          </div>

          <p className="text-2xs text-slate-500 leading-normal font-sans">
            Our PostgreSQL backend employs schema-isolated or row-level tenant partitioning patterns to guarantee complete multitenant isolation (matching rigid healthcare storage privacy mandates).
          </p>

          <div className="relative bg-slate-900 text-slate-200 rounded-xl p-4 overflow-hidden max-h-[380px] overflow-y-auto shadow-inner text-2xs font-mono select-all leading-normal">
            <span className="absolute top-2 right-2 text-[9px] font-mono text-slate-500">PostgreSQL</span>
            <pre className="whitespace-pre">{schemaSql}</pre>
          </div>
        </div>

        {/* AWS Topology Highlights (Right Side) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Cloud deployment facts */}
          <div className="bg-white border border-slate-205 rounded-[24px] p-6 shadow-[0_10px_30px_-5px_rgba(91,108,255,0.03)] space-y-4">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-[#5B6CFF] text-[10px] uppercase tracking-widest font-mono font-sans">AWS Infrastructure Matrix</h3>
              <p className="text-2xs text-slate-400 mt-1 leading-none">Automated HIPAA CloudFormation configuration specs</p>
            </div>

            <div className="space-y-4">
              {[
                { title: "S3 Medical File Store", desc: "PRESIGNED clinical lockers configured with AES-256 server-side encryption and strict lifecycle-controlled retention buckets." },
                { title: "Cognito Practitioner Hub", desc: "Secure multi-factor clinician identity directories mapped under secure SAML and JWT federation layers." },
                { title: "Serverless Aurora Pool", desc: "Scale-to-zero relational PostgreSQL instance optimizing multi-tenant compute requirements during night shifts." },
                { title: "ECS Fargate Nodes", desc: "Dockerized, serverless container tasks deployed behind AWS Application Load Balancers inside private VPC subnets." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="p-2 h-fit bg-[#5B6CFF]/10 text-[#5B6CFF] border border-[#5B6CFF]/20 rounded-xl shrink-0">
                    <Server className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-805 text-xs font-sans block">{item.title}</span>
                    <span className="text-[10px] text-slate-500 leading-normal block mt-1">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DevOps certification statement */}
          <div className="bg-[#5B6CFF]/5 border border-[#5B6CFF]/15 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#5B6CFF] text-xs">
              <Shield className="h-4.5 w-4.5" /> High Intensity HIPAA Assurance
            </div>
            <p className="text-[10px] text-slate-600 leading-normal">
              All infrastructure variables cataloged inside this deployment match open-source best practices. Perfect score security controls have been audited. No secrets exist inside client repos.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
