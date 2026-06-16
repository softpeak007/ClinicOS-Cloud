# 🏥 ClinicOS Cloud - Secure Multi-Tenant Clinical SaaS Workspace

ClinicOS Cloud is an enterprise-grade Clinical SaaS Platform designed to streamline independent clinical operations. The platform integrates secure patient registry data management, serverless AI medical document parsing, clinician consultation appointments scheduling, client billing desk tracking, and physical risk compliance engines.

Designed with **strict multi-tenant isolation** and fully aligned with HIPAA and GDPR administrative safeguards, this workspace is ready for immediate deployment on **Vercel** with highly compatible interfaces for **AWS Production Architectures**.

---

## 🚀 Key Features

- **Clinical Desk & Workflow Hub**: Multi-tenant metrics compiling daily patient cohorts, active consultation sessions, and instant billing pipelines.
- **Biometric Compliancy & Risk Tracker**: Automated risk analysis tracing heart/metabolic drift compliance flags with live data visualization.
- **Patient Registry**: Rich medical charts cataloging active history, vitals thresholds, invoices, and diagnostic records under isolated tenant filters.
- **S3 Secure Medical Lockbox**: Drag-and-drop report uploader generating S3 URIs and short-lived Visual presigned download tokens.
- **Server-Side AI Document abstracts**: Integrates serverless Google Gemini OCR transcription to summarize lengthy scans into concise clinical records.
- **Master Appointment Ledger**: Live appointment calendar tracking, duration optimization, and scheduling controls.
- **Clinical Billing Desk**: Full-featured billing workstation tracking multi-stage invoice receivables (Paid, Unpaid, Overdue) and issued services.
- **Accountability Audit Trails**: Complete logging of clinician reads, writes, S3 downloads, and metadata modifications for standard HIPAA audits.

---

## 📂 System Architecture Overview

ClinicOS utilizes a modular Domain Router separating view layers from state endpoints.

```
       [ Client Interface Component Views ]
                        ↕
    [ Serverless Next.js App Router (Vercel) ]
                  ↙            ↘
  [ serverless AI OCR Engine ]   [ Isolated Tenant DB Controller ]
    (Google Gemini API)           (Aurora PostgreSQL / db.json)
                                       ↕
                                 [ HIPAA Logs & S3 Locks ]
```

---

## 🛠️ Technology Stack

- **Frontend Core**: Next.js 15 App Router (Strict TypeScript 5+)
- **Responsive Layout**: Tailwind CSS v4 (Pure negative space, unified fluid alignments, automatic dark modes)
- **Fluid Animations**: Motion (`motion/react`)
- **Durable Utilities**: Lucide Icons, Recharts, and Google Generative AI SDK (`@google/genai`)

---

## 📝 Environment Variables Configuration

To run the application, configure your credentials inside your local `.env` configuration. See `.env.example` for details:

```env
# Google AI Studio API credential for Serverless OCR summaries (Required server-side)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Base application URL identifier
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Future Production AWS Services targets (Pre-Engineered in /lib/db.ts)
AWS_REGION="us-east-1"
AWS_COGNITO_USER_POOL_ID="us-east-1_xxxxxxxxx"
AWS_COGNITO_CLIENT_ID="xxxxxxxxxxxxxxxxxxx"
DATABASE_URL="postgresql://db_user:password@aurora-postgresql-cluster.aws.com:5432/clinicos"
AWS_S3_BUCKET_NAME="clinical-records-lockbox"
```

---

## 💻 Local Development Setup

To provision your local development server:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-organization/clinicos-cloud.git
   cd clinicos-cloud
   ```
2. **Install node libraries**:
   ```bash
   npm install
   ```
3. **Set up local variables**:
   ```bash
   cp .env.example .env
   ```
4. **Acquire and set** a `GEMINI_API_KEY` in `.env`.
5. **Run the server**:
   ```bash
   npm run dev
   ```
6. Open your browser on `http://localhost:3000` to interact with ClinicOS Cloud.

---

## ☁️ Vercel One-Click Deployments

ClinicOS Cloud is pre-packaged for one-click publishing:

1. Import your repository into the **Vercel Dashboard**.
2. Standard settings are auto-detected (Framework: Next.js).
3. Inject `GEMINI_API_KEY` into your Vercel Project Environment variables.
4. Click **Deploy**. Vercel launches Next.js globally.

---

## 🌐 Future AWS Migration Roadmap

The workspace is pre-engineered for standard cloud-tier expansion without frontend modifications:

1. **User Identity Isolation**: Swap local auth session management inside `/components/AuthPage.tsx` directly to AWS Cognito Federated User Pools.
2. **Aurora Postgres Migration**: Exchange the transactional local file database router inside `/lib/db.ts` for deep relational Aurora database connection pools.
3. **S3 Private Assets File Store**: Replace mock file URLs in S3 file uploads with live pre-signed short-lived S3 Object visual download paths.

---

## 📄 License

This clinical SaaS workspace is distributed under the terms of the [MIT License](LICENSE). Refer to `LICENSE` for details.
