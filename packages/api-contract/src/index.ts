import type { components, operations, paths } from './generated/openapi.js';

export type { components, operations, paths } from './generated/openapi.js';

export type ApiPaths = paths;
export type ApiOperations = operations;
export type HealthResponse = components['schemas']['HealthResponse'];
export type ApiErrorCode = components['schemas']['ApiErrorCode'];
export type ApiErrorResponse = components['schemas']['ApiErrorResponse'];
export type ReferenceDataItem = components['schemas']['ReferenceDataItem'];
export type ReferenceDataListResponse = components['schemas']['ReferenceDataListResponse'];
export type ReferenceDataItemResponse = components['schemas']['ReferenceDataItemResponse'];
export type TrendItem = components['schemas']['TrendItem'];
export type TrendListResponse = components['schemas']['TrendListResponse'];
export type TrendItemResponse = components['schemas']['TrendItemResponse'];
