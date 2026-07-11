"use client";

import { Step } from "@/types";

const STEPS: { key: Step; label: string }[] = [
  { key: "upload", label: "Upload" },
  { key: "preview", label: "Preview" },
  { key: "processing", label: "Processing" },
  { key: "results", label: "Results" },
];

const ORDER: Step[] = ["upload", "preview", "processing", "results"];

interface StepIndicatorProps {
  current: Step;
}

export function StepIndicator({ current }: StepIndicatorProps) {
  const currentIdx = ORDER.indexOf(current);

  return (
    <nav aria-label="Import steps" className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const status =
          i < currentIdx ? "done" : i === currentIdx ? "active" : "upcoming";

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex items-center gap-2">
              <span
                className={[
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold font-display transition-colors",
                  status === "done"
                    ? "bg-signal text-white"
                    : status === "active"
                    ? "bg-signal text-white ring-4 ring-signal/20"
                    : "bg-border dark:bg-border-dark text-slate-400",
                ].join(" ")}
                aria-current={status === "active" ? "step" : undefined}
              >
                {status === "done" ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7l3.5 3.5L12 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={[
                  "text-sm font-medium hidden sm:block",
                  status === "active"
                    ? "text-signal"
                    : status === "done"
                    ? "text-ink dark:text-slate-200"
                    : "text-slate-400",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "w-8 sm:w-12 h-px mx-2 transition-colors",
                  i < currentIdx
                    ? "bg-signal"
                    : "bg-border dark:bg-border-dark",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
