import fs from 'fs';
import path from 'path';

export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  plan: string;
  createdAt: string;
}

export interface User {
  id: string;
  clinicId: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

export interface Patient {
  id: string;
  clinicId: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  bloodType: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  primaryCondition: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Appointment {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string; // denormalized for easy client render
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutes
  reason: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
  notes?: string;
}

export interface Report {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  fileName: string;
  fileSize: string;
  category: string; // Lab test, Radiology, Diagnostic, Prescription
  uploadedAt: string;
  uploadedBy: string;
  summary?: string; // AI generated summary
  s3Key: string;
}

export interface Invoice {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  service: string;
  issuedAt: string;
}

export interface AuditLog {
  id: string;
  clinicId: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface PatientReading {
  id: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  glucose: number;
  bloodPressure: string;
  pulse: number;
  hba1c: number;
  status: 'Normal' | 'Review' | 'Urgent';
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseState {
  clinics: Clinic[];
  users: User[];
  patients: Patient[];
  appointments: Appointment[];
  reports: Report[];
  invoices: Invoice[];
  auditLogs: AuditLog[];
  patientReadings?: PatientReading[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'db.json');

const INITIAL_STATE: DatabaseState = {
  clinics: [
    {
      id: "clinic-default",
      name: "Oakridge Family Care & Cardiology",
      address: "128 Oakridge Medical Parkway, Suite 400, Austin, TX 78759",
      phone: "+1 (512) 555-0192",
      email: "contact@oakridgefamilycare.com",
      plan: "Enterprise Cloud Plus",
      createdAt: "2025-01-15T08:00:00Z"
    }
  ],
  users: [
    {
      id: "user-default",
      clinicId: "clinic-default",
      name: "Dr. Sarah Jenkins, MD",
      email: "s.jenkins@oakridgefamilycare.com",
      role: "Medical Director",
      lastLogin: "2026-06-13T06:30:00Z"
    }
  ],
  patients: [
    {
      id: "pat-1",
      clinicId: "clinic-default",
      name: "Eleanor Vance",
      email: "e.vance@gmail.com",
      phone: "+1 (512) 555-0144",
      dob: "1958-04-12",
      gender: "Female",
      bloodType: "A+",
      address: "4203 Bluebonnet Lane, Austin, TX 78704",
      emergencyContactName: "Thomas Vance (Son)",
      emergencyContactPhone: "+1 (512) 555-0145",
      primaryCondition: "Hypertension & Mild Astigmatism",
      status: "Active",
      createdAt: "2025-11-20T14:30:00Z"
    },
    {
      id: "pat-2",
      clinicId: "clinic-default",
      name: "Arthur Pendelton",
      email: "arthur.p@gmail.com",
      phone: "+1 (512) 555-0311",
      dob: "1984-09-25",
      gender: "Male",
      bloodType: "O-",
      address: "1709 Westlake Hills Dr, West Lake Hills, TX 78746",
      emergencyContactName: "Sarah Pendelton (Spouse)",
      emergencyContactPhone: "+1 (512) 555-0312",
      primaryCondition: "Type 2 Diabetes Mellitus",
      status: "Active",
      createdAt: "2026-01-08T09:15:00Z"
    },
    {
      id: "pat-3",
      clinicId: "clinic-default",
      name: "Chloe Mercer",
      email: "chloejm@gmail.com",
      phone: "+1 (512) 555-0988",
      dob: "1997-11-05",
      gender: "Female",
      bloodType: "AB+",
      address: "812 Colorado St, Apt 14B, Austin, TX 78701",
      emergencyContactName: "Daniel Mercer (Spouse)",
      emergencyContactPhone: "+1 (512) 555-0989",
      primaryCondition: "Pregnancy routine (G2P1, 24 Weeks)",
      status: "Active",
      createdAt: "2026-02-14T11:45:00Z"
    },
    {
      id: "pat-4",
      clinicId: "clinic-default",
      name: "Brandon Fletcher",
      email: "bfletcher@outlook.com",
      phone: "+1 (512) 555-2342",
      dob: "1972-07-20",
      gender: "Male",
      bloodType: "B+",
      address: "1104 Rainey St, Austin, TX 78701",
      emergencyContactName: "George Fletcher (Brother)",
      emergencyContactPhone: "+1 (512) 555-2343",
      primaryCondition: "Chronic Asthma (Moderate Persistent)",
      status: "Active",
      createdAt: "2026-03-01T15:00:00Z"
    },
    {
      id: "pat-5",
      clinicId: "clinic-default",
      name: "Maya Lin",
      email: "maya.lin@gmail.com",
      phone: "+1 (512) 555-7722",
      dob: "1993-01-18",
      gender: "Female",
      bloodType: "O+",
      address: "3104 South Congress Ave, Austin, TX 78704",
      emergencyContactName: "Jack Lin (Father)",
      emergencyContactPhone: "+1 (512) 555-7723",
      primaryCondition: "General Anxiety Disorder",
      status: "Active",
      createdAt: "2026-05-10T10:30:00Z"
    }
  ],
  appointments: [
    {
      id: "app-1",
      clinicId: "clinic-default",
      patientId: "pat-1",
      patientName: "Eleanor Vance",
      date: "2026-06-13",
      time: "09:00",
      duration: 30,
      reason: "Hypertension Follow-up & BP Check",
      status: "Scheduled",
      notes: "Patient reports mild dizziness in mornings last week. Check blood pressure twice."
    },
    {
      id: "app-2",
      clinicId: "clinic-default",
      patientId: "pat-3",
      patientName: "Chloe Mercer",
      date: "2026-06-13",
      time: "11:30",
      duration: 45,
      reason: "24-Week Antenatal Assessment & Glucose Screening",
      status: "Scheduled",
      notes: "Perform routine ultrasound and fetal heart rate checks. Hand out instructions for gestational oral glucose challenge."
    },
    {
      id: "app-3",
      clinicId: "clinic-default",
      patientId: "pat-2",
      patientName: "Arthur Pendelton",
      date: "2026-06-14",
      time: "14:00",
      duration: 45,
      reason: "HbA1c Lab Review & Foot Screen",
      status: "Scheduled",
      notes: "Comprehensive microvascular exam and diabetic counselling session."
    },
    {
      id: "app-4",
      clinicId: "clinic-default",
      patientId: "pat-5",
      patientName: "Maya Lin",
      date: "2026-06-13",
      time: "08:15",
      duration: 30,
      reason: "Response audit on Lexapro dosage",
      status: "Completed",
      notes: "Patient reports stabilized sleep patterns but experiences mild afternoon nausea. Adjusted dosage plan."
    },
    {
      id: "app-5",
      clinicId: "clinic-default",
      patientId: "pat-4",
      patientName: "Brandon Fletcher",
      date: "2026-06-10",
      time: "10:00",
      duration: 30,
      reason: "Asthma action plan update",
      status: "Completed",
      notes: "Albuterol inhaler use down to twice a week. Spirometry scores normalized. Keep on current daily budesonide dose."
    }
  ],
  reports: [
    {
      id: "rep-1",
      clinicId: "clinic-default",
      patientId: "pat-1",
      patientName: "Eleanor Vance",
      fileName: "BP_Cardio_Report_June26.pdf",
      fileSize: "1.4 MB",
      category: "Radiology",
      uploadedAt: "2026-06-01T10:14:00Z",
      uploadedBy: "Dr. Sarah Jenkins, MD",
      summary: "Resting Echocardiogram indicates normal left ventricular ejection fraction (~58%) with mild diastolic dysfunction. Routine EKG reveals sinus bradycardia without acute ST-T changes. Overall cardiodynamic function remains stable under current medication.",
      s3Key: "clinic-default/pat-1/BP_Cardio_Report_June26_uuid992.pdf"
    },
    {
      id: "rep-2",
      clinicId: "clinic-default",
      patientId: "pat-2",
      patientName: "Arthur Pendelton",
      fileName: "Endocrine_Blood_Panel_May26.pdf",
      fileSize: "840 KB",
      category: "Lab Test",
      uploadedAt: "2026-05-18T14:32:00Z",
      uploadedBy: "Dr. Sarah Jenkins, MD",
      summary: "Endocrine metabolic profile displays fasting blood glucose at 134 mg/dL. HbA1c is registered at 7.1%, representing a positive decrease from March's 7.4%. Lipid sub-panel marks LDL-C at 94 mg/dL; kidney function registers within baseline values.",
      s3Key: "clinic-default/pat-2/Endocrine_Blood_Panel_May26_uuid102.pdf"
    },
    {
      id: "rep-3",
      clinicId: "clinic-default",
      patientId: "pat-3",
      patientName: "Chloe Mercer",
      fileName: "First_Trimester_Ultrasound.png",
      fileSize: "3.2 MB",
      category: "Diagnostic",
      uploadedAt: "2026-03-12T09:00:00Z",
      uploadedBy: "Dr. Sarah Jenkins, MD",
      summary: "First trimester obstetric ultrasound confirms viable singleton, matching gestational age of 11 weeks 2 days. Normal fluid volume, fetal heart rate evaluated at robust 162 bpm. Placental position: anterior regular. No retroplacental pathology noted.",
      s3Key: "clinic-default/pat-3/First_Trimester_Ultrasound_uuid055.png"
    }
  ],
  invoices: [
    {
      id: "inv-1",
      clinicId: "clinic-default",
      patientId: "pat-1",
      patientName: "Eleanor Vance",
      amount: 450,
      dueDate: "2026-06-30",
      status: "Paid",
      service: "Cardiovascular Echocardiogram and In-Clinic Consultation",
      issuedAt: "2026-06-01T10:14:00Z"
    },
    {
      id: "inv-2",
      clinicId: "clinic-default",
      patientId: "pat-2",
      amount: 180,
      patientName: "Arthur Pendelton",
      dueDate: "2026-06-28",
      status: "Unpaid",
      service: "HbA1c Lab Panel & Dietary Advisory Consultation",
      issuedAt: "2026-05-18T14:32:00Z"
    },
    {
      id: "inv-3",
      clinicId: "clinic-default",
      patientId: "pat-3",
      patientName: "Chloe Mercer",
      amount: 320,
      dueDate: "2026-07-14",
      status: "Unpaid",
      service: "Mid-Term Obstetric Ultrasound, Urinalysis, & GTT Vial Package",
      issuedAt: "2026-06-13T11:45:00Z"
    },
    {
      id: "inv-4",
      clinicId: "clinic-default",
      patientId: "pat-4",
      patientName: "Brandon Fletcher",
      amount: 120,
      dueDate: "2026-06-10",
      status: "Paid",
      service: "Spirometry Testing & Respiratory Guidance",
      issuedAt: "2026-06-10T10:00:00Z"
    },
    {
      id: "inv-5",
      clinicId: "clinic-default",
      patientId: "pat-5",
      patientName: "Maya Lin",
      amount: 150,
      dueDate: "2026-06-23",
      status: "Paid",
      service: "Extended Psychiatric Evaluation and Prescription Adjustment",
      issuedAt: "2026-06-13T08:15:00Z"
    }
  ],
  auditLogs: [
    {
      id: "log-1",
      clinicId: "clinic-default",
      userId: "user-default",
      userName: "Dr. Sarah Jenkins, MD",
      action: "System Initialization",
      entityType: "System",
      entityId: "system",
      details: "ClinicOS Secure Suite initialized with fully multi-tenant AWS Aurora PostgreSQL storage layout and AWS S3-compatible medical records lockboxes.",
      timestamp: "2026-06-13T06:00:00Z"
    },
    {
      id: "log-2",
      clinicId: "clinic-default",
      userId: "user-default",
      userName: "Dr. Sarah Jenkins, MD",
      action: "Patient Record Access",
      entityType: "Patient",
      entityId: "pat-1",
      details: "Viewed patient medical chart, record log history, and linked billing statements for Eleanor Vance under secure auditing protocols.",
      timestamp: "2026-06-13T06:15:00Z"
    }
  ],
  patientReadings: [
    {
      id: "read-1",
      clinicId: "clinic-default",
      patientId: "pat-1",
      patientName: "Eleanor Vance",
      glucose: 95,
      bloodPressure: "148/95",
      pulse: 72,
      hba1c: 5.7,
      status: "Urgent",
      recordedAt: "2026-06-13T08:30:00Z",
      createdAt: "2026-06-13T08:30:00Z",
      updatedAt: "2026-06-13T08:30:00Z"
    },
    {
      id: "read-2",
      clinicId: "clinic-default",
      patientId: "pat-2",
      patientName: "Arthur Pendelton",
      glucose: 142,
      bloodPressure: "135/85",
      pulse: 78,
      hba1c: 7.9,
      status: "Review",
      recordedAt: "2026-06-12T10:15:00Z",
      createdAt: "2026-06-12T10:15:00Z",
      updatedAt: "2026-06-12T10:15:00Z"
    },
    {
      id: "read-3",
      clinicId: "clinic-default",
      patientId: "pat-3",
      patientName: "Chloe Mercer",
      glucose: 115,
      bloodPressure: "118/75",
      pulse: 82,
      hba1c: 5.4,
      status: "Review",
      recordedAt: "2026-06-13T09:00:00Z",
      createdAt: "2026-06-13T09:00:00Z",
      updatedAt: "2026-06-13T09:00:00Z"
    },
    {
      id: "read-4",
      clinicId: "clinic-default",
      patientId: "pat-4",
      patientName: "Brandon Fletcher",
      glucose: 88,
      bloodPressure: "120/80",
      pulse: 98,
      hba1c: 5.2,
      status: "Review",
      recordedAt: "2026-06-10T14:20:00Z",
      createdAt: "2026-06-10T14:20:00Z",
      updatedAt: "2026-06-10T14:20:00Z"
    }
  ]
};

// Helper to check if file exists, if not write INITIAL_STATE
function getDatabaseState(): DatabaseState {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(INITIAL_STATE, null, 2));
      return INITIAL_STATE;
    }
    const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const state = JSON.parse(data);
    
    // Safety check / automatic migration of new collections
    if (!state.patientReadings) {
      state.patientReadings = INITIAL_STATE.patientReadings || [];
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(state, null, 2));
    }
    return state;
  } catch (error) {
    console.error("Local JSON database read error, using fallback in-memory state:", error);
    return INITIAL_STATE;
  }
}

function saveDatabaseState(state: DatabaseState): void {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error("Local JSON database write error:", error);
  }
}

