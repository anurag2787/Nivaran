"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { user } = await api.login(email, password);
      // Role-specific dashboard redirection (Workstream A requirement)
      if (user.role === "admin") {
        router.push("/admin");
      } else if (user.role === "officer") {
        router.push("/officer");
      } else {
        router.push("/citizen");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid credentials";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (role: "citizen" | "officer" | "admin") => {
    setEmail(`${role}@example.com`);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-md mx-auto px-4 py-12 w-full flex flex-col justify-center">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Welcome Back
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Log In to Nivaran
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access your grievances, task queue, or department oversight.
            </p>
          </div>

          {error && (
            <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
              Sign In →
            </Button>
          </form>

          {/* Quick Demo Credentials for Reviewers */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
              Quick Demo Accounts
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemo("citizen")}
                className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-200 text-center transition-colors cursor-pointer"
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => fillDemo("officer")}
                className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-200 text-center transition-colors cursor-pointer"
              >
                Officer
              </button>
              <button
                type="button"
                onClick={() => fillDemo("admin")}
                className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-200 text-center transition-colors cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            Don't have a citizen account?{" "}
            <Link href="/register" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
