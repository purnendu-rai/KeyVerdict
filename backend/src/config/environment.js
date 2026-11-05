import dotenv from 'dotenv';

dotenv.config();

function parsePositiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseOrigins(value, nodeEnv) {
  const rawOrigins = (value || (nodeEnv === 'production' ? '' : 'http://localhost:5173')).split(',').map((origin) => origin.trim()).filter(Boolean);
  const origins = rawOrigins.map((origin) => {
    let parsed;
    try {
      parsed = new URL(origin);
    } catch {
      throw new Error(`Invalid ALLOWED_ORIGINS entry: ${origin}`);
    }
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.search || parsed.hash || (parsed.pathname && parsed.pathname !== '/')) {
      throw new Error(`ALLOWED_ORIGINS entries must be origins without paths: ${origin}`);
    }
    return parsed.origin;
  });

  if (nodeEnv === 'production' && origins.length === 0) {
    throw new Error('ALLOWED_ORIGINS must contain at least one approved origin in production.');
  }
  return origins;
}

const nodeEnv = process.env.NODE_ENV || 'development';

export const environment = Object.freeze({
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: parsePositiveInteger(process.env.PORT, 3000),
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS, nodeEnv),
  rateLimitWindowMs: parsePositiveInteger(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitMax: parsePositiveInteger(process.env.RATE_LIMIT_MAX, 120),
  apiVersion: '1.0.0',
});
