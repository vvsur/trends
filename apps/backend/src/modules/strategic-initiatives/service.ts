import type { AppPrismaClient } from '../../shared/database/prisma-client.js';
import type { StrategicInitiativeGetPayload } from '../../shared/database/generated/client/models/StrategicInitiative.js';

export type StrategicInitiativeItem = {
  id: string;
  seedKey: string;
  title: string;
  department: {
    id: string;
    code: string;
    name: string;
  };
  createdQuarter: string;
  ownerName: string;
  year: string;
  comment: string;
  sourceTrace: unknown;
  version: number;
  createdAt: string;
  updatedAt: string;
};

const initiativeInclude = {
  department: true,
} as const;

type StrategicInitiativeWithRelations = StrategicInitiativeGetPayload<{ include: typeof initiativeInclude }>;

function parseJsonValue(value: string): unknown {
  return JSON.parse(value);
}

function mapInitiative(initiative: StrategicInitiativeWithRelations): StrategicInitiativeItem {
  return {
    comment: initiative.comment,
    createdAt: initiative.createdAt.toISOString(),
    createdQuarter: initiative.createdQuarter,
    department: {
      code: initiative.department.code,
      id: initiative.department.id,
      name: initiative.department.name,
    },
    id: initiative.id,
    ownerName: initiative.ownerName,
    seedKey: initiative.seedKey,
    sourceTrace: parseJsonValue(initiative.sourceTraceJson),
    title: initiative.title,
    updatedAt: initiative.updatedAt.toISOString(),
    version: initiative.version,
    year: initiative.year,
  };
}

export async function listStrategicInitiatives(prisma: AppPrismaClient): Promise<StrategicInitiativeItem[]> {
  const initiatives = await prisma.strategicInitiative.findMany({
    include: initiativeInclude,
    orderBy: [
      { year: 'asc' },
      { seedKey: 'asc' },
    ],
  });

  return initiatives.map(mapInitiative);
}
