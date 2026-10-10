"use client";

import React from "react";
import { Issue } from "@/types";
import { CategoryBadge, StatusBadge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface IssueDetailModalProps {
  issue: Issue | null;
  onClose: () => void;
  onStatusUpdate?: (status: Issue["status"], remarks: string) => void;
  userRole?: string;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onClose,
  onStatusUpdate,
  userRole = "citizen",
}) => {
  if (!issue) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-98 duration-150 text-slate-900 dark:text-white">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CategoryBadge category={issue.category} />
              <StatusBadge status={issue.status} />
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                #{issue.id || issue._id}
              </span>
            </div>
            <h2 className="text-2xl font-bold leading-snug">
              {issue.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Complaint Statement
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              {issue.description}
            </p>
          </div>

          {/* Location & Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1 uppercase tracking-wider font-bold">
                Reported Location
              </span>
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {issue.location.address}, {issue.location.area}, {issue.location.city}
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1 uppercase tracking-wider font-bold">
                Responsible Agency
              </span>
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {issue.assignedDepartment?.name || "Pending Municipal Routing"}
              </p>
            </div>
          </div>

          {/* Citizen Photo Proof */}
          {issue.images && issue.images.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Citizen Photo Proof
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {issue.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <img src={img} alt="Citizen proof" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Completion Proof */}
          {issue.resolutionImages && issue.resolutionImages.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                Official Completion Proof (Field Photos)
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {issue.resolutionImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500"
                  >
                    <img src={img} alt="Resolution proof" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connected Audit Trail */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Official Resolution Audit Trail
            </h4>
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
                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 mt-1">
                    {evt.remarks}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer / Action Bar */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-300">
            {issue.supportCount} citizens supported
          </span>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>

            {userRole === "officer" && issue.status === "assigned" && onStatusUpdate && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onStatusUpdate("in_progress", "Officer started field inspection")}
              >
                Mark In Progress
              </Button>
            )}

            {userRole === "officer" && issue.status === "in_progress" && onStatusUpdate && (
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  onStatusUpdate("awaiting_verification", "Repairs completed on site by maintenance crew")
                }
              >
                Submit Resolution Proof
              </Button>
            )}

            {userRole === "citizen" && issue.status === "awaiting_verification" && onStatusUpdate && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onStatusUpdate("resolved", "Citizen confirmed satisfactory resolution")}
              >
                Verify & Close Grievance
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
