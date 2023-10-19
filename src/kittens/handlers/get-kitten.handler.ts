
import type { RouteGenericInterface } from 'fastify';

import { Static, Type } from '@sinclair/typebox'
import { injectable } from 'inversify';

import type { Request, RequestHandler, Result } from '../../framework/http-server/request-handler.js';

import { GetKittenApi } from '../api/get-kitten.api.js';
import { KittenSchema } from '../models/kitten.schema.js';


export const paramsSchema = Type.Object({
  id: KittenSchema.id,
});

interface Schema extends RouteGenericInterface {
  Params: Static<typeof paramsSchema>,
  Reply: Static<typeof GetKittenApi.ResponseSchema>,
}


@injectable()
export class GetKittenHandler
  implements RequestHandler<Schema>
{

  readonly route = {
    method: 'GET' as const,
    url: '/kittens/:id',
    schema: {
      params: paramsSchema,
      response: {
        200: GetKittenApi.ResponseSchema,
      },
    },
  };


  constructor(
    private readonly getKittenApi: GetKittenApi.Executor,
  ) {
  }


  async handleRequest(
    request: Request<Schema>

  ): Promise<Result<Schema>> {

    return this.getKittenApi.getKitten({
      id: request.params.id,
    });

  }

}
