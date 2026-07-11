import { UploadResponse, ImportResult } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function uploadCsv(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE}/api/import/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Upload failed (${res.status})`);
  }

  return res.json() as Promise<UploadResponse>;
}

export function streamImport(
  jobId: string,
  onProgress: (done: number, total: number) => void,
  onResult: (result: ImportResult) => void,
  onError: (message: string) => void
): () => void {
  const es = new EventSource(`${BASE}/api/import/${jobId}/stream`);

  es.addEventListener("progress", (e) => {
    const data = JSON.parse(e.data) as { batchesDone: number; batchesTotal: number };
    onProgress(data.batchesDone, data.batchesTotal);
  });

  es.addEventListener("result", (e) => {
    const data = JSON.parse(e.data) as ImportResult;
    es.close();
    onResult(data);
  });

  es.addEventListener("error", (e) => {
    const raw = (e as MessageEvent).data;
    const msg = raw
      ? ((JSON.parse(raw) as { error?: string }).error ?? "Unknown error")
      : "Connection lost";
    es.close();
    onError(msg);
  });

  return () => es.close();
}
