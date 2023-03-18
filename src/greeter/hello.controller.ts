
import type { RouteGenericInterface } from 'fastify/types/route';

import { Static, Type } from '@sinclair/typebox'

import type { Request, RequestHandler, Result } from '../framework/server/request-handler.js';

import { Controller } from '../framework/server/controller.decorator.js';
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


@Controller({
  route: {
    method: 'GET',
    url: '/hello',
    schema: {
      querystring: querySchema,
      response: {
        200: resultSchema,
      },
    },
  },
})
export class HelloController implements RequestHandler<Schema> {

  constructor(private readonly greeter: Greeter) {
  }


  public handleRequest(request: Request<Schema>): Result<Schema> {

    request.log.info(`Sending hello response`);

    const message = this.greeter.greet(request.query.name);

    return {
      message,
    };

  }

}
