# Nivaran -- Civic Grievance Resolution & Public Accountability Platform

> **One platform. Every voice. Visible change.**  
> A transparent, human-centered civic grievance registration, tracking, and municipal workflow resolution system designed to connect citizens, municipal field officers, and city administrators.

---

## 🌟 Key Features & User Roles

### 1. 👥 Citizen Workspace (`/citizen`, `/citizen/report`, `/citizen/my-issues`)
- **Grievance Registration**: Report municipal issues with photo evidence, categories, and street addresses.
- **GPS Location Detection**: One-click automatic coordinate detection with reverse-geocoded locality, area, and city.
- **Live Grievance Tracking**: Real-time status progression (`Submitted` → `Assigned` → `In Progress` → `Awaiting Verification` → `Resolved`).
- **Community Support**: Citizens can upvote/support reported issues in their ward to prioritize civic attention.
- **Welfare Schemes Directory (`/schemes`)**: Discover government welfare initiatives filtered by category with direct links to official ministry portals.

### 2. 👷 Field Officer Console (`/officer`)
- **Authoritative Department Jurisdiction**: Officers operate under locked jurisdictions assigned exclusively by Municipal Administrators (e.g. PWD, Solid Waste, Water & Sewage).
- **Active Task Queue**: View and manage unresolved civic complaints allotted to their specific department.
- **Evidence-Based Resolution**: Mark issues resolved by providing required remediation remarks and optional verification photos.
- **Inter-Departmental Reallocation**: If an issue falls outside their agency, officers can reallocate it to the correct department with official transfer notes.

### 3. 🛡️ Municipal Admin Console (`/admin`)
- **Officer & Agency Head Appointments**: Designate municipal officers by email or promote any registered citizen with 1 click.
- **Full Officer Details Editing**: Edit officer name, official email, contact phone, department preset, and custom organization title (e.g. *Delhi Jal Board - Central Zone*).
- **Master Grievance Ledger**: Inspect complete audit trails, override statuses, and reassign agencies.
- **Performance Breakdown**: Live resolution audit ratios across municipal agencies.

### 4. 🌓 Theme & Accessibility
- **Dark / Light Mode**: Unified theme engine with zero-flicker pre-hydration bootstrap.
- **Responsive Layout**: Tailored for both desktop control centers and mobile field reporting.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT (JSON Web Tokens) & bcryptjs |
| **Icons & Media** | Lucide React, Unsplash |
| **Deployment** | Vercel (Configured for both Frontend and Backend) |

---

## 📁 Project Structure

```
Nivaran/
├── frontend/                     # Next.js 16 Web Application
│   ├── app/
│   │   ├── (public)/             # Landing page (/)
│   │   ├── admin/                # Administrator console
│   │   ├── citizen/              # Citizen workspace & reporting form
│   │   │   ├── my-issues/        # Citizen personal grievances ledger
│   │   │   └── report/           # Dedicated issue submission page
│   │   ├── officer/              # Field officer taskboard & resolution
│   │   ├── issues/               # Master public issues directory
│   │   │   └── [id]/             # Detailed issue view with timeline
│   │   ├── schemes/              # Government schemes directory
│   │   │   └── [id]/             # Detailed scheme overview
│   │   ├── login/                # Authentication login screen
│   │   ├── register/             # Citizen signup screen
│   │   ├── profile/              # User profile & organization credentials
│   │   └── transparency/         # City-wide civic transparency audit
│   ├── components/
│   │   ├── forms/                # IssueReportForm with GPS locator
│   │   ├── issues/               # IssueCard, IssueDetailModal
│   │   ├── layout/               # Navbar, Footer
│   │   ├── theme/                # ThemeProvider, ThemeToggle
│   │   └── ui/                   # Badges, Buttons, Cards, Inputs
│   ├── services/                 # Unified API client & fallback datasets
│   └── types/                    # Shared TypeScript interfaces & types
├── backend/                      # Express.js REST API
│   ├── src/
│   │   ├── config/               # Database connection (MongoDB Mongoose)
│   │   ├── controllers/          # authController, issueController, statsController
│   │   ├── middleware/           # authMiddleware, errorHandler
│   │   ├── models/               # User, Issue, Department, Scheme schemas
│   │   ├── routes/               # authRoutes, issueRoutes, statsRoutes, schemeRoutes
│   │   └── utils/                # Standardized response envelopes
│   ├── server.js                 # Server entry point with CORS & routes
│   └── vercel.json               # Serverless deployment configuration
├── docs/                         # Architecture & API specifications
│   ├── API.md                    # REST endpoint documentation
│   ├── DATABASE.md               # MongoDB schemas & data models
│   └── STATUS-FLOW.md            # Grievance lifecycle state machine
└── README.md
```

---

## ⚡ Prerequisites

Make sure you have the following installed on your machine:

- **Node.js**: **>= 20.9.0** *(Required for Next.js 16)*
- **npm**: **>= 10.0.0**
- **MongoDB**: MongoDB Atlas URI or local MongoDB instance running on port 27017

