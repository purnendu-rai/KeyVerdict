import { environment } from '../config/environment.js';

export function healthController(_request, response) {
  response.json({ status: 'ok', service: 'keyverdict-api', version: environment.apiVersion });
}
