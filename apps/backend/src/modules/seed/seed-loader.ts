import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export type SeedDatasetName = 'strategic_initiatives' | 'primary_technology_trends';

type SeedFileConfig = {
  dataset: SeedDatasetName;
  filePath: string;
  entityKind: 'strategic_initiative' | 'technology_trend';
  expectedNumbers: number[];
  extraItemFields: string[];
};

type RawSeedFile = {
  schema_version?: unknown;
  dataset?: unknown;
  source_contract?: unknown;
  source_pdf?: unknown;
  source_raw_text?: unknown;
  source_number_gap_note?: unknown;
  items?: unknown;
};

type RawSeedItem = {
  seed_key?: unknown;
  source_number?: unknown;
  source_section?: unknown;
  title?: unknown;
  department_code?: unknown;
  created_quarter?: unknown;
  owner?: unknown;
  year?: unknown;
  comment?: unknown;
};

export type SeedSourceTrace = {
  source_kind: 'pdf_seed';
  source_contract: string;
  source_pdf: string;
  source_raw_text: string;
  source_number: number;
  source_section: string;
  source_row_key: string;
  source_hash: string;
  imported_from_dataset: SeedDatasetName;
  review_status: 'pending';
  version: 1;
};

export type SeedLoadRecord = {
  seed_key: string;
  entity_kind: 'strategic_initiative' | 'technology_trend';
  title: string;
  department_code: string;
  created_quarter: 'Q2';
  owner: string;
  year?: string;
  comment: string;
  source_trace: SeedSourceTrace;
  version: 1;
};

export type SeedLoadPlan = {
  schema_version: 1;
  generated_by: 'trends-seed-loader';
  records: SeedLoadRecord[];
  summary: {
    total_records: number;
    datasets: Record<SeedDatasetName, number>;
  };
};

export type SeedLoaderResult = {
  outputPath: string;
  changed: boolean;
  plan: SeedLoadPlan;
};

const seedFiles: SeedFileConfig[] = [
  {
    dataset: 'strategic_initiatives',
    filePath: 'data/seed/strategic-initiatives.seed.json',
    entityKind: 'strategic_initiative',
    expectedNumbers: [1, 2, 3, 4, 5, 6, 7],
    extraItemFields: ['year'],
  },
  {
    dataset: 'primary_technology_trends',
    filePath: 'data/seed/primary-technology-trends.seed.json',
    entityKind: 'technology_trend',
    expectedNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11],
    extraItemFields: [],
  },
];

const rootFields = [
  'schema_version',
  'dataset',
  'source_contract',
  'source_pdf',
  'source_raw_text',
  'items',
] as const;

const baseItemFields = [
  'seed_key',
  'source_number',
  'source_section',
  'title',
  'department_code',
  'created_quarter',
  'owner',
  'comment',
] as const;

function fail(filePath: string, message: string): never {
  throw new Error(`${filePath}: ${message}`);
}

function failItem(filePath: string, itemIndex: number, field: string, message: string): never {
  throw new Error(`${filePath}: item ${itemIndex + 1} field ${field}: ${message}`);
}

function readString(
  filePath: string,
  item: RawSeedItem,
  itemIndex: number,
  field: keyof RawSeedItem,
  options: { allowEmpty?: boolean } = {},
) {
  const value = item[field];

  if (typeof value !== 'string') {
    failItem(filePath, itemIndex, field, 'must be a string');
  }

  if (!options.allowEmpty && value.length === 0) {
    failItem(filePath, itemIndex, field, 'is required');
  }

  return value;
}

function canonicalJson(value: unknown) {
  return JSON.stringify(value, Object.keys(value as Record<string, unknown>).sort());
}

function hashRecord(value: unknown) {
  return createHash('sha256').update(canonicalJson(value)).digest('hex');
}

function parseJson(filePath: string, content: string): RawSeedFile {
  try {
    return JSON.parse(content) as RawSeedFile;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(filePath, `invalid JSON: ${message}`);
  }
}

function validateRoot(config: SeedFileConfig, data: RawSeedFile) {
  for (const field of rootFields) {
    if (!(field in data)) {
      fail(config.filePath, `missing root field ${field}`);
    }
  }

  if (data.schema_version !== 1) {
    fail(config.filePath, 'schema_version must be 1');
  }

  if (data.dataset !== config.dataset) {
    fail(config.filePath, `dataset must be ${config.dataset}`);
  }

  if (typeof data.source_contract !== 'string' || !data.source_contract.startsWith('docs/13-source-traceability.md#')) {
    fail(config.filePath, 'source_contract must point to docs/13-source-traceability.md');
  }

  if (data.source_pdf !== 'source-materials/trends-portal-task-2.pdf') {
    fail(config.filePath, 'source_pdf must preserve source-materials/trends-portal-task-2.pdf');
  }

  if (data.source_raw_text !== 'docs/research/raw-trends-portal-task-2.txt') {
    fail(config.filePath, 'source_raw_text must preserve docs/research/raw-trends-portal-task-2.txt');
  }

  if (!Array.isArray(data.items)) {
    fail(config.filePath, 'items must be an array');
  }
}

