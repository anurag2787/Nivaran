"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueFilter } from "@/components/issues/IssueFilter";
import { IssueDetailModal } from "@/components/issues/IssueDetailModal";
import { Issue } from "@/types";
import { mockIssues } from "@/services/mockData";
import { api } from "@/services/api";

export default function IssuesExplorerPage() {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "support" | "oldest">("newest");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    const load = async () => {
      const fetched = await api.getIssues({ sortBy });
      if (fetched && fetched.length > 0) setIssues(fetched);
    };
    load();
  }, [sortBy]);

  let filtered = issues.filter((item) => {
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (statusFilter && item.status !== statusFilter) return false;
    if (searchFilter && !item.title.toLowerCase().includes(searchFilter.toLowerCase()) && !item.description.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  if (sortBy === "support") {
    filtered = [...filtered].sort((a, b) => (b.supportCount || 0) - (a.supportCount || 0));
  } else if (sortBy === "oldest") {
    filtered = [...filtered].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const handleSupport = async (id: string) => {
    await api.supportIssue(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
              Public Transparency Ledger
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Community Issues Explorer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse public complaints, support priority issues to speed up municipal action, and inspect proof.
            </p>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "support" | "oldest")}
              className="px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 shadow-2xs cursor-pointer focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">Newest First</option>
              <option value="support">Most Supported</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
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

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((issue) => (
              <IssueCard
                key={issue.id || issue._id}
                issue={issue}
                onSupport={handleSupport}
                onSelect={(selected) => setSelectedIssue(selected)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">No matching civic issues</h3>
            <p className="text-xs text-slate-500 mb-4">Try clearing search keywords or selecting a different category.</p>
            <button
              onClick={() => {
                setCategoryFilter("");
                setStatusFilter("");
                setSearchFilter("");
              }}
              className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </main>

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />

      <Footer />
    </div>
  );
}
