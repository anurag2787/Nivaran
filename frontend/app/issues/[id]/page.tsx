"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryBadge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Issue } from "@/types";
import { api } from "@/services/api";

export default function SingleIssuePage() {
  const params = useParams();
  const id = params?.id as string;
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSupported, setHasSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(0);

  useEffect(() => {
    const loadIssue = async () => {
      if (!id) return;
      const data = await api.getIssueById(id);
      if (data) {
        setIssue(data);
        setSupportCount(data.supportCount || 0);
        setHasSupported(data.hasSupported || false);
      }
      setLoading(false);
    };
    loadIssue();
  }, [id]);

  const handleSupportToggle = async () => {
    if (!issue) return;
    const res = await api.supportIssue(issue.id || issue._id || "");
    setSupportCount(res.supportCount);
    setHasSupported(res.hasSupported);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
        <Navbar />
        <div className="p-12 text-center text-slate-500 text-sm">Loading grievance details...</div>
        <Footer />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
        <Navbar />
        <div className="p-12 text-center text-slate-500 space-y-4">
          <h2 className="text-xl font-bold">Issue Not Found</h2>
          <Link href="/issues" className="text-emerald-600 font-bold hover:underline">
            ← Return to Explorer
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/issues" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            ← Back to Community Feed
          </Link>
          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
            Reference ID: #{issue.id || issue._id}
          </span>
        </div>

        {/* Title Header */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <CategoryBadge category={issue.category} />
            <StatusBadge status={issue.status} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {issue.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>📍 {issue.location.address}, {issue.location.area}, {issue.location.city}</span>
            <span>📅 Reported on {new Date(issue.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
            <span>🏛️ Assigned: {issue.assignedDepartment?.name || "Pending Routing"}</span>
          </div>
        </div>

        {/* Support & Community Impact Callout */}
        <div className="bg-emerald-50 dark:bg-emerald-950/60 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              Are you affected by this civic problem too?
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
              Community upvotes directly escalate municipal priority and dispatcher scheduling.
            </p>
          </div>
          <button
            onClick={handleSupportToggle}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
              hasSupported
                ? "bg-emerald-600 text-white"
                : "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-200 border-2 border-emerald-400 hover:bg-emerald-100"
            }`}
          >
            <span>{hasSupported ? "✓ You Supported This" : "👍 I'm Affected Too"}</span>
            <span className="font-mono bg-black/10 px-2 py-0.5 rounded-full">{supportCount}</span>
          </button>
        </div>

        {/* Description & Photos */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Detailed Grievance Description
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
              {issue.description}
            </p>
          </div>

          {issue.images && issue.images.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Original Citizen Photo Evidence
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {issue.images.map((img, i) => (
                  <div key={i} className="h-60 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {issue.resolutionImages && issue.resolutionImages.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                Official Resolution Evidence (Field Photos)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {issue.resolutionImages.map((img, i) => (
                  <div key={i} className="h-60 rounded-2xl overflow-hidden border-2 border-emerald-500">
                    <img src={img} alt="Resolution" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Official Resolution Audit Trail & Timeline
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
            {issue.timeline?.map((evt, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-slate-900" />
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={evt.status} />
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(evt.timestamp).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 mt-1">
                  {evt.remarks}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
