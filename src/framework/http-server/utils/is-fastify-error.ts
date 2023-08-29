
import { FastifyError, FastifyErrorCodes } from 'fastify';


export function isFastifyError(
  error: unknown,
  code?: keyof FastifyErrorCodes

): error is FastifyError {

  return (
    (typeof error === 'object') &&
    (error !== null) &&
    ('code' in error) &&
    (typeof error.code === 'string') &&
    error.code.startsWith('FST_ERR_') &&
    (code ? (error.code === code) : true)
  );

}
