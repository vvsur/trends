import type { FastifyInstance } from 'fastify';
import type { AppPrismaClient } from '../../shared/database/prisma-client.js';
import { listStrategicInitiatives } from './service.js';

export type StrategicInitiativeRoutesOptions = {
  prisma: AppPrismaClient;
};

export async function registerStrategicInitiativeRoutes(app: FastifyInstance, options: StrategicInitiativeRoutesOptions) {
  app.get('/strategic-initiatives', async () => ({
    data: await listStrategicInitiatives(options.prisma),
  }));
}
