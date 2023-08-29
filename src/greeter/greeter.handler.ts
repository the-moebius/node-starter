
import type { RouteGenericInterface } from 'fastify';

import { Static, Type } from '@sinclair/typebox'

import type { Request, RequestHandler, Result } from '../framework/http-server/request-handler.js';

import { Injectable } from '../framework/di/injectable.decorator.js';

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


@Injectable()
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


  handleRequest(request: Request<Schema>): Result<Schema> {

    request.log.info(`Sending hello response`);

    const message = this.greeter.greet(request.query.name);

    return {
      message,
    };

  }

}
