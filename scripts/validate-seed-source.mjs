import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const seedFiles = [
  {
    dataset: 'strategic_initiatives',
    expectedNumbers: [1, 2, 3, 4, 5, 6, 7],
    filePath: 'data/seed/strategic-initiatives.seed.json',
    itemFields: ['year'],
  },
  {
    dataset: 'primary_technology_trends',
    expectedNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11],
    filePath: 'data/seed/primary-technology-trends.seed.json',
    itemFields: [],
  },
];

const rootFields = [
  'schema_version',
  'dataset',
  'source_contract',
  'source_pdf',
  'source_raw_text',
  'items',
];

const itemFields = [
  'seed_key',
  'source_number',
  'source_section',
  'title',
  'department_code',
  'created_quarter',
  'owner',
  'comment',
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readSeedFile(filePath) {
  return JSON.parse(readFileSync(join(process.cwd(), filePath), 'utf8'));
}

function validateSeedFile(config) {
  const data = readSeedFile(config.filePath);

  for (const field of rootFields) {
    assert(field in data, `${config.filePath}: missing root field ${field}`);
  }

  assert(data.schema_version === 1, `${config.filePath}: schema_version must be 1`);
  assert(data.dataset === config.dataset, `${config.filePath}: dataset must be ${config.dataset}`);
  assert(data.source_contract.startsWith('docs/13-source-traceability.md#'), `${config.filePath}: source_contract must point to docs/13-source-traceability.md`);
  assert(data.source_pdf === 'source-materials/trends-portal-task-2.pdf', `${config.filePath}: unexpected source_pdf`);
  assert(data.source_raw_text === 'docs/research/raw-trends-portal-task-2.txt', `${config.filePath}: unexpected source_raw_text`);
  assert(Array.isArray(data.items), `${config.filePath}: items must be an array`);

  const numbers = [];
  const seedKeys = new Set();

  for (const [index, item] of data.items.entries()) {
    const fields = [...itemFields, ...config.itemFields];

    for (const field of fields) {
      assert(field in item, `${config.filePath}: item ${index + 1} missing field ${field}`);
    }

    assert(typeof item.seed_key === 'string' && item.seed_key.length > 0, `${config.filePath}: item ${index + 1} seed_key must be a non-empty string`);
    assert(!seedKeys.has(item.seed_key), `${config.filePath}: duplicate seed_key ${item.seed_key}`);
    seedKeys.add(item.seed_key);

    assert(Number.isInteger(item.source_number), `${config.filePath}: ${item.seed_key} source_number must be an integer`);
    assert(typeof item.source_section === 'string' && item.source_section.length > 0, `${config.filePath}: ${item.seed_key} source_section is required`);
    assert(typeof item.title === 'string' && item.title.length > 0, `${config.filePath}: ${item.seed_key} title is required`);
    assert(typeof item.department_code === 'string' && item.department_code.length > 0, `${config.filePath}: ${item.seed_key} department_code is required`);
    assert(item.created_quarter === 'Q2', `${config.filePath}: ${item.seed_key} created_quarter must preserve source value Q2`);
    assert(typeof item.owner === 'string' && item.owner.length > 0, `${config.filePath}: ${item.seed_key} owner is required`);
    assert(typeof item.comment === 'string', `${config.filePath}: ${item.seed_key} comment must preserve source text, even when empty`);

    numbers.push(item.source_number);
  }

  assert(JSON.stringify(numbers) === JSON.stringify(config.expectedNumbers), `${config.filePath}: expected source numbers ${config.expectedNumbers.join(',')}, got ${numbers.join(',')}`);

  return {
    dataset: data.dataset,
    filePath: config.filePath,
    items: data.items.length,
    source_numbers: numbers,
  };
}

const results = seedFiles.map(validateSeedFile);

console.log(JSON.stringify({ result: 'pass', files: results }, null, 2));
