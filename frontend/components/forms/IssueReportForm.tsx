"use client";

import React, { useState, useRef } from "react";
import { ImageMetadata, Issue, IssueCategory } from "@/types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { api } from "@/services/api";

interface IssueReportFormProps {
  onSuccess: (newIssue: Issue) => void;
  onCancel?: () => void;
}

export const IssueReportForm: React.FC<IssueReportFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IssueCategory>("roads");

  // Location fields
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Lucknow");
  const [pincode, setPincode] = useState("226001");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // Geolocation state
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<"idle" | "detecting" | "success" | "error">("idle");
  const [locationMsg, setLocationMsg] = useState("");

  // Image upload state
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [uploadedImageMeta, setUploadedImageMeta] = useState<ImageMetadata | null>(null);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);

  const categories: Array<{ id: IssueCategory; label: string; icon: string }> = [
    { id: "roads", label: "Roads & Potholes", icon: "🛣️" },
    { id: "water", label: "Water Leakage", icon: "🚰" },
    { id: "electricity", label: "Power & Streetlights", icon: "⚡" },
    { id: "sanitation", label: "Waste & Garbage", icon: "🧹" },
    { id: "education", label: "School & Facility", icon: "🏫" },
    { id: "other", label: "Other Amenities", icon: "🏛️" },
  ];

  const handleDetectLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationStatus("error");
      setLocationMsg("Geolocation is not supported by your browser. Please type your location manually.");
      return;
    }

    setIsLocating(true);
    setLocationStatus("detecting");
    setLocationMsg("Requesting device GPS permission...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy);

        setCoordinates({ lat, lng });
        setAccuracy(acc);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
            { headers: { Accept: "application/json" } }
          );

          if (res.ok) {
            const data = await res.json();
            const a = data.address || {};

            const roadName = a.road || a.pedestrian || a.suburb || a.neighbourhood || a.residential || "";
            const areaName = a.suburb || a.neighbourhood || a.residential || a.city_district || "";
            const cityName = a.city || a.town || a.village || a.state_district || "Lucknow";
            const postCode = a.postcode || "";

            if (roadName) {
              setAddress(roadName);
            } else if (!address) {
              setAddress(`Near ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
            }

            if (areaName) {
              setArea(areaName);
            }
            if (cityName) {
              setCity(cityName);
            }
            if (postCode) {
              setPincode(postCode);
            }
          } else {
            if (!address) {
              setAddress(`GPS Location (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`);
            }
          }
        } catch {
          if (!address) {
            setAddress(`GPS Location (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`);
          }
        } finally {
          setIsLocating(false);
          setLocationStatus("success");
          setLocationMsg("");
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus("error");
        if (err.code === err.PERMISSION_DENIED) {
          setLocationMsg("Location permission was denied. Please enter your address manually.");
        } else if (err.code === err.TIMEOUT) {
          setLocationMsg("Location request timed out. Please enter your address manually.");
        } else {
          setLocationMsg("Could not detect location. Please enter your address manually.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  const handleClearGPS = () => {
    setCoordinates(null);
    setAccuracy(null);
    setLocationStatus("idle");
    setLocationMsg("");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");

    // Validate type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError("Invalid file format. Please upload JPG, PNG, or WEBP.");
      return;
    }

    // Validate size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setUploadError(`File is too large (${sizeMB}MB). Maximum allowed size is 5MB.`);
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Auto-upload
    await performUpload(file);
  };

  const performUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(10);
    setUploadError("");

    try {
      const meta = await api.uploadImage(file, {
        onProgress: (percent) => setUploadProgress(Math.max(10, percent)),
      });
      setUploadedImageUrl(meta.secureUrl || meta.url);
      setUploadedImageMeta(meta);
      setUploadProgress(100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image. Please try again or provide an image URL.";
      setUploadError(msg);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadedImageUrl("");
    setUploadedImageMeta(null);
    setUploadProgress(0);
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !address.trim()) {
      setError("Please fill in title, description, and street address.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      let reporterInfo: any = undefined;
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("nivaran-user");
        if (stored) {
          try {
            const u = JSON.parse(stored);
            reporterInfo = {
              id: u.id || u._id,
              name: u.name,
              email: u.email,
              phone: u.phone,
            };
          } catch {}
        }
      }

      let finalImages: string[] = [];
      let finalDetails: ImageMetadata[] = [];

      if (imageInputMode === "upload") {
        if (uploadedImageUrl) {
          finalImages = [uploadedImageUrl];
          if (uploadedImageMeta) finalDetails = [uploadedImageMeta];
        }
      } else {
        if (imageUrl.trim()) {
          finalImages = [imageUrl.trim()];
        }
      }

      const payload: Partial<Issue> = {
        title: title.trim(),
        description: description.trim(),
        category,
        location: {
          address: address.trim(),
          area: area.trim() || "Local Ward",
          city: city.trim() || "Lucknow",
          pincode: pincode.trim() || "226001",
          ...(coordinates ? { coordinates } : {}),
        },
        images: finalImages,
        imageDetails: finalDetails,
        reporter: reporterInfo,
        reporterId: reporterInfo?.id,
      };

      const created = await api.createIssue(payload);
      onSuccess(created);
      setLastSubmittedId(created.id || created._id || `issue-${Date.now()}`);

      // Reset form
      setTitle("");
      setDescription("");
      setAddress("");
      setArea("");
      setImageUrl("");
      handleRemoveImage();
      setCoordinates(null);
      setLocationStatus("idle");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to report issue";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (lastSubmittedId) {
    return (
      <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 space-y-4 animate-in fade-in">
        <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-200">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl">
            ✓
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Grievance Registered Successfully!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Dispatched to municipal routing queue.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Official Reference ID:
            </span>
            <div className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
              #{lastSubmittedId}
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 rounded-lg">
            Trackable
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Use this reference to track dispatch progress, inspection notes, and confirm the fix once repairs are completed.
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setLastSubmittedId(null)}
          className="w-full"
        >
          + File Another Complaint
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Category Selection Grid with icons */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Select Problem Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                category === cat.id
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-2xs scale-102"
                  : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span className="text-xs leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Complaint Title"
        placeholder="e.g. Major water pipeline bursting near Sector B market"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Incident Location Block - Sleek & Modern UI */}
      <div className="space-y-3">
        {/* Street Address Input with single elegant header action */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Street Address & Landmark *
            </label>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer group"
            >
              {isLocating ? (
                <>
                  <span className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span>Locating GPS...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Use current location</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Near Metro Pillar 42, MG Marg"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
              required
            />
          </div>

          {/* Minimalist GPS Status Badge */}
          {coordinates && (
            <div className="mt-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                GPS Locked: {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
                {accuracy ? ` (±${accuracy}m)` : ""}
              </span>
              <button
                type="button"
                onClick={handleClearGPS}
                className="text-[11px] font-semibold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
              >
                ✕ Clear
              </button>
            </div>
          )}

          {locationStatus === "error" && (
            <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
              {locationMsg}
            </p>
          )}
        </div>

        {/* Clean Secondary Location Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Neighborhood / Ward"
            placeholder="e.g. Hazratganj"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />

          <Input
            label="City"
            placeholder="e.g. Lucknow"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <Input
            label="Pincode"
            placeholder="e.g. 226001"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Detailed Description of the Issue
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide details about severity, road hazards, duration of issue, etc..."
          className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
          required
        />
      </div>

      {/* Photo Proof Section (Upload or URL) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Photo Proof Evidence <span className="text-slate-400 font-normal normal-case">(Optional)</span>
          </label>
          {/* Segmented Mode Switcher */}
          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setImageInputMode("upload")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                imageInputMode === "upload"
                  ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              📷 Upload Photo
            </button>
            <button
              type="button"
              onClick={() => setImageInputMode("url")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                imageInputMode === "url"
                  ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              🔗 Image URL
            </button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading || isSubmitting}
        />

        {imageInputMode === "upload" ? (
          <div>
            {!previewUrl ? (
              /* Drop / Click Trigger Area */
              <div
                onClick={handleTriggerFileInput}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/50 group"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📸
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <span className="text-emerald-600 dark:text-emerald-400 hover:underline">Choose Image</span> or take photo
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, PNG, WEBP (Max 5MB). Photo proof is optional.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors">
                  <span>📁 Choose Image / Upload Photo</span>
                </div>
              </div>
            ) : (
              /* Image Selected & Preview Card */
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3.5 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <img
                      src={previewUrl}
                      alt="Selected issue preview"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs">
                        {selectedFile?.name || "Selected photo"}
                      </p>
                      {selectedFile && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}
                        </p>
                      )}

                      {/* Status Badges */}
                      <div className="mt-1.5">
                        {isUploading ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                            <span className="w-2.5 h-2.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            Uploading to Cloudinary... ({uploadProgress}%)
                          </span>
                        ) : uploadedImageUrl ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                            ✓ Uploaded to Cloudinary
                          </span>
                        ) : uploadError ? (
                          <span className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                            ⚠️ Upload failed
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {uploadError && selectedFile && (
                      <button
                        type="button"
                        onClick={() => performUpload(selectedFile)}
                        disabled={isUploading}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                      >
                        ↻ Retry
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleTriggerFileInput}
                      disabled={isUploading}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={isUploading}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {isUploading && (
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {uploadError && (
              <div className="mt-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
                <span>⚠️ {uploadError}</span>
              </div>
            )}
          </div>
        ) : (
          /* URL Input Option */
          <div>
            <Input
              label=""
              placeholder="https://images.unsplash.com/... or paste image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              helperText="Enter a publicly accessible web image URL."
            />
            {imageUrl && (
              <div className="mt-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 max-w-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Preview
                </span>
                <img
                  src={imageUrl}
                  alt="URL Preview"
                  className="w-full h-28 object-cover rounded-lg"
                  onError={() => {}}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-2 flex items-center justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
          Submit Grievance →
        </Button>
      </div>
    </form>
  );
};
