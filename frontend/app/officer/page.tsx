"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueDetailModal } from "@/components/issues/IssueDetailModal";
import { StatCard } from "@/components/dashboard/StatCard";
import { Issue, IssueStatus } from "@/types";
import { mockIssues } from "@/services/mockData";
import { api } from "@/services/api";

export default function OfficerPage() {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [activeTab, setActiveTab] = useState<"assigned" | "in_progress" | "all">("all");

  useEffect(() => {
    api.getIssues().then((data) => {
      if (data && data.length > 0) setIssues(data);
    }).catch(() => {});
  }, []);

  const filteredIssues = issues.filter((i) => {
    if (activeTab === "assigned") return i.status === "assigned" || i.status === "submitted";
    if (activeTab === "in_progress") return i.status === "in_progress" || i.status === "awaiting_verification";
    return true;
  });

  const handleStatusChange = (status: IssueStatus, remarks: string) => {
    if (selectedIssue) {
      const updated = {
        ...selectedIssue,
        status,
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
      setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar currentRole="officer" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Field Operations
              </span>
              <span className="text-xs text-slate-500">Zone 3 Municipal Taskboard</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Officer Work Queue
            </h1>
          </div>

          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-2xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Tasks ({issues.length})
            </button>
            <button
              onClick={() => setActiveTab("assigned")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "assigned"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Pending Dispatch
            </button>
            <button
              onClick={() => setActiveTab("in_progress")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "in_progress"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Active on Ground
            </button>
          </div>
        </div>

        {/* Officer KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Assigned Tasks" value="18" subtitle="Requires action" />
          <StatCard label="Crews Dispatched" value="7" subtitle="Active remediation" />
          <StatCard label="Awaiting Verification" value="4" subtitle="Proof submitted" />
          <StatCard label="SLA Adherence" value="94.2%" subtitle="Within 72h standard" changeType="positive" />
        </div>

        {/* Queue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id || issue._id}
              issue={issue}
              onSelect={(selected) => setSelectedIssue(selected)}
            />
          ))}
        </div>
      </main>

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        userRole="officer"
        onStatusUpdate={handleStatusChange}
      />

      <Footer />
    </div>
  );
}
