
import { Redis } from 'ioredis';
import { injectable } from 'inversify';

import { parseRespBulkString } from './parse-resp-bulk-string.js';
import { RedisInfo } from './redis-info.js';


@injectable()
export class RedisInfoProvider {

  constructor(
    private readonly redis: Redis,
  ) {
  }


  async getRedisInfo(): Promise<RedisInfo> {

    return parseRespBulkString<RedisInfo>(
      await this.redis.info()
    );

  }

}
