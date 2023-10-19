
import type { ValidateFunction } from 'ajv';
import type { TObject } from '@sinclair/typebox';

import Ajv from 'ajv';
import addAjvFormats from 'ajv-formats';
import { injectable } from 'inversify';

import { ValidationError } from './errors/validation-error.js';


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
   * @throws ValidationError on failed validation
   */
  async validateOrThrow(
    data: unknown,
    schema: TObject

  ): Promise<void> {

    const validator = await this.#getValidator(schema);

    if (!validator(data)) {
      throw new ValidationError(validator.errors ?? []);
    }

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
