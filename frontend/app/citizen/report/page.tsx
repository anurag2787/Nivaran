"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { IssueReportForm } from "@/components/forms/IssueReportForm";
import { Issue } from "@/types";

export default function CitizenReportPage() {
  const router = useRouter();
  const [createdIssue, setCreatedIssue] = useState<Issue | null>(null);

  const handleSuccess = (newIssue: Issue) => {
    setCreatedIssue(newIssue);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-10 w-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/citizen" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline mb-1 inline-block">
              ← Back to Citizen Workspace
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Report a Civic Issue
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              File municipal issues with photo evidence for direct dispatch to responsible agencies.
            </p>
          </div>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Grievance Registration Form
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <IssueReportForm
              onSuccess={handleSuccess}
              onCancel={() => router.push("/citizen")}
            />
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
