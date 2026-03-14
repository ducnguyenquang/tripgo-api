import { Redis } from "ioredis";

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (!_redis) {
    const url = process.env.REDIS_URL;
    if (!url) {
      console.warn("REDIS_URL not set. Real-time features will be unavailable.");
      _redis = new Redis({ lazyConnect: true, maxRetriesPerRequest: 0 });
    } else {
      _redis = new Redis(url, { maxRetriesPerRequest: 3 });
    }
  }
  return _redis;
}

export { _redis as redis };
