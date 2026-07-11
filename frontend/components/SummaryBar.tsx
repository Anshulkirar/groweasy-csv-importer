"use client";

import { ImportResult } from "@/types";

interface SummaryBarProps {
  result: ImportResult;
}

export function SummaryBar({ result }: SummaryBarProps) {
  const stats = [
    {
      label: "Total rows",
      value: result.totalRows,
      classes: "text-ink dark:text-slate-100",
      bg: "bg-surface dark:bg-surface-dark border border-border dark:border-border-dark",
    },
    {
      label: "Imported",
      value: result.totalImported,
      classes: "text-success",
      bg: "bg-success-dim dark:bg-success-darkDim",
    },
    {
      label: "Skipped",
      value: result.totalSkipped,
      classes: result.totalSkipped > 0 ? "text-warn" : "text-slate-400",
      bg:
        result.totalSkipped > 0
          ? "bg-warn-dim dark:bg-warn-darkDim"
          : "bg-surface dark:bg-surface-dark border border-border dark:border-border-dark",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className={`rounded-xl px-4 py-3 ${s.bg}`}>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">
            {s.label}
          </p>
          <p className={`text-2xl font-bold font-display tabular-nums ${s.classes}`}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
