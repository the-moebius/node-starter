
import { Static, Type } from '@sinclair/typebox';
import { injectable } from 'inversify';

import { Validator } from '../../framework/validation/validator.js';

import { KittenSchema } from '../models/kitten.schema.js';
import { kittenResponse, KittenResponseSchema } from './common/kitten-response.js';
import { KittensStore } from '../models/kittens.store.js';


export namespace UpdateKittenApi {

  export const RequestSchemaKitten = Type.Object({
    name: Type.Optional(KittenSchema.name),
    color: Type.Optional(KittenSchema.color),
  }, {
    minProperties: 1,
  });

  export const RequestSchema = Type.Object({
    id: KittenSchema.id,
    kitten: RequestSchemaKitten,
  });

  export type Request = (
    Static<typeof RequestSchema>
  );

  export const ResponseSchema = Type.Object({
    kitten: KittenResponseSchema,
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


    async updateKitten(
      request: Request

    ): Promise<Response> {

      await this.validator.validateOrThrow(
        request,
        RequestSchema
      );

      const kitten = (await this.kittensStore
        .getKittenByIdOrThrow(request.id)
      );

      kitten.set(request.kitten);

      await kitten.save();

      return {
        message: `Kitten #${kitten.id} updated successfully`,
        kitten: kittenResponse(kitten),
      };

    }

  }

}
