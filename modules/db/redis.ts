import * as IORedis from "ioredis";
import * as config from "config";

// declare function getRedisConnection(): Redis;
let _redis: IORedis.Redis | null = null;
export function getRedisConnection() {
  if (!_redis) {
    _redis = new IORedis(config.get("redis.url"));
  }
  return _redis;
}

export async function destroyConnection() {
  if (_redis) {
    await _redis.disconnect();
    _redis = null;
  }
  return _redis;
}
