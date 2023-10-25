
import type { ValidateFunction } from 'ajv';
import type { TObject } from '@sinclair/typebox';

import { Static } from '@sinclair/typebox';
import Ajv from 'ajv';
import addAjvFormats from 'ajv-formats';
import { injectable } from 'inversify';

import type { Maybe } from '../types/maybe.js';

import { ValidationError } from './errors/validation-error.js';


export interface ValidateOptions<SchemaType extends TObject> {
  data: unknown;
  schema: SchemaType;
  errorMessage?: Maybe<string>;
}


@injectable()
export class Validator {

  // @todo make Ajv configurable
  readonly #ajv = addAjvFormats(
    new Ajv({
      removeAdditional: 'all',
      loadSchema: async () => ({}),
    })
  );

  readonly #validators = (
    new WeakMap<TObject, Promise<ValidateFunction>>()
  );


  /**
   * Validates the specified data using the specified
   * schema and returns valid data.
   *
   * Warning! It could mutate the supplied data. If it's
   * not acceptable, make a deep copy before calling this
   * function!
   *
   * @throws ValidationError on failed validation
   */
  async validateOrThrow<SchemaType extends TObject>(
    options: ValidateOptions<SchemaType>

  ): Promise<
    Static<SchemaType>

  > {

    const {
      data,
      schema,
      errorMessage,

    } = options;

    const validator = await this.#getValidator(schema);

    if (!validator(data)) {

      throw new ValidationError({
        errors: (validator.errors || undefined),
        message: errorMessage,
      });

    }

    return data as Static<SchemaType>;

  }


  async #getValidator(
    schema: TObject

  ): Promise<ValidateFunction> {

    if (!this.#validators.has(schema)) {

      const validatorPromise = (this.#ajv
        .compileAsync(schema)
      );

      this.#validators.set(schema, validatorPromise);

    }

    return this.#validators.get(schema)!;

  }

}
