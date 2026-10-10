"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-primary)] text-[var(--text-main)] hover:bg-[var(--surface-elevated)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent-civic)] cursor-pointer shadow-2xs text-xs font-semibold ${className}`}
      title={`Currently in ${resolvedTheme} mode. Click to toggle.`}
    >
      {resolvedTheme === "dark" ? (
        <>
          <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className="hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 text-slate-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          <span className="hidden sm:inline">Light</span>
        </>
      )}
    </button>
  );
};
