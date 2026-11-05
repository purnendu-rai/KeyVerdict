import { environment } from '../config/environment.js';
import { securityTips, threats } from '../data/securityGuidance.js';

export function securityTipsController(_request, response) {
  response.json({ data: securityTips });
}

export function threatsController(_request, response) {
  response.json({ data: threats });
}

export function appInfoController(_request, response) {
  response.json({
    apiVersion: environment.apiVersion,
    documentationVersion: '3.0.0',
    features: ['public security tips', 'public threat education', 'health monitoring'],
  });
}
