
import type { LoggerOptions, Logger } from 'pino';

import { pino } from 'pino';

import { IS_DEV } from './common/environment.js';
import { Maybe } from './types/maybe.js';


export function createLogger(
  options?: Maybe<LoggerOptions>

): Logger {

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
