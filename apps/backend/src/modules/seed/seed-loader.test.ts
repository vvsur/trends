import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildSeedLoadPlan, runSeedLoader } from './seed-loader.js';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');

const strategicSeed = {
  schema_version: 1,
  dataset: 'strategic_initiatives',
  source_contract: 'docs/13-source-traceability.md#seed-реестр-стратегических-инициатив-из-pdf',
  source_pdf: 'source-materials/trends-portal-task-2.pdf',
  source_raw_text: 'docs/research/raw-trends-portal-task-2.txt',
  items: [
    {
      seed_key: 'pdf-task-2-strategic-initiative-1',
      source_number: 1,
      source_section: 'Seed: реестр стратегических инициатив из PDF',
      title: 'FastTrack инноваций',
      department_code: 'ITG',
      created_quarter: 'Q2',
      owner: 'Новак Павел Александрович',
      year: '2026',
      comment: 'Замена О. Аврясова(?)',
    },
  ],
};

const trendSeed = {
  schema_version: 1,
  dataset: 'primary_technology_trends',
  source_contract: 'docs/13-source-traceability.md#seed-первичный-набор-технологических-трендовинноваций-для-скоринга',
  source_pdf: 'source-materials/trends-portal-task-2.pdf',
  source_raw_text: 'docs/research/raw-trends-portal-task-2.txt',
  items: [
    {
      seed_key: 'pdf-task-2-primary-technology-trend-1',
      source_number: 1,
      source_section: 'Seed: первичный набор технологических трендов/инноваций для скоринга',
      title: 'ИИ-трансформация. Внедрение ИИ-идей, что приносит бизнес в production',
      department_code: 'КСС',
      created_quarter: 'Q2',
      owner: 'Кузнецов Виталий Владимирович',
      comment: '',
    },
  ],
};

describe('seed loader', () => {
  it('builds records with source traceability', () => {
    const plan = buildSeedLoadPlan([
      {
        config: {
          dataset: 'strategic_initiatives',
          filePath: 'strategic.json',
          entityKind: 'strategic_initiative',
          expectedNumbers: [1],
          extraItemFields: ['year'],
        },
        content: JSON.stringify(strategicSeed),
      },
      {
        config: {
          dataset: 'primary_technology_trends',
          filePath: 'trends.json',
          entityKind: 'technology_trend',
          expectedNumbers: [1],
          extraItemFields: [],
        },
        content: JSON.stringify(trendSeed),
      },
    ]);

    expect(plan.summary).toEqual({
      total_records: 2,
      datasets: {
        strategic_initiatives: 1,
        primary_technology_trends: 1,
      },
    });
    expect(plan.records[0]?.source_trace).toMatchObject({
      source_kind: 'pdf_seed',
      source_row_key: 'pdf-task-2-strategic-initiative-1',
      imported_from_dataset: 'strategic_initiatives',
      review_status: 'pending',
      version: 1,
    });
  });

  it('reports item field errors with row context', () => {
    const brokenSeed = structuredClone(trendSeed);
    delete (brokenSeed.items[0] as Record<string, unknown>).owner;

    expect(() =>
      buildSeedLoadPlan([
        {
          config: {
            dataset: 'primary_technology_trends',
            filePath: 'trends.json',
            entityKind: 'technology_trend',
            expectedNumbers: [1],
            extraItemFields: [],
          },
          content: JSON.stringify(brokenSeed),
        },
      ]),
    ).toThrow('trends.json: item 1 field owner: is missing');
  });

  it('does not rewrite the generated artifact when content is unchanged', async () => {
    const rootDir = await mkdtemp(join(tmpdir(), 'trends-seed-'));
    const seedDir = join(rootDir, 'data/seed');
    const outputPath = 'generated/portal-seed.load.json';
    await mkdir(seedDir, { recursive: true });
    await writeFile(
      join(seedDir, 'strategic-initiatives.seed.json'),
      await readFile(join(repoRoot, 'data/seed/strategic-initiatives.seed.json'), 'utf8'),
      'utf8',
    );
    await writeFile(
      join(seedDir, 'primary-technology-trends.seed.json'),
      await readFile(join(repoRoot, 'data/seed/primary-technology-trends.seed.json'), 'utf8'),
      'utf8',
    );

    const firstRun = await runSeedLoader(rootDir, outputPath);
    const firstContent = await readFile(join(rootDir, firstRun.outputPath), 'utf8');
    const secondRun = await runSeedLoader(rootDir, outputPath);
    const secondContent = await readFile(join(rootDir, secondRun.outputPath), 'utf8');

    expect(firstRun.changed).toBe(true);
    expect(secondRun.changed).toBe(false);
    expect(secondContent).toBe(firstContent);
  });
});
