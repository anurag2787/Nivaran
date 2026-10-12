"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatCard } from "@/components/dashboard/StatCard";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueFilter } from "@/components/issues/IssueFilter";
import { IssueDetailModal } from "@/components/issues/IssueDetailModal";
import { Issue, OverviewStats, User, UserRole } from "@/types";
import { mockIssues, mockStats } from "@/services/mockData";
import { api } from "@/services/api";

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [stats, setStats] = useState<OverviewStats>(mockStats);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Spotlight active index
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  // Quick Tracking state
  const [trackRef, setTrackRef] = useState("");
  const [trackError, setTrackError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nivaran-user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch {}
      }
    }

    const loadData = async () => {
      const fetchedIssues = await api.getIssues();
      if (fetchedIssues && fetchedIssues.length > 0) {
        setIssues(fetchedIssues);
      }
      const fetchedStats = await api.getOverviewStats();
      if (fetchedStats) {
        setStats(fetchedStats);
      }
    };
    loadData();
  }, []);

  const filteredIssues = issues.filter((item) => {
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (statusFilter && item.status !== statusFilter) return false;
    if (searchFilter && !item.title.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  const handleSupport = (issueId: string) => {
    api.supportIssue(issueId);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackRef.trim()) return;

    const trimmed = trackRef.trim().toLowerCase();
    const found = issues.find(
      (i) =>
        (i.id && i.id.toLowerCase() === trimmed) ||
        (i._id && i._id.toLowerCase() === trimmed) ||
        i.title.toLowerCase().includes(trimmed)
    );

    if (found) {
      setTrackError("");
      setSelectedIssue(found);
    } else {
      setTrackError(`No record found for reference "${trackRef}". Try "issue-101" or "issue-103".`);
    }
  };

  const spotlightCases = issues.slice(0, 2);
  const activeSpotlight = spotlightCases[spotlightIndex] || issues[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      {/* Live Civic News Ticker Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-800 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium overflow-x-auto whitespace-nowrap scrollbar-none">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-300 font-bold text-[10px] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live City Pulse
            </span>
            <span>🛣️ 412 PWD road repairs logged</span>
            <span className="opacity-40">·</span>
            <span>🚰 Jal Sansthan avg response 2.4 days</span>
            <span className="opacity-40">·</span>
            <span>⚡ 185 streetlights energized in Aliganj</span>
            <span className="opacity-40">·</span>
            <span>✓ 94.2% citizen verified resolution rate</span>
          </div>
          <span className="hidden md:inline-block font-mono text-[11px] opacity-80 shrink-0">
            Lucknow Urban Division
          </span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Dynamic Civic Hero Section */}
        <section className="mb-14 pt-4 sm:pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-2xs">
                <span>📍</span>
                <span>Open Civic Grievance Resolution & Verification</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                Your Neighborhood Issue,{" "}
                <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-300 dark:decoration-emerald-700 decoration-wavy decoration-2">
                  Solved Transparently
                </span>
                .
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                No red tape or unanswered visits. File municipal issues with photo evidence, monitor daily field crew updates, and personally verify the resolution before closing.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/citizen#report"
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-102 active:scale-98 flex items-center gap-2"
                >
                  <span>📷</span>
                  <span>Report Civic Issue</span>
                </Link>
                <a
                  href="#track"
                  className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-xs transition-all active:scale-98 flex items-center gap-2"
                >
                  <span>🔍</span>
                  <span>Track Complaint</span>
                </a>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Direct Department Routing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Mandatory Photo Proof</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Citizen Sign-off Required</span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Interactive Case Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Live Case Spotlight
                    </span>
                  </div>

                  {/* Toggle between Active & Resolved spotlight */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
                    <button
                      onClick={() => setSpotlightIndex(0)}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                        spotlightIndex === 0
                          ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-2xs"
                          : "text-slate-500"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setSpotlightIndex(1)}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                        spotlightIndex === 1
                          ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-2xs"
                          : "text-slate-500"
                      }`}
                    >
                      Solved
                    </button>
                  </div>
                </div>

                {activeSpotlight && (
                  <div className="space-y-4">
                    <div className="h-44 rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                      <img
                        src={
                          activeSpotlight.resolutionImages?.[0] ||
                          activeSpotlight.images?.[0]
                        }
                        alt={activeSpotlight.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                        <span>#{activeSpotlight.id || activeSpotlight._id}</span>
                        <span>·</span>
                        <span className="capitalize">{activeSpotlight.category}</span>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                        {activeSpotlight.supportCount} Citizens Supported
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug line-clamp-1">
                        {activeSpotlight.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <span>📍 {activeSpotlight.location.area}, {activeSpotlight.location.city}</span>
                      </p>
                    </div>

                    {/* Stepper Visualization */}
                    <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-700 dark:text-slate-200">
                          {activeSpotlight.assignedDepartment?.name || "Assigned Department"}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                          {activeSpotlight.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        <div className="h-1.5 bg-emerald-500 rounded-full" />
                        <div className="h-1.5 bg-emerald-500 rounded-full" />
                        <div
                          className={`h-1.5 rounded-full ${
                            activeSpotlight.status === "resolved"
                              ? "bg-emerald-500"
                              : "bg-blue-500 animate-pulse"
                          }`}
                        />
                        <div
                          className={`h-1.5 rounded-full ${
                            activeSpotlight.status === "resolved"
                              ? "bg-emerald-500"
                              : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 italic pt-1">
                        Latest: "{activeSpotlight.timeline?.slice(-1)[0]?.remarks || "Inspection scheduled"}"
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedIssue(activeSpotlight)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Inspect Audit Timeline & Proof</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Track Bar Section */}
        <section id="track" className="mb-14 scroll-mt-24">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-lg relative overflow-hidden">
            <div className="max-w-2xl relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 block">
                Instant Grievance Lookup
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white">
                Track Any Complaint by Reference ID
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
                Enter your reference code (e.g. <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-emerald-300">issue-101</span> or <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-emerald-300">issue-103</span>) to see field inspection photos, contractor dispatch, and timeline.
              </p>

              <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  placeholder="Enter reference ID (e.g. issue-101)..."
                  value={trackRef}
                  onChange={(e) => setTrackRef(e.target.value)}
                  className="flex-1 px-4 py-3 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono font-medium backdrop-blur-xs"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer shrink-0"
                >
                  Track Status →
                </button>
              </form>

              {trackError && (
                <p className="mt-3 text-xs font-semibold text-rose-300">{trackError}</p>
              )}
            </div>
          </div>
        </section>

        {/* Key Municipal Metrics */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                City Dashboard
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Municipal Turnaround & Performance
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Complaints Submitted"
              value={stats.totalIssues}
              subtitle="Registered civic grievances"
            />
            <StatCard
              label="Issues Resolved"
              value={stats.resolvedIssues}
              subtitle="Verified by citizens"
              change="73.3% rate"
              changeType="positive"
            />
            <StatCard
              label="Work In Progress"
              value={stats.inProgressIssues}
              subtitle="Under active maintenance"
              changeType="neutral"
            />
            <StatCard
              label="Average Resolution"
              value={`${stats.averageResolutionDays} Days`}
              subtitle="From filing to citizen sign-off"
              change="-0.8d faster"
              changeType="positive"
            />
          </div>
        </section>

        {/* Community Issues Feed */}
        <section className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Community Complaints Feed
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Explore Civic Grievances
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Support public issues to increase priority and track work on the ground.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full shadow-2xs">
              {filteredIssues.length} Grievances Shown
            </span>
          </div>

          {/* Interactive Filter Pills */}
          <IssueFilter
            selectedCategory={categoryFilter}
            onCategoryChange={setCategoryFilter}
            selectedStatus={statusFilter}
            onStatusChange={setStatusFilter}
            searchQuery={searchFilter}
            onSearchChange={setSearchFilter}
          />

          {/* Issues Grid */}
          {filteredIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIssues.map((issue) => (
                <IssueCard
                  key={issue.id || issue._id}
                  issue={issue}
                  onSupport={handleSupport}
                  onSelect={(selected) => setSelectedIssue(selected)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3 text-xl">
                🔍
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                No matching grievances found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Try loosening your category filter or search keywords.
              </p>
              <button
                onClick={() => {
                  setCategoryFilter("");
                  setStatusFilter("");
                  setSearchFilter("");
                }}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Details & Tracking Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        userRole={currentUser?.role || "citizen"}
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
            setIssues((prev) =>
              prev.map((i) => (i.id === updated.id ? updated : i))
            );
          }
        }}
      />

      <Footer />
    </div>
  );
}
