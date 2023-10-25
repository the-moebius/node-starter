
import { Static, Type } from '@sinclair/typebox';
import { injectable } from 'inversify';

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


  @injectable()
  export class Executor {

    constructor(
      private readonly kittensStore: KittensStore,
      private readonly validator: Validator,
    ) {
    }


    async deleteKitten(request: Request): Promise<Response> {

      await this.validator.validateOrThrow({
        data: request,
        schema: RequestSchema,
      });

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
