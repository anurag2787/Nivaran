"use client";

import React from "react";

interface IssueFilterProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
}

export const IssueFilter: React.FC<IssueFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
}) => {
  const categoryPills: Array<{ label: string; value: string; icon: string }> = [
    { label: "All Categories", value: "", icon: "🏛️" },
    { label: "Roads & Traffic", value: "roads", icon: "🛣️" },
    { label: "Water Supply", value: "water", icon: "🚰" },
    { label: "Power & Light", value: "electricity", icon: "⚡" },
    { label: "Sanitation", value: "sanitation", icon: "🧹" },
    { label: "Education", value: "education", icon: "🏫" },
  ];

  const statusTabs: Array<{ label: string; value: string }> = [
    { label: "All Statuses", value: "" },
    { label: "Active & In Progress", value: "in_progress" },
    { label: "Submitted (New)", value: "submitted" },
    { label: "Resolved & Verified", value: "resolved" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 space-y-4">
      {/* Search Bar + Quick Status Tabs */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search complaints by keyword, landmark, or area (e.g. Hazratganj)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onStatusChange(tab.value)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === tab.value
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills with Icons */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1">
          Category:
        </span>
        {categoryPills.map((pill) => (
          <button
            key={pill.value}
            onClick={() => onCategoryChange(pill.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
              selectedCategory === pill.value
                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 font-bold shadow-2xs"
                : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            <span>{pill.icon}</span>
            <span>{pill.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
