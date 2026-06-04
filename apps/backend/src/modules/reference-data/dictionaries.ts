export const dictionaryNames = [
  'departments',
  'trend-domains',
  'trend-statuses',
  'innovation-statuses',
  'pilot-statuses',
  'maturity-rings',
  'trend-recommendations',
] as const;

export type DictionaryName = typeof dictionaryNames[number];

export type DictionaryConfig = {
  entityType: string;
  table: string;
  supportsVisibleInMvp?: boolean;
};

export const dictionaryConfigs: Record<DictionaryName, DictionaryConfig> = {
  departments: {
    entityType: 'department',
    table: 'departments',
  },
  'innovation-statuses': {
    entityType: 'innovation_status',
    table: 'innovation_statuses',
  },
  'maturity-rings': {
    entityType: 'maturity_ring',
    table: 'maturity_rings',
  },
  'pilot-statuses': {
    entityType: 'pilot_status',
    table: 'pilot_statuses',
  },
  'trend-domains': {
    entityType: 'trend_domain',
    supportsVisibleInMvp: true,
    table: 'trend_domains',
  },
  'trend-recommendations': {
    entityType: 'trend_recommendation',
    table: 'trend_recommendations',
  },
  'trend-statuses': {
    entityType: 'trend_status',
    table: 'trend_statuses',
  },
};

export function isDictionaryName(value: string): value is DictionaryName {
  return dictionaryNames.includes(value as DictionaryName);
}
