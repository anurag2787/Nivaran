"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-2xs ${className}`}
      >
        <span>☀️</span>
        <span className="hidden sm:inline">Theme</span>
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs text-xs font-bold ${
        isDark
          ? "bg-slate-900 hover:bg-slate-800 border-slate-700 text-amber-400"
          : "bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:text-slate-900"
      } ${className}`}
      title={`Currently in ${isDark ? "Dark" : "Light"} mode. Click to switch.`}
    >
      {isDark ? (
        <>
          <svg
            className="w-4 h-4 text-amber-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className="hidden sm:inline font-bold text-slate-200">Dark</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4 text-slate-700 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          <span className="hidden sm:inline font-bold text-slate-800">Light</span>
        </>
      )}
    </button>
  );
};
