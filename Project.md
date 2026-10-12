# Nivaran - Complete Phase-Wise Development Roadmap

[Civic Fix | Devpost](https://images.openai.com/static-rsc-4/HGTmB8-GnK5GavWsDSDEBRtzIAzg7CbZFKvoqWhh-HZeomdSr8EwGDR-U12R10nz64ToZIeF2zVM3ZiohW_LtqSTw20tViuks23y7dHSlOWBEaz2gbXdJ-AklNIbQWT9hx_MEXsuNhiI1jt_rhQnljmEtz6wR8X7c1HpyNNQF10?purpose=inline)

[devpost.com](https://devpost.com/software/civic-fix)

# Nivaran

One platform. Every voice. Visible change.

A citizen-centric civic engagement platform for reporting public issues, tracking their resolution, discovering government schemes, and making community problems visible.

For Nivaran, I recommend a modular, phase-wise development approach in which different teammates can build separate features simultaneously without constantly waiting for one another.

The biggest mistake to avoid is dividing the project only by technology-for example, assigning one person the entire frontend and another the entire backend. That creates a bottleneck: the frontend developer cannot finish a feature until the backend developer finishes its APIs.

Instead, we will define the architecture, database contracts, API contracts, and shared UI components first. After that, each feature can be developed independently using mock data, then connected to the backend through agreed interfaces.

The stack will remain straightforward:

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui.
- Backend: Node.js, Express.js.
- Database: MongoDB with Mongoose.
- Authentication: JWT-based authentication.
- Charts: Recharts.
- Maps: Leaflet, if time permits.
- Image uploads: Cloudinary or a similar simple storage service.
- Version control: Git and GitHub.

You do not need microservices, Redis, Docker, message queues, complex role hierarchies, or AI infrastructure for this project.

## 1. The complete roadmap at a glance

### 00

Planning & architecture

1–2 days

Freeze scope, define interfaces and assign ownership

### 01

Project foundation

1–2 days

Set up repositories, routing, design system and API skeleton

### 02

Independent feature development

5–8 days

Build citizen, issue, officer, dashboard and scheme modules in parallel

### 03

Backend & database integration

3–4 days

Connect APIs, MongoDB and authentication

### 04

Distinctive features

3–5 days

Community support, verification, evidence and issue insights

### 05

Polish & quality assurance

2–3 days

Responsive UI, validation, testing and bug fixing

### 06

Demo & presentation

1–2 days

Seed data, test accounts, presentation story and screenshots

Estimated duration: approximately 17–26 working days, with overlapping work. The actual duration depends on team size, available hours, and how much UI polish you want.

The key is that Phases 2 and 3 can overlap heavily after Phase 1 defines the shared contracts. You should not wait for every frontend screen to be completed before starting the backend.

# Phase 0 - Planning, scope and architecture

Foundation for parallel work

Goal: Agree on exactly what Nivaran will do before several people begin implementing different interpretations of the same feature.

This phase is short, but it has the highest leverage. Poor coordination here causes integration problems later.

### 0.1 Freeze the MVP

The minimum working version should include:

1. Citizen registration and login.
2. Citizen dashboard.
3. Report a civic issue with a photograph.
4. Issue listing, search and filtering.
5. Issue details and status timeline.
6. Officer/admin dashboard.
7. Department assignment and status updates.
8. Public statistics dashboard.
9. Community support for an existing issue.
10. Resolution evidence and citizen verification.
11. Government scheme discovery.

The interactive map can be included as an enhancement, not a blocker.

### 0.2 Define user roles

Use three roles initially.

| Role    | Main permissions                                                         |
| ------- | ------------------------------------------------------------------------ |
| Citizen | Report issues, view issues, support reports, verify resolution           |
| Officer | View assigned issues, update status, upload evidence                     |
| Admin   | Manage issues, assign departments, manage schemes and oversee statistics |

For the mini-project, an admin can also perform the assignment workflow that a department coordinator would perform. You do not need a separate role for every government department.

### 0.3 Define the status lifecycle

Use one shared set of statuses throughout the application.

Submitted

Assigned

In Progress

Awaiting Verification

Resolved

If the citizen reports that the problem still exists, an eligible issue returns to review or In Progress.

Also allow `Rejected` for invalid or out-of-scope reports and `Reopened` for a previously resolved issue that needs further action. Define these transitions centrally rather than allowing arbitrary status changes from every screen.

### 0.4 Define the architecture

Next.js frontend

Citizen pages · Officer pages · Public dashboard

Express.js REST API

Authentication · Authorization · Validation · Business logic

MongoDB + Mongoose

Users · Issues · Departments · Schemes · Activity history

Cloudinary handles image storage separately. MongoDB stores image URLs and metadata, not the actual image files.

Deliverables for Phase 0

- A final feature list.
- A basic wireframe for each main screen.
- Database field definitions.
- API contract document.
- GitHub repository and issue assignments.
- Shared status values and role definitions.

Exit condition: Every teammate knows what their module accepts, what it returns, and which shared components they must use.

# Phase 1 - Project foundation and shared contracts

Goal: Create a working skeleton of both applications so every teammate can start independently.

Owner: One integration lead, with help from one frontend/backend teammate.

### 1.1 Set up the repository structure

I recommend a single GitHub repository containing both frontend and backend.

```
nivaran/
├── frontend/
│   ├── app/
│   │   ├── (public)/
│   │   ├── (auth)/
│   │   ├── citizen/
│   │   ├── officer/
│   │   ├── admin/
│   │   └── schemes/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── issues/
│   │   ├── dashboard/
│   │   └── forms/
│   ├── lib/
│   ├── hooks/
│   ├── types/
│   └── services/
├── backend/
│   └── src/
│       ├── config/
│       ├── models/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       ├── services/
│       ├── validators/
│       └── utils/
├── docs/
│   ├── API.md
│   ├── DATABASE.md
│   └── STATUS-FLOW.md
└── README.md
```

The frontend uses Next.js App Router. The backend is a separate Express server. Do not put Express routes inside Next.js API routes if you have already decided to maintain a separate Node.js backend.

### 1.2 Establish the shared design system

Before teammates create their individual pages, define the basics:

- Primary color, background, typography and spacing.
- Button variants and sizes.
- Input fields, dropdowns and text areas.
- Status badges.
- Cards and tables.
- Loading skeletons.
- Empty states and error messages.
- Modal and confirmation dialog patterns.
- Sidebar, top navigation and mobile navigation.

Use shadcn/ui and Tailwind CSS to reduce the time spent implementing standard components.

For Nivaran, I would choose a clean, modern civic-tech design: white or light neutral backgrounds, deep indigo or navy accents, restrained green for successful resolution, and orange or red for pending and overdue issues.

The goal is a credible public-service product, not a generic admin template.

### 1.3 Define shared TypeScript types

Create a common set of frontend types and keep the backend schema aligned with them.

For example:

```
export type UserRole = "citizen" | "officer" | "admin";

export type IssueStatus =
  | "submitted"
  | "assigned"
  | "in_progress"
  | "awaiting_verification"
  | "resolved"
  | "rejected"
  | "reopened";

export type IssueCategory =
  | "roads"
  | "sanitation"
  | "water"
  | "electricity"
  | "education"
  | "other";
```

The full `Issue` type should also specify its ID, title, description, category, location, reporter, assigned department, photographs, support count, timestamps, and timeline.

Do not let different teammates invent their own status strings or category names.

### 1.4 Define API response conventions

For example, every successful request could return:

```
{
  "success": true,
  "message": "Issue fetched successfully",
  "data": {}
}
```

An error could return:

```
{
  "success": false,
  "message": "Issue not found",
  "errors": []
}
```

The exact convention matters less than using one convention everywhere.

### 1.5 Create a mock data contract

Every frontend module should initially use a small local dataset with the same structure as the eventual API response.

Example:

```
export const mockIssue = {
  id: "issue-1042",
  title: "Broken streetlight near campus",
  category: "electricity",
  status: "in_progress",
  location: {
    area: "Nearby campus",
    city: "Lucknow"
  },
  supportCount: 12,
  createdAt: "2026-10-02T10:00:00.000Z"
};
```

This allows the citizen dashboard, issue details page, and admin dashboard to be developed before MongoDB is connected.

Exit condition: Both applications run locally, shared types are committed, and the API contracts are documented.

# Phase 2 - Parallel feature development

This is the most important phase for your team structure.

Once Phase 1 is complete, divide the work into independent modules. Each teammate should be able to develop and test their module without waiting for another teammate to finish their implementation.

## Workstream A - Authentication and user profiles

Module A

Goal: Create the account and access foundation.

### Frontend work

- Login page.
- Registration page.
- Role-specific dashboard redirection.
- User profile page.
- Logout action.
- Form validation and error messages.
- Loading and success states.

### Backend work

- User Mongoose model.
- Registration endpoint.
- Login endpoint.
- Password hashing using bcrypt.
- JWT creation and verification.
- Authentication middleware.
- Role-based authorization middleware.
- Profile endpoint.

### Proposed user model

```
User
├── name
├── email
├── passwordHash
├── phoneNumber
├── role
├── avatarUrl
├── createdAt
└── updatedAt
```

Use an enum for `role`. For the prototype, an admin can create or promote demo officer accounts.

Do not allow users to choose `admin` or `officer` freely on the public registration form. A user could otherwise grant themselves privileges.

### API contract

| Method | Endpoint             | Purpose              |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Register a citizen   |
| POST   | `/api/auth/login`    | Log in               |
| GET    | `/api/auth/me`       | Get the current user |
| PATCH  | `/api/users/me`      | Update own profile   |

### Definition of done

- A citizen can register and log in.
- Invalid credentials show a useful error.
- Passwords are never stored in plain text.
- Protected pages require authentication.
- Officer/admin pages enforce the appropriate role.
- The frontend can operate against a mock authentication service before the real endpoints are ready.

## Workstream B - Citizen dashboard and issue reporting

Module B

Goal: Build the main citizen experience.

This module owns the reporting interface and the citizen's personal dashboard. It does not own the backend's department-assignment workflow.

### Frontend pages

- `/citizen`
- `/citizen/report`
- `/citizen/my-issues`
- `/citizen/profile`

### Citizen dashboard

Display:

- Total issues reported by the citizen.
- Issues awaiting action.
- Issues in progress.
- Resolved issues.
- Recent activity.
- A prominent Report an Issue button.

Each issue card should include its title, category, date, status, and location.

### Reporting form

Use a guided form with the following fields:

1. Issue title.
2. Issue category.
3. Detailed description.
4. State, city and locality.
5. Optional map location or coordinates.
6. Photo upload.
7. Submit button.

Add validation for required fields, maximum description length, allowed image types and reasonable image size.

After submission, show a success screen containing the generated issue ID and a button to view its details.

### Backend dependency

The reporting form eventually calls:

```
POST /api/issues
```

The personal dashboard calls:

```
GET /api/issues/mine
```

The reporting form should not directly write to MongoDB. It must call the Express API.

### How this module can work independently

Create a `mockIssueService.ts` implementing the same functions that the real API service will later implement.

For example:

```
export async function createIssue(payload: CreateIssueInput) {
  // Initially return a mock issue.
  // Later replace the implementation with an API request.
}
```

Keep the UI components independent of the data source. That way, connecting the backend requires changing the service implementation rather than rewriting the form.

### Definition of done

A user can complete the entire reporting flow, see a confirmation, and view their issues using mock data.

## Workstream C - Issue explorer, issue details and community support

Module C

Goal: Build the public-facing issue discovery experience and the feature that distinguishes Nivaran from a simple complaint form.

### Frontend pages

- `/issues`
- `/issues/[id]`

### Issue explorer

Provide:

- Search by issue title or description.
- Category filters.
- Status filters.
- Location filters.
- Sorting by newest, oldest or most supported.
- Pagination or a simple load-more control.
- Issue cards with status and support count.

### Issue detail page

The page should display:

- Issue title and full description.
- Reporter information, subject to privacy rules.
- Category and location.
- Original photograph.
- Current status.
- Department assigned.
- Submission date.
- Full status timeline.
- Citizen support control.
- Resolution evidence, when available.

### Community support

Add an "I'm affected too" action.

When a citizen supports an issue:

- Increase its support count.
- Prevent the same authenticated user from supporting the same issue repeatedly.
- Show whether the current user has already supported it.
- Update the interface immediately or after the API confirms the action.

For a small project, one support per user per issue is sufficient.

### Backend contract

| Method | Endpoint                  | Purpose                    |
| ------ | ------------------------- | -------------------------- |
| GET    | `/api/issues`             | Explore public issues      |
| GET    | `/api/issues/:id`         | Fetch issue details        |
| POST   | `/api/issues/:id/support` | Support an issue           |
| DELETE | `/api/issues/:id/support` | Remove support, if enabled |

The issue explorer should be usable without authentication. Supporting an issue should require a logged-in citizen.

### Duplicate reports: keep the first version simple

Do not build advanced AI-based duplicate detection.

Initially, show related issues using the same category and locality. Let the citizen choose to support an existing report rather than automatically merging two independent complaints.

Automatic merging can create incorrect associations, so an administrator should control any actual merge operation.

### Definition of done

The user can browse issues, search and filter results, open a complete issue page, and support a community issue.

## Workstream D - Officer and admin dashboard

Module D

Goal: Build the operational interface that makes the application feel like a real system.

This is separate from the citizen UI. Its development can begin with predefined assigned issues.

### Officer pages

- `/officer`
- `/officer/issues`
- `/officer/issues/[id]`

### Admin pages

- `/admin`
- `/admin/issues`
- `/admin/users` (optional)
- `/admin/departments`

### Officer dashboard

Display:

- Total assigned issues.
- Issues awaiting action.
- Issues in progress.
- Issues awaiting verification.
- Recently updated issues.
- Overdue issues.

The issue table should support filtering by status, category, priority, location and date.

### Admin workflow

An administrator should be able to:

1. Review newly submitted issues.
2. Inspect the description and photographs.
3. Select a relevant department.
4. Assign an officer.
5. Set or adjust priority.
6. Add an internal or public update.
7. Review reported resolution evidence.
8. Reject invalid or out-of-scope reports with a reason.

### Officer workflow

An officer should be able to:

1. View assigned issues.
2. Open an issue's details.
3. Mark the work as in progress.
4. Add a progress update.
5. Upload resolution evidence.
6. Mark the issue as awaiting citizen verification.

The officer should not be able to assign issues to other departments or change unrelated users' roles.

### Backend contract

| Method | Endpoint                   | Purpose                     |
| ------ | -------------------------- | --------------------------- |
| GET    | `/api/admin/issues`        | Get all manageable issues   |
| PATCH  | `/api/issues/:id/assign`   | Assign a department/officer |
| PATCH  | `/api/issues/:id/status`   | Change status               |
| POST   | `/api/issues/:id/updates`  | Add an issue update         |
| POST   | `/api/issues/:id/evidence` | Attach resolution evidence  |

The API must validate the role and permitted status transition on every request. Hiding a button in the frontend is not sufficient authorization.

### Definition of done

An admin can assign an issue, and an authorized officer can update its progress. The changes must be reflected in the citizen's issue details when the same issue is fetched again.

## Workstream E - Public analytics dashboard

Module E

Goal: Build the most visually impressive overview of Nivaran.

### Frontend page

\- `/dashboard` or `/transparency`

Make the dashboard publicly accessible, but never expose private information such as phone numbers, email addresses, password data or private officer notes.

### UI components

Build the following independently:

- `StatsCard`
- `ResolutionTrendChart`
- `IssuesByCategoryChart`
- `DepartmentPerformanceTable`
- `RecentResolvedIssues`
- `OverdueIssuesList`
- `IssueMap` (optional)

### Example layout

## Nivaran · Public Transparency

Illustrative dashboard layout - not real statistics.

# 1,248

Issues reported

# 782

Resolved

# 216

In progress

# 94

Overdue

Issue resolution rate

# 62.7%

782 resolved ÷ 1,248 reported

Issue lifecycle

Submitted

Pending review

In progress

Work ongoing

Resolved

Completed

### Backend contract

| Method | Endpoint                     | Purpose                  |
| ------ | ---------------------------- | ------------------------ |
| GET    | `/api/analytics/overview`    | Summary metrics          |
| GET    | `/api/analytics/categories`  | Category breakdown       |
| GET    | `/api/analytics/trends`      | Resolution trend data    |
| GET    | `/api/analytics/departments` | Department-level metrics |

Use Recharts for graphs.

You do not need to build complex MongoDB aggregation pipelines at the beginning. For a small dataset, simple Mongoose queries and JavaScript aggregation can be sufficient. Keep the metric calculations in the backend so all dashboards use consistent definitions.

### Definition of done

All charts, statistics and tables render correctly with mock data and can later consume the corresponding API responses without changing their visual components.

## Workstream F - Government scheme discovery

Module F

Goal: Build a separate, useful module that expands Nivaran beyond civic complaints.

### Frontend pages

- `/schemes`
- `/schemes/[id]`

### Features

- Search schemes by name.
- Filter by audience: students, farmers, general citizens.
- Filter by state and category.
- Display eligibility summaries.
- Show required documents.
- Provide official application links.
- Save or bookmark a scheme, if time permits.

### Proposed scheme model

```
Scheme
├── title
├── slug
├── description
├── audience[]
├── state
├── category
├── eligibility[]
├── requiredDocuments[]
├── officialUrl
├── lastVerifiedAt
└── isActive
```

Store curated scheme records in MongoDB. Verify scheme details against official sources before adding them.

### API contract

| Method | Endpoint           | Purpose                      |
| ------ | ------------------ | ---------------------------- |
| GET    | `/api/schemes`     | Search and filter schemes    |
| GET    | `/api/schemes/:id` | Scheme details               |
| POST   | `/api/schemes`     | Create a scheme (admin only) |
| PATCH  | `/api/schemes/:id` | Edit a scheme (admin only)   |

### Definition of done

A visitor can search and filter schemes, view eligibility summaries and follow the official link.

The scheme module should remain independent of the issue-reporting workflow. It does not need to wait for the officer dashboard or community-support feature.

# Phase 2 execution: who can work simultaneously?

The six workstreams above are not six sequential phases. They are parallel tracks that can start once the shared foundation is ready.

| Workstream                 | Can start with mock data? | Requires another module to finish? |
| -------------------------- | ------------------------- | ---------------------------------- |
| A. Authentication          | Yes                       | No                                 |
| B. Citizen reporting       | Yes                       | No                                 |
| C. Issue explorer          | Yes                       | No                                 |
| D. Officer/admin dashboard | Yes                       | No                                 |
| E. Public analytics        | Yes                       | No                                 |
| F. Scheme discovery        | Yes                       | No                                 |

There are two important shared dependencies:

- Every module must use the common issue and user types.
- The final integration requires the backend contracts to match what the frontend services expect.

A teammate can begin building the UI before the actual API exists, as long as the input and output structures have been agreed upon.

# Phase 3 - Backend and MongoDB implementation

Goal: Connect the independently developed modules to one functioning application.

The frontend teams should not stop working while this phase is underway. Their components should already be working against mock services.

One or two backend-focused teammates can implement the models, APIs and authorization rules while the frontend teams finish their screens.

## 3.1 Create the database models

Keep the initial database small. I recommend five main collections.

User

Accounts, profiles and permissions

Fields: `{m.fields}`

Issue

Core civic issue and its current state

Fields: `{m.fields}`

IssueUpdate

Progress history and resolution evidence

Fields: `{m.fields}`

Department

Department directory and issue assignment

Fields: `{m.fields}`

Scheme

Government scheme discovery

Fields: `{m.fields}`

### Important database decisions

Issue location: Store structured location information instead of one unstructured string.

```
location: {
  state: "Uttar Pradesh",
  city: "Lucknow",
  locality: "Near campus",
  latitude: null,
  longitude: null
}
```

Coordinates can be optional initially. This keeps the issue reporting form usable without a map.

Issue history: Keep updates in a separate collection, linked by `issueId`. Each status change should generate an update record.

Community support: For a small project, storing a unique array of user IDs on an issue is sufficient. Check that a user has not already supported it before adding their ID.

Department assignment: Store a department ID and, optionally, an officer ID on the issue. This makes filtering assigned work easier.

Resolution verification: Track verification separately from the main issue status if needed. A resolved issue should not silently lose its history when a citizen reopens it.

### A practical rule

Do not store separate copies of the same issue in the citizen, officer and analytics dashboards. All of those interfaces should derive their data from the same issue records.

## 3.2 Implement the backend in this order

1. Server and configuration

   Create the Express application, connect to MongoDB, configure environment variables, set up CORS, JSON parsing and a central error handler.
2. Authentication and authorization

   Finish registration, login, JWT verification, current-user retrieval and role checks.
3. Issue CRUD

   Implement issue creation, listing, detail retrieval, personal issue history, filtering and pagination.
4. Assignment and workflow

   Implement department assignment, officer assignment, status transitions and issue updates.
5. Community support

   Implement support and removal of support, with duplicate-action protection.
6. Image uploads

   Upload images to Cloudinary and store the resulting URLs in MongoDB. Validate file types and sizes.
7. Analytics

   Compute overview metrics, category distributions, overdue counts and department statistics.
8. Schemes and seed data

   Implement scheme queries and create demonstration users, departments, schemes and issues.

## 3.3 Complete API inventory

Use this as the first version of your API specification. It does not need to be expanded into dozens of endpoints.

| Area         | Endpoint                         | Access                               |
| ------------ | -------------------------------- | ------------------------------------ |
| Auth         | `POST /api/auth/register`        | Public                               |
| Auth         | `POST /api/auth/login`           | Public                               |
| Auth         | `GET /api/auth/me`               | Logged-in user                       |
| Issues       | `POST /api/issues`               | Citizen                              |
| Issues       | `GET /api/issues`                | Public                               |
| Issues       | `GET /api/issues/:id`            | Public, with private fields excluded |
| Issues       | `GET /api/issues/mine`           | Citizen                              |
| Issues       | `PATCH /api/issues/:id/assign`   | Admin                                |
| Issues       | `PATCH /api/issues/:id/status`   | Authorized officer/admin             |
| Issues       | `POST /api/issues/:id/support`   | Citizen                              |
| Issues       | `DELETE /api/issues/:id/support` | Citizen                              |
| Updates      | `GET /api/issues/:id/updates`    | Public updates only                  |
| Updates      | `POST /api/issues/:id/updates`   | Authorized officer/admin             |
| Verification | `POST /api/issues/:id/verify`    | Issue reporter                       |
| Departments  | `GET /api/departments`           | Public                               |
| Departments  | `POST /api/departments`          | Admin                                |
| Analytics    | `GET /api/analytics/overview`    | Public aggregate data                |
| Analytics    | `GET /api/analytics/categories`  | Public aggregate data                |
| Analytics    | `GET /api/analytics/departments` | Public aggregate data                |
| Schemes      | `GET /api/schemes`               | Public                               |
| Schemes      | `GET /api/schemes/:id`           | Public                               |
| Schemes      | `POST /api/schemes`              | Admin                                |
| Schemes      | `PATCH /api/schemes/:id`         | Admin                                |

This is enough to support the initial product. Add endpoints only when a concrete feature requires them.

## 3.4 Define the workflow rules centrally

Do not implement status changes as unrestricted updates such as:

```
await Issue.findByIdAndUpdate(id, req.body);
```

That pattern can allow a user to alter fields they should not control.

Instead, accept only the intended action, validate the current state and role, update the issue, and record the event.

For example:

- An admin can assign an unassigned issue.
- An assigned officer can move an issue to `in_progress`.
- An authorized officer can submit resolution evidence.
- The issue reporter can confirm the resolution or flag that the problem remains.
- Only authorized actors can reopen or reject an issue under the defined rules.

Every status change should also create an `IssueUpdate` record.

### Definition of done for Phase 3

- MongoDB is connected.
- The main API endpoints work.
- The frontend can authenticate and fetch real data.
- A submitted issue persists after refreshing the page.
- An assignment or status update is visible across user roles.
- Unauthorized users cannot perform restricted actions.
- Public endpoints do not leak private account information.

# Phase 4 - Integrate the distinctive features

The core CRUD workflow should work before you start this phase.

These features make Nivaran feel like a complete civic platform rather than a standard issue-management application.

## 4.1 Community issue grouping

Build this after the issue explorer and issue API are stable.

Start with a simple recommendation rule:

- Same category.
- Same locality or nearby location.
- Similar issue title, if useful.

Show possible related issues while the citizen is reporting a problem.

Offer two actions:

- Support an existing issue.
- Submit a new issue.

Do not automatically merge reports based only on matching text. Different problems can occur in the same area.

## 4.2 Citizen resolution verification

After an officer submits resolution evidence:

1. Change the issue to `awaiting_verification`.
2. Show the evidence on the issue details page.
3. Let the reporter confirm the resolution.
4. If confirmed, change the issue to `resolved`.
5. If the problem remains, return it to an authorized review or work-in-progress state.
6. Record the citizen's action in the history.

Prevent the reporter from verifying the issue before resolution evidence has been submitted.

For the demonstration, in-app notifications are enough. You do not need SMS or email notifications unless you have extra time.

## 4.3 Public accountability metrics

Connect the dashboard to actual database values.

Agree on the definitions before calculating metrics:

- Total reported: Number of issues created in the selected period or overall, clearly labelled.
- Resolved: Issues currently resolved, or issues resolved during a selected period, depending on the chart.
- Resolution rate: Resolved issues divided by the appropriate total issue population.
- Overdue: Issues past their target resolution date that are not resolved or rejected.
- Average resolution time: Average duration between report creation and resolution.

Do not count the same issue twice because it has multiple updates.

Also distinguish between current-state metrics and historical metrics. A reopened issue should not be treated as currently resolved merely because it was resolved once before.

For a simple version, define a target resolution time by priority, store the deadline when appropriate, and compute whether an issue is overdue.

## 4.4 Department recommendations

Create a small mapping between issue categories and departments.

For example:

| Issue category | Suggested department         |
| -------------- | ---------------------------- |
| Roads          | Road Maintenance             |
| Sanitation     | Sanitation                   |
| Water          | Water Supply                 |
| Electricity    | Electrical Services          |
| Education      | Relevant Education Authority |

The system can display a suggested department during reporting, while an administrator retains control over the final assignment.

These are demonstration mappings, not verified assignments for every Indian locality.

## 4.5 Interactive map

Add a map only after the core workflow and analytics are complete.

Use Leaflet with location markers and category filters.

Each marker should open the corresponding issue details. Resolved and pending issues should have distinguishable markers or icons.

If you lack accurate coordinates, use a clearly labelled sample dataset for a selected demonstration area.

## 4.6 Scheme recommendations

Keep this feature rule-based.

A student can select the student audience, state and category to see potentially relevant schemes. A farmer can select the farmer audience.

You can implement this with MongoDB filters rather than an AI model.

Show the official link and last-verified date on each scheme. Do not claim that the system has conclusively established eligibility unless you actually implement all relevant eligibility criteria.

### Definition of done for Phase 4

The community-support workflow, resolution-verification flow and analytics all work with persisted data. The map and richer scheme recommendations are optional enhancements.

# Phase 5 - Frontend polish, integration testing and bug fixing

This is not a cosmetic afterthought. Your professor will judge the experience they can see, so this phase deserves real time.

## 5.1 Complete the design of every screen

Use the following checklist.

## UI completion checklist

0/10

Landing page

Clear value proposition, primary actions, feature explanation and public statistics.

Citizen dashboard

Useful summaries, recent issues, status indicators and a prominent reporting action.

Reporting form

Clear validation, image previews, location fields, submission feedback and error states.

Issue explorer

Search, filters, useful sorting, readable cards and empty results.

Issue details

Original evidence, status timeline, department assignment and resolution proof.

Officer/admin dashboard

Useful tables, filters, assignment controls and status actions.

Transparency dashboard

Readable charts, consistent metric definitions and clear labels.

Scheme discovery

Searchable scheme cards, eligibility summaries and official links.

Responsive layout

Usable navigation, forms, tables and cards on mobile and desktop.

Loading and errors

Skeletons, empty states, API error messages and retry actions.

## 5.2 Test the complete user journey

Run these tests against the integrated application.

| Test                                   | Expected result                                      |
| -------------------------------------- | ---------------------------------------------------- |
| Register a citizen                     | Account is created                                   |
| Log in with incorrect credentials      | Login is rejected                                    |
| Report an issue                        | Issue appears in MongoDB and citizen dashboard       |
| Refresh the page                       | Issue still exists                                   |
| Open the issue publicly                | Public fields are visible, private fields are hidden |
| Support the issue twice                | Duplicate support is prevented                       |
| Assign an issue as admin               | Department and officer assignment persist            |
| Change status as an authorized officer | Status and timeline are updated                      |
| Attempt an unauthorized status change  | API rejects the request                              |
| Upload resolution evidence             | Evidence is saved and displayed                      |
| Confirm resolution as the reporter     | Issue becomes resolved                               |
| Report that the issue remains          | Issue enters the defined review workflow             |
| Open public analytics                  | Counts agree with the underlying data                |
| Search for a scheme                    | Relevant records are displayed                       |

Also test edge cases: missing fields, invalid image types, nonexistent issue IDs, expired or invalid tokens, empty results, and rejected API requests.

## 5.3 Keep a bug-fixing buffer

Do not spend the final day building a new feature.

Reserve the final working days for integration failures, inconsistent data, broken layouts, authentication problems and deployment issues.

Exit condition: The application works from beginning to end without requiring manual database edits during the presentation.

# Phase 6 - Seed data, demo preparation and presentation

Goal: Make the project easy to understand in a short live demonstration.

## 6.1 Prepare realistic demonstration data

Seed MongoDB with a controlled dataset:

- 3–5 citizen accounts.
- 2–3 officer accounts.
- 1 administrator account.
- 4–6 departments.
- 25–40 sample issues.
- 10–15 curated schemes.
- Multiple issue statuses.
- Several support counts and timeline updates.
- A few examples with resolution evidence.

Use fictional users and clearly identify demonstration data. Do not fabricate statistics and present them as actual government performance.

## 6.2 Prepare three demo accounts

Provide credentials in your local demo setup or a private team document:

- Citizen account.
- Officer account.
- Admin account.

For a public deployment, never expose administrator credentials or hardcode real secrets in frontend code.

## 6.3 Follow a fixed presentation sequence

01

Start with the problem

Explain how citizens can struggle to find the right authority and track a complaint.

02

Report a real-looking issue

Submit a streetlight or garbage issue with a photograph and location.

03

Show community support

Open a similar issue and demonstrate how citizens can support it.

04

Switch to the admin account

Assign the issue to a department and show the administrative workflow.

05

Switch to the officer account

Update the status and attach resolution evidence.

06

Verify as a citizen

Confirm the outcome or flag that the problem remains unresolved.

07

Finish with transparency

Show the updated issue history and public dashboard.

A single connected example is more persuasive than clicking randomly through ten unrelated pages.

# 13. How to divide the work among teammates

You haven't specified your team size, so here is a division for a team of five. If you have three or four members, combine the roles as explained below.

### Member 1 - Integration lead + authentication

Owns the shared contracts, repository structure, JWT authentication, authorization middleware, API conventions and final integration.

Also reviews pull requests and resolves conflicts between modules.

### Member 2 - Citizen experience

Owns the landing page, citizen dashboard, reporting form, personal issue list, profile and related frontend service layer.

### Member 3 - Issue explorer and community

Owns issue search, filters, issue details, status timeline, support interactions and the resolution-verification UI.

### Member 4 - Officer/admin workflow

Owns issue assignment, officer dashboard, admin tables, department management and backend issue-workflow endpoints.

### Member 5 - Analytics and schemes

Owns the public dashboard, charts, scheme discovery, seed data and supporting backend analytics/scheme endpoints.

This is a division of primary ownership, not a rule that each person can touch only one part of the stack. Member 2 can work on frontend screens while Member 4 works on the relevant backend APIs, for example.

For a four-member team, combine Member 5's analytics/schemes with Member 3's issue explorer, then distribute backend tasks between Members 1 and 4.

For a three-member team, use these broader workstreams:

- Member 1: Authentication, database, core APIs and integration.
- Member 2: Citizen experience, issue explorer and community UI.
- Member 3: Officer/admin interface, analytics, schemes and testing.

With three members, you will need to cut optional features or allow a little more time. Do not pretend the same workload will take the same amount of effort with fewer people.

# 14. The Git workflow that keeps parallel development safe

This part is critical. Parallel work fails when multiple people change the same files or make incompatible assumptions.

Use the following rules.

### Rule 1: Work on separate feature branches

Examples:

```
feature/authentication
feature/citizen-dashboard
feature/issue-reporting
feature/issue-explorer
feature/officer-dashboard
feature/analytics
feature/scheme-discovery
```

Each teammate should open a pull request against `main` or a designated integration branch. Keep `main` deployable.

### Rule 2: Do not let everyone edit shared files

Agree on ownership for these files before starting:

| Shared resource                      | Owner                                   |
| ------------------------------------ | --------------------------------------- |
| Global theme and design tokens       | Integration lead                        |
| Shared TypeScript types              | Integration lead, with reviewed changes |
| Authentication middleware            | Backend/auth owner                      |
| Common layout and navigation         | Integration lead or designated UI owner |
| Issue schema and status rules        | Core backend owner                      |
| API contract document                | Integration lead                        |
| Module-specific pages and components | Assigned teammate                       |

If a shared type must change, notify the other owners and update the API contract at the same time.

### Rule 3: Agree on interfaces before implementing them

For example, the issue reporting module expects a function like:

```
createIssue(payload): Promise<Issue>
```

The officer dashboard expects something like:

```
assignIssue(
  issueId,
  departmentId,
  officerId
): Promise<Issue>
```

The exact implementation can change internally, but the function signatures and returned data shape should remain consistent.

### Rule 4: Use mock services, not scattered hardcoded data

Keep mock data in dedicated files. Do not hardcode issue lists separately inside five pages.

For example:

```
frontend/
├── services/
│   ├── auth.service.ts
│   ├── issues.service.ts
│   ├── analytics.service.ts
│   └── schemes.service.ts
└── mocks/
    ├── issues.ts
    ├── users.ts
    └── schemes.ts
```

When the real API becomes available, replace the service implementation. The UI should not care whether its data came from a mock or the backend.

### Rule 5: Integrate continuously

Do not wait until the last two days to merge everyone's work.

Merge completed modules regularly, run the application, and check whether shared types and navigation still work.

A good rule is that every teammate should have something reviewable at the end of each working day or agreed milestone.

# 15. Dependency map: what actually needs to happen first?

Here is the most important distinction in your requirement: the workstreams should be independent, but some shared contracts and integration steps genuinely have dependencies.

\#chatgpt-mermaid-\_r_14o\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_14o\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_14o\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_14o\_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_14o\_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_14o\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_14o\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_14o\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_14o\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_14o\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_14o\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_14o\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_14o\_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_14o\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_14o\_ p{margin:0;}#chatgpt-mermaid-\_r_14o\_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_14o\_ .cluster-label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_14o\_ .cluster-label span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_14o\_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-\_r_14o\_ .label text,#chatgpt-mermaid-\_r_14o\_ span{fill:rgb(237, 237, 237);color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_14o\_ .node rect,#chatgpt-mermaid-\_r_14o\_ .node circle,#chatgpt-mermaid-\_r_14o\_ .node ellipse,#chatgpt-mermaid-\_r_14o\_ .node polygon,#chatgpt-mermaid-\_r_14o\_ .node path{fill:rgb(9, 23, 44);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-\_r_14o\_ .rough-node .label text,#chatgpt-mermaid-\_r_14o\_ .node .label text,#chatgpt-mermaid-\_r_14o\_ .image-shape .label,#chatgpt-mermaid-\_r_14o\_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-\_r_14o\_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-\_r_14o\_ .rough-node .label,#chatgpt-mermaid-\_r_14o\_ .node .label,#chatgpt-mermaid-\_r_14o\_ .image-shape .label,#chatgpt-mermaid-\_r_14o\_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-\_r_14o\_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-\_r_14o\_ .root .anchor path{fill:rgb(175, 175, 175)!important;stroke-width:0;stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_14o\_ .arrowheadPath{fill:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_14o\_ .edgePath .path{stroke:rgb(175, 175, 175);stroke-width:1px;}#chatgpt-mermaid-\_r_14o\_ .flowchart-link{stroke:rgb(175, 175, 175);fill:none;}#chatgpt-mermaid-\_r_14o\_ .edgeLabel{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-\_r_14o\_ .edgeLabel p{background-color:rgb(0, 0, 0);}#chatgpt-mermaid-\_r_14o\_ .edgeLabel rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-\_r_14o\_ .labelBkg{background-color:rgba(0, 0, 0, 0.5);}#chatgpt-mermaid-\_r_14o\_ .cluster rect{fill:rgb(48, 48, 48);stroke:rgba(255, 255, 255, 0.15);stroke-width:1px;}#chatgpt-mermaid-\_r_14o\_ .cluster text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_14o\_ .cluster span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_14o\_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(48, 48, 48);border:1px solid rgba(255, 255, 255, 0.15);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-\_r_14o\_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_14o\_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-\_r_14o\_ .icon-shape,#chatgpt-mermaid-\_r_14o\_ .image-shape{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-\_r_14o\_ .icon-shape p,#chatgpt-mermaid-\_r_14o\_ .image-shape p{background-color:rgb(0, 0, 0);padding:2px;}#chatgpt-mermaid-\_r_14o\_ .icon-shape .label rect,#chatgpt-mermaid-\_r_14o\_ .image-shape .label rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-\_r_14o\_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-\_r_14o\_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-\_r_14o\_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_14o\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_14o\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_14o\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_14o\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_14o\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_14o\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_14o\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_14o\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_14o\_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-\_r_14o\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_14o\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_14o\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_14o\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_14o\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_14o\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_14o\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_14o\_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(153, 206, 255);}#chatgpt-mermaid-\_r_14o\_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(153, 206, 255);}#chatgpt-mermaid-\_r_14o\_ .node tspan[font-weight="normal"],#chatgpt-mermaid-\_r_14o\_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-\_r_14o\_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-width:1px;}#chatgpt-mermaid-\_r_14o\_ .node rect,#chatgpt-mermaid-\_r_14o\_ .node circle,#chatgpt-mermaid-\_r_14o\_ .node ellipse,#chatgpt-mermaid-\_r_14o\_ .node polygon,#chatgpt-mermaid-\_r_14o\_ .node path{fill:rgb(0, 40, 77);stroke:rgba(255, 255, 255, 0.1);stroke-width:1px;}#chatgpt-mermaid-\_r_14o\_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-\_r_14o\_ .node.mermaid-decision .label-container{fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-dasharray:2,2;}#chatgpt-mermaid-\_r_14o\_ .edgePaths .flowchart-link{stroke:rgb(175, 175, 175);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-\_r_14o\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_14o\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}Phase 0: Scope and contractsPhase 1: Project foundationMock data and shared typesAuthentication moduleCitizen reportingIssue explorerOfficer/admin dashboardAnalytics dashboardScheme discoveryAPI and MongoDB integrationCommunity support andverificationTesting and UI polishDemo preparation

The diagram shows the main dependencies, not a requirement to finish one entire module before starting the next.

In practice, authentication and issue APIs can be developed while the mock-driven frontend modules are being built. The integration phase begins as soon as an endpoint and its consumer are ready.

One adjustment: community support and verification can also be developed against mocks in parallel with the other modules. Their final integration depends on the core issue API and status workflow, not on every dashboard being finished.

# 16. A practical working schedule

Here is one way to fit this into approximately four weeks.

| Period     | Main work                                                 | Expected outcome              |
| ---------- | --------------------------------------------------------- | ----------------------------- |
| Days 1–2   | Scope, schemas, contracts and repository setup            | Shared foundation             |
| Days 3–4   | Shared UI, mock services and Express skeleton             | Every teammate can start      |
| Days 5–10  | Parallel feature development                              | Independent pages and modules |
| Days 8–13  | Backend models, APIs and database integration             | Working persistence           |
| Days 12–16 | Community support, verification and analytics integration | Connected core workflow       |
| Days 17–19 | Scheme polish, optional map and UI refinement             | Feature-complete prototype    |
| Days 20–22 | Integration testing and bug fixing                        | Stable application            |
| Days 23–24 | Demo data, presentation and rehearsal                     | Ready to present              |

Some tasks overlap deliberately. For example, backend implementation starts before the independent frontend work is complete.

If your deadline is shorter, prioritize the citizen-to-officer-to-resolution workflow and reduce the number of optional features.

# 17. The final acceptance checklist

Before declaring Nivaran complete, check these items.

## Project readiness

### 0/17

Shared types, status values and API contracts are documented

Citizen registration and login work

Citizens can submit issues and upload images

Issues persist in MongoDB

Citizens can search, filter and open issues

Administrators can assign issues to departments

Authorized officers can update progress

Issue timelines preserve status history

Citizens can support an existing issue without duplicate support

Resolution evidence can be uploaded and reviewed

Citizens can confirm or challenge a claimed resolution

Public dashboard statistics match database records

Government scheme information links to official sources

Protected actions are enforced by the backend

Mobile and desktop layouts work

All critical user journeys pass testing

Demo accounts and sample data are ready

## My recommendation

Do not start by asking every teammate to build their favorite page. First, freeze the common data types, status lifecycle, API contracts and ownership rules.

Then let the team build independent modules against mock data while the backend is developed in parallel. Integrate continuously rather than leaving all integration until the end.

For Nivaran, the strongest result is not the website with the most features. It is a polished website in which the reporting flow, departmental workflow, community support, resolution verification and public dashboard all work together.

That gives you a feature-rich demonstration without introducing unnecessary backend complexity.