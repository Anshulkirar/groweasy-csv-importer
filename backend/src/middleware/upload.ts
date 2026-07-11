import multer from "multer";
import { CONFIG } from "../config/constants";

const ALLOWED_MIME_TYPES = new Set([
  "text/csv",
  "application/vnd.ms-excel",
  "application/csv",
  "text/plain",
]);

export const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: CONFIG.MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    const looksLikeCsv =
      ALLOWED_MIME_TYPES.has(file.mimetype) || file.originalname.toLowerCase().endsWith(".csv");

    if (!looksLikeCsv) {
      cb(new Error("Only .csv files are supported."));
      return;
    }
    cb(null, true);
  },
});
