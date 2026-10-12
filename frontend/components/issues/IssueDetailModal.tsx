"use client";

import React, { useState, useRef } from "react";
import { ImageMetadata, Issue, MUNICIPAL_DEPARTMENTS } from "@/types";
import { CategoryBadge, StatusBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { api } from "@/services/api";

interface IssueDetailModalProps {
  issue: Issue | null;
  onClose: () => void;
  onStatusUpdate?: (
    status: Issue["status"],
    remarks: string,
    evidenceUrl?: string,
    evidenceDetails?: ImageMetadata
  ) => void;
  onReassignDepartment?: (
    issueId: string,
    department: { name: string; code: string; remarks: string }
  ) => void;
  userRole?: string;
  officerDepartment?: string;
}

const SAMPLE_PROOF_PHOTOS = [
  {
    label: "Road / Civil Fix",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Water / Pipeline Fix",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Electrical / Lighting Fix",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Sanitation Cleared",
    url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
  },
];

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onClose,
  onStatusUpdate,
  onReassignDepartment,
  userRole = "citizen",
  officerDepartment,
}) => {
  // Resolution form state
  const [modalMode, setModalMode] = useState<"view" | "resolve" | "reallot">("view");
  const [resolutionRemarks, setResolutionRemarks] = useState("");
  const [resolutionPhoto, setResolutionPhoto] = useState("");
  const [resolvePhotoInputMode, setResolvePhotoInputMode] = useState<"upload" | "url">("upload");
  const [resolutionFile, setResolutionFile] = useState<File | null>(null);
  const [resolutionPreviewUrl, setResolutionPreviewUrl] = useState<string>("");
  const [isUploadingResolution, setIsUploadingResolution] = useState<boolean>(false);
  const [resolutionUploadProgress, setResolutionUploadProgress] = useState<number>(0);
  const [uploadedResolutionMeta, setUploadedResolutionMeta] = useState<ImageMetadata | null>(null);
  const [resolutionUploadError, setResolutionUploadError] = useState<string>("");
  const resolutionFileInputRef = useRef<HTMLInputElement>(null);
  const [resolveError, setResolveError] = useState("");

  // Reallotment form state
  const [targetDeptCode, setTargetDeptCode] = useState(
    MUNICIPAL_DEPARTMENTS[0]?.code || "PWD"
  );
  const [reallotRemarks, setReallotRemarks] = useState("");
  const [reallotError, setReallotError] = useState("");

  if (!issue) return null;

  const currentDeptName = issue.assignedDepartment?.name || "Pending Municipal Routing";

  const handleResolutionFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResolutionUploadError("");

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setResolutionUploadError("Invalid file format. Please upload JPG, PNG, or WEBP.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setResolutionUploadError(`File is too large (${sizeMB}MB). Maximum allowed size is 5MB.`);
      return;
    }

    setResolutionFile(file);
    const objectUrl = URL.createObjectURL(file);
    setResolutionPreviewUrl(objectUrl);

    // Auto-upload
    await performResolutionUpload(file);
  };

  const performResolutionUpload = async (file: File) => {
    setIsUploadingResolution(true);
    setResolutionUploadProgress(10);
    setResolutionUploadError("");

    try {
      const meta = await api.uploadImage(file, {
        folder: "nivaran/resolutions",
        onProgress: (percent) => setResolutionUploadProgress(Math.max(10, percent)),
      });
      setResolutionPhoto(meta.secureUrl || meta.url);
      setUploadedResolutionMeta(meta);
      setResolutionUploadProgress(100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image. Please try again or paste image URL.";
      setResolutionUploadError(msg);
      setResolutionUploadProgress(0);
    } finally {
      setIsUploadingResolution(false);
    }
  };

  const handleRemoveResolutionImage = () => {
    setResolutionFile(null);
    setResolutionPreviewUrl("");
    setResolutionPhoto("");
    setUploadedResolutionMeta(null);
    setResolutionUploadProgress(0);
    setResolutionUploadError("");
    if (resolutionFileInputRef.current) {
      resolutionFileInputRef.current.value = "";
    }
  };

  const handleTriggerResolutionFileInput = () => {
    if (resolutionFileInputRef.current) {
      resolutionFileInputRef.current.click();
    }
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionRemarks.trim()) {
      setResolveError("Remediation and resolution remarks are required.");
      return;
    }
    setResolveError("");
    const finalPhoto = resolutionPhoto.trim() || undefined;
    if (onStatusUpdate) {
      onStatusUpdate(
        "resolved",
        resolutionRemarks.trim(),
        finalPhoto,
        uploadedResolutionMeta || undefined
      );
    }
    setModalMode("view");
    setResolutionRemarks("");
    handleRemoveResolutionImage();
  };

  const handleReallotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reallotRemarks.trim()) {
      setReallotError("A transfer remark explaining why this issue is being reallocated is required.");
      return;
    }
    const targetDept = MUNICIPAL_DEPARTMENTS.find((d) => d.code === targetDeptCode);
    if (!targetDept) return;

    setReallotError("");
    if (onReassignDepartment) {
      onReassignDepartment(issue.id || issue._id || "", {
        name: targetDept.name,
        code: targetDept.code,
        remarks: reallotRemarks.trim(),
      });
    }
    setModalMode("view");
    setReallotRemarks("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-98 duration-150 text-slate-900 dark:text-white">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <CategoryBadge category={issue.category} />
              <StatusBadge status={issue.status} />
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                #{issue.id || issue._id}
              </span>
              {issue.assignedDepartment && (
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-md">
                  Dept: {issue.assignedDepartment.name}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold leading-snug">
              {issue.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto space-y-6">
          {/* RESOLUTION SUBMISSION FORM MODE */}
          {modalMode === "resolve" ? (
            <form onSubmit={handleResolveSubmit} className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-1">
                  <span>✅</span>
                  <span>Mark Grievance as Resolved</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Submit field resolution notes confirming ground completion. Remarks are mandatory, and photo proof is optional.
                </p>
              </div>

              {resolveError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-semibold">
                  ⚠️ {resolveError}
                </div>
              )}

              {/* Mandatory Remarks */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Remediation & Closure Remarks <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={resolutionRemarks}
                  onChange={(e) => {
                    setResolutionRemarks(e.target.value);
                    if (resolveError) setResolveError("");
                  }}
                  rows={3}
                  placeholder="e.g. Patching completed by PWD road crew. Asphalt laid and leveled, road opened to traffic."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Optional Photo Proof with Cloudinary Upload or URL */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Field Photo Evidence <span className="text-slate-400 font-normal normal-case">(Optional)</span>
                  </label>
                  <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setResolvePhotoInputMode("upload")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px] ${
                        resolvePhotoInputMode === "upload"
                          ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      📷 Upload Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setResolvePhotoInputMode("url")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px] ${
                        resolvePhotoInputMode === "url"
                          ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      🔗 Photo URL
                    </button>
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={resolutionFileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  capture="environment"
                  onChange={handleResolutionFileSelect}
                  className="hidden"
                  disabled={isUploadingResolution}
                />

                {resolvePhotoInputMode === "upload" ? (
                  <div>
                    {!resolutionPreviewUrl ? (
                      <div
                        onClick={handleTriggerResolutionFileInput}
                        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/40"
                      >
                        <div className="text-xl mb-1">📸</div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                          <span className="text-emerald-600 dark:text-emerald-400 hover:underline">Choose Resolution Photo</span> or take photo
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          JPG, PNG, WEBP (Max 5MB)
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={resolutionPreviewUrl}
                              alt="Resolution preview"
                              className="w-16 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                {resolutionFile?.name || "Resolution evidence"}
                              </p>
                              {resolutionFile && (
                                <p className="text-[10px] text-slate-400">
                                  {(resolutionFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              )}
                              <div className="mt-1">
                                {isUploadingResolution ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                    <span className="w-2 h-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    Uploading ({resolutionUploadProgress}%)
                                  </span>
                                ) : resolutionPhoto ? (
                                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                    ✓ Uploaded to Cloudinary
                                  </span>
                                ) : resolutionUploadError ? (
                                  <span className="text-[11px] text-rose-600 font-semibold">
                                    ⚠️ Upload failed
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={handleTriggerResolutionFileInput}
                              disabled={isUploadingResolution}
                              className="px-2 py-1 text-[11px] font-semibold rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 cursor-pointer"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveResolutionImage}
                              disabled={isUploadingResolution}
                              className="px-2 py-1 text-[11px] font-semibold rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 cursor-pointer"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {isUploadingResolution && (
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full transition-all duration-300"
                              style={{ width: `${resolutionUploadProgress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {resolutionUploadError && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                        ⚠️ {resolutionUploadError}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={resolutionPhoto}
                      onChange={(e) => setResolutionPhoto(e.target.value)}
                      placeholder="https://images.unsplash.com/... or paste image URL"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2"
                    />

                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Quick demo photos:</span>
                      {SAMPLE_PROOF_PHOTOS.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setResolutionPhoto(sample.url)}
                          className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>

                    {resolutionPhoto && (
                      <div className="mt-3 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 max-w-xs">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Photo Preview
                        </span>
                        <img
                          src={resolutionPhoto}
                          alt="Resolution preview"
                          className="w-full h-32 object-cover rounded-lg"
                          onError={() => {}}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalMode("view")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Confirm & Mark Resolved
                </Button>
              </div>
            </form>
          ) : modalMode === "reallot" ? (
            /* REALLOT / TRANSFER FORM MODE */
            <form onSubmit={handleReallotSubmit} className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm mb-1">
                  <span>⇄</span>
                  <span>Reallot to Specific Department</span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Not your department&apos;s issue? Forward this complaint directly to the responsible municipal department with an explanatory remark.
                </p>
              </div>

              {reallotError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-semibold">
                  ⚠️ {reallotError}
                </div>
              )}

              {/* Target Department Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Target Department <span className="text-rose-500">*</span>
                </label>
                <select
                  value={targetDeptCode}
                  onChange={(e) => setTargetDeptCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {MUNICIPAL_DEPARTMENTS.map((dept) => (
                    <option key={dept.code} value={dept.code}>
                      {dept.icon} {dept.name} ({dept.code}) - {dept.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mandatory Reallotment Remark */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Transfer Reason / Officer Remark <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={reallotRemarks}
                  onChange={(e) => {
                    setReallotRemarks(e.target.value);
                    if (reallotError) setReallotError("");
                  }}
                  rows={3}
                  placeholder="e.g. Complaint was filed under road maintenance, but ground inspection revealed broken drinking water line. Forwarding to Jal Sansthan for urgent pipe repair."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalMode("view")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Confirm Transfer
                </Button>
              </div>
            </form>
          ) : (
            /* DEFAULT DETAIL VIEW MODE */
            <>
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
                  {issue.location.coordinates && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <span>📍</span>
                        <span>
                          {issue.location.coordinates.lat.toFixed(4)}°N, {issue.location.coordinates.lng.toFixed(4)}°E
                        </span>
                      </span>
                      <a
                        href={`https://www.google.com/maps?q=${issue.location.coordinates.lat},${issue.location.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                      >
                        View Map ↗
                      </a>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div>
                    <span className="text-slate-400 block mb-1 uppercase tracking-wider font-bold">
                      Assigned Department
                    </span>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {currentDeptName}
                    </p>
                    {issue.assignedOfficer?.name && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        Officer: {issue.assignedOfficer.name}
                      </p>
                    )}
                  </div>
                  {userRole === "officer" && onReassignDepartment && (
                    <button
                      type="button"
                      onClick={() => setModalMode("reallot")}
                      className="mt-3 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start cursor-pointer"
                    >
                      <span>⇄ Not your department? Reallot issue</span>
                    </button>
                  )}
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                    <span>✅</span>
                    <span>Official Completion Proof (Field Photos)</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {issue.resolutionImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500 relative"
                      >
                        <img src={img} alt="Resolution proof" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 bg-emerald-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Verified Work
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Official Resolution Audit Trail */}
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
            </>
          )}
        </div>

        {/* Modal Footer / Action Bar (Only shown in view mode) */}
        {modalMode === "view" && (
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-300">
              {issue.supportCount} citizens supported
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>

              {/* Officer Progression Operations */}
              {userRole === "officer" && onStatusUpdate && (
                <>
                  {/* Start Remediation button when submitted or assigned */}
                  {(issue.status === "assigned" || issue.status === "submitted") && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                      onClick={() =>
                        onStatusUpdate(
                          "in_progress",
                          "Field inspection conducted; remediation crew dispatched on site."
                        )
                      }
                    >
                      ▶ Start Remediation
                    </Button>
                  )}

                  {/* Reallot to Another Department */}
                  {onReassignDepartment && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setModalMode("reallot")}
                      className="text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                    >
                      ⇄ Reallot Department
                    </Button>
                  )}

                  {/* Mark as Resolved button (triggers dedicated form with mandatory remark & optional photo) */}
                  {issue.status !== "resolved" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setModalMode("resolve")}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      ✓ Mark as Resolved
                    </Button>
                  )}
                </>
              )}

              {/* Citizen Operations */}
              {userRole === "citizen" && issue.status === "awaiting_verification" && onStatusUpdate && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    onStatusUpdate("resolved", "Citizen confirmed satisfactory resolution on site")
                  }
                >
                  Verify & Close Grievance
                </Button>
              )}

              {/* Admin Operations */}
              {userRole === "admin" && onStatusUpdate && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {onReassignDepartment && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setModalMode("reallot")}
                      className="text-amber-600 border-amber-300 hover:bg-amber-50"
                    >
                      ⇄ Reassign Dept
                    </Button>
                  )}
                  {issue.status !== "in_progress" && issue.status !== "resolved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onStatusUpdate(
                          "in_progress",
                          "Administrative intervention: Dispatched team to resolve"
                        )
                      }
                    >
                      Set In Progress
                    </Button>
                  )}
                  {issue.status !== "resolved" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setModalMode("resolve")}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Direct Resolve
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
