import rateLimit from 'express-rate-limit';
import { environment } from '../config/environment.js';

export function createRateLimiter(options = {}) {
  return rateLimit({
    windowMs: options.windowMs || environment.rateLimitWindowMs,
    limit: options.limit || environment.rateLimitMax,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Request limit reached. Try again later.' },
    handler: (_request, response) => {
      response.status(429).json({ error: 'Request limit reached. Try again later.' });
    },
  });
}
