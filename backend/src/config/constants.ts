export const CONFIG = {
  BATCH_SIZE: Number(process.env.AI_BATCH_SIZE ?? 25),
  MAX_CONCURRENT_BATCHES: Number(process.env.AI_MAX_CONCURRENCY ?? 3),
  MAX_RETRIES: Number(process.env.AI_MAX_RETRIES ?? 3),
  RETRY_BASE_DELAY_MS: 800,
  MODEL: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5",
  MAX_TOKENS_PER_BATCH: 8000,
  MAX_FILE_SIZE_BYTES: 15 * 1024 * 1024, 
  MAX_ROWS: 5000,
} as const;
