"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { api } from "@/services/api";

export default function TransparencyDashboardPage() {
  const [categories, setCategories] = useState<Array<{ category: string; label: string; count: number; resolved: number; rate: number }>>([]);
  const [departments, setDepartments] = useState<Array<{ name: string; code: string; resolved: number; pending: number; avgDays: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      const [cats, depts] = await Promise.all([
        api.getAnalyticsCategories(),
        api.getAnalyticsDepartments(),
      ]);
      setCategories(cats);
      setDepartments(depts);
      setLoading(false);
    };
    loadAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white p-8 sm:p-10 rounded-3xl shadow-xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-300 border border-emerald-700 mb-3">
            Open Governance & Accountability
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-white">
            Public Civic Transparency Dashboard
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Real-time public performance indicators, department resolution timelines, and city-wide turnaround metrics. All data is publicly verifiable with no personal citizen data exposed.
          </p>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Reported"
            value="1,284"
            subtitle="Grievances registered"
            change="+18% this month"
          />
          <StatCard
            label="Verified Resolved"
            value="942"
            subtitle="Citizen verified solutions"
            change="73.3% closure"
            changeType="positive"
          />
          <StatCard
            label="Active Remediation"
            value="218"
            subtitle="Crews on ground"
            changeType="neutral"
          />
          <StatCard
            label="Avg. Turnaround"
            value="3.4 Days"
            subtitle="Filing to sign-off"
            change="-0.8d faster"
            changeType="positive"
          />
        </div>

        {/* Category Breakdown & SLA Rates */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6">
            <Card className="h-full">
              <CardHeader>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Resolution Rate by Civic Category
                </h2>
                <p className="text-xs text-slate-500">
                  Total complaints vs verified completions
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {categories.map((c, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800 dark:text-slate-200">{c.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-normal">{c.resolved} / {c.count}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono">{c.rate}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${c.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Department Performance Table */}
          <div className="lg:col-span-6">
            <Card className="h-full">
              <CardHeader>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Municipal Department Performance
                </h2>
                <p className="text-xs text-slate-500">
                  Agency response rate and average turnaround time
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800 uppercase font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">Agency</th>
                        <th className="py-2.5 px-3">Resolved</th>
                        <th className="py-2.5 px-3">Active</th>
                        <th className="py-2.5 px-3">Avg SLA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {departments.map((dept, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                            {dept.name}
                          </td>
                          <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                            {dept.resolved}
                          </td>
                          <td className="py-3 px-3 text-amber-600 dark:text-amber-400 font-bold">
                            {dept.pending}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                            {dept.avgDays} Days
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
