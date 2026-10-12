import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs mt-20 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                नि
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Nivaran<span className="text-emerald-500">.</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              “Every voice deserves a response.”
            </p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              A transparent, community-grounded platform connecting citizens directly with responsible municipal departments.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/citizen" className="hover:text-emerald-400 transition-colors">
                  Citizen Grievance Workspace
                </Link>
              </li>
              <li>
                <Link href="/officer" className="hover:text-emerald-400 transition-colors">
                  Department Officer Taskboard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors">
                  Administrative Command Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Public Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/schemes" className="hover:text-emerald-400 transition-colors">
                  Central & State Welfare Schemes
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Municipal Citizen Charter & SLA</span>
              </li>
              <li>
                <span className="text-slate-500">Direct Public Escalation Matrix</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Civic Trust & Verification
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-400 mb-3">
              Independent audit trail with photo resolution proof before any complaint can be closed.
            </p>
            <div className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 inline-block font-semibold">
              Open Governance · Verified Resolution
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Nivaran Civic Grievance Resolution Platform.</p>
          <p>Empowering citizens, ensuring institutional accountability.</p>
        </div>
      </div>
    </footer>
  );
};
