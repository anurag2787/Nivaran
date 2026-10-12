import { ApiResponse, Issue, IssueStatus, OverviewStats, Scheme, User } from "../types";
import { mockIssues, mockSchemes, mockStats, mockUser } from "./mockData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("nivaran-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth API (Phase 2 Module A)
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    let res: Response;
    try {
      res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch (networkErr) {
      console.warn("Backend server unreachable, falling back to offline mock auth:", networkErr);
      const role = email.includes("officer") ? "officer" : email.includes("admin") ? "admin" : "citizen";
      const user: User = {
        ...mockUser,
        email,
        role,
        name: email.split("@")[0].toUpperCase() + " User",
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("nivaran-token", "mock-jwt-token-nivaran-phase1");
        localStorage.setItem("nivaran-user", JSON.stringify(user));
      }
      return { user, token: "mock-jwt-token-nivaran-phase1" };
    }

    const json: ApiResponse<{ user: User; token: string }> = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Invalid email or password");
    }

    if (json.data?.token && typeof window !== "undefined") {
      localStorage.setItem("nivaran-token", json.data.token);
      localStorage.setItem("nivaran-user", JSON.stringify(json.data.user));
    }
    return json.data;
  },

  async register(name: string, email: string, password: string, phone = ""): Promise<{ user: User; token: string }> {
    let res: Response;
    try {
      res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
    } catch (networkErr) {
      console.warn("Backend server unreachable, falling back to offline mock registration:", networkErr);
      const user: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: "citizen",
        phone,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("nivaran-token", "mock-jwt-token-nivaran-phase1");
        localStorage.setItem("nivaran-user", JSON.stringify(user));
      }
      return { user, token: "mock-jwt-token-nivaran-phase1" };
    }

    const json: ApiResponse<{ user: User; token: string }> = await res.json();
    if (!res.ok) {
      const errorMsg = json.message || (json.errors && json.errors[0]?.message) || "Registration failed";
      throw new Error(errorMsg);
    }

    if (json.data?.token && typeof window !== "undefined") {
      localStorage.setItem("nivaran-token", json.data.token);
      localStorage.setItem("nivaran-user", JSON.stringify(json.data.user));
    }
    return json.data;
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nivaran-token");
      localStorage.removeItem("nivaran-user");
    }
  },

  async getMe(): Promise<User | null> {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("nivaran-user");
          if (stored) return JSON.parse(stored);
        }
        return null;
      }

      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers,
      });
      if (res.ok) {
        const json: ApiResponse<{ user: User }> = await res.json();
        if (json.data?.user) {
          if (typeof window !== "undefined") {
            localStorage.setItem("nivaran-user", JSON.stringify(json.data.user));
          }
          return json.data.user;
        }
      }
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("nivaran-user");
        if (stored) return JSON.parse(stored);
      }
      return null;
    } catch {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("nivaran-user");
        if (stored) return JSON.parse(stored);
      }
      return null;
    }
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(updates),
      });
      const json: ApiResponse<{ user: User }> = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update profile");
      if (typeof window !== "undefined" && json.data?.user) {
        localStorage.setItem("nivaran-user", JSON.stringify(json.data.user));
      }
      return json.data.user;
    } catch (err) {
      if (err instanceof TypeError) {
        const current = (typeof window !== "undefined" && localStorage.getItem("nivaran-user"))
          ? JSON.parse(localStorage.getItem("nivaran-user")!)
          : mockUser;
        const updated = { ...current, ...updates };
        if (typeof window !== "undefined") {
          localStorage.setItem("nivaran-user", JSON.stringify(updated));
        }
        return updated;
      }
      throw err;
    }
  },

  async getOfficers(): Promise<User[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/officers`, { cache: "no-store" });
      const json: ApiResponse<{ officers: User[] }> = await res.json();
      return json.data?.officers || [];
    } catch {
      return [
        {
          id: "user-102",
          name: "Er. Rajesh Verma",
          email: "officer@example.com",
          role: "officer",
          departmentName: "Public Works Department (PWD)",
          departmentCode: "PWD",
        },
        {
          id: "user-104",
          name: "Smt. Vandana Singh",
          email: "water.officer@example.com",
          role: "officer",
          departmentName: "Jal Sansthan (Water & Sewage)",
          departmentCode: "DJB",
        },
        {
          id: "user-105",
          name: "Er. Alok Tripathi",
          email: "power.officer@example.com",
          role: "officer",
          departmentName: "Madhyanchal Vidyut Vitran (MVVNL)",
          departmentCode: "MVVNL",
        },
        {
          id: "user-106",
          name: "Dr. Pradeep Mishra",
          email: "sanitation.officer@example.com",
          role: "officer",
          departmentName: "Nagar Nigam (Sanitation & Waste)",
          departmentCode: "LMC",
        },
      ];
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users`, { cache: "no-store" });
      const json: ApiResponse<{ users: User[] }> = await res.json();
      return json.data?.users || [];
    } catch {
      return [
        {
          id: "user-101",
          name: "Aarav Sharma",
          email: "citizen@example.com",
          role: "citizen",
          phone: "+91 98765 43210",
        },
        {
          id: "user-102",
          name: "Er. Rajesh Verma",
          email: "officer@example.com",
          role: "officer",
          departmentName: "Public Works Department (PWD)",
          departmentCode: "PWD",
        },
        {
          id: "user-104",
          name: "Smt. Vandana Singh",
          email: "water.officer@example.com",
          role: "officer",
          departmentName: "Jal Sansthan (Water & Sewage)",
          departmentCode: "DJB",
        },
        {
          id: "user-105",
          name: "Er. Alok Tripathi",
          email: "power.officer@example.com",
          role: "officer",
          departmentName: "Madhyanchal Vidyut Vitran (MVVNL)",
          departmentCode: "MVVNL",
        },
        {
          id: "user-106",
          name: "Dr. Pradeep Mishra",
          email: "sanitation.officer@example.com",
          role: "officer",
          departmentName: "Nagar Nigam (Sanitation & Waste)",
          departmentCode: "LMC",
        },
      ];
    }
  },

  async assignOfficerDepartment(payload: {
    id?: string;
    email: string;
    name?: string;
    phone?: string;
    departmentName: string;
    departmentCode: string;
    role?: string;
  }): Promise<User> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/assign-officer`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });
      const json: ApiResponse<{ officer: User }> = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update officer details");
      return json.data.officer;
    } catch (err) {
      if (err instanceof TypeError) {
        return {
          id: payload.id || `officer-${Date.now()}`,
          name: payload.name || payload.email.split("@")[0],
          email: payload.email,
          phone: payload.phone || "",
          role: (payload.role as any) || "officer",
          departmentName: payload.departmentName,
          departmentCode: payload.departmentCode,
        };
      }
      throw err;
    }
  },

  // Issues (Phase 2 Modules B, C, D)
  async getIssues(filters?: { status?: string; category?: string; search?: string; sortBy?: string }): Promise<Issue[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.sortBy) params.append("sortBy", filters.sortBy);

      const res = await fetch(`${API_BASE_URL}/issues?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const json: ApiResponse<{ issues: Issue[] }> = await res.json();
      return json.data.issues || mockIssues;
    } catch {
      return mockIssues.filter((item) => {
        if (filters?.status && item.status !== filters.status) return false;
        if (filters?.category && item.category !== filters.category) return false;
        if (filters?.search && !item.title.toLowerCase().includes(filters.search.toLowerCase()) && !item.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
      });
    }
  },

  async getMyIssues(): Promise<Issue[]> {
    try {
      let queryParams = "";
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("nivaran-user");
        if (stored) {
          try {
            const u = JSON.parse(stored);
            if (u.id || u._id || u.email) {
              const params = new URLSearchParams();
              if (u.id || u._id) params.set("userId", u.id || u._id);
              if (u.email) params.set("email", u.email);
              queryParams = `?${params.toString()}`;
            }
          } catch {}
        }
      }

      const res = await fetch(`${API_BASE_URL}/issues/mine${queryParams}`, {
        headers: getAuthHeaders(),
        cache: "no-store",
      });
      const json: ApiResponse<{ issues: Issue[] }> = await res.json();
      if (json && json.data && Array.isArray(json.data.issues)) {
        return json.data.issues;
      }
      return mockIssues;
    } catch {
      return mockIssues;
    }
  },

  async getIssueById(id: string): Promise<Issue | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/issues/${id}`, { cache: "no-store" });
      const json: ApiResponse<{ issue: Issue }> = await res.json();
      return json.data.issue;
    } catch {
      return mockIssues.find((item) => item.id === id || item._id === id) || null;
    }
  },

  async createIssue(payload: Partial<Issue>): Promise<Issue> {
    try {
      const enhancedPayload = { ...payload };
      if (!enhancedPayload.reporter && typeof window !== "undefined") {
        const stored = localStorage.getItem("nivaran-user");
        if (stored) {
          try {
            const u = JSON.parse(stored);
            enhancedPayload.reporter = {
              id: u.id || u._id || "user-101",
              name: u.name || "Aarav Sharma",
              email: u.email || "citizen@example.com",
              phone: u.phone || "+91 98765 43210",
            };
            enhancedPayload.reporterId = u.id || u._id;
          } catch {}
        }
      }

      const res = await fetch(`${API_BASE_URL}/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(enhancedPayload),
      });
      const json: ApiResponse<{ issue: Issue }> = await res.json();
      if (json && json.data?.issue) {
        return json.data.issue;
      }
      throw new Error(json?.message || "Failed to create issue");
    } catch (err) {
      console.warn("createIssue fallback to local:", err);
      const synthesized: Issue = {
        id: `mock-${Date.now()}`,
        title: payload.title || "Reported Issue",
        description: payload.description || "",
        category: payload.category || "other",
        status: "submitted",
        location: payload.location || { address: "Local Street", area: "City Ward", city: "Lucknow" },
        images: payload.images || [],
        resolutionImages: [],
        supportCount: 1,
        timeline: [
          {
            status: "submitted",
            remarks: "Reported via citizen portal",
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return synthesized;
    }
  },

  async updateStatus(id: string, status: IssueStatus, remarks?: string, evidenceUrl?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/issues/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ status, remarks, evidenceUrl }),
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  async assignDepartment(id: string, data: { departmentName: string; departmentCode?: string; officerName?: string; remarks?: string }): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/issues/${id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  async attachEvidence(id: string, evidenceUrl: string, remarks?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/issues/${id}/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ evidenceUrl, remarks }),
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  async supportIssue(id: string): Promise<{ supportCount: number; hasSupported: boolean }> {
    try {
      const res = await fetch(`${API_BASE_URL}/issues/${id}/support`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const json: ApiResponse<{ supportCount: number; hasSupported: boolean }> = await res.json();
      return json.data;
    } catch {
      const found = mockIssues.find((i) => i.id === id || i._id === id);
      const nextCount = (found?.supportCount || 0) + 1;
      return { supportCount: nextCount, hasSupported: true };
    }
  },

  // Analytics (Phase 2 Module E)
  async getAnalyticsOverview(): Promise<OverviewStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/overview`);
      const json: ApiResponse<{ overview: OverviewStats }> = await res.json();
      return json.data.overview || mockStats;
    } catch {
      return mockStats;
    }
  },

  async getOverviewStats(): Promise<OverviewStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/stats/overview`, { cache: "no-store" });
      const json: ApiResponse<{ stats?: OverviewStats; overview?: OverviewStats }> = await res.json();
      return json.data?.stats || json.data?.overview || mockStats;
    } catch {
      return mockStats;
    }
  },

  async getAnalyticsCategories(): Promise<Array<{ category: string; label: string; count: number; resolved: number; rate: number }>> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/categories`);
      const json = await res.json();
      return json.data.categories;
    } catch {
      return [
        { category: "roads", label: "Roads & Traffic", count: 486, resolved: 362, rate: 74.4 },
        { category: "water", label: "Water Supply", count: 325, resolved: 248, rate: 76.3 },
        { category: "electricity", label: "Power & Streetlights", count: 216, resolved: 182, rate: 84.2 },
        { category: "sanitation", label: "Waste Management", count: 184, resolved: 108, rate: 58.6 },
      ];
    }
  },

  async getAnalyticsDepartments(): Promise<Array<{ name: string; code: string; resolved: number; pending: number; avgDays: number }>> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/departments`);
      const json = await res.json();
      return json.data.departments;
    } catch {
      return [
        { name: "Public Works Department (PWD)", code: "PWD", resolved: 412, pending: 82, avgDays: 3.1 },
        { name: "Jal Sansthan (Water Board)", code: "DJB", resolved: 280, pending: 45, avgDays: 2.4 },
        { name: "Madhyanchal Vidyut Vitran (MVVNL)", code: "MVVNL", resolved: 185, pending: 31, avgDays: 1.8 },
      ];
    }
  },

  // Schemes (Phase 2 Module F)
  async getSchemes(filters?: { category?: string; search?: string }): Promise<Scheme[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category && filters.category !== "All") params.append("category", filters.category);
      if (filters?.search) params.append("search", filters.search);

      const queryStr = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`${API_BASE_URL}/stats/schemes${queryStr}`, { cache: "no-store" });
      const json: ApiResponse<{ schemes: Scheme[] }> = await res.json();
      return json.data?.schemes || mockSchemes;
    } catch {
      return mockSchemes.filter((s) => {
        if (filters?.category && filters.category !== "All" && s.category.toLowerCase() !== filters.category.toLowerCase()) {
          return false;
        }
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          return (
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.ministry.toLowerCase().includes(q)
          );
        }
        return true;
      });
    }
  },

  async getSchemeById(id: string): Promise<Scheme | null> {
    const list = await this.getSchemes();
    return list.find((s) => s.id === id || (s as any)._id === id) || null;
  },
};
