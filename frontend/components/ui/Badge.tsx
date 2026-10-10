import React from "react";
import { IssueCategory, IssueStatus } from "@/types";

interface StatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

const statusConfig: Record<
  IssueStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  submitted: {
    label: "Submitted",
    bg: "bg-amber-50 dark:bg-amber-950/60",
    text: "text-amber-800 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  assigned: {
    label: "Assigned",
    bg: "bg-sky-50 dark:bg-sky-950/60",
    text: "text-sky-800 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-800",
    dot: "bg-sky-500",
  },
  in_progress: {
    label: "In Progress",
    bg: "bg-blue-50 dark:bg-blue-950/60",
    text: "text-blue-800 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    dot: "bg-blue-600 animate-pulse",
  },
  awaiting_verification: {
    label: "Awaiting Verification",
    bg: "bg-purple-50 dark:bg-purple-950/60",
    text: "text-purple-800 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
    dot: "bg-purple-500",
  },
  resolved: {
    label: "Resolved & Verified",
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    text: "text-emerald-800 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-rose-50 dark:bg-rose-950/60",
    text: "text-rose-800 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
    dot: "bg-rose-500",
  },
  reopened: {
    label: "Reopened",
    bg: "bg-orange-50 dark:bg-orange-950/60",
    text: "text-orange-800 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
    dot: "bg-orange-500",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const config = statusConfig[status] || {
    label: status,
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-800 dark:text-slate-200",
    border: "border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border tracking-wide shadow-2xs ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
};

interface CategoryBadgeProps {
  category: IssueCategory;
  className?: string;
}

const categoryConfig: Record<
  IssueCategory,
  { label: string; icon: string; bg: string; text: string; border: string }
> = {
  roads: {
    label: "Roads & Traffic",
    icon: "🛣️",
    bg: "bg-amber-50/80 dark:bg-amber-950/40",
    text: "text-amber-900 dark:text-amber-200",
    border: "border-amber-200 dark:border-amber-800/60",
  },
  sanitation: {
    label: "Sanitation & Waste",
    icon: "🧹",
    bg: "bg-emerald-50/80 dark:bg-emerald-950/40",
    text: "text-emerald-900 dark:text-emerald-200",
    border: "border-emerald-200 dark:border-emerald-800/60",
  },
  water: {
    label: "Water Supply",
    icon: "🚰",
    bg: "bg-cyan-50/80 dark:bg-cyan-950/40",
    text: "text-cyan-900 dark:text-cyan-200",
    border: "border-cyan-200 dark:border-cyan-800/60",
  },
  electricity: {
    label: "Power & Lighting",
    icon: "⚡",
    bg: "bg-yellow-50/80 dark:bg-yellow-950/40",
    text: "text-yellow-900 dark:text-yellow-200",
    border: "border-yellow-200 dark:border-yellow-800/60",
  },
  education: {
    label: "Education",
    icon: "🏫",
    bg: "bg-indigo-50/80 dark:bg-indigo-950/40",
    text: "text-indigo-900 dark:text-indigo-200",
    border: "border-indigo-200 dark:border-indigo-800/60",
  },
  other: {
    label: "Civic Amenities",
    icon: "🏛️",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-800 dark:text-slate-200",
    border: "border-slate-200 dark:border-slate-700",
  },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className = "" }) => {
  const conf = categoryConfig[category] || {
    label: category,
    icon: "📌",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-800 dark:text-slate-200",
    border: "border-slate-200 dark:border-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border tracking-wide shadow-2xs ${conf.bg} ${conf.text} ${conf.border} ${className}`}
    >
      <span>{conf.icon}</span>
      <span>{conf.label}</span>
    </span>
  );
};
