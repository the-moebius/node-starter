
import { Static, Type } from '@sinclair/typebox';

import { Validator } from '../../framework/validation/validator.js';
import { Injectable } from '../../framework/di/injectable.decorator.js';

import { KittenSchema } from '../models/kitten.schema.js';
import { kittenResponse, KittenResponseSchema } from './common/kitten-response.js';
import { KittenModel } from '../models/kitten.js';


export namespace CreateKittenApi {

  export const RequestSchema = Type.Object({
    kitten: Type.Object({
      name: KittenSchema.name,
      color: KittenSchema.color,
    }),
  });

  export type CreateKittenRequest = (
    Static<typeof RequestSchema>
  );

  export const ResponseSchema = Type.Object({
    kitten: KittenResponseSchema,
  });

  export type Response = (
    Static<typeof ResponseSchema>
  );


  @Injectable()
  export class Executor {

    constructor(
      private readonly validator: Validator,
    ) {
    }


    async createKitten(
      request: CreateKittenRequest

    ): Promise<Response> {

      await this.validator.validateOrThrow(
        request,
        RequestSchema
      );

      const kitten = new KittenModel(request.kitten);

      await kitten.save();

      return {
        kitten: kittenResponse(kitten),
      };

    }

  }

}
