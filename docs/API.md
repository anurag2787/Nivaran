# Nivaran API Documentation & Contract (Phase 1)

This document specifies the standard REST API structure, response envelopes, error formats, and core endpoints for Nivaran.

---

## 1. Response Standard

All API endpoints MUST conform to standard envelope formatting.

### Success Response Envelope
```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```

### Error Response Envelope
```json
{
  "success": false,
  "message": "Error description message",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

---

## 2. Standard HTTP Status Codes

- `200 OK`: Successful fetch, update, or general operation.
- `201 Created`: Resource successfully created (issue reported, registered, etc.).
- `400 Bad Request`: Validation failure or malformed payload.
- `401 Unauthorized`: Authentication token missing or invalid.
- `403 Forbidden`: User does not have permission (e.g. citizen accessing officer routes).
- `404 Not Found`: Requested resource does not exist.
- `500 Internal Server Error`: Unexpected server error.

---

## 3. Core API Endpoints

### 3.1 Health & Base
- `GET /api/v1/health`
  - Returns backend health status and DB connection state.

### 3.2 Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register`
  - Body: `{ name, email, password, role?: "citizen" | "officer" | "admin", phone?, departmentId? }`
  - Response: User details + JWT token
- `POST /api/v1/auth/login`
  - Body: `{ email, password }`
  - Response: User details + JWT token
- `GET /api/v1/auth/me`
  - Headers: `Authorization: Bearer <token>`
  - Response: Current authenticated user profile

### 3.3 Civic Issues (`/api/v1/issues`)
- `GET /api/v1/issues`
  - Query params: `page`, `limit`, `status`, `category`, `search`, `departmentId`
  - Returns: Paginated list of issues
- `GET /api/v1/issues/:id`
  - Returns: Single issue with full details, timeline, and support count
- `POST /api/v1/issues`
  - Role: `citizen`
  - Body: `{ title, description, category, location: { address, area, city, pincode, coordinates? }, images?: string[] }`
  - Returns: Created issue
- `PATCH /api/v1/issues/:id/status`
  - Role: `officer`, `admin`
  - Body: `{ status: IssueStatus, remarks?: string, evidenceUrl?: string }`
  - Returns: Updated issue with new timeline entry
- `POST /api/v1/issues/:id/support`
  - Role: `citizen`
  - Toggles/adds citizen upvote/support for the issue

### 3.4 Public Stats & Schemes
- `GET /api/v1/stats/overview`
  - Returns: `{ totalIssues, resolvedIssues, inProgressIssues, averageResolutionDays }`
- `GET /api/v1/schemes`
  - Returns: List of government schemes with category, eligibility, and apply link
