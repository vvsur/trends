import type { FastifyError, FastifyInstance, FastifyRequest } from 'fastify';

export type ApiErrorCode =
  | 'validation_error'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'internal_error';

export type ApiErrorResponse = {
  error: {
    code: ApiErrorCode;
    message: string;
    statusCode: number;
    requestId: string;
    details?: unknown;
  };
};

export const apiErrorResponseSchema = {
  type: 'object',
  required: ['error'],
  additionalProperties: false,
  properties: {
    error: {
      type: 'object',
      required: ['code', 'message', 'statusCode', 'requestId'],
      additionalProperties: false,
      properties: {
        code: {
          type: 'string',
          enum: ['validation_error', 'unauthorized', 'forbidden', 'not_found', 'conflict', 'internal_error'],
        },
        message: { type: 'string' },
        statusCode: { type: 'integer' },
        requestId: { type: 'string' },
        details: {},
      },
    },
  },
} as const;

type FastifyValidationError = FastifyError & {
  validation?: unknown;
  validationContext?: string;
};

function codeForStatus(statusCode: number): ApiErrorCode {
  if (statusCode === 400) {
    return 'validation_error';
  }

  if (statusCode === 401) {
    return 'unauthorized';
  }

  if (statusCode === 403) {
    return 'forbidden';
  }

  if (statusCode === 404) {
    return 'not_found';
  }

  if (statusCode === 409) {
    return 'conflict';
  }

  return 'internal_error';
}

function validationDetails(error: FastifyValidationError): unknown {
  if (!error.validation) {
    return undefined;
  }

  return {
    context: error.validationContext,
    issues: error.validation,
  };
}

function buildErrorResponse(params: {
  code: ApiErrorCode;
  message: string;
  request: FastifyRequest;
  statusCode: number;
  details?: unknown;
}): ApiErrorResponse {
  return {
    error: {
      code: params.code,
      message: params.message,
      statusCode: params.statusCode,
      requestId: params.request.id,
      ...(params.details === undefined ? {} : { details: params.details }),
    },
  };
}

export function registerApiErrorHandlers(app: FastifyInstance): void {
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send(buildErrorResponse({
      code: 'not_found',
      message: 'Resource not found.',
      request,
      statusCode: 404,
    }));
  });

  app.setErrorHandler((error: FastifyValidationError, request, reply) => {
    const statusCode = error.statusCode && error.statusCode >= 400 && error.statusCode < 600
      ? error.statusCode
      : 500;
    const code = error.validation ? 'validation_error' : codeForStatus(statusCode);
    const message = code === 'internal_error'
      ? 'Internal server error.'
      : error.message;

    if (statusCode >= 500) {
      request.log.error(error);
    }

    reply.status(statusCode).send(buildErrorResponse({
      code,
      details: validationDetails(error),
      message,
      request,
      statusCode,
    }));
  });
}
