import type { StrategicInitiativeListResponse } from '@trends/api-contract';

export type StrategicInitiativeListItem = StrategicInitiativeListResponse['data'][number];

export async function fetchStrategicInitiatives(signal?: AbortSignal): Promise<StrategicInitiativeListItem[]> {
  const response = await fetch('/api/v1/strategic-initiatives', { signal });

  if (!response.ok) {
    throw new Error(`Strategic initiatives request failed with status ${response.status}`);
  }

  const payload = await response.json() as StrategicInitiativeListResponse;
  return payload.data;
}
