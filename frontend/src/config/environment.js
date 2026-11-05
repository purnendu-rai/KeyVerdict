const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();

function isLocalHost(url) {
  return url.hostname === 'localhost' || url.hostname === '127.0.0.1';
}

function parseApiBaseUrl(value) {
  if (!value) return '';

  try {
    const url = new URL(value);
    const isProductionBuild = import.meta.env.PROD;
    if (isProductionBuild && url.protocol !== 'https:' && !isLocalHost(url)) {
      return '';
    }
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || (url.pathname && url.pathname !== '/')) return '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return '';
  }
}

export const API_BASE_URL = parseApiBaseUrl(rawApiBaseUrl);
export const API_CONFIGURED = Boolean(API_BASE_URL);
export const APP_VERSION = '3.0.0';
