import React from "react";
import { Card } from "../ui/Card";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
  subtitle,
}) => {
  return (
    <Card className="p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
          {value}
        </span>
        {change && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              changeType === "positive"
                ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800"
                : changeType === "negative"
                ? "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800"
                : "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800"
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{subtitle}</p>
      )}
    </Card>
  );
};
