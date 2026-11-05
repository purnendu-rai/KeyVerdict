import app from './app.js';
import { environment } from './config/environment.js';

const server = app.listen(environment.port, '0.0.0.0', () => {
  console.info(JSON.stringify({ level: 'info', message: 'keyverdict-api listening', port: environment.port, environment: environment.nodeEnv }));
});

let shuttingDown = false;

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.info(JSON.stringify({ level: 'info', message: 'shutdown requested', signal }));
  server.close((error) => {
    if (error) {
      console.error(JSON.stringify({ level: 'error', message: 'server shutdown failed' }));
      process.exitCode = 1;
    }
    process.exit();
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
