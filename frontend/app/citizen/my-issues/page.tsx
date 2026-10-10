"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueDetailModal } from "@/components/issues/IssueDetailModal";
import { Issue } from "@/types";
import { api } from "@/services/api";

export default function MyIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadIssues = async () => {
      const my = await api.getMyIssues();
      setIssues(my);
    };
    loadIssues();
  }, []);

  const filtered = issues.filter((i) => {
    if (filter === "active") return i.status !== "resolved";
    if (filter === "resolved") return i.status === "resolved";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar currentRole="citizen" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <Link href="/citizen" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline mb-1 inline-block">
              ← Back to Citizen Workspace
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight">
              My Tracked Complaints
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              All civic reports submitted under your citizen profile.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-2xs">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filter === "all" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                All ({issues.length})
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filter === "active" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter("resolved")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filter === "resolved" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                Verified Resolved
              </button>
            </div>

            <Link
              href="/citizen/report"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
            >
              + New Report
            </Link>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((issue) => (
              <IssueCard
                key={issue.id || issue._id}
                issue={issue}
                onSelect={(selected) => setSelectedIssue(selected)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">No complaints in this category</h3>
            <p className="text-xs text-slate-500 mb-4">You have not reported any issues matching this filter.</p>
            <Link href="/citizen/report" className="text-xs font-bold text-emerald-600 hover:underline">
              File a new complaint now →
            </Link>
          </div>
        )}
      </main>

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        userRole="citizen"
      />

      <Footer />
    </div>
  );
}
