# Nivaran Civic Issue Status Lifecycle (Phase 1)

This document standardizes the status transitions, permissions, and rules across Nivaran.

---

## 1. Status Flow Diagram

```
[submitted] ──────► [assigned] ──────► [in_progress] ──────► [awaiting_verification] ──────► [resolved]
      │                                                                  │
      ▼                                                                  ▼
  [rejected]                                                        [reopened] ──────► [in_progress]
```

---

## 2. Status Definitions

1. **`submitted`**: Initial state when a citizen files a new report.
2. **`assigned`**: An admin/dispatcher assigns the issue to a specific department or officer.
3. **`in_progress`**: Field officer begins work, orders materials, or initiates remediation.
4. **`awaiting_verification`**: Officer submits resolution details & photo proof; citizen is prompted to confirm.
5. **`resolved`**: Citizen confirms resolution, or automatically marked resolved after validation period.
6. **`rejected`**: Admin marks as duplicate, out-of-scope, or invalid (mandatory remark required).
7. **`reopened`**: Citizen reports that the grievance was not resolved or problem persisted.

---

## 3. Permitted Transitions by Role

| Current Status | Target Status | Allowed Role | Notes |
| :--- | :--- | :--- | :--- |
| `submitted` | `assigned` | `admin` | Assigns department and optionally an officer |
| `submitted` | `rejected` | `admin` | Must provide reason |
| `assigned` | `in_progress` | `officer`, `admin` | Work commenced |
| `in_progress` | `awaiting_verification` | `officer`, `admin` | Requires resolution notes/proof |
| `awaiting_verification` | `resolved` | `citizen`, `admin` | Verified fix |
| `awaiting_verification` | `reopened` | `citizen`, `admin` | Citizen contests fix |
| `reopened` | `in_progress` | `officer`, `admin` | Further remediation initiated |
