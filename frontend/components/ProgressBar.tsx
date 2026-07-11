"use client";

interface ProgressBarProps {
  done: number;
  total: number;
}

export function ProgressBar({ done, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-600 dark:text-slate-300 font-medium">
          Processing batches…
        </span>
        <span className="font-mono text-signal font-semibold tabular-nums">
          {done} / {total}
        </span>
      </div>
      <div
        className="w-full h-2 bg-border dark:bg-border-dark rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% complete`}
      >
        <div
          className="h-full bg-signal rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 text-right">{pct}%</p>
    </div>
  );
}
