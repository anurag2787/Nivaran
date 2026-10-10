/**
 * Shared Type Definitions for Nivaran (Phase 1 Contract)
 */

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

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  departmentId?: string;
  departmentName?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface IssueTimelineEvent {
  status: IssueStatus;
  remarks: string;
  updatedBy?: {
    id: string;
    name: string;
    role: UserRole;
  };
  timestamp: string;
}

export interface IssueLocation {
  address: string;
  area: string;
  city: string;
  pincode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Issue {
  id: string;
  _id?: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  location: IssueLocation;
  reporter?: {
    id: string;
    name: string;
    phone?: string;
  };
  assignedDepartment?: {
    id: string;
    name: string;
    code: string;
  };
  assignedOfficer?: {
    id: string;
    name: string;
  };
  images: string[];
  resolutionImages: string[];
  supportCount: number;
  hasSupported?: boolean;
  timeline: IssueTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  categoriesHandled: IssueCategory[];
  totalIssuesCount?: number;
  resolvedIssuesCount?: number;
}

export interface Scheme {
  id: string;
  title: string;
  ministry: string;
  category: string;
  description: string;
  eligibility: string[];
  benefits?: string[];
  applyUrl: string;
}

export interface OverviewStats {
  totalIssues: number;
  resolvedIssues: number;
  inProgressIssues: number;
  awaitingVerification: number;
  pendingAssignment: number;
  averageResolutionDays: number;
  departmentPerformance?: Array<{
    name: string;
    resolved: number;
    pending: number;
  }>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ field?: string; message: string }>;
}
