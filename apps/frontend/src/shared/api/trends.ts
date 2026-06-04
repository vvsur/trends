import type { TrendItemResponse, TrendListResponse } from '@trends/api-contract';

export type TrendListFilters = {
  domainCode?: string;
  statusCode?: string;
  ownerId?: string;
  departmentId?: string;
};

export type TrendListItem = TrendListResponse['data'][number];
export type TrendDetailItem = TrendItemResponse['data'];

function appendFilter(params: URLSearchParams, name: keyof TrendListFilters, value: string | undefined) {
  const normalized = value?.trim();

  if (normalized) {
    params.set(name, normalized);
  }
}

export async function fetchTrends(filters: TrendListFilters, signal?: AbortSignal): Promise<TrendListItem[]> {
  const params = new URLSearchParams();
  appendFilter(params, 'domainCode', filters.domainCode);
  appendFilter(params, 'statusCode', filters.statusCode);
  appendFilter(params, 'ownerId', filters.ownerId);
  appendFilter(params, 'departmentId', filters.departmentId);

  const query = params.toString();
  const response = await fetch(`/api/v1/trends${query ? `?${query}` : ''}`, { signal });

  if (!response.ok) {
    throw new Error(`Trend list request failed with status ${response.status}`);
  }

  const payload = await response.json() as TrendListResponse;
  return payload.data;
}

export async function fetchTrend(id: string, signal?: AbortSignal): Promise<TrendDetailItem> {
  const response = await fetch(`/api/v1/trends/${encodeURIComponent(id)}`, { signal });

  if (!response.ok) {
    throw new Error(`Trend detail request failed with status ${response.status}`);
  }

  const payload = await response.json() as TrendItemResponse;
  return payload.data;
}
