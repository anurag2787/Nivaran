"use client";

import React, { useState } from "react";
import { Issue, IssueStatus } from "@/types";
import { CategoryBadge, StatusBadge } from "../ui/Badge";
import { Card } from "../ui/Card";

interface IssueCardProps {
  issue: Issue;
  onSupport?: (issueId: string) => void;
  onSelect?: (issue: Issue) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onSupport,
  onSelect,
}) => {
  const [supportCount, setSupportCount] = useState(issue.supportCount);
  const [hasSupported, setHasSupported] = useState(issue.hasSupported || false);

  const [copied, setCopied] = useState(false);

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    const idToCopy = issue.id || issue._id || "";
    if (idToCopy) {
      navigator.clipboard.writeText(idToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSupportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasSupported) {
      setSupportCount((prev) => prev + 1);
      setHasSupported(true);
      if (onSupport) onSupport(issue.id || issue._id || "");
    }
  };

  const formattedDate = new Date(issue.createdAt).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Calculate resolution step: 1: Submitted, 2: Assigned, 3: In Progress, 4: Resolved
  const getStepLevel = (status: IssueStatus) => {
    switch (status) {
      case "submitted":
        return 1;
      case "assigned":
        return 2;
      case "in_progress":
      case "awaiting_verification":
        return 3;
      case "resolved":
        return 4;
      default:
        return 1;
    }
  };

  const stepLevel = getStepLevel(issue.status);

  return (
    <Card
      onClick={() => onSelect && onSelect(issue)}
      className="p-5 flex flex-col justify-between hover:border-emerald-500/80 transition-all cursor-pointer group hover:shadow-lg relative overflow-hidden"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <CategoryBadge category={issue.category} />
          <StatusBadge status={issue.status} />
        </div>

        {/* Tracking ID */}
        <div className="flex items-center gap-1.5 mb-2.5 min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 shrink-0">
            Tracking ID:
          </span>
          <button
            type="button"
            onClick={handleCopyId}
            title="Click to copy tracking ID"
            className="group/id inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200/90 dark:hover:bg-slate-700/80 px-2 py-0.5 rounded-md border border-slate-200/70 dark:border-slate-800 transition-colors cursor-pointer min-w-0 max-w-[240px]"
          >
            <span className="truncate">#{issue.id || issue._id}</span>
            <span className="text-[10px] shrink-0">
              {copied ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-sans font-bold text-[10px]">
                  Copied!
                </span>
              ) : (
                <svg
                  className="w-3 h-3 text-slate-400 group-hover/id:text-emerald-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </span>
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2 leading-snug">
          {issue.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
          {issue.description}
        </p>

        {/* Resolution Progress Bar */}
        <div className="mb-4 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            <span>Progress: Step {stepLevel} of 4</span>
            <span className={stepLevel === 4 ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"}>
              {issue.status.replace("_", " ")}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-colors ${
                  step <= stepLevel
                    ? stepLevel === 4
                      ? "bg-emerald-500"
                      : "bg-blue-500"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Image thumbnail with Evidence Tag */}
        {issue.images && issue.images.length > 0 && (
          <div className="mb-4 rounded-xl overflow-hidden h-36 bg-slate-100 dark:bg-slate-800 relative border border-slate-200 dark:border-slate-700">
            <img
              src={issue.images[0]}
              alt={issue.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              📸 Citizen Proof
            </span>
            {issue.status === "resolved" && (
              <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                ✓ Fix Verified
              </span>
            )}
            {issue.images.length > 1 && (
              <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                +{issue.images.length - 1} photos
              </span>
            )}
          </div>
        )}
      </div>

      <div>
        {/* Location chip */}
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
          <svg
            className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate font-medium">
            {issue.location.area}, {issue.location.city}
          </span>
        </div>

        {/* Footer row: Date & Support Upvote */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium">
            {formattedDate}
          </span>

          <button
            onClick={handleSupportClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              hasSupported
                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-emerald-600"
            }`}
          >
            <svg
              className={`w-3.5 h-3.5 ${
                hasSupported ? "fill-emerald-600 text-emerald-600" : "fill-none text-current"
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2"
              />
            </svg>
            <span>{supportCount} Supports</span>
          </button>
        </div>
      </div>
    </Card>
  );
};
