"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { StatusBadge, CategoryBadge } from "@/components/ui/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { IssueDetailModal } from "@/components/issues/IssueDetailModal";
import { Issue, IssueStatus } from "@/types";
import { mockIssues, mockStats } from "@/services/mockData";

export default function AdminPage() {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

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
      <Navbar currentRole="admin" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              City Administration
            </span>
            <span className="text-xs text-slate-500">Municipal Command & Coordination</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Administration & Resolution Oversight
          </h1>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Grievances" value={mockStats.totalIssues} subtitle="Since system inception" />
          <StatCard label="Resolved" value={mockStats.resolvedIssues} subtitle="Closed & verified" changeType="positive" />
          <StatCard label="Pending Routing" value={mockStats.pendingAssignment} subtitle="Requires department" changeType="negative" />
          <StatCard label="Avg Turnaround" value={`${mockStats.averageResolutionDays} Days`} subtitle="Resolution time" />
        </div>

        {/* Department Performance Breakdown */}
        <Card className="mb-8">
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

        {/* Master Ledger */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Master Grievances Ledger
                </h2>
                <p className="text-xs text-slate-500">
                  Inspect audit trail and transition issue status
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
                        {issue.id || issue._id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                        {issue.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <CategoryBadge category={issue.category} />
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
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
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
      </main>

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        userRole="admin"
        onStatusUpdate={handleStatusChange}
      />

      <Footer />
    </div>
  );
}
