"use client";

import React, { useState } from "react";
import { Issue, IssueCategory } from "@/types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

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
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !address.trim()) {
      setError("Please fill in title, description, and street address.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const generatedId = `issue-${Math.floor(1000 + Math.random() * 9000)}`;
      const newIssue: Issue = {
        id: generatedId,
        _id: generatedId,
        title,
        description,
        category,
        status: "submitted",
        location: {
          address,
          area: area || "Local Ward",
          city: "Lucknow",
          pincode: "226001",
        },
        images: imageUrl
          ? [imageUrl]
          : [
              "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=60",
            ],
        resolutionImages: [],
        supportCount: 1,
        timeline: [
          {
            status: "submitted",
            remarks: `Citizen filed grievance via Nivaran portal (Ref: #${generatedId})`,
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onSuccess(newIssue);
      setLastSubmittedId(generatedId);

      // Reset
      setTitle("");
      setDescription("");
      setAddress("");
      setArea("");
      setImageUrl("");
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Category Selection Grid with icons */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Select Problem Category:
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Neighborhood / Ward Area"
          placeholder="e.g. Hazratganj / Vikas Nagar"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <Input
          label="Specific Street / Landmark"
          placeholder="e.g. Opposite Metro Pillar 42"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
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
