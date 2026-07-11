import Papa from "papaparse";
import { RawCsvRow } from "../types/crm";
import { CONFIG } from "../config/constants";

export class CsvParseError extends Error {}


export function parseCsv(buffer: Buffer): RawCsvRow[] {
  const text = stripBom(buffer.toString("utf-8"));

  const parsed = Papa.parse<RawCsvRow>(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim(),
    transform: (value) => (typeof value === "string" ? value.trim() : value),
  });

  if (parsed.errors.length > 0) {
    
    const fatal = parsed.errors.filter((e) => e.type === "Delimiter" || e.code === "UndetectableDelimiter");
    if (fatal.length > 0) {
      throw new CsvParseError("Could not detect a valid CSV structure in the uploaded file.");
    }
  }

  const rows = (parsed.data ?? []).filter((row) => hasAnyValue(row));

  if (rows.length === 0) {
    throw new CsvParseError("The CSV file contains no data rows.");
  }

  if (rows.length > CONFIG.MAX_ROWS) {
    throw new CsvParseError(
      `File has ${rows.length} rows, which exceeds the maximum of ${CONFIG.MAX_ROWS} rows per import.`
    );
  }

  return rows;
}

function hasAnyValue(row: RawCsvRow): boolean {
  return Object.values(row).some((v) => typeof v === "string" && v.trim().length > 0);
}

function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}
