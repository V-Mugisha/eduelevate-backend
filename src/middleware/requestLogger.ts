import type { Request, Response, NextFunction } from "express";

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";

function formatTimestamp(): string {
  return new Date().toISOString();
}

function getStatusColor(statusCode: number): string {
  if (statusCode >= 500) return RED;
  if (statusCode >= 400) return YELLOW;
  if (statusCode >= 300) return CYAN;
  return GREEN;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

function formatDuration(durationMs: number): string {
  if (durationMs < 1000) return `${durationMs}ms`;
  return `${(durationMs / 1000).toFixed(2)}s`;
}

export default function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const { method, originalUrl } = req;
  const clientIp = getClientIp(req);

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const statusColor = getStatusColor(statusCode);
    const timestamp = formatTimestamp();

    const line = `[${DIM}${timestamp}${RESET}] ${statusColor}${method}${RESET} ${originalUrl} ${statusColor}${statusCode}${RESET} ${formatDuration(duration)} ${DIM}- ${clientIp}${RESET}`;

    if (statusCode >= 500) {
      console.error(line);
      const error = res.locals.error as Error | undefined;
      if (error?.stack) {
        console.error(`  ${RED}${error.stack}${RESET}`);
      }
    } else if (statusCode >= 400) {
      console.warn(line);
    } else {
      console.log(line);
    }
  });

  next();
}
