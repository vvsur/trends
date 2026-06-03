import Fastify from 'fastify';
import { registerHealthRoutes } from './modules/health/routes.js';

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(registerHealthRoutes, { prefix: '/api/v1' });

  return app;
}
