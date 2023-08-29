
import type { RouteGenericInterface } from 'fastify';

import { Static } from '@sinclair/typebox'

import type { RequestHandler, Result } from '../../framework/http-server/request-handler.js';

import { Injectable } from '../../framework/di/injectable.decorator.js';

import { GetKittensApi } from '../api/get-kittens.api.js';


interface Schema extends RouteGenericInterface {
  Reply: Static<typeof GetKittensApi.ResponseSchema>,
}


@Injectable()
export class GetKittensHandler
  implements RequestHandler<Schema>
{

  readonly route = {
    method: 'GET' as const,
    url: '/kittens/',
    schema: {
      response: {
        200: GetKittensApi.ResponseSchema,
      },
    },
  };


  constructor(
    private readonly getKittenApi: GetKittensApi.Executor,
  ) {
  }


  async handleRequest(): Promise<Result<Schema>> {

    return this.getKittenApi.getKittens();

  }

}
