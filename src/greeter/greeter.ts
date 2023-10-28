
import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import type { LoggerType } from '../framework/logger.js';

import { Logger } from '../framework/logger.js';
import { MINUTE_MS } from '../framework/common/utils/time-consts.js';
import { wait } from '../framework/common/utils/wait.js';


@injectable()
export class Greeter {

  constructor(
    private readonly redis: Redis,

    @inject(Logger)
    private readonly logger: LoggerType,
  ) {
  }


  async greet(name = 'Anonymous'): Promise<string> {

    this.logger.debug(`Greeting ${name}…`)

    const cacheKey = `greeting/${name}`;

    let greeting = await this.redis.get(cacheKey);

    if (!greeting) {

      // Generating greeting if it's not in the cache
      greeting = await this.#generateGreeting(name);

      this.redis.set(
        cacheKey,
        greeting,
        'PX',
        (5 * MINUTE_MS)
      );

    }

    return greeting;

  }


  async #generateGreeting(name: string): Promise<string> {

    // Emulating slow async function
    await wait(1_000);

    return `Hello ${name}!`;

  }

}
