
import type { ErrorObject } from 'ajv';


export class ValidationError extends Error {

  readonly errors: ErrorObject[];


  constructor(errors: ErrorObject[]) {

    super(`Validation failed`);

    this.errors = errors;

  }

}
