# Nivaran - Civic Issue Resolution & Grievance Redressal

Transparent civic issue reporting and municipal grievance resolution platform.

---

## Phase 1 Implementation Overview

Phase 1 establishes the foundational skeleton, shared TypeScript contracts, unified API response formats, design system primitives, and mock contracts across frontend and backend.

### Project Structure

```
nivaran/
├── frontend/                     # Next.js (App Router) client application
│   ├── app/
│   │   ├── (public)/             # Public Landing & Discovery
│   │   ├── citizen/              # Citizen Grievance Portal
│   │   ├── officer/              # Field Officer Taskboard & Verification
│   │   ├── admin/                # Municipal Administration Dashboard
│   │   ├── schemes/              # Government Welfare Schemes
│   │   └── layout.tsx            # Global Root Layout
│   ├── components/
│   │   ├── ui/                   # Badge, Button, Card, Input, Skeleton
│   │   ├── layout/               # Navbar, Footer
│   │   ├── issues/               # IssueCard, IssueFilter, IssueDetailModal
│   │   ├── dashboard/            # StatCard
│   │   └── forms/                # IssueReportForm
│   ├── types/                    # Shared TypeScript types & API envelopes
│   └── services/                 # API client and mock data contracts
├── backend/                      # Express.js REST API
│   ├── src/
│   │   ├── config/               # Database connection (Mongoose)
│   │   ├── models/               # User, Issue, Department, Scheme schemas
│   │   ├── controllers/          # Auth, Issue, Stats controllers
│   │   ├── routes/               # Modular Express API routers
│   │   ├── middleware/           # Auth and error handling middlewares
│   │   └── utils/                # Standard API response helpers
│   └── server.js                 # Express server with CORS & JSON support
└── docs/                         # Specification & Contract documentation
    ├── API.md                    # Standard response envelopes and endpoints
    ├── DATABASE.md               # MongoDB collections and fields
    └── STATUS-FLOW.md            # Issue lifecycle state machine
```

---

## Running Locally

### 1. Backend Server
```bash
cd backend
npm run dev    # Starts server on http://localhost:5000 with nodemon
# or: npm start
```

### 2. Frontend Client
```bash
cd frontend
npm run dev    # Starts Next.js app on http://localhost:3000
```