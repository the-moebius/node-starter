
import assert from 'node:assert/strict';

import { Redis, RedisOptions } from 'ioredis';

import type { Maybe } from '../types/maybe.js';

import { ApplicationModule } from '../application/application-module.js';


export interface RedisModuleConfig {
  url?: Maybe<string>;
  autoConnectOnStart?: Maybe<boolean>;
  redisOptions?: Maybe<RedisOptions>;
}


export class RedisModule extends ApplicationModule {

  readonly name = 'redis';

  readonly #config: RedisModuleConfig;


  constructor(config: RedisModuleConfig) {

    super();

    this.#config = config;

  }


  override async init(): Promise<void> {

    const redis = this.#createRedis();

    const onConnect = () => {
      this.logger.debug(`Redis connected`);
      redis.removeListener('connect', onConnect);
    };

    redis.on('connect', onConnect);

    (this.context.container
      .bind(Redis)
      .toConstantValue(redis)
    );

  }

  override async start(): Promise<void> {

    if (this.#config.autoConnectOnStart) {
      await this.connectRedis();
    }

  }

  override async stop(): Promise<void> {

    await this.disconnectRedis();

  }


  #createRedis(): Redis {

    const userOptions = (this.#config.redisOptions ?? {});

    if (userOptions.lazyConnect !== undefined) {
      throw new Error(
        `Please use the "autoConnectOnStart" Redis ` +
        `option instead of the "lazyConnect"`
      );
    }

    const redisOptions: RedisOptions = {

      ...userOptions,

      // We are connecting manually ourselves
      lazyConnect: true,

    };

    this.logger.debug({
      msg: `Creating Redis instance`,
      redisOptions: (
        this.#getRedisOptionsForLog(redisOptions)
      ),
    });

    if (this.#config.url) {
      return new Redis(
        this.#config.url,
        redisOptions
      );

    } else {
      return new Redis(redisOptions);

    }

  }

  async connectRedis(): Promise<void> {

    const { logger } = this.context;

    const redis = (this.context.container
      .get(Redis)
    );

    logger.info(`Establishing Redis connection…`);

    await redis.connect();

    const result = await redis.ping();
    assert.equal(result, 'PONG');

    logger.info(`Redis connection established`);

  }

  async disconnectRedis(): Promise<void> {

    const { logger } = this.context;

    const redis = (this.context.container
      .get(Redis)
    );

    logger.info(`Disconnecting Redis…`);

    // Gracefully disconnecting
    await redis.quit();

    logger.info(`Redis disconnected`);

  }


  #getRedisOptionsForLog(
    options: RedisOptions

  ): RedisOptions {

    // Creating a shallow copy
    const result = {
      ...options,
    };

    // Obfuscating secrets from the log output.
    // -----

    if (options.password) {
      result.password = '*****';
    }

    if (options.sentinelPassword) {
      result.sentinelPassword = '*****';
    }

    return result;

  }

}