> **Tip (Using NVM on Linux/macOS)**:
> ```bash
> nvm use 20   # Switch to Node 20 if multiple versions are installed
> ```

---

## 🚀 Getting Started (Step-by-Step)

### 1. Clone the Repository

```bash
git clone https://github.com/anurag2787/Nivaran.git
cd Nivaran
```

---

### 2. Configure Environment Variables

#### Backend Environment (`backend/.env`)
Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .example.env .env
```

Edit `backend/.env` with your values:
```env
PORT=5000
NODE_ENV=development
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/nivaran?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_key_here
CLIENT_URL=http://localhost:3000
```

#### Frontend Environment (`frontend/.env.local`)
Create a `.env.local` file in the `frontend/` directory:

```bash
cd ../frontend
cp .example.env .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

### 3. Install Dependencies & Run the Project

You will need **two terminal tabs/windows**:

#### Terminal 1 -- Start the Backend Server:
```bash
cd backend
npm install
npm start
# Or for auto-reloading: npm run dev
```
> Server runs at: **`http://localhost:5000`**  
> Health check: **`http://localhost:5000/api/v1/health`**

#### Terminal 2 -- Start the Frontend Application:
```bash
cd frontend
npm install
npm run dev
```
> Web Application opens at: **`http://localhost:3000`**

---

## 🔑 Pre-Configured Demo Accounts

For fast review and testing without manual registration, Nivaran includes pre-seeded demo accounts. You can also click the **"Quick Demo Accounts"** shortcut buttons directly on the `/login` page:

| Role | Email | Password | Permissions & Dashboard |
|---|---|---|---|
| **Citizen** | `citizen@example.com` | `password123` | Report issues, track personal grievances, view resolution progress (`/citizen`) |
| **Field Officer** | `officer@example.com` | `password123` | Department-locked taskboard, resolve issues with evidence, reallocate departments (`/officer`) |
| **Administrator** | `admin@example.com` | `password123` | Appoint officers, edit officer organization credentials, master audit ledger (`/admin`) |

---

## 🌐 API Endpoints Reference

All backend API routes are prefixed with `/api/v1`:

### Authentication & Officers (`/api/v1/auth`)
- `POST /auth/register` -- Register a new citizen account
- `POST /auth/login` -- Login and receive JWT bearer token
- `GET /auth/me` -- Retrieve current authenticated user profile
- `GET /auth/officers` -- List all active appointed municipal officers
- `GET /auth/users` -- List registered users directory (Admin access)
- `POST /auth/assign-officer` -- Appoint or update officer details & department jurisdiction

### Grievances & Issues (`/api/v1/issues`)
- `GET /issues` -- Fetch issues with optional filtering (`status`, `category`, `search`, `sortBy`)
- `GET /issues/mine` -- Fetch grievances filed by the logged-in citizen
- `GET /issues/:id` -- Get detailed issue data with timeline events
- `POST /issues` -- Submit a new grievance
- `PATCH /issues/:id/status` -- Update issue status with remarks and evidence
- `PATCH /issues/:id/assign` -- Reallocate issue to another municipal department
- `POST /issues/:id/support` -- Toggle citizen support/upvote on an issue

### Welfare Schemes (`/api/v1/schemes`)
- `GET /schemes` -- List welfare schemes with category filtering
- `GET /schemes/:id` -- Get scheme details and application eligibility

### Platform Statistics (`/api/v1/stats`)
- `GET /stats/overview` -- Aggregated counts (Total, Resolved, Pending, Active Citizens)

---

## 🚢 Deployment Guide

### Deploying Frontend to Vercel
1. Import the repository in [Vercel](https://vercel.app).
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Next.js**.
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g. `https://your-backend.vercel.app/api/v1`).
5. Click **Deploy**.

### Deploying Backend to Vercel
1. Import the repository in Vercel as a new project.
2. Set **Root Directory** to `backend`.
3. The included `backend/vercel.json` automatically configures the `@vercel/node` serverless runtime.
4. Add Environment Variables:
   - `MONGODB_URL`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string for JWT signing.
   - `CLIENT_URL`: Your deployed frontend URL (e.g. `https://your-frontend.vercel.app`).
5. Click **Deploy**.

---

## 🛠️ Common Troubleshooting

### 1. `You are using Node.js 18.x. For Next.js, Node.js version ">=20.9.0" is required.`
- **Fix**: Next.js 16 requires Node 20+. Use NVM to switch:
  ```bash
  nvm install 20
  nvm use 20
  ```

### 2. Issues filed by citizen don't show up in "My Tracked Grievances"
- **Fix**: Make sure you are logged in (e.g. using `citizen@example.com` or your citizen account). Issues are linked directly to your authenticated user profile and reflected in real-time across both `/citizen` and `/citizen/my-issues`.

### 3. MongoDB connection error (`MongooseServerSelectionError`)
- **Fix**: Verify your MongoDB Atlas Network Access rules. Go to **MongoDB Atlas → Network Access → Add IP Address** and allow access from your current IP (or `0.0.0.0/0` for development).

---

## 📄 License

This project is licensed under the ISC License.