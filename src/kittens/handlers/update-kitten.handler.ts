
import type { RouteGenericInterface } from 'fastify';

import { Static, Type } from '@sinclair/typebox'
import { injectable } from 'inversify';

import type { Request, RequestHandler, Result } from '../../framework/http-server/request-handler.js';

import { UpdateKittenApi } from '../api/update-kitten.api.js';
import { KittenSchema } from '../models/kitten.schema.js';


export const paramsSchema = Type.Object({
  id: KittenSchema.id,
});

export const bodySchema = Type.Object({
  kitten: UpdateKittenApi.RequestSchemaKitten,
});

export const resultSchema = UpdateKittenApi.ResponseSchema;

interface Schema extends RouteGenericInterface {
  Params: Static<typeof paramsSchema>,
  Body: Static<typeof bodySchema>,
  Reply: Static<typeof resultSchema>,
}


@injectable()
export class UpdateKittenHandler
  implements RequestHandler<Schema>
{

  readonly route = {
    method: 'PUT' as const,
    url: '/kittens/:id',
    schema: {
      body: bodySchema,
      response: {
        200: resultSchema,
      },
    },
  };


  constructor(
    private readonly updateKittenApi: UpdateKittenApi.Executor,
  ) {
  }


  async handleRequest(
    request: Request<Schema>

  ): Promise<Result<Schema>> {

    return (this.updateKittenApi
      .updateKitten({
        id: request.params.id,
        kitten: request.body.kitten,
      })
    );

  }

}
