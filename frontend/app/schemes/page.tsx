"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { mockSchemes } from "@/services/mockData";
import { api } from "@/services/api";
import { Scheme } from "@/types";

const SCHEME_CATEGORIES = [
  { label: "All Schemes", value: "All", icon: "🇮🇳" },
  { label: "Housing & Urban", value: "Housing", icon: "🏠" },
  { label: "Water Supply", value: "Water Supply", icon: "💧" },
  { label: "Sanitation & Cleanliness", value: "Sanitation", icon: "🧹" },
  { label: "Healthcare & Medicine", value: "Healthcare", icon: "🏥" },
  { label: "Education & Skills", value: "Education", icon: "🎓" },
  { label: "Social Welfare & Women", value: "Social Welfare", icon: "👵" },
  { label: "Employment & Agriculture", value: "Employment", icon: "💼" },
];

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>(mockSchemes);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    api
      .getSchemes({
        category: selectedCategory === "All" ? undefined : selectedCategory,
        search: search.trim() || undefined,
      })
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setSchemes(data);
        }
      })
      .catch((err) => {
        console.warn("Error fetching schemes from API, using fallback:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, search]);

  const filtered = useMemo(() => {
    return schemes.filter((s) => {
      const matchesCategory =
        selectedCategory === "All" ||
        s.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.ministry.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [schemes, selectedCategory, search]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Banner */}
        <div className="mb-8 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800/80 text-emerald-300 border border-emerald-700 mb-3">
              Official Welfare Initiatives • Digital India
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 text-white">
              Government Welfare Scheme Discovery
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Explore 60 verified central & state citizen assistance initiatives, housing subsidies, clean water missions, healthcare benefits, and educational grants.
            </p>

            <div className="mt-6 max-w-xl flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search schemes by name, keyword, or ministry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-xs font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Browse by Department Domain
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Showing {filtered.length} of {schemes.length} schemes
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SCHEME_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-102"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Schemes Grid */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500">Loading verified government schemes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <span className="text-4xl block">🔍</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No matching government schemes found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn&apos;t find any schemes matching &ldquo;{search}&rdquo; in the selected category. Try selecting &ldquo;All Schemes&rdquo; or adjusting your search term.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearch("");
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((scheme) => (
              <Card
                key={scheme.id || (scheme as any)._id}
                className="flex flex-col justify-between hover:shadow-lg transition-all border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <div>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                        {scheme.category}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate max-w-[200px]" title={scheme.ministry}>
                        {scheme.ministry}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {scheme.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {scheme.description}
                    </p>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                        <span>Eligibility Criteria:</span>
                      </h4>
                      <ul className="space-y-1">
                        {scheme.eligibility.slice(0, 3).map((el, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-700 dark:text-slate-200 flex items-start gap-1.5 font-medium"
                          >
                            <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            <span className="leading-tight">{el}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {scheme.benefits && scheme.benefits.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Key Entitlements:
                        </h4>
                        <ul className="space-y-1">
                          {scheme.benefits.slice(0, 2).map((b, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5"
                            >
                              <span className="text-amber-500 font-bold shrink-0">•</span>
                              <span className="leading-tight">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </div>

                <CardFooter className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={`/schemes/${scheme.id || (scheme as any)._id}`}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    View Details →
                  </Link>
                  <a
                    href={scheme.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Apply Online ↗
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
