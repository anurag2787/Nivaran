import { ApiResponse, Issue, IssueStatus, OverviewStats, Scheme, User } from "../types";
import { mockIssues, mockSchemes, mockStats, mockUser } from "./mockData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

/**
 * Universal API Client with automatic mock fallback for offline/isolated frontend development
 */
export const api = {
  // Healthcheck
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
      const data = await res.json();
      return data.success === true;
    } catch {
      return false;
    }
  },

  // Issues
  async getIssues(filters?: { status?: string; category?: string; search?: string }): Promise<Issue[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.search) params.append("search", filters.search);

      const res = await fetch(`${API_BASE_URL}/issues?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Network response was not ok");
      const json: ApiResponse<{ issues: Issue[] }> = await res.json();
      return json.data.issues || mockIssues;
    } catch {
      // Fallback to mock issues
      return mockIssues.filter((item) => {
        if (filters?.status && item.status !== filters.status) return false;
        if (filters?.category && item.category !== filters.category) return false;
        if (filters?.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
      });
    }
  },

  async getIssueById(id: string): Promise<Issue | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/issues/${id}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Network response was not ok");
      const json: ApiResponse<{ issue: Issue }> = await res.json();
      return json.data.issue;
    } catch {
      return mockIssues.find((item) => item.id === id || item._id === id) || null;
    }
  },

  async createIssue(payload: Partial<Issue>): Promise<Issue> {
    try {
      const res = await fetch(`${API_BASE_URL}/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json: ApiResponse<{ issue: Issue }> = await res.json();
      return json.data.issue;
    } catch {
      // In offline mock mode, synthesize new issue
      const synthesized: Issue = {
        id: `mock-${Date.now()}`,
        title: payload.title || "Reported Issue",
        description: payload.description || "",
        category: payload.category || "other",
        status: "submitted",
        location: payload.location || { address: "Reported Location", area: "Local", city: "Lucknow" },
        images: payload.images || [],
        resolutionImages: [],
        supportCount: 1,
        timeline: [
          {
            status: "submitted",
            remarks: "Reported via Nivaran citizen portal",
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return synthesized;
    }
  },

  async updateIssueStatus(id: string, status: IssueStatus, remarks?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/issues/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, remarks }),
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  async supportIssue(id: string): Promise<number> {
    try {
      const res = await fetch(`${API_BASE_URL}/issues/${id}/support`, {
        method: "POST",
      });
      const json: ApiResponse<{ supportCount: number }> = await res.json();
      return json.data.supportCount;
    } catch {
      const found = mockIssues.find((i) => i.id === id || i._id === id);
      return (found?.supportCount || 0) + 1;
    }
  },

  // Stats & Schemes
  async getOverviewStats(): Promise<OverviewStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/stats/overview`, { cache: "no-store" });
      const json: ApiResponse<{ stats: OverviewStats }> = await res.json();
      return json.data.stats || mockStats;
    } catch {
      return mockStats;
    }
  },

  async getSchemes(): Promise<Scheme[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/stats/schemes`, { cache: "no-store" });
      const json: ApiResponse<{ schemes: Scheme[] }> = await res.json();
      return json.data.schemes || mockSchemes;
    } catch {
      return mockSchemes;
    }
  },

  // Auth
  async getCurrentUser(): Promise<User> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`);
      const json: ApiResponse<{ user: User }> = await res.json();
      return json.data.user || mockUser;
    } catch {
      return mockUser;
    }
  },
};
