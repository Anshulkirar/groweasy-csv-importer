import Papa from "papaparse";
import { RawCsvRow } from "@/types";

export interface ParsedCsv {
  headers: string[];
  rows: RawCsvRow[];
}

export function parsePreview(file: File): Promise<ParsedCsv> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawCsvRow>(file, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (h) => h.trim(),
      transform: (v) => (typeof v === "string" ? v.trim() : v),
      complete: (result) => {
        if (result.errors.length > 0) {
          const fatal = result.errors.find((e) => e.type === "Delimiter");
          if (fatal) {
            reject(new Error("Could not parse the CSV file. Make sure it is a valid CSV."));
            return;
          }
        }
        const rows = result.data.filter((r) =>
          Object.values(r).some((v) => typeof v === "string" && v.trim())
        );
        resolve({ headers: result.meta.fields ?? [], rows });
      },
      error: (err: Error) => reject(err),
    });
  });
}
