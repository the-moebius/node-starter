
import type { RouteGenericInterface } from 'fastify';

import { Static, Type } from '@sinclair/typebox'
import { injectable } from 'inversify';

import type { Request, RequestHandler, Result } from '../../framework/http-server/request-handler.js';

import { KittenSchema } from '../models/kitten.schema.js';
import { DeleteKittenApi } from '../api/delete-kitten.api.js';


export const paramsSchema = Type.Object({
  id: KittenSchema.id,
});

export const resultSchema = DeleteKittenApi.ResponseSchema;

interface Schema extends RouteGenericInterface {
  Params: Static<typeof paramsSchema>,
  Reply: Static<typeof resultSchema>,
}


@injectable()
export class DeleteKittenHandler
  implements RequestHandler<Schema>
{

  readonly route = {
    method: 'DELETE' as const,
    url: '/kittens/:id',
    schema: {
      response: {
        200: resultSchema,
      },
    },
  };


  constructor(
    private readonly deleteKittenApi: DeleteKittenApi.Executor,
  ) {
  }


  async handleRequest(
    request: Request<Schema>

  ): Promise<Result<Schema>> {

    return (this.deleteKittenApi
      .deleteKitten({
        id: request.params.id,
      })
    );

  }

}
