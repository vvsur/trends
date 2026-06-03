import type { FastifyInstance } from 'fastify';

export async function registerHealthRoutes(app: FastifyInstance) {
  app.get('/health', {
    schema: {
      response: {
        200: {
          type: 'object',
          required: ['service', 'status'],
          properties: {
            service: { type: 'string' },
            status: { type: 'string', enum: ['ok'] },
          },
        },
      },
    },
  }, async () => {
    return {
      service: 'trends-backend',
      status: 'ok' as const,
    };
  });
}
