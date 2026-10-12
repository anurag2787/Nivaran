"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { StatusBadge, CategoryBadge } from "@/components/ui/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { IssueDetailModal } from "@/components/issues/IssueDetailModal";
import {
  User,
  Issue,
  IssueStatus,
  MUNICIPAL_DEPARTMENTS,
  MunicipalDepartment,
} from "@/types";
import { mockIssues, mockStats } from "@/services/mockData";
import { api } from "@/services/api";
import Link from "next/link";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Active Admin View Tab: "officers" | "grievances" | "performance"
  const [activeAdminTab, setActiveAdminTab] = useState<"officers" | "grievances" | "performance">("officers");

  // Officers & Users Management State
  const [officers, setOfficers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [newOfficerEmail, setNewOfficerEmail] = useState("");
  const [newOfficerName, setNewOfficerName] = useState("");
  const [newOfficerDeptCode, setNewOfficerDeptCode] = useState(
    MUNICIPAL_DEPARTMENTS[0].code
  );
  const [isAssigning, setIsAssigning] = useState(false);
  const [officerSuccessMsg, setOfficerSuccessMsg] = useState<string | null>(null);
  const [officerErrorMsg, setOfficerErrorMsg] = useState<string | null>(null);

  // Edit Officer Modal State
  const [editingOfficer, setEditingOfficer] = useState<User | null>(null);
  const [editFormName, setEditFormName] = useState("");
  const [editFormEmail, setEditFormEmail] = useState("");
  const [editFormPhone, setEditFormPhone] = useState("");
  const [editFormRole, setEditFormRole] = useState<"officer" | "admin" | "citizen">("officer");
  const [editFormDeptCode, setEditFormDeptCode] = useState("PWD");
  const [editFormDeptName, setEditFormDeptName] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Quick user promotion selection state: map of userId -> selectedDeptCode
  const [userDeptSelections, setUserDeptSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nivaran-user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
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

    refreshUserLists();
  }, []);

  const refreshUserLists = async () => {
    try {
      const [freshOfficers, freshAll] = await Promise.all([
        api.getOfficers(),
        api.getAllUsers(),
      ]);
      if (freshOfficers) setOfficers(freshOfficers);
      if (freshAll) setAllUsers(freshAll);
    } catch {}
  };

  const handleStatusChange = (status: IssueStatus, remarks: string, evidenceUrl?: string) => {
    if (selectedIssue) {
      const targetId = selectedIssue.id || selectedIssue._id || "";
      api.updateStatus(targetId, status, remarks, evidenceUrl).catch(() => {});

      const updated = {
        ...selectedIssue,
        status,
        resolutionImages:
          evidenceUrl && !selectedIssue.resolutionImages?.includes(evidenceUrl)
            ? [...(selectedIssue.resolutionImages || []), evidenceUrl]
            : selectedIssue.resolutionImages || [],
        timeline: [
          ...selectedIssue.timeline,
          {
            status,
            remarks,
            timestamp: new Date().toISOString(),
          },
        ],
      };
      setSelectedIssue(updated);
      setIssues((prev) => prev.map((i) => ((i.id === targetId || i._id === targetId) ? updated : i)));
    }
  };

  const handleReassignDepartment = async (
    issueId: string,
    target: { name: string; code: string; remarks: string }
  ) => {
    try {
      await api.assignDepartment(issueId, {
        departmentName: target.name,
        departmentCode: target.code,
        officerName: currentUser?.name || "City Administrator",
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
              remarks: `Reassigned to ${target.name} (${target.code}) by Admin: ${target.remarks}`,
              timestamp: new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      }
      return i;
    });

    setIssues(updatedList);
    setSelectedIssue(null);
  };

  // Form submit: Appoint / Assign Officer by Email
  const handleAssignOfficerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerEmail.trim()) {
      setOfficerErrorMsg("Officer email address is required.");
      return;
    }

    setIsAssigning(true);
    setOfficerErrorMsg(null);
    setOfficerSuccessMsg(null);

    const targetDept =
      MUNICIPAL_DEPARTMENTS.find((d) => d.code === newOfficerDeptCode) ||
      MUNICIPAL_DEPARTMENTS[0];

    try {
      const assigned = await api.assignOfficerDepartment({
        email: newOfficerEmail.trim(),
        name: newOfficerName.trim() || undefined,
        departmentName: targetDept.name,
        departmentCode: targetDept.code,
      });

      setOfficerSuccessMsg(
        `Person ${assigned.email} has been designated as Officer for ${targetDept.name} (${targetDept.code}).`
      );
      setNewOfficerEmail("");
      setNewOfficerName("");
      await refreshUserLists();
    } catch (err: any) {
      setOfficerErrorMsg(err?.message || "Failed to designate officer.");
    } finally {
      setIsAssigning(false);
    }
  };

  // Quick reassign an existing officer's department
  const handleQuickOfficerReassign = async (
    officerEmail: string,
    newDeptCode: string
  ) => {
    const targetDept = MUNICIPAL_DEPARTMENTS.find((d) => d.code === newDeptCode);
    if (!targetDept) return;

    try {
      await api.assignOfficerDepartment({
        email: officerEmail,
        departmentName: targetDept.name,
        departmentCode: targetDept.code,
      });
      setOfficerSuccessMsg(
        `Updated ${officerEmail} jurisdiction to ${targetDept.name} (${targetDept.code}).`
      );
      await refreshUserLists();
    } catch {
      setOfficerErrorMsg("Failed to reallocate officer department.");
    }
  };

  // Direct 1-click promote any registered user to an officer
  const handlePromoteUserToOfficer = async (user: User, deptCode: string) => {
    const targetDept = MUNICIPAL_DEPARTMENTS.find((d) => d.code === deptCode) || MUNICIPAL_DEPARTMENTS[0];

    try {
      await api.assignOfficerDepartment({
        email: user.email,
        name: user.name,
        departmentName: targetDept.name,
        departmentCode: targetDept.code,
      });
      setOfficerSuccessMsg(
        `Successfully appointed ${user.name} (${user.email}) as Officer of ${targetDept.name} (${targetDept.code}).`
      );
      await refreshUserLists();
    } catch {
      setOfficerErrorMsg(`Failed to promote ${user.email} to officer.`);
    }
  };

  const openEditModal = (officer: User) => {
    setEditingOfficer(officer);
    setEditFormName(officer.name || "");
    setEditFormEmail(officer.email || "");
    setEditFormPhone(officer.phone || "");
    setEditFormRole((officer.role as any) || "officer");
    const currentDept =
      MUNICIPAL_DEPARTMENTS.find(
        (d) => d.code === officer.departmentCode || d.name === officer.departmentName
      ) || MUNICIPAL_DEPARTMENTS[0];
    setEditFormDeptCode(officer.departmentCode || currentDept.code);
    setEditFormDeptName(officer.departmentName || currentDept.name);
  };

  const handleSaveOfficerEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficer) return;
    setIsSavingEdit(true);
    setOfficerErrorMsg(null);
    setOfficerSuccessMsg(null);

    const dept = MUNICIPAL_DEPARTMENTS.find((d) => d.code === editFormDeptCode);
    const finalDeptName =
      editFormDeptName.trim() || (dept ? dept.name : "Public Works Department (PWD)");
    const finalDeptCode = editFormDeptCode || (dept ? dept.code : "PWD");

    try {
      const updated = await api.assignOfficerDepartment({
        id: editingOfficer.id,
        email: editFormEmail.trim() || editingOfficer.email,
        name: editFormName.trim(),
        phone: editFormPhone.trim(),
        departmentName: finalDeptName,
        departmentCode: finalDeptCode,
        role: editFormRole,
      });

      setOfficerSuccessMsg(
        `Officer ${updated.name || updated.email} details and organization updated successfully.`
      );
      setEditingOfficer(null);
      await refreshUserLists();
    } catch (err: any) {
      setOfficerErrorMsg(err?.message || "Failed to update officer details.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  if (authChecked && (!currentUser || currentUser.role !== "admin")) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
        <Navbar />
        <main className="flex-1 max-w-lg mx-auto px-4 py-20 flex flex-col justify-center text-center">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl font-bold">
              🛡️
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Administrator Clearance Required
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {currentUser
                ? `You are signed in as a ${currentUser.role} (${currentUser.name}). Only city administrators can view and execute municipal administrative operations.`
                : "This console is restricted to municipal administrative officers. Please log in with an administrator account."}
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={async () => {
                  try {
                    const result = await api.login("admin@example.com", "password123");
                    setCurrentUser(result.user);
                    await refreshUserLists();
                  } catch {}
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md cursor-pointer transition-all"
              >
                ⚡ Switch to Administrator Account (admin@example.com)
              </button>
              <Link
                href="/login"
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Go to Sign In Page →
              </Link>
              <Link
                href="/issues"
                className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs"
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
        {/* Top Header */}
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              City Administration Command
            </span>
            <span className="text-xs text-slate-500">Municipal Command & Coordination Center</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Administration & Governance Console
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Make anyone an officer and specify their organization, oversee civic resolution progress, and manage agency performance.
          </p>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Grievances" value={mockStats.totalIssues} subtitle="Since system inception" />
          <StatCard label="Resolved" value={mockStats.resolvedIssues} subtitle="Closed & verified" changeType="positive" />
          <StatCard label="Designated Officers" value={officers.length.toString()} subtitle="Field response force" />
          <StatCard label="Registered Users" value={allUsers.length.toString()} subtitle="Citizens & personnel" />
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab("officers")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === "officers"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            }`}
          >
            👮 Officer Designation & Organization Allocation ({officers.length})
          </button>
          <button
            onClick={() => setActiveAdminTab("grievances")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === "grievances"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            }`}
          >
            📋 Master Grievances Ledger ({issues.length})
          </button>
          <button
            onClick={() => setActiveAdminTab("performance")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === "performance"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            }`}
          >
            📊 Department Performance Breakdown
          </button>
        </div>

        {/* TAB 1: OFFICER DESIGNATION & ORGANIZATION ALLOCATION */}
        {activeAdminTab === "officers" && (
          <div className="space-y-8 animate-in fade-in">
            {/* Success and Error Alerts */}
            {officerSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between">
                <span>✅ {officerSuccessMsg}</span>
                <button
                  onClick={() => setOfficerSuccessMsg(null)}
                  className="text-emerald-800 dark:text-emerald-200 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
            {officerErrorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center justify-between">
                <span>⚠️ {officerErrorMsg}</span>
                <button
                  onClick={() => setOfficerErrorMsg(null)}
                  className="text-rose-800 dark:text-rose-200 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Officer Designation Form */}
            <Card className="border-2 border-purple-200 dark:border-purple-900/60 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center text-xl font-bold">
                    🏛️
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Make Anyone an Officer & Specify Their Organization
                    </h2>
                    <p className="text-xs text-slate-500">
                      Enter any person&apos;s email address to appoint them as a Field Officer and assign their authorized municipal department/organization. When that person logs in, their profile will be locked to this organization.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAssignOfficerSubmit} className="space-y-4">
                  {/* Quick-pick from existing users */}
                  {allUsers.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        ⚡ Quick Pick: Select a registered user to auto-fill:
                      </span>
                      <select
                        onChange={(e) => {
                          const selected = allUsers.find((u) => u.email === e.target.value);
                          if (selected) {
                            setNewOfficerEmail(selected.email);
                            setNewOfficerName(selected.name);
                            if (selected.departmentCode) {
                              setNewOfficerDeptCode(selected.departmentCode);
                            }
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                      >
                        <option value="">-- Choose registered user --</option>
                        {allUsers.map((u) => (
                          <option key={u.id || u.email} value={u.email}>
                            {u.name} ({u.email}) - {u.role.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Person / Officer Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={newOfficerEmail}
                        onChange={(e) => setNewOfficerEmail(e.target.value)}
                        placeholder="e.g. anyperson@city.gov.in"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Officer Full Name / Title
                      </label>
                      <input
                        type="text"
                        value={newOfficerName}
                        onChange={(e) => setNewOfficerName(e.target.value)}
                        placeholder="e.g. Er. Sandeep Patel"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Specify Organization / Field <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={newOfficerDeptCode}
                        onChange={(e) => setNewOfficerDeptCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                      >
                        {MUNICIPAL_DEPARTMENTS.map((dept) => (
                          <option key={dept.code} value={dept.code}>
                            {dept.icon} {dept.name} ({dept.code}) - {dept.category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isLoading={isAssigning}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md"
                    >
                      ✓ Appoint as Officer & Lock Organization
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Current Appointed Officers Roster */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Active Appointed Municipal Officers Roster
                    </h2>
                    <p className="text-xs text-slate-500">
                      Officers designated by administration and their authorized organizations. Reassign on the fly.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    {officers.length} Active Officers
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Officer Name</th>
                        <th className="py-3 px-4">Email Address</th>
                        <th className="py-3 px-4">Designated Organization</th>
                        <th className="py-3 px-4">Field Scope</th>
                        <th className="py-3 px-4">Change Organization</th>
                        <th className="py-3 px-4 text-right">Edit Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {officers.map((officer) => {
                        const currentDept =
                          MUNICIPAL_DEPARTMENTS.find(
                            (d) =>
                              d.code === officer.departmentCode ||
                              d.name === officer.departmentName
                          ) || MUNICIPAL_DEPARTMENTS[0];

                        return (
                          <tr
                            key={officer.id || officer.email}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                          >
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-xs">
                                  {officer.name ? officer.name.charAt(0).toUpperCase() : "O"}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 dark:text-white block">
                                    {officer.name || "Appointed Officer"}
                                  </span>
                                  {officer.phone && (
                                    <span className="text-[11px] text-slate-400 font-mono">
                                      {officer.phone}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                              {officer.email}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                <span>{currentDept.icon}</span>
                                <span>{officer.departmentName || currentDept.name}</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-4 capitalize font-medium text-slate-600 dark:text-slate-400">
                              {currentDept.category}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={officer.departmentCode || currentDept.code}
                                onChange={(e) =>
                                  handleQuickOfficerReassign(officer.email, e.target.value)
                                }
                                className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                              >
                                {MUNICIPAL_DEPARTMENTS.map((dept) => (
                                  <option key={dept.code} value={dept.code}>
                                    {dept.icon} Transfer to {dept.code} ({dept.category})
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => openEditModal(officer)}
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold whitespace-nowrap shadow-xs"
                              >
                                ✏️ Edit Details
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Registered Users & Citizens Directory (1-Click Promote to Officer) */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Registered Users & Citizens Directory
                    </h2>
                    <p className="text-xs text-slate-500">
                      Promote any registered citizen to an officer on the spot and assign which organization they will head.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    {allUsers.length} Users Registered
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Current Role</th>
                        <th className="py-3 px-4">Assign Organization</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {allUsers.map((user) => {
                        const selectedDept = userDeptSelections[user.id || user.email] || "PWD";

                        return (
                          <tr
                            key={user.id || user.email}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                          >
                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                              {user.name}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-500">
                              {user.email}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                  user.role === "admin"
                                    ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-300"
                                    : user.role === "officer"
                                    ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={selectedDept}
                                onChange={(e) =>
                                  setUserDeptSelections((prev) => ({
                                    ...prev,
                                    [user.id || user.email]: e.target.value,
                                  }))
                                }
                                className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                              >
                                {MUNICIPAL_DEPARTMENTS.map((dept) => (
                                  <option key={dept.code} value={dept.code}>
                                    {dept.icon} {dept.name} ({dept.code})
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handlePromoteUserToOfficer(user, selectedDept)}
                                  className="text-xs font-bold text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/60"
                                >
                                  {user.role === "officer" ? "Assign Org" : "Make Officer →"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openEditModal(user)}
                                  className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                                  title="Edit full credentials and organization"
                                >
                                  ✏️ Edit
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: MASTER GRIEVANCE LEDGER */}
        {activeAdminTab === "grievances" && (
          <Card className="animate-in fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Master Grievances Ledger
                  </h2>
                  <p className="text-xs text-slate-500">
                    Inspect audit trail, transition issue status, or reassign municipal agencies
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  {issues.length} Records
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Ref ID</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Area</th>
                      <th className="py-3 px-4">Supports</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {issues.map((issue) => (
                      <tr
                        key={issue.id || issue._id}
                        onClick={() => setSelectedIssue(issue)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-400">
                          #{issue.id || issue._id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                          {issue.title}
                        </td>
                        <td className="py-3.5 px-4">
                          <CategoryBadge category={issue.category} />
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          {issue.assignedDepartment?.code || "Pending"}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={issue.status} />
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                          {issue.location.area}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {issue.supportCount}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                            Inspect & Manage →
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 3: DEPARTMENT PERFORMANCE BREAKDOWN */}
        {activeAdminTab === "performance" && (
          <Card className="animate-in fade-in">
            <CardHeader>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Department Performance Breakdown
              </h2>
              <p className="text-xs text-slate-500">
                Real-time audit metrics across municipal agencies
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Resolved</th>
                      <th className="py-3 px-4">Pending / Active</th>
                      <th className="py-3 px-4">Resolution Ratio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {mockStats.departmentPerformance?.map((dept, i) => {
                      const total = dept.resolved + dept.pending;
                      const ratio = Math.round((dept.resolved / total) * 100);
                      return (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{dept.name}</td>
                          <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">{dept.resolved}</td>
                          <td className="py-3.5 px-4 text-amber-600 dark:text-amber-400 font-bold tabular-nums">{dept.pending}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-28 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${ratio}%` }} />
                              </div>
                              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{ratio}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* EDIT OFFICER / USER DETAILS MODAL */}
      {editingOfficer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-98 duration-150 text-slate-900 dark:text-white my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center text-2xl font-bold border border-purple-200 dark:border-purple-800 shadow-xs">
                  🏛️
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Edit Officer & Department Details
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Update credentials, official designation title, contact, and administrative department
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingOfficer(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveOfficerEdit} className="p-6 space-y-5">
              {/* Officer Profile Summary Pill */}
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {(editingOfficer.name || editingOfficer.email || "O").charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {editingOfficer.name || "Designated Officer"}
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                      {editingOfficer.email}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                  {editingOfficer.role || "officer"}
                </span>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name & Designation Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormName}
                    onChange={(e) => setEditFormName(e.target.value)}
                    placeholder="e.g. Er. Rajesh Verma (Chief Engineer)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editFormEmail}
                    onChange={(e) => setEditFormEmail(e.target.value)}
                    placeholder="officer@pwd.gov.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editFormPhone}
                    onChange={(e) => setEditFormPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                  />
                </div>
              </div>

              {/* Department & Organization Assignment Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🏛️</span> Organization & Jurisdiction Allocation
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Preset or Custom
                  </span>
                </div>

                {/* Preset Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Select Department Preset
                  </label>
                  <select
                    value={editFormDeptCode}
                    onChange={(e) => {
                      const selectedCode = e.target.value;
                      setEditFormDeptCode(selectedCode);
                      const matched = MUNICIPAL_DEPARTMENTS.find((d) => d.code === selectedCode);
                      if (matched) {
                        setEditFormDeptName(matched.name);
                      }
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer shadow-xs"
                  >
                    {MUNICIPAL_DEPARTMENTS.map((dept) => (
                      <option key={dept.code} value={dept.code}>
                        {dept.icon} {dept.name} ({dept.code}) — {dept.category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Organization / Department Name (Editable Text) */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Organization / Department Name (Customizable)
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormDeptName}
                    onChange={(e) => setEditFormDeptName(e.target.value)}
                    placeholder="e.g. Public Works Department (PWD)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    You can fine-tune the exact organization title (e.g. add zone, branch, or agency name).
                  </p>
                </div>

                {/* Department Code & System Role */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Department Code
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormDeptCode}
                      onChange={(e) => setEditFormDeptCode(e.target.value.toUpperCase())}
                      placeholder="e.g. PWD"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                      System Clearance Role
                    </label>
                    <select
                      value={editFormRole}
                      onChange={(e) => setEditFormRole(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer shadow-xs uppercase"
                    >
                      <option value="officer">Officer (Municipal Operations)</option>
                      <option value="admin">Admin (System Authority)</option>
                      <option value="citizen">Citizen (General Citizen)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Informational Notice */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-[11px] text-blue-700 dark:text-blue-300 flex items-start gap-2">
                <span className="text-sm">ℹ️</span>
                <span>
                  Updates apply in real-time. The officer will view their updated organization title, jurisdiction queues, and department resolution badge immediately upon their next login or refresh.
                </span>
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingOfficer(null)}
                  disabled={isSavingEdit}
                  className="text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSavingEdit}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-5 py-2.5 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {isSavingEdit ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving Updates...
                    </>
                  ) : (
                    <>
                      <span>💾</span> Save Officer Details
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        userRole="admin"
        onStatusUpdate={handleStatusChange}
        onReassignDepartment={handleReassignDepartment}
      />

      <Footer />
    </div>
  );
}
