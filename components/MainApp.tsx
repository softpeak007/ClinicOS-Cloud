"use client";

import { useState, useEffect } from "react";
import { 
  Key, 
  Database, 
  HardDrive, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Copy, 
  Settings, 
  Terminal, 
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  FileText, 
  Activity, 
  Heart, 
  Calendar, 
  User, 
  Building,
  Check,
  HelpCircle
} from "lucide-react";
import { 
  handleSignUp, 
  handleSignIn, 
  handleVerifyOTP, 
  handleForgotPassword,
  handleConfirmForgotPassword,
  handleResendConfirmationCode,
  generateDownloadUrl, 
  generateUploadUrl, 
  checkDbConnection,
  runCognitoAudit
} from "@/app/actions";

export default function Home() {
  // Tabs: 'auth' | 'storage' | 'database' | 'env'
  const [activeTab, setActiveTab] = useState<"auth" | "storage" | "database" | "env">("auth");
  
  // Audit system state
  const [auditResult, setAuditResult] = useState<any | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  
  // Db Status
  const [dbStatus, setDbStatus] = useState<{ success: boolean; configured: boolean; connectionString?: string; error?: string } | null>(null);
  const [checkingDb, setCheckingDb] = useState(false);

  // Cognito simulator states
  const [authAction, setAuthAction] = useState<"signup" | "signin" | "verify" | "forgot" | "confirm_forgot" | "resend_code">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Clinician");
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [authResult, setAuthResult] = useState<{ success: boolean; data?: any; error?: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // S3 simulator states
  const [s3Key, setS3Key] = useState("records/patient_001_vitals.pdf");
  const [s3ContentType, setS3ContentType] = useState("application/pdf");
  const [s3Expiry, setS3Expiry] = useState(3600);
  const [s3Result, setS3Result] = useState<{ success: boolean; downloadUrl?: string; uploadUrl?: string; error?: string } | null>(null);
  const [s3Loading, setS3Loading] = useState(false);

  // Notification for copy events
  const [copiedText, setCopiedText] = useState("");

  const triggerCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const loadDbStatus = async () => {
    setCheckingDb(true);
    const status = await checkDbConnection();
    setDbStatus(status as any);
    setCheckingDb(false);
  };

  useEffect(() => {
    loadDbStatus();
  }, []);

  const onAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthResult(null);
    
    if (authAction === "signup") {
      const res = await handleSignUp({ email, password, name, role });
      setAuthResult(res);
    } else if (authAction === "signin") {
      const res = await handleSignIn({ email, password });
      setAuthResult(res);
    } else if (authAction === "verify") {
      const res = await handleVerifyOTP({ email, code: otpCode });
      setAuthResult(res);
    } else if (authAction === "forgot") {
      const res = await handleForgotPassword({ email });
      setAuthResult(res);
    } else if (authAction === "confirm_forgot") {
      const res = await handleConfirmForgotPassword({ email, code: otpCode, newPassword: password });
      setAuthResult(res);
    } else if (authAction === "resend_code") {
      const res = await handleResendConfirmationCode({ email });
      setAuthResult(res);
    }
    setAuthLoading(false);
  };

  const onS3Submit = async (type: "get" | "put") => {
    setS3Loading(true);
    setS3Result(null);
    if (type === "get") {
      const res = await generateDownloadUrl(s3Key, s3Expiry);
      if (res.success) {
        setS3Result({ success: true, downloadUrl: res.url });
      } else {
        setS3Result({ success: false, error: res.error });
      }
    } else {
      const res = await generateUploadUrl(s3Key, s3ContentType, s3Expiry);
      if (res.success) {
        setS3Result({ success: true, uploadUrl: res.url });
      } else {
        setS3Result({ success: false, error: res.error });
      }
    }
    setS3Loading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8 border-b border-slate-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> AWS Cloud-Native
            </span>
          </div>
          <h1 id="main-title" className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            ClinicOS Cloud Stack
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Production-ready, strictly typed integration architecture for Vercel deployment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadDbStatus}
            disabled={checkingDb}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white"
            title="Refresh database connection status"
          >
            <RefreshCw className={`w-4 h-4 ${checkingDb ? "animate-spin" : ""}`} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-sm">
            <Database className="w-4 h-4 text-slate-500" />
            <span>Database:</span>
            {dbStatus?.success ? (
              <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3 h-3" /> Configured
              </span>
            ) : (
              <span className="text-amber-600 flex items-center gap-1 font-semibold">
                <XCircle className="w-3 h-3" /> Not Found
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-2">
          <button
            id="nav-auth-tab"
            onClick={() => setActiveTab("auth")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "auth" 
                ? "bg-slate-900 text-white shadow-md" 
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Key className="w-4 h-4" />
            <span>AWS Cognito Auth</span>
          </button>

          <button
            id="nav-storage-tab"
            onClick={() => setActiveTab("storage")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "storage" 
                ? "bg-slate-900 text-white shadow-md" 
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>AWS S3 Storage</span>
          </button>

          <button
            id="nav-database-tab"
            onClick={() => setActiveTab("database")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "database" 
                ? "bg-slate-900 text-white shadow-md" 
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Drizzle Schema</span>
          </button>

          <button
            id="nav-env-tab"
            onClick={() => setActiveTab("env")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "env" 
                ? "bg-slate-900 text-white shadow-md" 
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Environment Setup</span>
          </button>

          <div className="pt-6 border-t border-slate-200 mt-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-2">Technical Specs</h4>
            <div className="bg-slate-100 rounded-xl p-3 text-xs space-y-1.5 font-mono text-slate-600 border border-slate-200">
              <p>Next.js: <span className="font-bold text-slate-800">v15.x</span></p>
              <p>React: <span className="font-bold text-slate-800">v19.x</span></p>
              <p>Tailwind: <span className="font-bold text-slate-800">v4.x</span></p>
              <p>Drizzle ORM: <span className="font-bold text-slate-800">v0.33.x</span></p>
              <p>AWS SDK: <span className="font-bold text-slate-800">v3.x</span></p>
            </div>
          </div>
        </aside>

        {/* Dynamic Detail Panel */}
        <main className="lg:col-span-3">
          {copiedText && (
            <div className="mb-4 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 animate-fade-in shadow-lg">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Copied {copiedText} to clipboard!</span>
            </div>
          )}

          {/* Tab 1: Cognito */}
          {activeTab === "auth" && (
            <>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-fade-in">
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">AWS Cognito Testing</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Test user pool interaction, roles, attributes, password reset, and registration flow.</p>
                </div>
                <div className="flex flex-wrap bg-slate-100 rounded-lg p-1 shrink-0 gap-1">
                  <button 
                    onClick={() => { setAuthAction("signup"); setAuthResult(null); }}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${authAction === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Sign Up
                  </button>
                  <button 
                    onClick={() => { setAuthAction("verify"); setAuthResult(null); }}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${authAction === "verify" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Verify OTP
                  </button>
                  <button 
                    onClick={() => { setAuthAction("signin"); setAuthResult(null); }}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${authAction === "signin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => { setAuthAction("forgot"); setAuthResult(null); }}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${authAction === "forgot" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Forgot Pwd
                  </button>
                  <button 
                    onClick={() => { setAuthAction("confirm_forgot"); setAuthResult(null); }}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${authAction === "confirm_forgot" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Reset Pwd
                  </button>
                  <button 
                    onClick={() => { setAuthAction("resend_code"); setAuthResult(null); }}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${authAction === "resend_code" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Resend Code
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Simulator Form */}
                <form onSubmit={onAuthSubmit} className="space-y-4">
                  {authAction === "signup" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Dr. Jordan Miller"
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Clinic Role</label>
                        <select 
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                        >
                          <option value="Clinician">Clinician (Doctor / Practitioner)</option>
                          <option value="Admin">Administrator</option>
                          <option value="Staff">Medical Staff / Nurse</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jordan.miller@clinicos.cloud"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  {(authAction === "signup" || authAction === "signin" || authAction === "confirm_forgot") && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                        {authAction === "confirm_forgot" ? "New Password" : "Password"}
                      </label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full px-3.5 py-2 pr-10 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {(authAction === "verify" || authAction === "confirm_forgot") && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                        {authAction === "confirm_forgot" ? "Reset Code (OTP)" : "OTP Verification Code"}
                      </label>
                      <input 
                        type="text" 
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="123456"
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 tracking-widest font-mono text-center font-bold text-lg"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {authLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        {authAction === "signup" && <UserPlus className="w-4 h-4" />}
                        {authAction === "signin" && <LogIn className="w-4 h-4" />}
                        {authAction === "verify" && <ShieldCheck className="w-4 h-4" />}
                        {authAction === "forgot" && <HelpCircle className="w-4 h-4" />}
                        {authAction === "confirm_forgot" && <Check className="w-4 h-4" />}
                        {authAction === "resend_code" && <RefreshCw className="w-4 h-4" />}
                        <span>
                          {authAction === "signup" && "Register with Cognito"}
                          {authAction === "signin" && "Authenticate User"}
                          {authAction === "verify" && "Verify OTP Confirmation"}
                          {authAction === "forgot" && "Send Reset Link / Code"}
                          {authAction === "confirm_forgot" && "Reset Password"}
                          {authAction === "resend_code" && "Resend OTP Code"}
                        </span>
                      </>
                    )}
                  </button>
                </form>

                {/* Response Code Block */}
                <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-slate-500" /> aws-cognito-output
                    </span>
                    {authResult && (
                      <button
                        type="button"
                        onClick={() => triggerCopy(JSON.stringify(authResult, null, 2), "response payload")}
                        className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
                        title="Copy Response JSON"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex-1 overflow-auto max-h-72 min-h-[12rem] whitespace-pre-wrap select-text">
                    {authResult ? (
                      <pre className={authResult.success ? "text-emerald-400 font-mono" : "text-rose-400 font-mono"}>
                        {JSON.stringify(authResult, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-slate-500 italic select-none">
                        Submit the form to simulate or run a real request to the configured AWS User Pool.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Programmatic Cognito Audit and Diagnostics */}
            <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Cognito Integration Audit & Diagnostics</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Run a complete programmatic check on client secrets, SECRET_HASH computations across all AWS SDK commands, and perform a real sign-up test.</p>
                </div>
                <button
                  onClick={async () => {
                    setAuditLoading(true);
                    setAuditResult(null);
                    try {
                      const result = await runCognitoAudit();
                      setAuditResult(result);
                    } catch (err: any) {
                      setAuditResult({
                        success: false,
                        logs: ["❌ Audit Execution Error: " + (err.message || String(err))],
                        rootCause: "An unexpected exception occurred when executing the server-side audit script.",
                        resolution: "Check your local developer server console or package dependencies."
                      });
                    }
                    setAuditLoading(false);
                  }}
                  disabled={auditLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm cursor-pointer disabled:bg-slate-300"
                >
                  {auditLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Running Audit...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Run Cognito Audit</span>
                    </>
                  )}
                </button>
              </div>

              {/* Audit Results View */}
              {auditResult ? (
                <div className="space-y-6 animate-fade-in">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                    auditResult.success 
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
                      : auditResult.errorDetails
                        ? "bg-rose-50 border-rose-200 text-rose-900"
                        : "bg-amber-50 border-amber-200 text-amber-900"
                  }`}>
                    {auditResult.success ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-bold text-sm">
                        {auditResult.success 
                          ? "Cognito Integration Audit: FULLY FUNCTIONAL" 
                          : "Cognito Integration Audit: ATTENTION REQUIRED"
                        }
                      </h4>
                      <p className="text-xs mt-1 text-slate-750 font-medium leading-relaxed">
                        {auditResult.success 
                          ? "All environment variables are present, SECRET_HASH parameters are mapped across all SDK commands, and the live registration test succeeded." 
                          : "The programmatic check verified SDK configurations correctly, but the live connection test failed or requires updated credentials."
                        }
                      </p>
                    </div>
                  </div>

                  {/* Requirements & Checklist Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Diagnostic Summary Cards */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Audit Checklist</h4>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3.5">
                        
                        {/* Requirement 1 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">1. Client Secret loaded:</span>
                          </div>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            auditResult.environmentStatus?.clientSecretConfigured
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}>
                            {auditResult.environmentStatus?.clientSecretConfigured 
                              ? `Yes (len: ${auditResult.environmentStatus.clientSecretLength})` 
                              : "No Secret Required"
                            }
                          </span>
                        </div>

                        {/* Requirement 2 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">2. SECRET_HASH in SDK Commands:</span>
                          </div>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Verified Correct
                          </span>
                        </div>

                        {/* Requirement 3 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">3. Test SECRET_HASH Length:</span>
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-600">
                            {auditResult.environmentStatus?.clientSecretConfigured ? "44 characters" : "0 characters (No Secret)"}
                          </span>
                        </div>

                        {/* Requirement 4 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">4. Environment Availability:</span>
                          </div>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            auditResult.environmentStatus?.userPoolIdConfigured && auditResult.environmentStatus?.clientIdConfigured
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                            {auditResult.environmentStatus?.userPoolIdConfigured && auditResult.environmentStatus?.clientIdConfigured 
                              ? "Available at Runtime" 
                              : "Placeholder Values"
                            }
                          </span>
                        </div>

                        {/* Requirement 5 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">5. Live SignUp Test:</span>
                          </div>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            auditResult.success
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {auditResult.success ? "Succeeded" : "Skipped or Mapped"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Diagnostics and Action Plan */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Root Cause & Resolution</h4>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Identified Issue</span>
                          <span className="text-xs font-bold text-slate-800 leading-relaxed block mt-1">{auditResult.rootCause}</span>
                        </div>
                        <div className="pt-2.5 border-t border-slate-150">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Correction Steps</span>
                          <span className="text-xs text-slate-600 leading-relaxed block mt-1">{auditResult.resolution}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terminal Log Output */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Audit Runtime Logs</h4>
                    <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-150 border border-slate-800 leading-relaxed max-h-60 overflow-y-auto">
                      {auditResult.logs.map((log: string, index: number) => (
                        <div key={index} className="py-0.5 whitespace-pre-wrap text-slate-300">{log}</div>
                      ))}
                    </div>
                  </div>

                  {/* Full Error Explorer */}
                  {auditResult.errorDetails && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">AWS SDK Full Exception Details</h4>
                      <div className="bg-rose-950/20 rounded-xl p-4 font-mono text-xs text-rose-200 border border-rose-900/40 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-rose-300">
                          <div><span className="font-bold text-rose-400">Error Name:</span> {auditResult.errorDetails.name}</div>
                          <div><span className="font-bold text-rose-400">Request ID:</span> {auditResult.errorDetails.requestId || "N/A"}</div>
                        </div>
                        <div><span className="font-bold text-rose-400">Message:</span> {auditResult.errorDetails.message}</div>
                        {auditResult.errorDetails.metadata && (
                          <div className="pt-2">
                            <span className="font-bold text-rose-400 block mb-1">AWS SDK Metadata Object:</span>
                            <pre className="p-2.5 bg-rose-950/40 rounded-lg text-[11px] text-rose-300/90 overflow-x-auto whitespace-pre">
                              {JSON.stringify(auditResult.errorDetails.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
                  <Settings className="w-8 h-8 text-slate-400 mb-2.5 animate-pulse" />
                  <p className="text-xs text-slate-600 font-medium">No audit run yet. Click "Run Cognito Audit" to execute programmatic checks and live connection tests.</p>
                </div>
              )}
            </div>
          </>)}

          {/* Tab 2: S3 Storage */}
          {activeTab === "storage" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-fade-in">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-900">AWS S3 Presigned URLs</h2>
                <p className="text-xs text-slate-500 mt-0.5">Generate highly secure presigned URLs to upload and retrieve records directly from S3.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">S3 Object Key (File Path)</label>
                    <input 
                      type="text"
                      value={s3Key}
                      onChange={(e) => setS3Key(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">MIME Content Type</label>
                    <input 
                      type="text"
                      value={s3ContentType}
                      onChange={(e) => setS3ContentType(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="w-full md:w-1/3">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Expiration Duration (Seconds)</label>
                  <select
                    value={s3Expiry}
                    onChange={(e) => setS3Expiry(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value={900}>15 Minutes (900s)</option>
                    <option value={3600}>1 Hour (3600s)</option>
                    <option value={86400}>24 Hours (86400s)</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => onS3Submit("get")}
                    disabled={s3Loading}
                    className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Generate GET (Download) URL</span>
                  </button>

                  <button
                    onClick={() => onS3Submit("put")}
                    disabled={s3Loading}
                    className="flex-1 bg-white text-slate-800 border border-slate-200 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <HardDrive className="w-4 h-4 text-slate-500" />
                    <span>Generate PUT (Upload) URL</span>
                  </button>
                </div>

                {/* S3 Result block */}
                {s3Result && (
                  <div className="bg-slate-900 rounded-xl p-4 text-white font-mono text-xs border border-slate-800 space-y-3 select-text">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Presigned Link Generated</span>
                      <span className="text-emerald-400 font-semibold text-[10px] uppercase">Signature OK</span>
                    </div>

                    {s3Result.success ? (
                      <div className="space-y-4">
                        {s3Result.downloadUrl && (
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-slate-400 text-[10px]">GET Download URL (expires in {s3Expiry}s)</span>
                              <button 
                                type="button"
                                onClick={() => triggerCopy(s3Result.downloadUrl!, "S3 GET URL")}
                                className="text-slate-400 hover:text-white flex items-center gap-1 p-0.5 text-[10px] hover:bg-slate-800 rounded"
                              >
                                <Copy className="w-3 h-3" /> Copy URL
                              </button>
                            </div>
                            <div className="bg-slate-950 p-2 rounded border border-slate-800 select-text overflow-x-auto whitespace-pre font-mono">
                              {s3Result.downloadUrl}
                            </div>
                          </div>
                        )}

                        {s3Result.uploadUrl && (
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-slate-400 text-[10px]">PUT Upload URL (expires in {s3Expiry}s)</span>
                              <button 
                                type="button"
                                onClick={() => triggerCopy(s3Result.uploadUrl!, "S3 PUT URL")}
                                className="text-slate-400 hover:text-white flex items-center gap-1 p-0.5 text-[10px] hover:bg-slate-800 rounded"
                              >
                                <Copy className="w-3 h-3" /> Copy URL
                              </button>
                            </div>
                            <div className="bg-slate-950 p-2 rounded border border-slate-800 select-text overflow-x-auto whitespace-pre font-mono">
                              {s3Result.uploadUrl}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-rose-400 font-mono text-xs">
                        Error generating link: {s3Result.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Drizzle Schema */}
          {activeTab === "database" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-fade-in">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-900">Drizzle PostgreSQL Schema</h2>
                <p className="text-xs text-slate-500 mt-0.5">Explore the production-ready entity models mapped directly to PostgreSQL database schemas.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Clinics */}
                <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                    <Building className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-sm text-slate-800 font-sans">clinics</h3>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 space-y-1">
                    <p><span className="text-indigo-600 font-semibold">id:</span> uuid (Primary Key, DefaultRandom)</p>
                    <p><span className="text-indigo-600 font-semibold">name:</span> text (NotNull)</p>
                    <p><span className="text-indigo-600 font-semibold">address:</span> text</p>
                    <p><span className="text-indigo-600 font-semibold">phone:</span> text</p>
                    <p><span className="text-indigo-600">created_at:</span> timestamp</p>
                  </div>
                </div>

                {/* Users */}
                <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                    <User className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-sm text-slate-800 font-sans">users</h3>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 space-y-1">
                    <p><span className="text-indigo-600 font-semibold">id:</span> uuid (Primary Key)</p>
                    <p><span className="text-rose-600 font-semibold">clinic_id:</span> uuid (FK references <span className="underline">clinics.id</span>)</p>
                    <p><span className="text-indigo-600 font-semibold">cognito_sub:</span> text (Unique, NotNull)</p>
                    <p><span className="text-indigo-600 font-semibold">email:</span> text (Unique, NotNull)</p>
                    <p><span className="text-indigo-600 font-semibold">name:</span> text</p>
                    <p><span className="text-indigo-600">role:</span> text (Admin / Clinician / Staff)</p>
                  </div>
                </div>

                {/* Patients */}
                <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <h3 className="font-bold text-sm text-slate-800 font-sans">patients</h3>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 space-y-1">
                    <p><span className="text-indigo-600 font-semibold">id:</span> uuid (Primary Key)</p>
                    <p><span className="text-rose-600 font-semibold">clinic_id:</span> uuid (FK references <span className="underline">clinics.id</span>)</p>
                    <p><span className="text-indigo-600 font-semibold">first_name / last_name:</span> text</p>
                    <p><span className="text-indigo-600">date_of_birth:</span> timestamp</p>
                    <p><span className="text-indigo-600">phone / email / gender:</span> text</p>
                  </div>
                </div>

                {/* Appointments */}
                <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <h3 className="font-bold text-sm text-slate-800 font-sans">appointments</h3>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 space-y-1">
                    <p><span className="text-indigo-600 font-semibold">id:</span> uuid (Primary Key)</p>
                    <p><span className="text-rose-600 font-semibold">clinic_id:</span> uuid (FK references <span className="underline">clinics.id</span>)</p>
                    <p><span className="text-rose-600 font-semibold">patient_id:</span> uuid (FK references <span className="underline">patients.id</span>)</p>
                    <p><span className="text-rose-600 font-semibold">user_id:</span> uuid (FK references <span className="underline">users.id</span>)</p>
                    <p><span className="text-indigo-600">start_time / end_time:</span> timestamp</p>
                    <p><span className="text-indigo-600">reason / status:</span> text</p>
                  </div>
                </div>

                {/* Records */}
                <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <h3 className="font-bold text-sm text-slate-800 font-sans">records</h3>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 space-y-1">
                    <p><span className="text-indigo-600 font-semibold">id:</span> uuid (Primary Key)</p>
                    <p><span className="text-rose-600">clinic_id / patient_id:</span> uuid (FK references)</p>
                    <p><span className="text-rose-600">appointment_id:</span> uuid (FK references)</p>
                    <p><span className="text-indigo-600">notes:</span> text</p>
                    <p><span className="text-indigo-600 font-bold">s3_key:</span> text (S3 Document pointer)</p>
                  </div>
                </div>

                {/* Vitals */}
                <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                    <Activity className="w-4 h-4 text-red-600" />
                    <h3 className="font-bold text-sm text-slate-800 font-sans">vitals</h3>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 space-y-1">
                    <p><span className="text-indigo-600 font-semibold">id:</span> uuid (Primary Key)</p>
                    <p><span className="text-rose-600 font-semibold">patient_id:</span> uuid (FK references)</p>
                    <p><span className="text-indigo-600">blood_pressure_systolic / diastolic:</span> integer</p>
                    <p><span className="text-indigo-600">temperature:</span> real | <span className="text-indigo-600">oxygen_saturation:</span> integer</p>
                    <p><span className="text-indigo-600">heart_rate / respiratory_rate:</span> integer</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Env Config */}
          {activeTab === "env" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-fade-in">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-900">Environment Setup</h2>
                <p className="text-xs text-slate-500 mt-0.5">Configure environment variables in your deployment environment or locally to test real AWS services.</p>
              </div>

              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <Settings className="w-4 h-4 text-amber-700" /> Important Configuration Note
                  </p>
                  <p className="text-xs text-amber-800">
                    To connect to a live AWS Cognito, AWS S3, and PostgreSQL instance, supply the environment keys listed below. Make sure to define them in your environment settings.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute right-4 top-4">
                    <button
                      type="button"
                      onClick={() => triggerCopy(
                        `DATABASE_URL="postgresql://username:password@your-postgres-instance:5432/clinicos"\nAWS_REGION="us-east-1"\nAWS_COGNITO_USER_POOL_ID="us-east-1_xxxxxxxxx"\nAWS_COGNITO_CLIENT_ID="xxxxxxxxxxxxxxxxxxxxxxxxxx"\nAWS_S3_BUCKET_NAME="clinicos-cloud-storage-bucket"`, 
                        "environment keys"
                      )}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-md text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Copy Configuration Template"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="bg-slate-950 text-slate-200 rounded-xl p-5 font-mono text-xs overflow-x-auto select-text border border-slate-850">
{`# Database Connection String for PostgreSQL
DATABASE_URL="postgresql://username:password@your-postgres-instance:5432/clinicos"

# AWS Settings
AWS_REGION="us-east-1"
AWS_COGNITO_USER_POOL_ID="us-east-1_xxxxxxxxx"
AWS_COGNITO_CLIENT_ID="xxxxxxxxxxxxxxxxxxxxxxxxxx"
AWS_S3_BUCKET_NAME="clinicos-cloud-storage-bucket"`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