function validateItem(config: SeedFileConfig, data: RawSeedFile, rawItem: unknown, itemIndex: number): SeedLoadRecord {
  if (typeof rawItem !== 'object' || rawItem === null || Array.isArray(rawItem)) {
    fail(config.filePath, `item ${itemIndex + 1} must be an object`);
  }

  const item = rawItem as RawSeedItem;
  const fields = [...baseItemFields, ...config.extraItemFields];

  for (const field of fields) {
    if (!(field in item)) {
      failItem(config.filePath, itemIndex, field, 'is missing');
    }
  }

  const sourceNumber = item.source_number;
  if (!Number.isInteger(sourceNumber)) {
    failItem(config.filePath, itemIndex, 'source_number', 'must be an integer');
  }

  const createdQuarter = item.created_quarter;
  if (createdQuarter !== 'Q2') {
    failItem(config.filePath, itemIndex, 'created_quarter', 'must preserve source value Q2');
  }

  const seedKey = readString(config.filePath, item, itemIndex, 'seed_key');
  const sourceSection = readString(config.filePath, item, itemIndex, 'source_section');
  const title = readString(config.filePath, item, itemIndex, 'title');
  const departmentCode = readString(config.filePath, item, itemIndex, 'department_code');
  const owner = readString(config.filePath, item, itemIndex, 'owner');
  const comment = readString(config.filePath, item, itemIndex, 'comment', { allowEmpty: true });
  const sourceHash = hashRecord({
    seed_key: seedKey,
    source_number: sourceNumber,
    source_section: sourceSection,
    title,
    department_code: departmentCode,
    created_quarter: createdQuarter,
    owner,
    year: typeof item.year === 'string' ? item.year : undefined,
    comment,
  });

  return {
    seed_key: seedKey,
    entity_kind: config.entityKind,
    title,
    department_code: departmentCode,
    created_quarter: createdQuarter,
    owner,
    ...(typeof item.year === 'string' ? { year: item.year } : {}),
    comment,
    source_trace: {
      source_kind: 'pdf_seed',
      source_contract: data.source_contract as string,
      source_pdf: data.source_pdf as string,
      source_raw_text: data.source_raw_text as string,
      source_number: sourceNumber as number,
      source_section: sourceSection,
      source_row_key: seedKey,
      source_hash: sourceHash,
      imported_from_dataset: config.dataset,
      review_status: 'pending',
      version: 1,
    },
    version: 1,
  };
}

export function buildSeedLoadPlan(files: Array<{ config: SeedFileConfig; content: string }>): SeedLoadPlan {
  const records: SeedLoadRecord[] = [];
  const recordKeys = new Set<string>();
  const datasetCounts = {
    strategic_initiatives: 0,
    primary_technology_trends: 0,
  };

  for (const file of files) {
    const data = parseJson(file.config.filePath, file.content);
    validateRoot(file.config, data);

    const numbers: number[] = [];

    for (const [itemIndex, rawItem] of (data.items as unknown[]).entries()) {
      const record = validateItem(file.config, data, rawItem, itemIndex);

      if (recordKeys.has(record.seed_key)) {
        fail(file.config.filePath, `duplicate seed_key ${record.seed_key}`);
      }

      recordKeys.add(record.seed_key);
      numbers.push(record.source_trace.source_number);
      records.push(record);
      datasetCounts[file.config.dataset] += 1;
    }

    if (JSON.stringify(numbers) !== JSON.stringify(file.config.expectedNumbers)) {
      fail(file.config.filePath, `expected source numbers ${file.config.expectedNumbers.join(',')}, got ${numbers.join(',')}`);
    }
  }

  const datasetOrder: Record<SeedDatasetName, number> = {
    strategic_initiatives: 0,
    primary_technology_trends: 1,
  };

  records.sort((left, right) => {
    const datasetDiff = datasetOrder[left.source_trace.imported_from_dataset] - datasetOrder[right.source_trace.imported_from_dataset];

    if (datasetDiff !== 0) {
      return datasetDiff;
    }

    return left.source_trace.source_number - right.source_trace.source_number;
  });

  return {
    schema_version: 1,
    generated_by: 'trends-seed-loader',
    records,
    summary: {
      total_records: records.length,
      datasets: datasetCounts,
    },
  };
}

export async function runSeedLoader(rootDir = process.cwd(), outputPath = 'data/seed/generated/portal-seed.load.json'): Promise<SeedLoaderResult> {
  const files = await Promise.all(
    seedFiles.map(async (config) => ({
      config,
      content: await readFile(join(rootDir, config.filePath), 'utf8'),
    })),
  );
  const plan = buildSeedLoadPlan(files);
  const absoluteOutputPath = join(rootDir, outputPath);
  const output = `${JSON.stringify(plan, null, 2)}\n`;

  let previous: string | undefined;
  try {
    previous = await readFile(absoluteOutputPath, 'utf8');
  } catch {
    previous = undefined;
  }

  if (previous === output) {
    return {
      outputPath,
      changed: false,
      plan,
    };
  }

  await mkdir(dirname(absoluteOutputPath), { recursive: true });
  await writeFile(absoluteOutputPath, output, 'utf8');

  return {
    outputPath,
    changed: true,
    plan,
  };
}
