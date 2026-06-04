import Fastify from 'fastify';
import { registerHealthRoutes } from './modules/health/routes.js';
import { registerReferenceDataRoutes } from './modules/reference-data/routes.js';
import { registerTrendRoutes } from './modules/trends/routes.js';
import { registerApiErrorHandlers } from './shared/api-errors.js';
import { createPrismaClient, type AppPrismaClient } from './shared/database/prisma-client.js';

export type BuildAppOptions = {
  prisma?: AppPrismaClient;
};

export async function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify({
    logger: true,
  });
  const prisma = options.prisma ?? createPrismaClient();

  registerApiErrorHandlers(app);

  await app.register(registerHealthRoutes, { prefix: '/api/v1' });
  await app.register(registerReferenceDataRoutes, { prefix: '/api/v1', prisma });
  await app.register(registerTrendRoutes, { prefix: '/api/v1', prisma });

  app.addHook('onClose', async () => {
    if (!options.prisma) {
      await prisma.$disconnect();
    }
  });

  return app;
}
