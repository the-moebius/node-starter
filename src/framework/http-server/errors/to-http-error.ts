
import { HttpError, HttpErrorConstruct } from './http-error.js';


/**
 * Converts the specified error-like object to a proper
 * HttpError instance. You can override error properties
 * as well.
 */
export function toHttpError(
  error: unknown,
  construct: HttpErrorConstruct = {}

): HttpError {

  if (typeof error === 'object' && error !== null) {

    if (!construct.name) {
      construct.name = (
        ('name' in error && typeof error.name === 'string')
          ? error.name
          : error.constructor.name
      );
    }

    if (
      !construct.message &&
      ('message' in error) &&
      (typeof error.message === 'string')
    ) {
      construct.message = error.message;

    }

  }

  return new HttpError(construct);

}
