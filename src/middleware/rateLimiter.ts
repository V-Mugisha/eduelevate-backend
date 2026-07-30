import rateLimit from "express-rate-limit";

function message(max: number, windowMinutes: number) {
  return `Too many requests. You are limited to ${max} requests per ${windowMinutes} minute${windowMinutes !== 1 ? "s" : ""}. Please try again later.`;
}

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: message(20, 15) },
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: message(50, 60) },
});
