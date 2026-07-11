"use client";

import { CrmRecord } from "@/types";
import { StatusBadge } from "./StatusBadge";

interface ResultsTableProps {
  records: CrmRecord[];
}

const COLS: { key: keyof CrmRecord; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "mobile_without_country_code", label: "Mobile" },
  { key: "company", label: "Company" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
  { key: "crm_status", label: "Status" },
  { key: "lead_owner", label: "Lead Owner" },
  { key: "data_source", label: "Source" },
  { key: "created_at", label: "Created At" },
  { key: "crm_note", label: "Notes" },
];

export function ResultsTable({ records }: ResultsTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-400 text-sm border border-dashed border-border dark:border-border-dark rounded-xl">
        No records were imported.
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border border-border dark:border-border-dark overflow-auto scrollbar-thin"
      style={{ maxHeight: "520px" }}
    >
      <table className="min-w-full text-sm border-collapse">
        <thead className="sticky top-0 z-10 bg-paper dark:bg-ink">
          <tr>
            {COLS.map((c) => (
              <th
                key={c.key}
                className="px-4 py-3 text-left font-semibold font-display whitespace-nowrap border-b border-border dark:border-border-dark text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((rec, ri) => (
            <tr
              key={ri}
              className={[
                "transition-colors",
                ri % 2 === 0
                  ? "bg-surface dark:bg-surface-dark"
                  : "bg-paper dark:bg-ink",
                "hover:bg-signal-dim dark:hover:bg-signal-darkDim",
              ].join(" ")}
            >
              {COLS.map((c) => (
                <td
                  key={c.key}
                  className="px-4 py-2.5 border-b border-border/50 dark:border-border-dark/50 max-w-[220px]"
                >
                  {c.key === "crm_status" ? (
                    <StatusBadge status={rec.crm_status} />
                  ) : (
                    <span
                      className="block truncate text-ink dark:text-slate-200"
                      title={rec[c.key]}
                    >
                      {rec[c.key] || (
                        <span className="text-slate-300 dark:text-slate-600 italic">—</span>
                      )}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
