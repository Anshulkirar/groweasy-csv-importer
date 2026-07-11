"use client";

import { useState } from "react";
import { SkippedRecord } from "@/types";

interface SkippedPanelProps {
  skipped: SkippedRecord[];
}

export function SkippedPanel({ skipped }: SkippedPanelProps) {
  const [open, setOpen] = useState(false);

  if (skipped.length === 0) return null;

  return (
    <div className="rounded-xl border border-warn/40 dark:border-warn/30 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-warn-dim dark:bg-warn-darkDim text-left"
        aria-expanded={open}
      >
        <span className="font-semibold font-display text-warn text-sm">
          {skipped.length} row{skipped.length !== 1 ? "s" : ""} skipped
        </span>
        <svg
          className={`w-4 h-4 text-warn transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="overflow-auto scrollbar-thin" style={{ maxHeight: "300px" }}>
          <table className="min-w-full text-xs border-collapse">
            <thead className="sticky top-0 bg-warn-dim dark:bg-warn-darkDim z-10">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-warn border-b border-warn/20 uppercase tracking-wide">
                  Row #
                </th>
                <th className="px-4 py-2 text-left font-semibold text-warn border-b border-warn/20 uppercase tracking-wide">
                  Reason
                </th>
                <th className="px-4 py-2 text-left font-semibold text-warn border-b border-warn/20 uppercase tracking-wide">
                  Raw data
                </th>
              </tr>
            </thead>
            <tbody>
              {skipped.map((s) => (
                <tr
                  key={s.rowIndex}
                  className="border-b border-warn/10 last:border-0 bg-surface dark:bg-surface-dark hover:bg-warn-dim/40"
                >
                  <td className="px-4 py-2 text-warn font-mono">{s.rowIndex + 1}</td>
                  <td className="px-4 py-2 text-slate-600 dark:text-slate-300">
                    {s.reason}
                  </td>
                  <td className="px-4 py-2 text-slate-500 dark:text-slate-400 max-w-[400px]">
                    <span className="font-mono truncate block" title={JSON.stringify(s.raw)}>
                      {Object.entries(s.raw)
                        .filter(([, v]) => v)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(" · ")
                        .slice(0, 120)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
