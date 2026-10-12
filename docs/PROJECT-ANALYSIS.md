# Nivaran — Comprehensive Project Analysis & Status Report

**Document Version:** 1.0  
**Repository:** [Nivaran](file:///Users/tanishmoral/Desktop/Coding%20/Projects/Nivaran)  
**Date of Audit:** October 2026  

---

## 1. Executive Summary & Project Purpose

### What is Nivaran?
**Nivaran** (*"One platform. Every voice. Visible change."*) is a civic grievance registration, lifecycle tracking, and municipal workflow resolution platform. It is engineered to bridge the divide between citizens, municipal field officers, and city administrative leadership.

### The Problem It Solves
In conventional urban municipal setups:
1. **Citizens** suffer from lack of transparency: complaints lodged through paper registers, call centers, or disparate WhatsApp numbers vanish into administrative black holes with zero status feedback.
2. **Municipal Field Officers** (e.g., PWD road engineers, Jal Sansthan water supervisors, electricity linemen) struggle with disorganized complaint dispatching, cross-department jurisdiction confusion, and lack of verified photo evidence.
3. **Municipal Administrators** (Municipal Commissioners, Mayors, Ward Officers) lack real-time visibility into agency turnaround times (SLAs), officer accountability, and city-wide civic health metrics.

### How Nivaran Addresses It
Nivaran creates a unified, role-governed digital ecosystem where:
- **Citizens** can register civic complaints with one-click GPS coordinate capture and photo proof, track live status progressions, upvote community issues, and discover government welfare schemes.
- **Field Officers** work from an authoritative, department-locked taskboard to review assigned issues, initiate repairs, log resolution remarks, attach completion evidence, or forward mismatched complaints to the appropriate department.
- **Administrators** possess full oversight: appointing officers, reassigning departments, managing master ledgers, and monitoring city-wide resolution analytics.

---

## 2. System Architecture & Tech Stack

```
                                  ┌─────────────────────────────┐
                                  │      Next.js 16 Web App     │
                                  │  (React 19, Tailwind CSS)   │
                                  └──────────────┬──────────────┘
                                                 │
                                         HTTP / REST API
                                                 │
                                  ┌──────────────▼──────────────┐
                                  │   Node.js / Express.js API  │
                                  │ (JWT Auth, RBAC Middleware) │
                                  └──────┬───────────────┬──────┘
                                         │               │
                                         ▼               ▼
                        ┌──────────────────┐   ┌───────────────────┐
                        │ MongoDB Database │   │ In-Memory Mock    │
                        │   (Mongoose)     │   │ Data Store (Safe) │
                        └──────────────────┘   └───────────────────┘
```

| Layer | Technology | Key Dependencies / Implementations |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 16.4.0 (App Router, Turbopack) | React 19.3.0, TypeScript 5, Lucide React icons |
| **Styling & UI** | Tailwind CSS v4 | Custom design system, dark/light theme engine, zero-flicker pre-hydration script |
| **Backend Runtime** | Node.js / Express.js 5.3.0 | REST architecture, CORS handling, custom response envelopes |
| **Database** | MongoDB with Mongoose 9.11.1 | Schemas for `User`, `Issue`, `Department`, `Scheme` |
| **Authentication** | JWT (`jsonwebtoken` 9.0) & `bcryptjs` 3.0 | Role-based authorization middleware (`requireAuth`, `requireRole`, `optionalAuth`) |
| **Geolocation** | HTML5 Geolocation + OpenStreetMap | Nominatim API for client-side reverse geocoding to address, area, city, and pincode |
| **Deployment** | Vercel configured | Serverless backend configuration (`vercel.json`) and Next.js frontend |

---

## 3. Detailed Feature Breakdown

### 3.1 Authentication & Role-Based Access Control (RBAC)
- **Three Core Personas**:
  - `citizen`: Can file complaints, track personal complaints, support community issues, and view welfare schemes.
  - `officer`: Locked to assigned municipal department (PWD, Water, Electricity, Sanitation, Education, Civic). Manages department taskboard, starts remediation, attaches resolution evidence, and can reallocate complaints.
  - `admin`: Super-user role. Appoints officers, edits officer credentials, reassigns departments, overrides grievance statuses, and views administrative KPIs.
- **Authentication Flows**:
  - `POST /api/v1/auth/register`: Public registration automatically enforces `citizen` role.
  - `POST /api/v1/auth/login`: Issues JWT signed token (7-day validity).
  - `GET /api/v1/auth/me`: Fetches authenticated user profile.
  - `PATCH /api/v1/auth/profile`: Updates name, phone, or avatar.
  - Pre-seeded Demo Accounts: `citizen@example.com`, `officer@example.com`, `admin@example.com` (password: `password123`).

### 3.2 Citizen Workspace (`/citizen`, `/citizen/report`, `/citizen/my-issues`)
- **Grievance Registration Form** ([IssueReportForm.tsx](file:///Users/tanishmoral/Desktop/Coding%20/Projects/Nivaran/frontend/components/forms/IssueReportForm.tsx)):
  - Category selector: Roads & Potholes, Water Leakage, Power & Streetlights, Waste & Garbage, School & Facilities, Other.
  - Automatic GPS coordinate detection with reverse-geocoded road name, neighbourhood, and district.
  - Photo evidence URL inputs with quick test sample presets.
  - Form validation with structured error feedback.
- **Personal Complaint Ledger** (`/citizen/my-issues`):
  - Filterable by `All`, `In Progress`, and `Verified Resolved`.
  - Status counters displaying total complaints, active issues, and resolved fixes.

### 3.3 Public Community Explorer (`/issues`, `/issues/[id]`)
- Master feed of civic grievances across all city wards.
- Search and multi-criteria filtering:
  - Filter by category (Roads, Water, Sanitation, Electricity, Education, Other).
  - Filter by status (`submitted`, `assigned`, `in_progress`, `awaiting_verification`, `resolved`).
  - Search by keyword matching title or description.
  - Sort by Newest First, Most Supported, or Oldest First.
- **Community Support Mechanism**: "I'm affected too" upvoting system allowing citizens to endorse community issues to increase priority.
- **Interactive Detail Modal & Single Page** (`/issues/[id]`):
  - Complete grievance statement, location with coordinates and Google Maps link.
  - Photo proof before and after resolution.
  - Real-time audit trail and status timeline.

### 3.4 Municipal Field Officer Console (`/officer`)
- **Authoritative Department Jurisdiction**: Officers operate under locked departments (e.g. Er. Rajesh Verma under PWD).
- **Task Queue Organization**:
  - Filter by All, Pending, In Progress, and Resolved.
  - Live department KPI cards (Total Allotted, Pending Review, In Progress, Resolved).
- **Two-Step Resolution Flow**:
  1. *Start Remediation*: Transitions status from `assigned`/`submitted` to `in_progress`.
  2. *Mark as Resolved*: Opens dedicated resolution modal requiring mandatory field closure remarks and optional photo evidence.
- **Inter-Departmental Reallocation**: If a reported complaint falls outside the officer's jurisdiction, the officer can forward the issue to the correct department with an explanatory transfer remark.

### 3.5 Municipal Admin Console (`/admin`)
- **Officer & Agency Appointments**:
  - Search or enter an email to designate any user as a department officer.
  - One-click promotion from registered citizens table.
- **Officer Profile Management**:
  - Edit officer name, official email, contact phone, department assignment, and customized organizational title (e.g., *Delhi Jal Board - Central Zone*).
- **Master Grievance Ledger**:
  - Master table of all complaints across the city.
  - Direct administrative overrides (force status to `in_progress` or `resolved`, or reassign department).
- **Performance Breakdown**:
  - Department resolution audit metrics, pending vs resolved ratios.

### 3.6 Government Welfare Schemes Directory (`/schemes`, `/schemes/[id]`)
- Catalog of central and state welfare initiatives (PM Awas Yojana, Jal Jeevan Mission, Swachh Bharat Urban 2.0).
- Categorized by domain (Housing, Water Supply, Sanitation).
- Eligibility checklists and verified external links to official ministry portals.

### 3.7 Public Civic Transparency Dashboard (`/transparency`)
- High-level public performance indicators (Total Reported, Verified Resolved, Active Remediation, Turnaround Time).
- Category-by-category resolution efficiency percentages with visual progress bars.
- Department performance comparison table with average turnaround days.

---

## 4. Status Audit: Complete vs. Half-Built vs. Pending

| Module / Feature | Status | Implementation Details | What is Missing / Needed |
| :--- | :--- | :--- | :--- |
| **Next.js Frontend Architecture** | 🟢 **Complete** | Next.js 16 App Router, TypeScript, responsive layout, dark/light theme engine. | None. Core foundation is solid. |
| **Authentication & RBAC** | 🟢 **Complete** | Register, Login, JWT auth, bcrypt password hashing, `requireAuth` / `requireRole` middlewares. | Password reset flow / email verification not implemented. |
| **Citizen Issue Reporting Form** | 🟢 **Complete** | Guided form with GPS coordinate capture, OpenStreetMap reverse-geocoding, validation. | Direct file upload (camera/device file storage) vs URL input. |
| **Citizen Dashboard & My Issues** | 🟢 **Complete** | `/citizen`, `/citizen/my-issues`, filter tabs, KPI counters, detail modal. | None for MVP. |
| **Public Issues Explorer** | 🟢 **Complete** | `/issues`, multi-filter (category, status, search, sorting), cards, detail modal. | Pagination (currently client-side array filter). |
| **Community Support (Upvotes)** | 🟢 **Complete** | Support toggle endpoint and frontend button, increments/decrements supporter count. | None. Fully functional. |
| **Officer Taskboard & Queue** | 🟢 **Complete** | Department-locked view, tab filters, start remediation, resolution modal with remarks. | None. Fully functional. |
| **Officer Reallocation** | 🟢 **Complete** | Ability to transfer an issue to another department with mandatory transfer notes. | None. Works smoothly. |
| **Admin Officer Appointment & Edit** | 🟢 **Complete** | 1-click citizen promotion, officer modal editing name, email, phone, department. | None. Fully functional. |
| **Admin Master Ledger** | 🟢 **Complete** | Full audit list, status overrides, department reassignment. | CSV export feature not implemented. |
| **Public Transparency Dashboard** | 🟡 **Half-Built** | UI renders key metrics, category progress bars, department SLA table. | Backend endpoints (`/analytics/*` and `/stats/overview`) return **hardcoded mock numbers** instead of real MongoDB aggregations. |
| **Database Persistence Pipeline** | 🟡 **Half-Built** | MongoDB Mongoose models exist for `Issue`, `User`, `Department`, `Scheme`. `Issue.create` and `User.create` write to DB. | Endpoints like `attachEvidence` and `supportIssue` **only update in-memory state**, skipping MongoDB writes. If MongoDB is active, support counts do not persist across restarts. |
| **Scheme Management** | 🟡 **Half-Built** | Directory page (`/schemes`) and detail page (`/schemes/[id]`) display schemes with search and links. | Schemes are served from hardcoded arrays in controller and mock files. No Admin CRUD API/UI to create or edit schemes dynamically in DB. |
| **Interactive Map View (Leaflet/Mapbox)** | 🔴 **Pending** | Planned in `Project.md` Phase 4 (`IssueMap` with markers). | Not implemented. Coordinates are displayed only as text with a link to Google Maps (`View Map ↗`). |
| **Chart Visualizations (Recharts)** | 🔴 **Pending** | Planned in `Project.md` Phase 2 Module E for trend and category graphs. | Recharts library is not installed in `package.json`. Custom CSS bars are used instead. |
| **File / Photo Upload Pipeline** | 🔴 **Pending** | Planned for Cloudinary / AWS S3 / Multer multipart image uploads. | Uses image URLs or preset sample images instead of real file upload from device camera/storage. |
| **Automated Notifications** | 🔴 **Pending** | Planned in Phase 4 for SMS/Email notifications on status transitions. | No email/SMS dispatch service connected. |
| **Automated Duplicate Detection** | 🔴 **Pending** | Planned in Phase 4 for flagging nearby complaints in the same category. | No proximity checking when a citizen starts filling out a form. |

---

## 5. Summary Statistics

- **Total Planned Core Capabilities:** 18
- **Fully Completed & Operational:** 10 (56%)
- **Partially Built / Using Fallbacks:** 3 (17%)
- **Pending / Not Started:** 5 (27%)

---

## 6. Recommended Next Steps for Complete Production Readiness

1. **Wire Live MongoDB Aggregations for Analytics**:
   - Replace hardcoded JSON in [analyticsController.js](file:///Users/tanishmoral/Desktop/Coding%20/Projects/Nivaran/backend/src/controllers/analyticsController.js) and [statsController.js](file:///Users/tanishmoral/Desktop/Coding%20/Projects/Nivaran/backend/src/controllers/statsController.js) with Mongoose `Issue.aggregate()` queries to compute real live resolution rates and department turnaround times.
2. **Complete MongoDB Persistence for Evidence & Upvotes**:
   - Update `supportIssue` and `attachEvidence` in [issueController.js](file:///Users/tanishmoral/Desktop/Coding%20/Projects/Nivaran/backend/src/controllers/issueController.js) to execute `Issue.findByIdAndUpdate()` so user upvotes and photos persist in the database.
3. **Integrate Real Image Uploads**:
   - Add a lightweight upload route using Cloudinary or Multer to allow citizens and officers to upload images directly from camera or phone gallery.
4. **Interactive Map Enhancement (Leaflet)**:
   - Install `leaflet` and `react-leaflet` to display a visual map of the city showing color-coded pins for open vs resolved issues.
5. **Scheme Admin Management**:
   - Add CRUD routes (`/api/v1/schemes`) so administrators can manage government schemes directly from the dashboard.
