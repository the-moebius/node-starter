
import { Redis } from 'ioredis';
import Redlock from 'redlock';
import { RedlockAbortSignal } from 'redlock';
import { injectable } from 'inversify';

import type { Maybe } from '../types/maybe.js';


export interface UseLockOptions<ReturnType = unknown> {
  key: string;
  duration: number;
  handler: (
    (signal: RedlockAbortSignal)
      => Promise<ReturnType>
  );
}


@injectable()
export class RedisLockManager {

  #redlock: Maybe<Redlock>;


  constructor(
    private readonly redis: Redis,
  ) {
  }


  useLock<ReturnType = unknown>(
    options: UseLockOptions<ReturnType>

  ): Promise<ReturnType> {

    const {
      duration,
      handler,

    } = options;

    const redlock = this.#getRedlock();

    return redlock.using([options.key], duration, {}, handler);

  }


  #getRedlock(): Redlock {

    if (!this.#redlock) {

      this.#redlock = new Redlock([this.redis], {
        automaticExtensionThreshold: 1_000,
      });

    }

    return this.#redlock;

  }

}
