import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './generated/client/client.js';

export type AppPrismaClient = PrismaClient;

export function readDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  return env.DATABASE_URL ?? 'file:./data/trends.sqlite';
}

export function createPrismaClient(databaseUrl = readDatabaseUrl()): AppPrismaClient {
  const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
  return new PrismaClient({ adapter });
}
