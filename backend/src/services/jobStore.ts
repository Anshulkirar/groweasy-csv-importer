import { randomUUID } from "crypto";
import { ImportResult, RawCsvRow } from "../types/crm";

export type JobStatus = "pending" | "processing" | "done" | "error";

export interface ImportJob {
  id: string;
  status: JobStatus;
  rows: RawCsvRow[];
  totalBatches: number;
  batchesDone: number;
  result?: ImportResult;
  error?: string;
  createdAt: number;
}

const JOB_TTL_MS = 30 * 60 * 1000; // 30 minutes


class JobStore {
  private jobs = new Map<string, ImportJob>();

  create(rows: RawCsvRow[], totalBatches: number): ImportJob {
    this.sweepExpired();
    const job: ImportJob = {
      id: randomUUID(),
      status: "pending",
      rows,
      totalBatches,
      batchesDone: 0,
      createdAt: Date.now(),
    };
    this.jobs.set(job.id, job);
    return job;
  }

  get(id: string): ImportJob | undefined {
    return this.jobs.get(id);
  }

  private sweepExpired() {
    const now = Date.now();
    for (const [id, job] of this.jobs) {
      if (now - job.createdAt > JOB_TTL_MS) {
        this.jobs.delete(id);
      }
    }
  }
}

export const jobStore = new JobStore();
