
import { Static, Type } from '@sinclair/typebox';
import { injectable } from 'inversify';

import { KittensStore } from '../models/kittens.store.js';
import { kittenResponse, KittenResponseSchema } from './common/kitten-response.js';


export namespace GetKittensApi {

  export const ResponseSchema = Type.Object({
    kittens: Type.Array(KittenResponseSchema),
  });

  export type Response = (
    Static<typeof ResponseSchema>
  );


  @injectable()
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
