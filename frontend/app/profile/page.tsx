"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User } from "@/types";
import { api } from "@/services/api";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const current = await api.getMe();
      if (current) {
        setUser(current);
        setName(current.name);
        setPhone(current.phone || "");
      } else {
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");
    try {
      const updated = await api.updateProfile({ name, phone });
      setUser(updated);
      setMessage("Profile updated successfully!");
    } catch {
      setMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Account Profile</h1>
            <p className="text-xs text-slate-500">Manage your contact information and credentials.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-rose-600 border-rose-300">
            Log Out
          </Button>
        </div>

        {message && (
          <div className="mb-4 p-3 text-xs bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-xl font-medium">
            {message}
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{name || "User"}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">{user?.email}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {user?.role || "citizen"}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email (Fixed)"
                value={user?.email || ""}
                disabled
                helperText="Email is permanently bound to your municipal audit identity."
              />

              <Input
                label="Contact Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 ..."
              />

              {user?.role === "officer" && (
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Official Department & Organization
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Admin Designated
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {user.departmentName || "Public Works Department (PWD)"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Department Code: <strong className="font-mono text-blue-600 dark:text-blue-400">{user.departmentCode || "PWD"}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-blue-100 dark:border-blue-900/60">
                    Note: Department jurisdictions are assigned exclusively by Municipal Administration. To transfer or reallocate, contact the city admin desk.
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
