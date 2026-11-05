import express from 'express';
import educationRouter from './routes/education.routes.js';
import healthRouter from './routes/health.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { createRateLimiter } from './middleware/rateLimiter.js';
import { corsMiddleware, helmetMiddleware, methodGuard, requestProtection } from './middleware/security.js';

export function createApp({ rateLimit = {} } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);

  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(requestLogger);
  app.use(methodGuard);
  app.use(requestProtection);
  app.use('/api', createRateLimiter(rateLimit));

  app.use('/api', healthRouter);
  app.use('/api/v1', educationRouter);
  app.use('/api', notFoundHandler);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

const app = createApp();
export default app;
