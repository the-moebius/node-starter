

import type { RouteGenericInterface } from 'fastify';

import { Static, Type } from '@sinclair/typebox';

import type { Request, ResultAsync } from '../http-server/request-handler.js';
import type { RequestHandler } from '../http-server/request-handler.js';

import { HealthCheckHandler } from './health-check-handler.js';


export const resultSchema = Type.Object({
  status: Type.String(),
});

interface Schema extends RouteGenericInterface {
  Reply: Static<typeof resultSchema>,
}


export class HealthCheckController implements RequestHandler<Schema> {

  readonly route = {
    method: 'GET' as const,
    url: '/health',
  };


  constructor(
    private readonly healthCheckHandler: HealthCheckHandler,
  ) {
  }


  async handleRequest(
    request: Request<Schema>

  ): ResultAsync<Schema> {

    const status = await this.healthCheckHandler.getStatus();

    return { status };

  }

}
