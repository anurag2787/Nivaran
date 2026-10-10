"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "../theme/ThemeToggle";
import { UserRole } from "@/types";

interface NavbarProps {
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole = "citizen",
  onRoleChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
              <Link
                href="/citizen"
                className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Citizen Portal
              </Link>
              <Link
                href="/officer"
                className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Officer Taskboard
              </Link>
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Administration
              </Link>
              <Link
                href="/schemes"
                className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Gov Schemes
              </Link>
            </nav>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {onRoleChange && (
              <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700">
                <span className="px-2 text-slate-400 dark:text-slate-500">View as:</span>
                {(["citizen", "officer", "admin"] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => onRoleChange(role)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                      currentRole === role
                        ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs border border-slate-200 dark:border-slate-700"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}

            <ThemeToggle />

            <Link
              href="/citizen#report"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/25 transition-all hover:scale-102 active:scale-98"
            >
              + File Grievance
            </Link>

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
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-3 bg-white dark:bg-slate-900 space-y-2 text-xs font-bold uppercase tracking-wider">
          <Link
            href="/citizen"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-200 hover:text-emerald-600"
          >
            Citizen Portal
          </Link>
          <Link
            href="/officer"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-200 hover:text-emerald-600"
          >
            Officer Taskboard
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-200 hover:text-emerald-600"
          >
            Administration
          </Link>
          <Link
            href="/schemes"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-200 hover:text-emerald-600"
          >
            Gov Schemes
          </Link>
        </div>
      )}
    </header>
  );
};
