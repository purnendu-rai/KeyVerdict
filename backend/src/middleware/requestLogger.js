const knownRoutes = new Set(['/api/health', '/api/v1/security-tips', '/api/v1/threats', '/api/v1/app-info']);

export function sanitizeRoute(path) {
  return knownRoutes.has(path) ? path : '/unmatched';
}

export function requestLogger(request, response, next) {
  const startedAt = process.hrtime.bigint();
  response.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    console.info(JSON.stringify({ level: 'info', method: request.method, route: sanitizeRoute(request.path), status: response.statusCode, durationMs: Math.round(durationMs * 100) / 100 }));
  });
  next();
}
