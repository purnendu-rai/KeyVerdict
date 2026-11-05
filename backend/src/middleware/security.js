import cors from 'cors';
import helmet from 'helmet';
import { environment } from '../config/environment.js';

export const corsMiddleware = cors({
  origin(origin, callback) {
    // Non-browser tools such as health monitors do not send an Origin header.
    if (!origin) return callback(null, true);
    if (environment.allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS origin is not approved.'));
  },
  credentials: false,
  methods: ['GET', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Accept', 'Content-Type'],
  optionsSuccessStatus: 204,
});

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      baseUri: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  referrerPolicy: { policy: 'no-referrer' },
  hsts: environment.isProduction,
});

export function requestProtection(request, response, next) {
  if (request.originalUrl.length > 2048) {
    return response.status(414).json({ error: 'Request URL is too long.' });
  }
  if (request.originalUrl.includes('?')) {
    return response.status(400).json({ error: 'Query parameters are not supported.' });
  }
  const declaredLength = Number(request.headers['content-length'] || 0);
  if (declaredLength > 0 || request.headers['transfer-encoding']) {
    return response.status(400).json({ error: 'Request bodies are not accepted.' });
  }
  return next();
}

export function methodGuard(request, response, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return next();
  response.set('Allow', 'GET, HEAD, OPTIONS');
  return response.status(405).json({ error: 'HTTP method is not supported.' });
}
