"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await api.register(name, email, password, phone);
      router.push("/citizen");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-md mx-auto px-4 py-12 w-full flex flex-col justify-center">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Join Nivaran
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Create Citizen Account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Report civic complaints and verify municipal solutions in your ward.
            </p>
          </div>

          {error && (
            <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Mobile Number"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              label="Password (min. 6 characters)"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
              Register as Citizen →
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
