"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";

interface UploadZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function UploadZone({ onFile, disabled }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragEnter = (e: DragEvent) => {
    handleDrag(e);
    setDragging(true);
  };
  const handleDragLeave = (e: DragEvent) => {
    handleDrag(e);
    setDragging(false);
  };
  const handleDrop = (e: DragEvent) => {
    handleDrag(e);
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validate(file);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validate(file);
    e.target.value = "";
  };

  function validate(file: File) {
    if (!file.name.toLowerCase().endsWith(".csv") && !file.type.includes("csv")) {
      alert("Please upload a .csv file.");
      return;
    }
    onFile(file);
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload CSV file"
      onDragEnter={handleDragEnter}
      onDragOver={handleDrag}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) inputRef.current?.click();
      }}
      className={[
        "relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer",
        "flex flex-col items-center justify-center gap-4 px-8 py-16 text-center",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2",
        dragging
          ? "border-signal bg-signal-dim dark:bg-signal-darkDim scale-[1.01]"
          : "border-border dark:border-border-dark hover:border-signal/60 bg-surface dark:bg-surface-dark",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv,application/vnd.ms-excel,text/plain"
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className={[
          "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
          dragging ? "bg-signal text-white" : "bg-signal-dim dark:bg-signal-darkDim text-signal",
        ].join(" ")}
      >
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" strokeWidth={1.5}>
          <path
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div>
        <p className="font-semibold font-display text-ink dark:text-slate-100 text-base">
          {dragging ? "Release to upload" : "Drop your CSV here"}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          or{" "}
          <span className="text-signal font-medium underline underline-offset-2">
            browse files
          </span>{" "}
          — any CSV format accepted
        </p>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
        <span>.csv</span>
        <span className="w-1 h-1 rounded-full bg-slate-300" />
        <span>Max 15 MB</span>
        <span className="w-1 h-1 rounded-full bg-slate-300" />
        <span>Up to 5 000 rows</span>
      </div>
    </div>
  );
}
