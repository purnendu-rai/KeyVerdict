import { sanitizeRoute } from './requestLogger.js';

export function notFoundHandler(_request, response) {
  response.status(404).json({ error: 'Resource not found.' });
}

export function errorHandler(error, request, response, next) {
  const status = error.message === 'CORS origin is not approved.' ? 403 : Number(error.statusCode) || 500;
  console.error(JSON.stringify({ level: 'error', message: error.message || 'Unhandled server error', method: request.method, route: sanitizeRoute(request.path), status }));
  if (response.headersSent) return next(error);
  response.status(status).json({ error: status === 403 ? 'Origin is not approved.' : 'Request could not be completed.' });
}
