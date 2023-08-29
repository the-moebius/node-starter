
import { Static, Type } from '@sinclair/typebox';

import { Injectable } from '../../framework/di/injectable.decorator.js';

import { KittensStore } from '../models/kittens.store.js';
import { kittenResponse, KittenResponseSchema } from './common/kitten-response.js';


export namespace GetKittensApi {

  export const ResponseSchema = Type.Object({
    kittens: Type.Array(KittenResponseSchema),
  });

  export type Response = (
    Static<typeof ResponseSchema>
  );


  @Injectable()
  export class Executor {

    constructor(
      private readonly kittensStore: KittensStore,
    ) {
    }


    async getKittens(): Promise<Response> {

      const kittens = (await this.kittensStore
        .getKittens()
      );

      return {
        kittens: kittens.map(kittenResponse),
      };

    }

  }

}
