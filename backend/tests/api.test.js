import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('public API contract', () => {
  it('returns a minimal health response', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', service: 'keyverdict-api', version: '1.0.0' });
  });

  it('returns fixed structured education data', async () => {
    const tips = await request(app).get('/api/v1/security-tips').set('Origin', 'http://localhost:5173');
    const threats = await request(app).get('/api/v1/threats');
    const info = await request(app).get('/api/v1/app-info');
    expect(tips.status).toBe(200);
    expect(tips.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(tips.body.data[0]).toEqual(expect.objectContaining({ id: expect.any(String), title: expect.any(String), practice: expect.any(String) }));
    expect(threats.body.data).toHaveLength(5);
    expect(info.body.features).toContain('public threat education');
  });

  it('rejects methods, bodies, query strings, and unknown routes', async () => {
    const post = await request(app).post('/api/v1/security-tips').send({ password: 'SYNTHETIC-MARKER' });
    const body = await request(app).get('/api/health').set('Content-Length', '20').send('not accepted');
    const query = await request(app).get('/api/health?password=SYNTHETIC-MARKER');
    const unknown = await request(app).get('/api/analyze-password');
    expect(post.status).toBe(405);
    expect(body.status).toBe(400);
    expect(query.status).toBe(400);
    expect(unknown.status).toBe(404);
    expect(JSON.stringify(post.body)).not.toContain('SYNTHETIC-MARKER');
  });

  it('rejects unapproved browser origins', async () => {
    const response = await request(app).get('/api/health').set('Origin', 'https://unapproved.example');
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Origin is not approved.' });
  });

  it('includes security headers and does not disclose stack traces', async () => {
    const response = await request(app).get('/does-not-exist');
    expect(response.status).toBe(404);
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['content-security-policy']).toContain("default-src 'none'");
    expect(response.headers['x-powered-by']).toBeUndefined();
    expect(response.text).not.toContain('at ');
  });
});

describe('rate limiting', () => {
  it('returns 429 after the configured limit is reached', async () => {
    const limitedApp = createApp({ rateLimit: { limit: 2, windowMs: 60_000 } });
    await request(limitedApp).get('/api/health');
    await request(limitedApp).get('/api/health');
    const response = await request(limitedApp).get('/api/health');
    expect(response.status).toBe(429);
    expect(response.headers['retry-after']).toBeDefined();
    expect(response.body).toEqual({ error: 'Request limit reached. Try again later.' });
  });
});
