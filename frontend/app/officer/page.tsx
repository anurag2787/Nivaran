"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueDetailModal } from "@/components/issues/IssueDetailModal";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  User,
  Issue,
  IssueStatus,
  MUNICIPAL_DEPARTMENTS,
  MunicipalDepartment,
} from "@/types";
import { mockIssues } from "@/services/mockData";
import { api } from "@/services/api";
import Link from "next/link";

export default function OfficerPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Department State
  const [selectedDeptCode, setSelectedDeptCode] = useState<string>("PWD");

  // Filter Tabs: all, pending, in_progress, resolved
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "in_progress" | "resolved">("all");

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nivaran-user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as User;
          setCurrentUser(parsed);
          if (parsed.departmentCode) {
            setSelectedDeptCode(parsed.departmentCode);
          } else if (parsed.departmentName) {
            const found = MUNICIPAL_DEPARTMENTS.find(
              (d) =>
                d.name.toLowerCase() === parsed.departmentName?.toLowerCase() ||
                parsed.departmentName?.toLowerCase().includes(d.code.toLowerCase())
            );
            if (found) setSelectedDeptCode(found.code);
          }
        } catch {}
      }
    }
    setAuthChecked(true);

    api
      .getIssues()
      .then((data) => {
        if (data && data.length > 0) setIssues(data);
      })
      .catch(() => {});
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const activeDepartment = useMemo(() => {
    return MUNICIPAL_DEPARTMENTS.find((d) => d.code === selectedDeptCode) || MUNICIPAL_DEPARTMENTS[0];
  }, [selectedDeptCode]);

  // Issues matching selected department
  const departmentIssues = useMemo(() => {
    if (selectedDeptCode === "ALL") return issues;

    return issues.filter((i) => {
      const codeMatches = i.assignedDepartment?.code?.toUpperCase() === selectedDeptCode.toUpperCase();
      const catMatches = i.category === activeDepartment.category;
      const nameMatches = i.assignedDepartment?.name
        ?.toLowerCase()
        .includes(activeDepartment.code.toLowerCase());

      return codeMatches || catMatches || nameMatches;
    });
  }, [issues, selectedDeptCode, activeDepartment]);

  // Tab filtered issues
  const filteredIssues = useMemo(() => {
    return departmentIssues.filter((i) => {
      if (activeTab === "pending") return i.status === "assigned" || i.status === "submitted";
      if (activeTab === "in_progress")
        return i.status === "in_progress" || i.status === "awaiting_verification";
      if (activeTab === "resolved") return i.status === "resolved";
      return true;
    });
  }, [departmentIssues, activeTab]);

  // Dynamic KPI Stats for current department
  const stats = useMemo(() => {
    const total = departmentIssues.length;
    const pending = departmentIssues.filter(
      (i) => i.status === "assigned" || i.status === "submitted"
    ).length;
    const active = departmentIssues.filter(
      (i) => i.status === "in_progress" || i.status === "awaiting_verification"
    ).length;
    const resolved = departmentIssues.filter((i) => i.status === "resolved").length;
    return { total, pending, active, resolved };
  }, [departmentIssues]);

  // Update Status handler (Start Remediation or Resolve)
  const handleStatusChange = async (
    status: IssueStatus,
    remarks: string,
    evidenceUrl?: string
  ) => {
    if (!selectedIssue) return;
    const targetId = selectedIssue.id || selectedIssue._id || "";

    try {
      await api.updateStatus(targetId, status, remarks, evidenceUrl);
    } catch {}

    const updatedImages =
      evidenceUrl && !selectedIssue.resolutionImages?.includes(evidenceUrl)
        ? [...(selectedIssue.resolutionImages || []), evidenceUrl]
        : selectedIssue.resolutionImages || [];

    const updatedIssue: Issue = {
      ...selectedIssue,
      status,
      resolutionImages: updatedImages,
      timeline: [
        ...(selectedIssue.timeline || []),
        {
          status,
          remarks,
          updatedBy: currentUser
            ? { id: currentUser.id, name: currentUser.name, role: currentUser.role }
            : undefined,
          timestamp: new Date().toISOString(),
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    setSelectedIssue(updatedIssue);
    setIssues((prev) =>
      prev.map((i) => (i.id === targetId || i._id === targetId ? updatedIssue : i))
    );
    setToastMessage(`Grievance #${targetId} updated to "${status.replace("_", " ")}" successfully.`);
  };

  // Reallot to Another Department handler
  const handleReassignDepartment = async (
    issueId: string,
    target: { name: string; code: string; remarks: string }
  ) => {
    try {
      await api.assignDepartment(issueId, {
        departmentName: target.name,
        departmentCode: target.code,
        officerName: currentUser?.name || "Field Officer",
        remarks: target.remarks,
      });
    } catch {}

    const updatedList = issues.map((i) => {
      if (i.id === issueId || i._id === issueId) {
        return {
          ...i,
          status: "assigned" as IssueStatus,
          assignedDepartment: {
            id: `dept-${target.code.toLowerCase()}`,
            name: target.name,
            code: target.code,
          },
          timeline: [
            ...(i.timeline || []),
            {
              status: "assigned" as IssueStatus,
              remarks: `Transferred to ${target.name} (${target.code}) by ${currentUser?.name || "Officer"}: ${target.remarks}`,
              updatedBy: currentUser
                ? { id: currentUser.id, name: currentUser.name, role: currentUser.role }
                : undefined,
              timestamp: new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      }
      return i;
    });

    setIssues(updatedList);
    setSelectedIssue(null); // Close modal on reallotment
    setToastMessage(
      `Complaint #${issueId} reallocated to ${target.name} with your transfer remarks.`
    );
  };

  // Set default primary department for officer
  const handleSetPrimaryDept = async (dept: MunicipalDepartment) => {
    setSelectedDeptCode(dept.code);
    if (currentUser) {
      try {
        const updated = await api.updateProfile({
          departmentName: dept.name,
          departmentCode: dept.code,
        });
        setCurrentUser(updated);
        setToastMessage(`Your primary field department has been set to ${dept.name}.`);
      } catch {}
    }
  };

  if (
    authChecked &&
    (!currentUser || (currentUser.role !== "officer" && currentUser.role !== "admin"))
  ) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
        <Navbar />
        <main className="flex-1 max-w-lg mx-auto px-4 py-20 flex flex-col justify-center text-center">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-bold">
              📋
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Field Officer Clearance Required
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {currentUser
                ? `You are signed in as a ${currentUser.role} (${currentUser.name}). Only municipal zonal officers or administrators can access the remediation queue.`
                : "This workspace is reserved for municipal field engineers and response teams. Please sign in with an officer account."}
            </p>
            <div className="pt-4 flex flex-col gap-2">
              {!currentUser ? (
                <Link
                  href="/login"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md"
                >
                  Sign In to Nivaran →
                </Link>
              ) : (
                <Link
                  href="/citizen"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md"
                >
                  Return to Citizen Portal →
                </Link>
              )}
              <Link
                href="/issues"
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm"
              >
                Browse Public Issues
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 duration-200">
            <div className="px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-xl text-sm font-semibold flex items-center gap-3">
              <span>🔔</span>
              <span>{toastMessage}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="ml-2 text-white/80 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Top Header & Officer Department Identity */}
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
                  <span>👷</span>
                  <span>Field Operations Workspace</span>
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Officer: <strong>{currentUser?.name || "Municipal Officer"}</strong>
                </span>
                {currentUser?.email && (
                  <span className="text-xs font-mono text-slate-400">({currentUser.email})</span>
                )}
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Officer Remediation Console
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Manage grievances assigned to your department, dispatch field teams, record resolution proofs, or reallot misrouted complaints.
              </p>
            </div>

            {/* Department Active Card & Switcher */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-2xl flex items-center justify-center shrink-0">
                  {selectedDeptCode === "ALL" ? "🌐" : activeDepartment.icon}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Active Department View
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {selectedDeptCode === "ALL"
                      ? "All Municipal Departments"
                      : activeDepartment.name}
                  </p>
                  <span className="text-xs text-slate-500">
                    {selectedDeptCode === "ALL"
                      ? "Universal municipal queue"
                      : `Category: ${activeDepartment.category} (${activeDepartment.code})`}
                  </span>
                </div>
              </div>

              {/* Department Dropdown Switcher */}
              <div className="sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-4 flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Switch Field / Department:
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedDeptCode}
                    onChange={(e) => setSelectedDeptCode(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {MUNICIPAL_DEPARTMENTS.map((dept) => (
                      <option key={dept.code} value={dept.code}>
                        {dept.icon} {dept.name} ({dept.code})
                      </option>
                    ))}
                    <option value="ALL">🌐 All Departments (Universal Queue)</option>
                  </select>

                  {selectedDeptCode !== "ALL" &&
                    currentUser?.departmentCode !== selectedDeptCode && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryDept(activeDepartment)}
                        title="Set this department as your default assigned profile"
                        className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer shrink-0"
                      >
                        Set as Default
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time KPI Stats for Active Department */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total in Department"
            value={stats.total.toString()}
            subtitle={
              selectedDeptCode === "ALL"
                ? "Across all departments"
                : `${activeDepartment.code} department total`
            }
          />
          <StatCard
            label="Pending Action"
            value={stats.pending.toString()}
            subtitle="Requires inspection / crew dispatch"
            changeType={stats.pending > 0 ? "negative" : "neutral"}
          />
          <StatCard
            label="Active Remediation"
            value={stats.active.toString()}
            subtitle="Crews working on site"
          />
          <StatCard
            label="Resolved Grievances"
            value={stats.resolved.toString()}
            subtitle="Closed with audit trail"
            changeType="positive"
          />
        </div>

        {/* Filter Navigation & Progression Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-2xs overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Tasks ({departmentIssues.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "pending"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              ⏳ Pending Action ({stats.pending})
            </button>
            <button
              onClick={() => setActiveTab("in_progress")}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "in_progress"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              🔧 Active on Ground ({stats.active})
            </button>
            <button
              onClick={() => setActiveTab("resolved")}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "resolved"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              ✓ Resolved ({stats.resolved})
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong>{filteredIssues.length}</strong> complaints in queue
          </div>
        </div>

        {/* Complaints Grid */}
        {filteredIssues.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 my-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-2xl flex items-center justify-center">
              🎉
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              No Complaints in this Status
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
              {activeTab === "all"
                ? `No active issues currently assigned to ${activeDepartment.name}.`
                : `There are currently no tasks in the "${activeTab.replace("_", " ")}" stage for this department.`}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                View All Department Tasks
              </button>
              <button
                onClick={() => setSelectedDeptCode("ALL")}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                View Universal Queue
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <div key={issue.id || issue._id} className="relative group">
                <IssueCard
                  issue={issue}
                  onSelect={(selected) => setSelectedIssue(selected)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Upgraded Resolution & Reallotment Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        userRole="officer"
        officerDepartment={activeDepartment.name}
        onStatusUpdate={handleStatusChange}
        onReassignDepartment={handleReassignDepartment}
      />

      <Footer />
    </div>
  );
}
