"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { IssueReportForm } from "@/components/forms/IssueReportForm";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueDetailModal } from "@/components/issues/IssueDetailModal";
import { StatCard } from "@/components/dashboard/StatCard";
import { Issue, User } from "@/types";
import { mockIssues } from "@/services/mockData";
import { api } from "@/services/api";

export default function CitizenPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadIssues = async () => {
    setIsLoading(true);
    try {
      const my = await api.getMyIssues();
      if (my && my.length > 0) {
        setIssues(my);
      } else {
        const all = await api.getIssues();
        setIssues(all && all.length > 0 ? all : mockIssues);
      }
    } catch {
      setIssues(mockIssues);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nivaran-user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch {}
      }
    }
    loadIssues();
  }, []);

  const handleCreateSuccess = (newIssue: Issue) => {
    setIssues((prev) => [
      newIssue,
      ...prev.filter((i) => (i.id || i._id) !== (newIssue.id || newIssue._id)),
    ]);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const myIssues = issues.filter((i) => {
    if (filter === "active") return i.status !== "resolved";
    if (filter === "resolved") return i.status === "resolved";
    return true;
  });

  const resolvedCount = issues.filter((i) => i.status === "resolved").length;
  const inProgressCount = issues.filter(
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>My Tracked Grievances</span>
                  <button
                    onClick={loadIssues}
                    title="Refresh complaints"
                    className="text-xs p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    🔄
                  </button>
                </h2>
                <p className="text-[11px] text-slate-500">
                  {currentUser ? `Complaints filed by ${currentUser.name || currentUser.email}` : "Your registered civic reports"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-2xs">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                      filter === "all" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    All ({issues.length})
                  </button>
                  <button
                    onClick={() => setFilter("active")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                      filter === "active" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    In Progress ({inProgressCount})
                  </button>
                  <button
                    onClick={() => setFilter("resolved")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                      filter === "resolved" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    Resolved ({resolvedCount})
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <span className="w-6 h-6 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin inline-block mb-2" />
                <p className="text-xs text-slate-500">Loading your tracked grievances...</p>
              </div>
            ) : myIssues.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myIssues.map((issue) => (
                  <IssueCard
                    key={issue.id || issue._id}
                    issue={issue}
                    onSelect={(selected) => setSelectedIssue(selected)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-3">
                  📋
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                  No grievances found under this filter
                </h3>
                <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
                  {filter === "all"
                    ? "You haven't filed any complaints yet. Submit a new grievance using the form to track it live."
                    : `No grievances currently matching '${filter}' status.`}
                </p>
                {filter !== "all" && (
                  <button
                    onClick={() => setFilter("all")}
                    className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                  >
                    View All ({issues.length}) Grievances →
                  </button>
                )}
              </div>
            )}
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
