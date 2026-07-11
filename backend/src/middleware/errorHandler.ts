import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { CsvParseError } from "../services/csvService";

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof CsvParseError) {
    return res.status(400).json({ error: err.message });
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE" ? "File is too large." : `Upload error: ${err.message}`;
    return res.status(400).json({ error: message });
  }

  if (err instanceof Error) {
    return res.status(500).json({ error: err.message || "Internal server error." });
  }

  return res.status(500).json({ error: "Internal server error." });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found." });
}
