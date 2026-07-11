"use client";

interface DataTableProps {
  headers: string[];
  rows: Record<string, string>[];
  highlightCols?: Set<string>;
  maxHeight?: string;
  emptyMessage?: string;
}

export function DataTable({
  headers,
  rows,
  highlightCols,
  maxHeight = "420px",
  emptyMessage = "No data",
}: DataTableProps) {
  if (headers.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className="relative rounded-xl border border-border dark:border-border-dark overflow-auto scrollbar-thin"
      style={{ maxHeight }}
    >
      <table className="min-w-full text-sm border-collapse">
        <thead className="sticky top-0 z-10 bg-paper dark:bg-ink">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className={[
                  "px-4 py-3 text-left font-semibold font-display whitespace-nowrap border-b border-border dark:border-border-dark text-xs uppercase tracking-wide",
                  highlightCols?.has(h)
                    ? "text-signal"
                    : "text-slate-500 dark:text-slate-400",
                ].join(" ")}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
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
              {headers.map((h) => (
                <td
                  key={h}
                  className="px-4 py-2.5 whitespace-nowrap text-ink dark:text-slate-200 max-w-[260px] truncate border-b border-border/50 dark:border-border-dark/50"
                  title={row[h] ?? ""}
                >
                  {row[h] ?? (
                    <span className="text-slate-300 dark:text-slate-600 italic">—</span>
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
