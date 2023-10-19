
import type { RouteGenericInterface } from 'fastify';

import { Static } from '@sinclair/typebox'
import { injectable } from 'inversify';

import type { Request, RequestHandler, Result } from '../../framework/http-server/request-handler.js';

import { Reply } from '../../framework/http-server/request-handler.js';

import { CreateKittenApi } from '../api/create-kitten.api.js';


export const bodySchema = CreateKittenApi.RequestSchema;
export const resultSchema = CreateKittenApi.ResponseSchema;

interface Schema extends RouteGenericInterface {
  Body: Static<typeof bodySchema>,
  Reply: Static<typeof resultSchema>,
}


@injectable()
export class CreateKittenHandler
  implements RequestHandler<Schema>
{

  readonly route = {
    method: 'POST' as const,
    url: '/kittens/',
    schema: {
      body: bodySchema,
      response: {
        201: resultSchema,
      },
    },
  };


  constructor(
    private readonly createKittenApi: CreateKittenApi.Executor,
  ) {
  }


  async handleRequest(
    request: Request<Schema>,
    reply: Reply<Schema>,

  ): Promise<Result<Schema>> {

    const response = await (this.createKittenApi
      .createKitten(request.body)
    );

    reply.statusCode = 201;

    return response;

  }

}
