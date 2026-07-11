import { Router, Request, Response, NextFunction } from "express";
import { csvUpload } from "../middleware/upload";
import { ApiError } from "../middleware/errorHandler";
import { parseCsv } from "../services/csvService";
import { extractCrmRecords } from "../services/aiExtractionService";
import { jobStore } from "../services/jobStore";
import { CONFIG } from "../config/constants";

export const importRouter = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}


importRouter.post(
  "/upload",
  csvUpload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded. Attach a CSV file under the 'file' field.");
    }

    const rows = parseCsv(req.file.buffer);
    const totalBatches = Math.ceil(rows.length / CONFIG.BATCH_SIZE);
    const job = jobStore.create(rows, totalBatches);

    res.status(201).json({
      jobId: job.id,
      totalRows: rows.length,
      totalBatches,
      batchSize: CONFIG.BATCH_SIZE,
    });
  })
);


importRouter.get("/:jobId/stream", (req: Request, res: Response) => {
  const job = jobStore.get(req.params.jobId);

  if (!job) {
    res.status(404).json({ error: "Import job not found or expired." });
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  if (job.status === "done" && job.result) {
    send("progress", { batchesDone: job.totalBatches, batchesTotal: job.totalBatches });
    send("result", job.result);
    res.end();
    return;
  }

  if (job.status === "processing" || job.status === "pending") {
    job.status = "processing";
    send("progress", { batchesDone: job.batchesDone, batchesTotal: job.totalBatches });

    extractCrmRecords(job.rows, (p) => {
      job.batchesDone = p.batchesDone;
      send("progress", { batchesDone: p.batchesDone, batchesTotal: p.batchesTotal });
    })
      .then((result) => {
        job.status = "done";
        job.result = result;
        send("result", result);
        res.end();
      })
      .catch((err: unknown) => {
        job.status = "error";
        job.error = err instanceof Error ? err.message : "AI extraction failed.";
        send("error", { error: job.error });
        res.end();
      });
    return;
  }

  send("error", { error: job.error ?? "AI extraction failed." });
  res.end();
});
