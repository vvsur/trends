import { describe, expect, it } from 'vitest';
import { createPrismaClient, readDatabaseUrl } from './prisma-client.js';

describe('Prisma client factory', () => {
  it('uses the documented local SQLite database URL by default', () => {
    expect(readDatabaseUrl({})).toBe('file:./data/trends.sqlite');
  });

  it('can query the local SQLite database through the Prisma 7 adapter', async () => {
    const prisma = createPrismaClient();

    try {
      const technology = await prisma.trendDomain.findUnique({
        where: { code: 'technology' },
      });

      expect(technology).toMatchObject({
        active: true,
        code: 'technology',
        visibleInMvp: true,
      });
    } finally {
      await prisma.$disconnect();
    }
  });
});
