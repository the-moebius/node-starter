
import { Static, Type } from '@sinclair/typebox';

import { Injectable } from '../../framework/di/injectable.decorator.js';
import { Validator } from '../../framework/validation/validator.js';

import { KittenSchema } from '../models/kitten.schema.js';
import { KittensStore } from '../models/kittens.store.js';


export namespace DeleteKittenApi {

  export const RequestSchema = Type.Object({
    id: KittenSchema.id,
  });

  export type Request = (
    Static<typeof RequestSchema>
  );

  export const ResponseSchema = Type.Object({
    message: Type.String(),
  });

  export type Response = (
    Static<typeof ResponseSchema>
  );


  @Injectable()
  export class Executor {

    constructor(
      private readonly kittensStore: KittensStore,
      private readonly validator: Validator,
    ) {
    }


    async deleteKitten(request: Request): Promise<Response> {

      await this.validator.validateOrThrow(
        request,
        RequestSchema
      );

      const kitten = (await this.kittensStore
        .getKittenByIdOrThrow(request.id)
      );

      await kitten.deleteOne();

      return {
        message: `Kitten #${kitten.id} deleted successfully`,
      };

    }

  }

}
