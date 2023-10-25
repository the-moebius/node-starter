
import type { ErrorObject } from 'ajv';

import type { Maybe } from '../../types/maybe.js';


export interface ValidationErrorConstruct {
  errors?: Maybe<ErrorObject[]>;
  message?: Maybe<string>;
}


export class ValidationError extends Error {

  override name = this.constructor.name;

  readonly errors: ErrorObject[];


  constructor(construct: ValidationErrorConstruct) {

    super(construct.message ?? `Validation failed`);

    this.errors = (construct.errors ?? []);

  }

}
