
import type { RouteGenericInterface } from 'fastify';

import { Static, Type } from '@sinclair/typebox'
import { injectable } from 'inversify';

import type { Request, RequestHandler, Result } from '../framework/http-server/request-handler.js';

import { Greeter } from './greeter.js';


export const querySchema = Type.Object({
  name: Type.String(),
});

export const resultSchema = Type.Object({
  message: Type.String(),
});

interface Schema extends RouteGenericInterface {
  Querystring: Static<typeof querySchema>,
  Reply: Static<typeof resultSchema>,
}


@injectable()
export class GreeterHandler implements RequestHandler<Schema> {

  route = {
    method: 'GET' as const,
    url: '/greet',
    schema: {
      querystring: querySchema,
      response: {
        200: resultSchema,
      },
    },
  };

  constructor(private readonly greeter: Greeter) {
  }


  async handleRequest(
    request: Request<Schema>

  ): Promise<Result<Schema>> {

    request.log.info(`Sending hello response`);

    const message = await this.greeter.greet(
      request.query.name
    );

    return {
      message,
    };

  }

}
