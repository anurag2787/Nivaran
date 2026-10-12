"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { mockSchemes } from "@/services/mockData";
import { Scheme } from "@/types";

export default function SchemesPage() {
  const [schemes] = useState<Scheme[]>(mockSchemes);
  const [search, setSearch] = useState("");

  const filtered = schemes.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Banner */}
        <div className="mb-8 p-8 rounded-3xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-lg">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-300 border border-emerald-700 mb-2">
            Public Civic Entitlements
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-white">
            Government Welfare Scheme Discovery
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Find and explore central & state citizen assistance initiatives, housing grants, sanitation subsidies, and infrastructure programs.
          </p>

          <div className="mt-6 max-w-md">
            <input
              type="text"
              placeholder="Search schemes by name, domain, or ministry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-xs font-medium"
            />
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((scheme) => (
            <Card key={scheme.id} className="flex flex-col justify-between hover:shadow-lg transition-all border-2">
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      {scheme.category}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{scheme.ministry}</span>
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
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Eligibility Requirements:
                    </h4>
                    <ul className="space-y-1">
                      {scheme.eligibility.map((el, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-200 flex items-start gap-1.5 font-medium">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{el}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {scheme.benefits && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Key Entitlements:
                      </h4>
                      <ul className="space-y-1">
                        {scheme.benefits.map((b, idx) => (
                          <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                            <span className="text-amber-500 font-bold shrink-0">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </div>

              <CardFooter className="flex items-center justify-between">
                <Link
                  href={`/schemes/${scheme.id}`}
                  className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  View Full Criteria →
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
      </main>

      <Footer />
    </div>
  );
}
