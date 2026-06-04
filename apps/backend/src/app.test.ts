import { afterEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from './app.js';

let app: FastifyInstance | undefined;

afterEach(async () => {
  await app?.close();
  app = undefined;
});

describe('backend app', () => {
  it('serves the health endpoint', async () => {
    app = await buildApp();

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/health',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      service: 'trends-backend',
      status: 'ok',
    });
  });

  it('returns the shared not found error shape', async () => {
    app = await buildApp();

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/missing',
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      error: {
        code: 'not_found',
        message: 'Resource not found.',
        statusCode: 404,
      },
    });
    expect(response.json().error.requestId).toEqual(expect.any(String));
  });

  it('returns the shared validation error shape', async () => {
    app = await buildApp();
    app.get('/api/v1/test-validation', {
      schema: {
        querystring: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
          },
        },
      },
    }, async () => ({ ok: true }));

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/test-validation',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: {
        code: 'validation_error',
        statusCode: 400,
      },
    });
    expect(response.json().error.details).toMatchObject({
      context: 'querystring',
    });
  });
});
