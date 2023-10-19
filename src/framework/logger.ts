
import type { LoggerOptions, Logger as LoggerType } from 'pino';

import { pino } from 'pino';

import type { Maybe } from './types/maybe.js';

import { IS_DEV } from './common/environment.js';


export const Logger = Symbol('Logger');
export type { LoggerType };


export function createLogger(
  options?: Maybe<LoggerOptions>

): LoggerType {

  options = (options ?? {});

  // Using pretty logging in development
  if (!options.transport && IS_DEV) {
    options.transport = {
      target: 'pino-pretty'
    };
  }

  if (!options.level) {
    options.level = (IS_DEV ? 'debug' : 'info');
  }

  return pino(options);

}
