
import { inject, injectable } from 'inversify';

import type { LoggerType } from '../framework/logger.js';

import { Logger } from '../framework/logger.js';


@injectable()
export class Greeter {

  constructor(
    @inject(Logger)
    private readonly logger: LoggerType,
  ) {
  }


  greet(name = 'Anonymous'): string {

    this.logger.info(`Greeting ${name}…`)

    return `Hello ${name}!`;

  }

}
