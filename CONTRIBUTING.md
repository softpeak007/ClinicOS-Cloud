# Contributing to ClinicOS Cloud

Thank you for your interest in contributing to ClinicOS Cloud! We welcome community contributions to build the most secure, modern workspace for independent clinical practices.

---

## 🛠️ Local Development & Setup

To get started writing code for ClinicOS Cloud:

1. **Fork & Clone** the repository.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill out your local secrets:
   ```bash
   cp .env.example .env
   ```
4. **Launch Local Server**:
   ```bash
   npm run dev
   ```

---

## 🛡️ Security First

Because ClinicOS Cloud handles clinical records and is aligned with **HIPAA and GDPR** compliance structures:
- **No Hardcoded Secrets**: Ensure any secret key, database connection string, or AI key accesses `process.env`.
- **Tenant Isolation**: When adding queries, always route actions through isolated tenant contexts (`clinic_id`).
- **Audit Logging**: Any modifications to clinical records (vitals, diagnoses, invoices) **must** write a descriptive entry to the audit trail table.

---

## 🚀 Testing Guidelines

Before opening a Pull Request, please run the checking and building routines locally:

```bash
# Run lint code checker
npm run lint

# Compile and optimize build assets
npm run build
```

We look forward to reviewing your contributions!
