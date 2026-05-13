// Minimal structured JSON logger.
// In production you'd use pino, winston, or your platform's logging SDK.
// This is deliberately simple to keep the exercise focused on distributed systems.

interface LogEntry {
  level: "info" | "warn" | "error";
  message: string;
  correlationId?: string;
  [key: string]: unknown;
}

function log(level: LogEntry["level"], message: string, meta: Record<string, unknown> = {}): void {
  const entry: LogEntry = {
    ts: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

interface Logger {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
  child(meta: Record<string, unknown>): Logger;
}

function createLogger(defaultMeta: Record<string, unknown> = {}): Logger {
  return {
    info: (message, meta = {}) => log("info", message, { ...defaultMeta, ...meta }),
    warn: (message, meta = {}) => log("warn", message, { ...defaultMeta, ...meta }),
    error: (message, meta = {}) => log("error", message, { ...defaultMeta, ...meta }),
    child: (meta) => createLogger({ ...defaultMeta, ...meta }),
  };
}

export const logger = createLogger();
