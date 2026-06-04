import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPrismaClient } from '../../shared/database/prisma-client.js';
import { runSeedLoader } from './seed-loader.js';
import { publishSeedPlan } from './seed-publisher.js';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(moduleDir, '../../../../..');
const prisma = createPrismaClient();

try {
  const seedLoaderResult = await runSeedLoader(repositoryRoot);
  const publishResult = await publishSeedPlan(prisma, seedLoaderResult.plan);

  console.log(
    JSON.stringify(
      {
        result: 'pass',
        output_path: seedLoaderResult.outputPath,
        changed: seedLoaderResult.changed,
        total_records: seedLoaderResult.plan.summary.total_records,
        published: publishResult,
      },
      null,
      2,
    ),
  );
} finally {
  await prisma.$disconnect();
}
