"use client";

import React, { useState } from "react";
import { Issue, IssueCategory } from "@/types";
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

  const [imageUrl, setImageUrl] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !address.trim()) {
      setError("Please fill in title, description, and street address.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
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
        images: imageUrl.trim()
          ? [imageUrl.trim()]
          : [
              "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=60",
            ],
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

      <Input
        label="Photo Proof URL (Optional)"
        placeholder="https://images.unsplash.com/..."
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        helperText="In production, citizens take or upload photos directly from mobile camera."
      />

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
