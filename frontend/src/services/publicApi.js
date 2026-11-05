import { API_BASE_URL, APP_VERSION } from '../config/environment';
import { fallbackThreats, fallbackTips } from '../data/fallbackEducation';

const ENDPOINTS = Object.freeze({
  health: '/api/health',
  tips: '/api/v1/security-tips',
  threats: '/api/v1/threats',
  info: '/api/v1/app-info',
});

const requestTimeoutMs = 4500;

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateItems(payload, fields) {
  if (!isRecord(payload) || !Array.isArray(payload.data)) throw new Error('The education response shape is invalid.');
  const valid = payload.data.every((item) => isRecord(item) && fields.every((field) => typeof item[field] === 'string'));
  if (!valid) throw new Error('The education response contains invalid items.');
  return payload.data;
}

function validateHealth(payload) {
  if (!isRecord(payload) || payload.status !== 'ok' || typeof payload.service !== 'string') {
    throw new Error('The health response shape is invalid.');
  }
  return payload;
}

function validateInfo(payload) {
  if (!isRecord(payload) || typeof payload.apiVersion !== 'string' || !Array.isArray(payload.features)) {
    throw new Error('The app info response shape is invalid.');
  }
  return payload;
}

async function request(path, validate) {
  if (!API_BASE_URL) throw new Error('Live education API is not configured.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });
    if (!response.ok) throw new Error(`Education API returned ${response.status}.`);
    return validate(await response.json());
  } finally {
    clearTimeout(timeout);
  }
}

export async function getHealth() {
  try {
    return { data: await request(ENDPOINTS.health, validateHealth), available: true };
  } catch (error) {
    return { data: null, available: false, error };
  }
}

export async function getSecurityTips() {
  try {
    return { data: await request(ENDPOINTS.tips, (payload) => validateItems(payload, ['id', 'title', 'category', 'description', 'practice'])), source: 'live' };
  } catch (error) {
    return { data: fallbackTips, source: 'local-fallback', error };
  }
}

export async function getThreats() {
  try {
    return { data: await request(ENDPOINTS.threats, (payload) => validateItems(payload, ['id', 'name', 'description', 'defense'])), source: 'live' };
  } catch (error) {
    return { data: fallbackThreats, source: 'local-fallback', error };
  }
}

export async function getAppInfo() {
  try {
    return { data: await request(ENDPOINTS.info, validateInfo), source: 'live' };
  } catch (error) {
    return {
      data: { apiVersion: 'local', features: ['browser password engine', 'bundled security education'], documentationVersion: APP_VERSION },
      source: 'local-fallback',
      error,
    };
  }
}

export async function getEducationBundle() {
  const [tips, threats, info] = await Promise.all([getSecurityTips(), getThreats(), getAppInfo()]);
  return { tips, threats, info, source: tips.source === 'live' && threats.source === 'live' ? 'live' : 'local-fallback' };
}

export { ENDPOINTS };
