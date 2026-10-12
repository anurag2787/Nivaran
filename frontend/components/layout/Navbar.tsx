"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "../theme/ThemeToggle";
import { User, UserRole } from "@/types";
import { api } from "@/services/api";

interface NavbarProps {
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nivaran-user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch {}
      }
    }
  }, []);

  const role = currentUser?.role;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark (Leftmost) */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Nivaran<span className="text-emerald-600">.</span>
              </span>
            </Link>

            {/* Navigation links dynamically based on logged in user role */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
              <Link
                href="/issues"
                className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Explore Issues
              </Link>

              {/* Citizen or Admin or Unauthenticated visitor sees Citizen Portal */}
              {(!role || role === "citizen" || role === "admin") && (
                <Link
                  href="/citizen"
                  className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Citizen Portal
                </Link>
              )}

              {/* Officer or Admin sees Officer Taskboard */}
              {(role === "officer" || role === "admin") && (
                <Link
                  href="/officer"
                  className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Officer Taskboard
                </Link>
              )}

              {/* Only Admin sees Administration */}
              {role === "admin" && (
                <Link
                  href="/admin"
                  className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Administration
                </Link>
              )}

              <Link
                href="/schemes"
                className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Gov Schemes
              </Link>

              <Link
                href="/transparency"
                className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Transparency
              </Link>
            </nav>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 py-1 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors text-xs font-bold"
                  title="Profile & Account"
                >
                  <span
                    className={`w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-[10px] uppercase shadow-xs ${
                      role === "admin"
                        ? "bg-purple-600"
                        : role === "officer"
                        ? "bg-blue-600"
                        : "bg-emerald-600"
                    }`}
                  >
                    {currentUser.name ? currentUser.name.charAt(0) : "U"}
                  </span>
                  <span className="hidden sm:inline truncate max-w-[110px]">{currentUser.name}</span>
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-wider ${
                      role === "admin"
                        ? "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                        : role === "officer"
                        ? "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    }`}
                  >
                    {role}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Role-tailored primary action button */}
            {role === "officer" ? (
              <Link
                href="/officer"
                className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/25 transition-all hover:scale-102 active:scale-98"
              >
                Tasks Board →
              </Link>
            ) : role === "admin" ? (
              <Link
                href="/admin"
                className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-600/25 transition-all hover:scale-102 active:scale-98"
              >
                Admin Desk →
              </Link>
            ) : (
              <Link
                href="/citizen/report"
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/25 transition-all hover:scale-102 active:scale-98"
              >
                + File Grievance
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle Navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-3 bg-white dark:bg-slate-900 space-y-2 text-xs font-bold tracking-wide">
          <Link
            href="/issues"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-200 hover:text-emerald-600"
          >
            Explore Issues
          </Link>

          {(!role || role === "citizen" || role === "admin") && (
            <Link
              href="/citizen"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 dark:text-slate-200 hover:text-emerald-600"
            >
              Citizen Portal
            </Link>
          )}

          {(role === "officer" || role === "admin") && (
            <Link
              href="/officer"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 dark:text-slate-200 hover:text-emerald-600"
            >
              Officer Taskboard
            </Link>
          )}

          {role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 dark:text-slate-200 hover:text-purple-600"
            >
              Administration
            </Link>
          )}

          <Link
            href="/schemes"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-200 hover:text-emerald-600"
          >
            Gov Schemes
          </Link>

          <Link
            href="/transparency"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-200 hover:text-emerald-600"
          >
            Public Transparency
          </Link>

          {currentUser ? (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-slate-700 dark:text-slate-200 hover:text-emerald-600 font-bold"
              >
                Profile ({currentUser.name} · {role})
              </Link>
              <button
                type="button"
                onClick={() => {
                  api.logout();
                  setCurrentUser(null);
                  setMobileMenuOpen(false);
                  window.location.href = "/login";
                }}
                className="block w-full text-left py-1.5 text-rose-600 dark:text-rose-400 font-bold cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
