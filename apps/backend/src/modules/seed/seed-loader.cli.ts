import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runSeedLoader } from './seed-loader.js';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(moduleDir, '../../../../..');
const result = await runSeedLoader(repositoryRoot);

console.log(
  JSON.stringify(
    {
      result: 'pass',
      output_path: result.outputPath,
      changed: result.changed,
      total_records: result.plan.summary.total_records,
      datasets: result.plan.summary.datasets,
    },
    null,
    2,
  ),
);
