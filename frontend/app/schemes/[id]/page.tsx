"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Scheme } from "@/types";
import { api } from "@/services/api";

export default function SingleSchemePage() {
  const params = useParams();
  const id = params?.id as string;
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const s = await api.getSchemeById(id);
      setScheme(s);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
        <Navbar />
        <div className="p-12 text-center text-slate-500 text-sm">Loading scheme...</div>
        <Footer />
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
        <Navbar />
        <div className="p-12 text-center text-slate-500 space-y-4">
          <h2 className="text-xl font-bold">Scheme Not Found</h2>
          <Link href="/schemes" className="text-emerald-600 font-bold hover:underline">
            ← Return to Schemes Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full space-y-8">
        <div>
          <Link href="/schemes" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline mb-2 inline-block">
            ← Back to All Welfare Schemes
          </Link>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                {scheme.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">{scheme.ministry}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {scheme.title}
            </h1>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Overview & Objective
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                {scheme.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Eligibility Requirements Checklist
              </h3>
              <ul className="space-y-2">
                {scheme.eligibility.map((el, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 flex items-start gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-emerald-600 font-bold text-base shrink-0">✓</span>
                    <span>{el}</span>
                  </li>
                ))}
              </ul>
            </div>

            {scheme.benefits && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Key Citizen Entitlements & Subsidies
                </h3>
                <ul className="space-y-2">
                  {scheme.benefits.map((b, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 flex items-start gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-amber-500 font-bold text-base shrink-0">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Verified Official Portal Link</span>
            <a
              href={scheme.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Apply on Ministry Portal</span>
              <span>→</span>
            </a>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
