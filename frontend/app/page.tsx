"use client";

import { useState, useCallback, useRef } from "react";
import { Step, RawCsvRow, ImportResult, UploadResponse } from "@/types";
import { parsePreview } from "@/lib/csvParser";
import { uploadCsv, streamImport } from "@/lib/api";

import { StepIndicator } from "@/components/StepIndicator";
import { UploadZone } from "@/components/UploadZone";
import { DataTable } from "@/components/DataTable";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultsTable } from "@/components/ResultsTable";
import { SkippedPanel } from "@/components/SkippedPanel";
import { SummaryBar } from "@/components/SummaryBar";

const CRM_FIELD_SET = new Set([
  "created_at","name","email","country_code","mobile_without_country_code",
  "company","city","state","country","lead_owner","crm_status","crm_note",
  "data_source","possession_time","description",
]);

export default function Home() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<RawCsvRow[]>([]);
  const [uploadInfo, setUploadInfo] = useState<UploadResponse | null>(null);
  const [batchesDone, setBatchesDone] = useState(0);
  const [batchesTotal, setBatchesTotal] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const abortRef = useRef<(() => void) | null>(null);

  const handleFile = useCallback(async (f: File) => {
    setError(null);
    setFile(f);
    try {
      const { headers, rows } = await parsePreview(f);
      setHeaders(headers);
      setPreviewRows(rows);
      setStep("preview");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse file.");
    }
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      const info = await uploadCsv(file);
      setUploadInfo(info);
      setBatchesDone(0);
      setBatchesTotal(info.totalBatches);
      setStep("processing");
      setUploading(false);

      const cancel = streamImport(
        info.jobId,
        (done, total) => {
          setBatchesDone(done);
          setBatchesTotal(total);
        },
        (res) => {
          setResult(res);
          setStep("results");
        },
        (msg) => {
          setError(msg);
          setStep("preview");
        }
      );
      abortRef.current = cancel;
    } catch (e) {
      setUploading(false);
      setError(e instanceof Error ? e.message : "Upload failed.");
    }
  }, [file]);

  const handleReset = useCallback(() => {
    abortRef.current?.();
    setStep("upload");
    setFile(null);
    setHeaders([]);
    setPreviewRows([]);
    setUploadInfo(null);
    setBatchesDone(0);
    setBatchesTotal(0);
    setResult(null);
    setError(null);
    setUploading(false);
  }, []);

  return (
    <div className="min-h-screen bg-paper dark:bg-ink">
      {/* Header */}
      <header className="border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-signal flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold font-display text-ink dark:text-slate-100 text-lg tracking-tight">
              GrowEasy
              <span className="ml-2 text-sm font-medium text-slate-400 hidden sm:inline">
                CSV Importer
              </span>
            </span>
          </div>
          <StepIndicator current={step} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Error banner */}
        {error && (
          <div className="rounded-xl bg-danger-dim dark:bg-danger-darkDim border border-danger/30 px-5 py-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-danger mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
            <div className="flex-1">
              <p className="text-danger font-semibold text-sm font-display">Something went wrong</p>
              <p className="text-danger/80 text-sm mt-0.5">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-danger/60 hover:text-danger">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}

        {/* ── Step 1: Upload ── */}
        {step === "upload" && (
          <section className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold font-display text-ink dark:text-slate-100">
                Import leads from any CSV
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                Upload a CSV from Facebook Ads, Google Ads, real-estate CRMs, Excel exports — any format.
                AI maps your columns to GrowEasy's CRM fields automatically.
              </p>
            </div>
            <UploadZone onFile={handleFile} />
          </section>
        )}

        {/* ── Step 2: Preview ── */}
        {step === "preview" && (
          <section className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-bold font-display text-ink dark:text-slate-100">
                  Preview — {file?.name}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                  {previewRows.length} row{previewRows.length !== 1 ? "s" : ""} · {headers.length} columns
                  {" · "}
                  <span className="text-slate-400">No AI processing yet</span>
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-slate-500 hover:text-danger transition-colors"
              >
                ← Upload different file
              </button>
            </div>

            <DataTable
              headers={headers}
              rows={previewRows}
              highlightCols={CRM_FIELD_SET}
              maxHeight="400px"
            />

            <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Column names highlighted in{" "}
                <span className="text-signal font-semibold">blue</span> already match CRM fields.
                Other columns will be mapped by AI.
              </p>
              <button
                onClick={handleConfirm}
                disabled={uploading}
                className="px-6 py-2.5 rounded-xl bg-signal text-white font-semibold font-display text-sm hover:bg-signal/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                )}
                {uploading ? "Uploading…" : "Confirm & Import"}
              </button>
            </div>
          </section>
        )}

        {/* ── Step 3: Processing ── */}
        {step === "processing" && (
          <section className="space-y-8">
            <div>
              <h2 className="text-xl font-bold font-display text-ink dark:text-slate-100">
                Mapping {uploadInfo?.totalRows.toLocaleString()} rows with AI…
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                Claude is reading your CSV headers, inferring intent, and converting each row to GrowEasy format.
              </p>
            </div>

            <div className="bg-surface dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark p-8">
              <ProgressBar done={batchesDone} total={batchesTotal} />

              {/* Animated processing card */}
              <div className="mt-8 flex items-center gap-4 text-slate-400 text-sm">
                <div className="flex gap-1">
                  {[0,1,2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-signal animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
                <span>
                  Batch {Math.min(batchesDone + 1, batchesTotal)} of {batchesTotal} — extracting CRM fields
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ── Step 4: Results ── */}
        {step === "results" && result && (
          <section className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-bold font-display text-ink dark:text-slate-100">
                  Import complete
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                  AI extracted and mapped your leads to GrowEasy CRM format.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl border border-border dark:border-border-dark text-sm font-medium font-display text-ink dark:text-slate-200 hover:bg-signal-dim dark:hover:bg-signal-darkDim hover:border-signal/40 transition-all"
              >
                Import another file
              </button>
            </div>

            <SummaryBar result={result} />

            <div className="space-y-3">
              <h3 className="font-semibold font-display text-ink dark:text-slate-100 text-sm">
                Imported records
              </h3>
              <ResultsTable records={result.records} />
            </div>

            <SkippedPanel skipped={result.skipped} />
          </section>
        )}
      </main>
    </div>
  );
}
