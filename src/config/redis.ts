
import { RedisModule } from '../framework/redis/redis.module.js';


export const redisModule = new RedisModule({
  url: (process.env['REDIS_URL'] ?? ''),
  autoConnectOnStart: true,
  redisOptions: {
    keyPrefix: 'node-starter:',
  },
});