export function getClinics(clinicId = 'clinic-default'): Clinic[] {
  const db = getDatabaseState();
  return db.clinics.filter(c => c.id === clinicId);
}

export function getUsers(clinicId = 'clinic-default'): User[] {
  const db = getDatabaseState();
  return db.users.filter(u => u.clinicId === clinicId);
}

export function getPatients(clinicId = 'clinic-default'): Patient[] {
  const db = getDatabaseState();
  return db.patients.filter(p => p.clinicId === clinicId);
}

export function addPatient(patient: Omit<Patient, 'id' | 'clinicId' | 'createdAt'>, clinicId = 'clinic-default', userId = 'user-default'): Patient {
  const db = getDatabaseState();
  const newPatient: Patient = {
    ...patient,
    id: `pat-${Date.now()}`,
    clinicId,
    createdAt: new Date().toISOString()
  };
  db.patients.push(newPatient);
  
  // Log audit
  const newAudit: AuditLog = {
    id: `log-${Date.now()}`,
    clinicId,
    userId,
    userName: db.users.find(u => u.id === userId)?.name || "System User",
    action: "Add Patient",
    entityType: "Patient",
    entityId: newPatient.id,
    details: `Added new patient profile: ${newPatient.name} with DOB: ${newPatient.dob}.`,
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(newAudit); // prepend for newest log first

  saveDatabaseState(db);
  return newPatient;
}

export function updatePatient(id: string, updated: Partial<Patient>, clinicId = 'clinic-default', userId = 'user-default'): Patient | null {
  const db = getDatabaseState();
  const index = db.patients.findIndex(p => p.id === id && p.clinicId === clinicId);
  if (index === -1) return null;
  
  db.patients[index] = { ...db.patients[index], ...updated };
  
  const newAudit: AuditLog = {
    id: `log-${Date.now()}`,
    clinicId,
    userId,
    userName: db.users.find(u => u.id === userId)?.name || "System User",
    action: "Update Patient",
    entityType: "Patient",
    entityId: id,
    details: `Modified patient profile details for: ${db.patients[index].name}. Fields customized: ${Object.keys(updated).join(', ')}.`,
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(newAudit);

  saveDatabaseState(db);
  return db.patients[index];
}

export function getAppointments(clinicId = 'clinic-default'): Appointment[] {
  const db = getDatabaseState();
  return db.appointments.filter(a => a.clinicId === clinicId);
}

export function addAppointment(appointment: Omit<Appointment, 'id' | 'clinicId'>, clinicId = 'clinic-default', userId = 'user-default'): Appointment {
  const db = getDatabaseState();
  const newApp: Appointment = {
    ...appointment,
    id: `app-${Date.now()}`,
    clinicId
  };
  db.appointments.push(newApp);

  const newAudit: AuditLog = {
    id: `log-${Date.now()}`,
    clinicId,
    userId,
    userName: db.users.find(u => u.id === userId)?.name || "System User",
    action: "Create Appointment",
    entityType: "Appointment",
    entityId: newApp.id,
    details: `Scheduled new medical appointment for ${newApp.patientName} on ${newApp.date} at ${newApp.time}.`,
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(newAudit);

  saveDatabaseState(db);
  return newApp;
}

export function updateAppointment(id: string, updated: Partial<Appointment>, clinicId = 'clinic-default', userId = 'user-default'): Appointment | null {
  const db = getDatabaseState();
  const index = db.appointments.findIndex(a => a.id === id && a.clinicId === clinicId);
  if (index === -1) return null;

  db.appointments[index] = { ...db.appointments[index], ...updated };

  const newAudit: AuditLog = {
    id: `log-${Date.now()}`,
    clinicId,
    userId,
    userName: db.users.find(u => u.id === userId)?.name || "System User",
    action: "Update Appointment",
    entityType: "Appointment",
    entityId: id,
    details: `Modified appointment details/status for ${db.appointments[index].patientName} to ${db.appointments[index].status}.`,
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(newAudit);

  saveDatabaseState(db);
  return db.appointments[index];
}

export function getReports(clinicId = 'clinic-default'): Report[] {
  const db = getDatabaseState();
  return db.reports.filter(r => r.clinicId === clinicId);
}

export function addReport(report: Omit<Report, 'id' | 'clinicId' | 'uploadedAt'>, clinicId = 'clinic-default', userId = 'user-default'): Report {
  const db = getDatabaseState();
  const newReport: Report = {
    ...report,
    id: `rep-${Date.now()}`,
    clinicId,
    uploadedAt: new Date().toISOString()
  };
  db.reports.push(newReport);

  const newAudit: AuditLog = {
    id: `log-${Date.now()}`,
    clinicId,
    userId,
    userName: db.users.find(u => u.id === userId)?.name || "System User",
    action: "Upload Report",
    entityType: "Report",
    entityId: newReport.id,
    details: `Uploaded new medical record/report: ${newReport.fileName} for patient ${newReport.patientName}. S3 Key successfully registered.`,
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(newAudit);

  saveDatabaseState(db);
  return newReport;
}

export function getInvoices(clinicId = 'clinic-default'): Invoice[] {
  const db = getDatabaseState();
  return db.invoices.filter(i => i.clinicId === clinicId);
}

export function addInvoice(invoice: Omit<Invoice, 'id' | 'clinicId' | 'issuedAt'>, clinicId = 'clinic-default', userId = 'user-default'): Invoice {
  const db = getDatabaseState();
  const newInv: Invoice = {
    ...invoice,
    id: `inv-${Date.now()}`,
    clinicId,
    issuedAt: new Date().toISOString()
  };
  db.invoices.push(newInv);

  const newAudit: AuditLog = {
    id: `log-${Date.now()}`,
    clinicId,
    userId,
    userName: db.users.find(u => u.id === userId)?.name || "System User",
    action: "Generate Invoice",
    entityType: "Invoice",
    entityId: newInv.id,
    details: `Issued new invoice ${newInv.id} to ${newInv.patientName} for $${newInv.amount} due by ${newInv.dueDate}.`,
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(newAudit);

  saveDatabaseState(db);
  return newInv;
}

export function updateInvoice(id: string, updated: Partial<Invoice>, clinicId = 'clinic-default', userId = 'user-default'): Invoice | null {
  const db = getDatabaseState();
  const index = db.invoices.findIndex(i => i.id === id && i.clinicId === clinicId);
  if (index === -1) return null;

  db.invoices[index] = { ...db.invoices[index], ...updated };

  const newAudit: AuditLog = {
    id: `log-${Date.now()}`,
    clinicId,
    userId,
    userName: db.users.find(u => u.id === userId)?.name || "System User",
    action: "Update Invoice Status",
    entityType: "Invoice",
    entityId: id,
    details: `Updated payment status of invoice ${id} for ${db.invoices[index].patientName} to ${db.invoices[index].status}.`,
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(newAudit);

  saveDatabaseState(db);
  return db.invoices[index];
}

export function getAuditLogs(clinicId = 'clinic-default'): AuditLog[] {
  const db = getDatabaseState();
  return db.auditLogs.filter(log => log.clinicId === clinicId);
}

export function getAnalytics(clinicId = 'clinic-default') {
  const db = getDatabaseState();
  const clinicPatients = db.patients.filter(p => p.clinicId === clinicId);
  const clinicAppointments = db.appointments.filter(a => a.clinicId === clinicId);
  const clinicReports = db.reports.filter(r => r.clinicId === clinicId);
  const clinicInvoices = db.invoices.filter(i => i.clinicId === clinicId);

  // Calculate statistics
  const totalPatients = clinicPatients.length;
  const activePatients = clinicPatients.filter(p => p.status === 'Active').length;
  
  // Outstanding and total billing calculations
  const totalInvoiced = clinicInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = clinicInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalOutstanding = clinicInvoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.amount, 0);

  // Appointments categorization
  const totalAppointments = clinicAppointments.length;
  const scheduledCount = clinicAppointments.filter(a => a.status === 'Scheduled').length;
  const completedCount = clinicAppointments.filter(a => a.status === 'Completed').length;
  const cancelledCount = clinicAppointments.filter(a => a.status === 'Cancelled').length;

  // Monthly breakdown of invoices (simulated based on dates)
  const billingByService = clinicInvoices.reduce((acc: { [key: string]: number }, inv) => {
    acc[inv.service.split(' & ')[0].split(' and ')[0]] = (acc[inv.service.split(' & ')[0].split(' and ')[0]] || 0) + inv.amount;
    return acc;
  }, {});

  const serviceDistribution = Object.entries(billingByService).map(([name, value]) => ({
    name,
    value
  }));

  return {
    totalPatients,
    activePatients,
    inactivePatients: totalPatients - activePatients,
    totalInvoiced,
    totalPaid,
    totalOutstanding,
    totalAppointments,
    scheduledCount,
    completedCount,
    cancelledCount,
    totalReports: clinicReports.length,
    serviceDistribution,
    recentActivity: db.auditLogs.filter(log => log.clinicId === clinicId).slice(0, 15)
  };
}

export function getPatientReadings(clinicId = 'clinic-default'): PatientReading[] {
  const db = getDatabaseState();
  return (db.patientReadings || []).filter(r => r.clinicId === clinicId);
}

export function addPatientReading(reading: Omit<PatientReading, 'id' | 'clinicId' | 'createdAt' | 'updatedAt'>, clinicId = 'clinic-default', userId = 'user-default'): PatientReading {
  const db = getDatabaseState();
  const newReading: PatientReading = {
    ...reading,
    id: `read-${Date.now()}`,
    clinicId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (!db.patientReadings) db.patientReadings = [];
  db.patientReadings.push(newReading);

  const newAudit: AuditLog = {
    id: `log-${Date.now()}`,
    clinicId,
    userId,
    userName: db.users.find(u => u.id === userId)?.name || "System User",
    action: "Add Reading",
    entityType: "PatientReading",
    entityId: newReading.id,
    details: `Recorded vitals for ${newReading.patientName}: BP ${newReading.bloodPressure}, Glucose ${newReading.glucose} mg/dL, HbA1c ${newReading.hba1c}%, status flagged as ${newReading.status}.`,
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(newAudit);

  saveDatabaseState(db);
  return newReading;
}

export function updatePatientReading(id: string, updated: Partial<PatientReading>, clinicId = 'clinic-default', userId = 'user-default'): PatientReading | null {
  const db = getDatabaseState();
  if (!db.patientReadings) db.patientReadings = [];
  const index = db.patientReadings.findIndex(r => r.id === id && r.clinicId === clinicId);
  if (index === -1) return null;

  db.patientReadings[index] = {
    ...db.patientReadings[index],
    ...updated,
    updatedAt: new Date().toISOString()
  };

  const newAudit: AuditLog = {
    id: `log-${Date.now()}`,
    clinicId,
    userId,
    userName: db.users.find(u => u.id === userId)?.name || "System User",
    action: "Update Reading",
    entityType: "PatientReading",
    entityId: id,
    details: `Updated vitals profile for ${db.patientReadings[index].patientName}. Fields adjusted: ${Object.keys(updated).join(', ')}.`,
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(newAudit);

  saveDatabaseState(db);
  return db.patientReadings[index];
}
