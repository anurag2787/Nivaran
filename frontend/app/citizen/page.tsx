"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { IssueReportForm } from "@/components/forms/IssueReportForm";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueDetailModal } from "@/components/issues/IssueDetailModal";
import { StatCard } from "@/components/dashboard/StatCard";
import { Issue } from "@/types";
import { mockIssues } from "@/services/mockData";

export default function CitizenPage() {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleCreateSuccess = (newIssue: Issue) => {
    setIssues((prev) => [newIssue, ...prev]);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const myIssues = issues;
  const resolvedCount = myIssues.filter((i) => i.status === "resolved").length;
  const inProgressCount = myIssues.filter(
    (i) => i.status === "in_progress" || i.status === "awaiting_verification"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Toast confirmation */}
        {showSuccessToast && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 rounded-2xl flex items-center justify-between text-xs sm:text-sm shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                ✓
              </span>
              <span className="font-semibold">Grievance Registered:</span>
              <span>Your complaint is logged with municipal coordination and ready for tracking.</span>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="text-emerald-700 dark:text-emerald-300 font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 block">
            Public Civic Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Citizen Grievance Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            File municipal complaints, monitor department responses, and verify on-site resolution evidence.
          </p>
        </div>

        {/* Quick summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="My Grievances"
            value={myIssues.length}
            subtitle="Registered under this profile"
          />
          <StatCard
            label="In Progress"
            value={inProgressCount}
            subtitle="Under active maintenance"
            changeType="neutral"
          />
          <StatCard
            label="Verified Resolved"
            value={resolvedCount}
            subtitle="Closed and citizen verified"
            changeType="positive"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* File New Issue Form (Left side) */}
          <div className="lg:col-span-5" id="report">
            <Card className="sticky top-24 border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    File a New Grievance
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Accurate details and locations expedite municipal coordination.
                </p>
              </CardHeader>
              <CardContent>
                <IssueReportForm onSuccess={handleCreateSuccess} />
              </CardContent>
            </Card>
          </div>

          {/* My Issues Feed (Right side) */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                My Tracked Grievances
              </h2>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full shadow-2xs">
                {myIssues.length} Complaints
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myIssues.map((issue) => (
                <IssueCard
                  key={issue.id || issue._id}
                  issue={issue}
                  onSelect={(selected) => setSelectedIssue(selected)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        userRole="citizen"
        onStatusUpdate={(newStatus, remarks) => {
          if (selectedIssue) {
            const updated = {
              ...selectedIssue,
              status: newStatus,
              timeline: [
                ...selectedIssue.timeline,
                {
                  status: newStatus,
                  remarks,
                  timestamp: new Date().toISOString(),
                },
              ],
            };
            setSelectedIssue(updated);
            setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
          }
        }}
      />

      <Footer />
    </div>
  );
}
