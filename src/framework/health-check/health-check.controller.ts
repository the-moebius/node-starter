
import type { RouteGenericInterface } from 'fastify/types/route';
import { Static, Type } from '@sinclair/typebox';

import type { Request, ResultAsync } from '../server/request-handler.js';
import type { RequestHandler } from '../server/request-handler.js';
import { Controller } from '../server/controller.decorator.js';
import { HealthCheckHandler } from './health-check-handler.js';


export const resultSchema = Type.Object({
  status: Type.String(),
});

interface Schema extends RouteGenericInterface {
  Reply: Static<typeof resultSchema>,
}


@Controller({
  route: {
    method: 'GET',
    url: '/health',
  },
})
export class HealthCheckController implements RequestHandler<Schema> {

  constructor(
    private readonly healthCheckHandler: HealthCheckHandler
  ) {
  }


  public async handleRequest(
    request: Request<Schema>

  ): ResultAsync<Schema> {

    const status = await this.healthCheckHandler.getStatus();

    return { status };

  }

}
