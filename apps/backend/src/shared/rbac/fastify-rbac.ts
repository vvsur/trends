import type { FastifyRequest, preHandlerHookHandler } from 'fastify';
import type { Actor, Capability, ResourceScope } from './policies.js';
import { requireCapability } from './policies.js';

export type RbacPreHandlerOptions = {
  capability: Capability;
  getActor: (request: FastifyRequest) => Actor | undefined | Promise<Actor | undefined>;
  getResource?: (request: FastifyRequest) => ResourceScope | undefined | Promise<ResourceScope | undefined>;
};

export class AuthenticationRequiredError extends Error {
  statusCode = 401;

  constructor() {
    super('Authentication is required.');
    this.name = 'AuthenticationRequiredError';
  }
}

export function createRbacPreHandler(options: RbacPreHandlerOptions): preHandlerHookHandler {
  return async (request: FastifyRequest) => {
    const actor = await options.getActor(request);

    if (!actor) {
      throw new AuthenticationRequiredError();
    }

    const resource = await options.getResource?.(request);
    requireCapability(actor, options.capability, resource);
  };
}
