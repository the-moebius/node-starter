
import createLogger, { LoggerOptions } from 'pino';

import { IS_DEV } from './common/environment.js';


const options: LoggerOptions = {};

if (IS_DEV) {
  // Using pretty logging in development
  options.transport = {
    target: 'pino-pretty'
  };
}

export const logger = createLogger(options);
