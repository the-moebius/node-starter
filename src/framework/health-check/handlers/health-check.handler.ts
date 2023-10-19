

import type { RouteGenericInterface } from 'fastify';

import { Static, Type } from '@sinclair/typebox';

import type { Request, ResultAsync } from '../../http-server/request-handler';
import type { RequestHandler } from '../../http-server/request-handler';

import { HealthCheckService } from '../health-check-service';


export const resultSchema = Type.Object({
  status: Type.String(),
});

interface Schema extends RouteGenericInterface {
  Reply: Static<typeof resultSchema>,
}


export class HealthCheckHandler implements RequestHandler<Schema> {

  readonly route = {
    method: 'GET' as const,
    url: '/health',
  };


  constructor(
    private readonly healthCheckService: HealthCheckService,
  ) {
  }


  async handleRequest(
    request: Request<Schema>

  ): ResultAsync<Schema> {

    const status = await this.healthCheckService.getStatus();

    return { status };

  }

}
