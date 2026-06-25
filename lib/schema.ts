import { pgTable, text, integer, timestamp, varchar, doublePrecision } from "drizzle-orm/pg-core";

// Clinics table
export const clinics = pgTable("clinics", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: text("email").notNull(),
  plan: varchar("plan", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  clinicId: text("clinic_id").references(() => clinics.id),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: varchar("role", { length: 50 }).notNull(),
  lastLogin: timestamp("last_login"),
});

// Patients table
export const patients = pgTable("patients", {
  id: text("id").primaryKey(),
  clinicId: text("clinic_id").references(() => clinics.id).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  dob: varchar("dob", { length: 15 }).notNull(), // YYYY-MM-DD
  gender: varchar("gender", { length: 20 }).notNull(),
  bloodType: varchar("blood_type", { length: 10 }).notNull(),
  address: text("address").notNull(),
  emergencyContactName: text("emergency_contact_name").notNull(),
  emergencyContactPhone: varchar("emergency_contact_phone", { length: 30 }).notNull(),
  primaryCondition: text("primary_condition").notNull(),
  status: varchar("status", { length: 20 }).$type<"Active" | "Inactive">().notNull().default("Active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: text("id").primaryKey(),
  clinicId: text("clinic_id").references(() => clinics.id).notNull(),
  patientId: text("patient_id").references(() => patients.id).notNull(),
  patientName: text("patient_name").notNull(),
  date: varchar("date", { length: 15 }).notNull(), // YYYY-MM-DD
  time: varchar("time", { length: 10 }).notNull(), // HH:MM
  duration: integer("duration").notNull(), // in minutes
  reason: text("reason").notNull(),
  status: varchar("status", { length: 20 }).$type<"Scheduled" | "Completed" | "Cancelled" | "No Show">().notNull().default("Scheduled"),
  notes: text("notes"),
});

// Medical Records / Reports table
export const reports = pgTable("reports", {
  id: text("id").primaryKey(),
  clinicId: text("clinic_id").references(() => clinics.id).notNull(),
  patientId: text("patient_id").references(() => patients.id).notNull(),
  patientName: text("patient_name").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: varchar("file_size", { length: 30 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // Lab test, Radiology, Diagnostic, Prescription
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  uploadedBy: text("uploaded_by").notNull(),
  summary: text("summary"), // AI generated summary
  s3Key: text("s3_key").notNull(),
});

// Invoices table
export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(),
  clinicId: text("clinic_id").references(() => clinics.id).notNull(),
  patientId: text("patient_id").references(() => patients.id).notNull(),
  patientName: text("patient_name").notNull(),
  amount: doublePrecision("amount").notNull(),
  dueDate: varchar("due_date", { length: 15 }).notNull(), // YYYY-MM-DD
  status: varchar("status", { length: 20 }).$type<"Paid" | "Unpaid" | "Overdue">().notNull().default("Unpaid"),
  service: text("service").notNull(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
});

// Vitals / PatientReadings table
export const patientReadings = pgTable("patient_readings", {
  id: text("id").primaryKey(),
  clinicId: text("clinic_id").references(() => clinics.id).notNull(),
  patientId: text("patient_id").references(() => patients.id).notNull(),
  patientName: text("patient_name").notNull(),
  glucose: doublePrecision("glucose").notNull(),
  bloodPressure: varchar("blood_pressure", { length: 20 }).notNull(),
  pulse: integer("pulse").notNull(),
  hba1c: doublePrecision("hba1c").notNull(),
  status: varchar("status", { length: 20 }).$type<"Normal" | "Review" | "Urgent">().notNull().default("Normal"),
  recordedAt: varchar("recorded_at", { length: 30 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Audit Logs table
export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  clinicId: text("clinic_id").references(() => clinics.id).notNull(),
  userId: text("user_id").notNull(),
  userName: text("user_name").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  details: text("details").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
